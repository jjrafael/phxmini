import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import ModalWindow from 'components/modal';

import FeedDetails from '../components/FeedDetails';
import FeedErrorConditions from '../components/FeedErrorConditions';
import FeedContentViewer from '../components/FeedContentViewer';
import { closeModal, openModal } from 'actions/modal';

import {fetchFeedHistoryFeeds} from '../actions';


class ViewXMLModalContainer extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount(){
  }

  render() {
    let {closeModal, openModal, feedDetails} = this.props;
    let eventDetails = {
        fileId : feedDetails.fileId,
        eventDescription :feedDetails.eventDescription,
        feedId : feedDetails.feedId,
        startTime : feedDetails.eventTime,
        deletionType : "",
        feedMessages :[],
        content : feedDetails.content

    };
    return (
        <ModalWindow
            className="large feed-history-modal"
            key={'importViewXML'}
            title="Feed History"
            closeButton={false}
            name="importViewXML"
            isVisibleOn={this.props.modals.importViewXML}
            shouldCloseOnOverlayClick={false}>
            <div className="modal-content">
				      <div className="form-wrapper no-border">
                <h4 className="modal-title">
                    Transaction Detail Display
                </h4>
                <div className="content">
                  <div className="inner">
                    <div className="block">
                        <FeedDetails feedDetails={eventDetails}/>
                        <FeedErrorConditions feedDetails={eventDetails} />
                        <FeedContentViewer feedXMLData={eventDetails}/>
                    </div>
                  </div>
                </div>
                <div className="modal-controls">
                  <button className="" onClick={() => {
                      closeModal('importViewXML')
                  }}>
                      Close
                  </button>
                </div>
              </div>
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
      closeModal, openModal
    }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(ViewXMLModalContainer);