import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import _ from 'underscore';

let FeedDetails = (props) => {
    let {event, feedHistory, feedDetails} = props;
    let hasFeedDetails = !_.isEmpty(feedDetails);
	return <div className="padding-small">
            <div className="row">
                <div className="desktop-full">
                    <div className="form-wrapper feed-event">
                        <h4 className="">Event</h4>
                        <div className="">
                            <div className="form-group clearfix">
                                <label className="form-group-label">ID</label>
                                <div className="form-group-control">
                                    <input type="text" name="id" value={hasFeedDetails ? feedDetails.fileId : ''} readOnly={true} />
                                </div>
                            </div>
                            <div className="form-group clearfix">
                                <label className="form-group-label">Description</label>
                                <div className="form-group-control">
                                    <input type="text" name="id" value={hasFeedDetails ? feedDetails.eventDescription : ''} readOnly={true} />
                                </div>
                            </div>
                            <div className="form-group clearfix">
                                <label className="form-group-label">Feed ID</label>
                                <div className="form-group-control">
                                    <input type="text" name="id" value={hasFeedDetails ? feedDetails.feedId : ''} readOnly={true} />
                                </div>
                            </div>
                            <div className="form-group clearfix">
                                <label className="form-group-label">Start</label>
                                <div className="form-group-control">
                                    <input type="text" name="id" value={hasFeedDetails ? feedDetails.startTime : ''} readOnly={true} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="row">
                <div className="desktop-full">
                    <div className="form-wrapper feed-deletion">
                        <h4 className="">Deletion</h4>
                        <div className="">
                            <div className="form-group clearfix">
                                <label className="form-group-label">Type</label>
                                <div className="form-group-control">
                                    <input type="text" name="id" value={hasFeedDetails ? feedDetails.deletionType : ''} readOnly={true} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
}

function mapStateToProps(state) {
    return {
        event: state.eventCreatorEvent.event,
        feedHistory : state.feedHistory,
        modals: state.modals,
    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({ 
     
    }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(FeedDetails);