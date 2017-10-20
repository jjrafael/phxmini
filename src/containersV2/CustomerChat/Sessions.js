import React from "react";
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { selectSession, fetchMessages, closeAssignedSession, fetchAssignedSessionDetails, toggleAssignedSessionWarning } from './actions';
import SessionsItem from './SessionsItem';

const mapStateToProps = (state) => {
  return {
    sessions: state.customerChat.assignedSessions,
    selectedSessionId: state.customerChat.selectedSessionId
  }
}

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({
    selectSession,
    fetchMessages,
    closeAssignedSession,
    fetchAssignedSessionDetails,
    toggleAssignedSessionWarning
  }, dispatch);
};

class Sessions extends React.Component {
  constructor(props) {
    super(props);
    this._closeSession = this._closeSession.bind(this);
  }

  componentWillMount() {
    this.timers = {};
  }

  componentWillUnmount() {
    for (let key in this.timers) {
      clearInterval(this.timers[key]);
      delete this.timers[key];
    }
  }

  componentWillReceiveProps(nextProps) {
    this.selectedSession = nextProps.sessions.find((session) => session.id === nextProps.selectedSessionId) || null;
    nextProps.sessions.forEach((session) => {
      if (session.ended && this.timers[`timer-${session.id}`]) {
        clearInterval(this.timers[`timer-${session.id}`]);
        delete this.timers[`timer-${session.id}`];
      }

      if (!session.ended && !this.timers[`timer-${session.id}`]) {
        this.props.fetchMessages(session.id);
        this.props.fetchAssignedSessionDetails(session.id);
        this.timers[`timer-${session.id}`] = setInterval(() => {
          this.props.fetchMessages(session.id);
          this.props.fetchAssignedSessionDetails(session.id);
        }, 2000);
      }
    });

    for (let key in this.timers) {
      if (!nextProps.sessions.some((session) => String(session.id) === key.split('-')[1])) {
        clearInterval(this.timers[key]);
        delete this.timers[key];
      }
    }
  }

  _closeSession(session) {
    this.props.closeAssignedSession(session.id);
    if (this.props.selectedSessionId === session.id) {
      this.props.selectSession(null);
    }
  }

  render() {
    const { sessions } = this.props;
    return (
      <div className="sessions">
        <div className="sidebar-head">
          Current Chat Sessions
        </div>
        <div className="sidebar-body">
          {sessions.map((session) =>
            <SessionsItem
              session={session}
              isGuest={!session.customerId}
              selectSession={this.props.selectSession}
              closeSession={this._closeSession}
              selected={this.props.selectedSessionId && (this.props.selectedSessionId === session.id)}
              toggleWarning={this.props.toggleAssignedSessionWarning}
              key={session.id}
            />
          )}
        </div>
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Sessions);