import React, { PropTypes } from "react";
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import ModalYesNo from 'phxComponents/modalYesNo';
import { deleteAllOpponentOfEventPath } from 'eventCreatorOpponentsActions/opponentsAction';
import { deleteAllPlayerOfEventPath } from 'eventCreatorOpponentsActions/playersActions';
import ModalWindow from 'components/modal';
import LoadingIndicator from 'components/loadingIndicator';


const mapStateToProps = (state, ownProps) => {
    return {
        activePathId: state.sportsTree.activePathId,
        isDelAllOppOfEPPerforming: state.opponentsReducers.isDeleteAllOpponentOfEventPathPerforming,
        delAllOppOfEPFailed: state.opponentsReducers.delAllOppOfEPFailed,
        delAllOppOfEPErrorMessage: state.opponentsReducers.delAllOppOfEPErrorMessage,

        isDelAllPlayerOfEPPerforming: state.playersReducers.isDelAllPlayerOfEPPerforming,
        delAllPlayerOfEPFailed: state.playersReducers.delAllPlayerOfEPFailed,
        delAllPlayerOfEPErrorMessage: state.playersReducers.delAllPlayerOfEPErrorMessage,
    };
};

const mapDispatchToProps = (dispatch, ownProps) => {
    return bindActionCreators({
      deleteAllOpponentOfEventPath,
      deleteAllPlayerOfEventPath
    }, dispatch);
};

class EventPathBottomBar extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      showConfirmDlg: false,
      confirmDlgTitle: null,
      confirmDlgMessage: null,
      confirmDlgYesHandler: null,
      confirmDlgNoHandler: null,
      functionToInvoke: null,
    }

    this._onRemoveAllTeamsClick = this._onRemoveAllTeamsClick.bind(this);
    this._onRemoveAllPlayersClick = this._onRemoveAllPlayersClick.bind(this);
    this._onResubmitToRetailClick = this._onResubmitToRetailClick.bind(this);

    this._onConfirmYesDlgClick = this._onConfirmYesDlgClick.bind(this);
    this._closeConfirmDlg = this._closeConfirmDlg.bind(this);
    this._showConfirmDlg = this._showConfirmDlg.bind(this);

    this._showConfirmDlgForRemoveAllTeams = this._showConfirmDlgForRemoveAllTeams.bind(this);
    this._showConfirmDlgForRemoveAllPlayers = this._showConfirmDlgForRemoveAllPlayers.bind(this);
    this._showConfirmDlgForResubmitToRetail = this._showConfirmDlgForResubmitToRetail.bind(this);

    this._renderLoadingIndicator = this._renderLoadingIndicator.bind(this);

  }

  _onRemoveAllTeamsClick() {
    const { activePathId, deleteAllOpponentOfEventPath } = this.props;
    deleteAllOpponentOfEventPath(activePathId);
  }

  _onRemoveAllPlayersClick() {
    const { activePathId, deleteAllPlayerOfEventPath } = this.props;
    deleteAllPlayerOfEventPath(activePathId);
  }

  _onResubmitToRetailClick() {
  }

  _onConfirmYesDlgClick() {
    const {functionToInvoke, confirmDlgNoHandler} = this.state;

    confirmDlgNoHandler(functionToInvoke);
  }

  _closeConfirmDlg(nextFunc) {
    this.setState({
      showConfirmDlg: false,
      confirmDlgTitle: null,
      confirmDlgMessage: null,
      confirmDlgYesHandler: null,
      confirmDlgNoHandler: null,
      functionToInvoke: null
    }, () => {
      if (nextFunc) {
        nextFunc()
      }
    });
  }

  _showConfirmDlg(title, message, func) {
    this.setState({
      showConfirmDlg: true,
      confirmDlgTitle: title,
      confirmDlgMessage: message,
      confirmDlgYesHandler: this._onConfirmYesDlgClick,
      confirmDlgNoHandler: this._closeConfirmDlg,
      functionToInvoke: func
    });
  }

  _showConfirmDlgForRemoveAllTeams() {
    this._showConfirmDlg(
      "Remove All Teams",
      "WARNING - All teams/players and players within teams for this event path and all children beneath will be removed. Please confirm you wish to continue?",
      this._onRemoveAllTeamsClick
    );
  }

  _showConfirmDlgForRemoveAllPlayers() {
    this._showConfirmDlg(
      "Remove All Players",
      "WARNING - All players within teams for this event path and all children beneath will be removed. Please confirm you wish to continue?",
      this._onRemoveAllPlayersClick
    );
  }

  _showConfirmDlgForResubmitToRetail() {
    this._showConfirmDlg(
      "Resubmit to Retail",
      "WARNING - This action will re-submit data to the retail system for multiple events. Are you sure you wish to continue?",
      this._onResubmitToRetailClick
    );
  }
  _renderLoadingIndicator() {
      return (
        <ModalWindow
            key="loading-modal"
            className="small-box"
            title="Loading"
            name="error"
            isVisibleOn={true}
            shouldCloseOnOverlayClick={false}
            closeButton={false}>
            <div>
              <LoadingIndicator />
            </div>
        </ModalWindow>
      )
  }

  render() {
    const { showConfirmDlg, confirmDlgTitle, confirmDlgMessage, confirmDlgYesHandler } = this.state;
    const { isDelAllOppOfEPPerforming, isDelAllPlayerOfEPPerforming } = this.props;

    return (
      <div className="event_path--bottom_bar">

        <div className="bottom_bar--left_padding">
        </div>

        <button
          className="btn btn-action bottom_bar--button"
          type="button"
          onClick={this._showConfirmDlgForRemoveAllTeams}
          disabled={false}>
          Remove All Teams
        </button>

        <button
          className="btn btn-action bottom_bar--button"
          type="button"
          onClick={this._showConfirmDlgForRemoveAllPlayers}
          disabled={false}>
          Remove All Players
        </button>

        <button
          className="btn btn-action bottom_bar--button"
          type="button"
          onClick={this._showConfirmDlgForResubmitToRetail}
          disabled={false}>
          Resubmit to Retail
        </button>

        {showConfirmDlg &&
          <ModalYesNo
            title={confirmDlgTitle}
            message={confirmDlgMessage}
            isVisibleOn={showConfirmDlg}
            yesButtonLabel={'Yes'}
            onYesButtonClickHandler={confirmDlgYesHandler}
            noButtonLabel={'No'}
            onNoButtonClickedHandler={() => this._closeConfirmDlg(null)}
            />
        }
        { (isDelAllOppOfEPPerforming || isDelAllPlayerOfEPPerforming) &&
          this._renderLoadingIndicator()
        }

      </div>
    );
  }

};

export default connect(mapStateToProps, mapDispatchToProps)(EventPathBottomBar);
