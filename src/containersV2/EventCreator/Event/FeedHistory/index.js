import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import ReactTable from 'react-table';
import ModalWindow from 'components/modal';
import { closeModal, openModal } from 'actions/modal';
import TabComponent from 'components/Tabs';

import LineupPanel from './components/LineupPanel';
import CommentPanel from './components/CommentPanel';
import FeedHistoryModalContainer from './containers/FeedHistoryModalContainer';
import {fetchFeedHistoryLineup} from './actions';

class FeedHistory extends React.Component {
  constructor(props) {
    super(props);
  }
  componentWillMount() {
  	let {event} = this.props;
  	this.props.fetchFeedHistoryLineup(event.event.id)
  }
  render() {
  	let {closeModal, openModal, lineup, feedHistory} = this.props;
	let { isFetchingFeedHistoryLineup } = feedHistory;
	let hasLineup = (!isFetchingFeedHistoryLineup && lineup.teamADetails.length && lineup.teamBDetails.length);
    return (
      <div className="feed-history padding-medium">
      	<div className={`form-wrapper ${hasLineup ? 'has-lineup' : ''}`}>
            <h4>Betradar</h4>
            <div className="clearfix">
            	<div className="desktop-full">
            		<div className="row">
            			<div className="desktop-half">
            				<input type="checkbox" disabled={true} name="statistics" value="false" id="statistics" />
            				<span className="checkbox-label">
            					<label htmlFor="statistics"> Statistics</label>
            				</span>
            			</div>
            			<div className="desktop-half">
            				<button className="fright" onClick={() => {
            					openModal('feedHistory');
            				}}>Feed History</button>
            			</div>
            		</div>
            		{
            			hasLineup ? <LineupPanel /> : null
            		}
            		<CommentPanel />
                <FeedHistoryModalContainer />
            	</div>
            </div>
        </div>
      </div>
    );
  }
}


function mapStateToProps(state) {
    return {
        event: state.eventCreatorEvent,
        lineup : state.feedHistory.lineup,
        feedHistory : state.feedHistory,
        modals: state.modals,
    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({ 
      closeModal, 
      openModal,
      fetchFeedHistoryLineup
    }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(FeedHistory);