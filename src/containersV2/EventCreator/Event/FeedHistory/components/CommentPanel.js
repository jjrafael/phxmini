import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import _ from "underscore";

let CommentPanel = (props) => {
	let {event} = props;
	return (
		<div className="row ">
			<div className="desktop-full">
                <label>Comments</label>
    			<div className="form-wrapper comments">
    				<label>
    				{
    					(event.hasOwnProperty('eventInfo') && !_.isEmpty(event.eventInfo)) ? event.eventInfo.comments : null
    				}
    				</label>
    			</div>
			</div>
		</div>
	)
            		
}

function mapStateToProps(state) {
    return {
        event : state.eventCreatorEvent.event,
    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({ 
    }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(CommentPanel);
