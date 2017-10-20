import React from 'react';
import TabComponent from 'components/Tabs';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

let LineupPanel = (props) => {
	let {lineup, feedHistory} = props;
	let { isFetchingFeedHistoryLineup } = feedHistory;
	if(!isFetchingFeedHistoryLineup) {
		return (
			<div className="row">
				<div className="desktop-full main-inner">
					<label>Line-up:</label>
					<TabComponent 
		                className={`inner-tab  lineup`}
		                items={[{
		                    title:  lineup.teamAName,
		                    content: <div>
		                    	<table className="table-lineup">
		                    		<tbody>
		                    		{
		                    			(lineup.teamADetails.length) ? lineup.teamADetails.map(lu => {
		                    				return <tr>
			                    				<td><i className={`phxico phx-${(lu.lineUpStatus === "IN" ? 'check' : lu.lineUpStatus === "OUT" ? 'close' : 'alert') }`} /></td>
			                    				<td>{lu.description}</td>
			                    				<td>{lu.reason}</td>
			                    			</tr> 
		                    			}) : null
		                    		}
		                    		</tbody>
		                    	</table>
		                    </div>
		                },{
		                    title: lineup.teamBName,
		                    content: <div>
		                    	<table className="table-lineup">
		                    		<tbody>
		                    		{
		                    			(lineup.teamBDetails.length) ? lineup.teamBDetails.map(lu => {
		                    				return <tr>
			                    				<td><i className={`phxico phx-${(lu.lineUpStatus === "IN" ? 'check' : lu.lineUpStatus === "OUT" ? 'close' : 'alert') }`} /></td>
			                    				<td>{lu.description}</td>
			                    				<td>{lu.reason}</td>
			                    			</tr> 
		                    			}) : null
		                    		}
		                    		</tbody>
		                    	</table>
		                    </div>
		                }]} 
		            />
				</div>
			</div>
		)
	}
	else {
		return (
                <div className="loading tcenter">
                    <i className="phxico phx-spinner phx-spin"></i>
                </div>
            ) 
	}
            		
}

function mapStateToProps(state) {
    return {
        feedHistory : state.feedHistory,
        lineup : state.feedHistory.lineup,
    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({ 
    }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(LineupPanel);