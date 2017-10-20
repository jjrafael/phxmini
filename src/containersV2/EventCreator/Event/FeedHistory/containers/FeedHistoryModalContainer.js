import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import ModalWindow from 'components/modal';

import {fetchFeedHistoryFeeds} from '../actions';

import FeedsContainer from './FeedsContainer';

class FeedHistoryModalContainer extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount(){
  }

  render() {
    return (
        <ModalWindow
            className="full-screen feed-history-modal"
            key={'feedHistory'}
            title="Feed History"
            closeButton={false}
            name="feedHistory"
            isVisibleOn={this.props.modals.feedHistory}
            shouldCloseOnOverlayClick={false}>
            <div>
				      <FeedsContainer />
            </div>
        </ModalWindow>
    );
  }
}



function mapStateToProps(state) {
    return {
        event: state.eventCreatorEvent,
        feedHistory : state.feedHistory,
        modals: state.modals,
    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({ 
      fetchFeedHistoryFeeds
    }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(FeedHistoryModalContainer);