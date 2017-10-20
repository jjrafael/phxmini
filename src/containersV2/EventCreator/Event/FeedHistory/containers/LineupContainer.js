import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import LineupPanel from '../components/LineupPanel';
import {fetchFeedHistoryLineup} from '../actions';

class LineupContainer extends React.Component {
   constructor(props) {
    super(props);
  }

  componentWillMount(){
  	let {event} = this.props;
  	this.props.fetchFeedHistoryLineup(event.event.id)
  }

  render() {
    return <LineupPanel />;
  }
}

function mapStateToProps(state) {
    return {
        event: state.eventCreatorEvent,
    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({ 
    	fetchFeedHistoryLineup
    }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(LineupContainer);


