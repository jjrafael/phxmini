import React from "react";
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { hidePreferencesModal, saveConstantsToStore } from '../actions';
import Tabs from '../Tabs';
import Bets from './Bets';
import Accounts from './Accounts';
import Payments from './Payments';
import FailedBets from './FailedBets';
import Connected from './Connected';
import ModalWindow from 'components/modal';
import HeadersPreferences from '../HeadersPreferences';

const mapStateToProps = (state) => {
  return {
    lastKeys: state.instantAction.lastKeys,
    sports: state.instantAction.allSports,
    origins: state.instantAction.origins,
    channels: state.instantAction.channels,
    brands: state.instantAction.brands,
    showPreferencesModal: state.instantAction.showPreferencesModal,
    apiConstants: state.apiConstants.values,
    isSideBarOpen: state.apps.isSideBarOpen
  }
}

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({
    hidePreferencesModal,
    saveConstantsToStore,
  }, dispatch);
};

class Main extends React.Component {
  constructor(props) {
    super(props);
    this._renderPreferencesModal = this._renderPreferencesModal.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    const { riskSports, allOrigins, channels: allChannels, brands: allBrands } = nextProps.apiConstants;
    const { sports, origins, channels, brands } = nextProps;

    if (riskSports && allOrigins && allChannels && allBrands) {
      if (!sports[0] || !origins[0] || !channels[0] || !brands[0]) {
        this.props.saveConstantsToStore(riskSports, allOrigins, allChannels, allBrands);
      }
    }
  }

  _renderPreferencesModal() {
    return (
      <ModalWindow
        onClose={(e) => this.props.hidePreferencesModal()}
        title="Headers Preferences"
        closeButton={true}
        isVisibleOn={this.props.showPreferencesModal}
        shouldCloseOnOverlayClick={true}
      >
        <HeadersPreferences />
      </ModalWindow>
    )
  }

  render() {
    const { isSideBarOpen } = this.props;
    return (
      <div className={`page-main no-footer ${isSideBarOpen ? '' : 'expand'}`}>
        {this.props.showPreferencesModal && this._renderPreferencesModal()}
        <Tabs
          className="main-tabs"
          items={[
            { title: 'BETS', component: <Bets /> },
            { title: 'ACCOUNTS', component: <Accounts /> },
            { title: 'PAYMENTS/RECEIPTS', component: <Payments /> },
            { title: 'FAILED BETS', component: <FailedBets /> }
          ]}
        />
        <Connected />
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Main);