import React from 'react';
import ReactTable from 'react-table';
import _ from 'underscore';
import ScrollTable from 'phxV2Components/ScrollTable/';

let FeedErrorConditions = (props) => {
    let {feedMessages} = props.feedDetails;
    let hasFeedMessages = !_.isEmpty(feedMessages);
	return <div className="desktop-half">
            <div className="form-wrapper feed-error-condition">
                <h4 className="">Error Conditions</h4>
                <div className="clearfix">
                	
                	<ScrollTable headers={[
                     {
                        title : "Type",
                        data : "messageType",
                        width: "30%",
                        render : (data) =>{
                            return <span><span className={`phx-ico phx-${data.messageType === "ERROR" ? 'alert-circle text-error' :data.messageType === "WARN" ? 'alert text-warning' : 'skip text-success'}`}></span>{data.label}</span>
                        }
                    }, {
                        title : "Message",
                        data : "description",
                        width: "70%"
                    }]} data={hasFeedMessages ? feedMessages : []} selectRow={false}/>
                    
                </div>
            </div>
        </div>
}

export default FeedErrorConditions;