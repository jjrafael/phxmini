import React from "react";
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { acceptSession, closeUnassignedSession, fetchUnassignedSessionDetails, toggleUnassignedSessionWarning } from './actions';
import QueueItem from './QueueItem';

const mapStateToProps = (state) => {
  return {
    sessions: state.customerChat.unassignedSessions,
    operatorSecurityLevel: state.customerChat.operatorSecurityLevel,
    acceptSessionLoading: state.customerChat.acceptSessionLoading
  }
}

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({
    acceptSession,
    closeUnassignedSession,
    fetchUnassignedSessionDetails,
    toggleUnassignedSessionWarning
  }, dispatch);
};

class Queue extends React.Component {
  componentWillMount() {
    this.timers = {}
  }

  componentWillUnmount() {
    for (let key in this.timers) {
      clearInterval(this.timers[key]);
      delete this.timers[key];
    }
  }

  componentWillReceiveProps(nextProps) {
    nextProps.sessions.forEach((session) => {
      if (session.ended && this.timers[`timer-${session.id}`]) {
        clearInterval(this.timers[`timer-${session.id}`]);
        delete this.timers[`timer-${session.id}`];
      }

      if (!session.ended && !this.timers[`timer-${session.id}`]) {
        this.props.fetchUnassignedSessionDetails(session.id);
        this.timers[`timer-${session.id}`] = setInterval(() => {
          this.props.fetchUnassignedSessionDetails(session.id);
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

  render() {
    const { sessions, operatorSecurityLevel, acceptSessionLoading } = this.props;
    return (
      <div className="queue">
        <div className="sidebar-head">
          Customer Queue
        </div>
        <div className="sidebar-body">
          {acceptSessionLoading &&
            <div className="loading tcenter">
              <i className="phxico phx-spinner phx-spin"></i>
            </div>}

          {!acceptSessionLoading && sessions.map((session) =>
            <QueueItem
              session={session}
              isGuest={!session.customerId}
              acceptSession={this.props.acceptSession}
              closeSession={this.props.closeUnassignedSession}
              disabled={session.customerDetails && operatorSecurityLevel < session.customerDetails.securityLevelRequired}
              customerDetails={session.customerDetails}
              toggleWarning={this.props.toggleUnassignedSessionWarning}
              key={session.id}
            />
          )}
        </div>
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Queue);