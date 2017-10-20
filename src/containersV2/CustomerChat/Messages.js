import React from "react";
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Message from './Message';

const mapStateToProps = (state) => {
  return {
    selectedSessionId: state.customerChat.selectedSessionId,
    assignedSessions: state.customerChat.assignedSessions,
    operatorSecurityLevel: state.customerChat.operatorSecurityLevel
  }
}

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({}, dispatch);
};

class Messages extends React.Component {
  componentWillReceiveProps(nextProps) {
    this.selectedSession = nextProps.assignedSessions.find((session) => session.id === nextProps.selectedSessionId) || null;
  }

  _parseTimestamp(time) {
    if (time) {
      const splited = time.split('T')[1].split(':');
      return `${splited[0]}:${splited[1]}`;
    }
  }

  _renderSysMessage(details) {
    let txt = '';
    let icon = '';

    switch (details.endReason) {
      case 'CUSTOMER_END':
        txt = 'The customer has ended the conversation';
        icon = 'comment-remove-outline';
        break;
      case 'OPERATOR_END':
        txt = 'The customer has ended the conversation';
        icon = 'comment-remove-outline';
        break;
      case 'CUSTOMER_MESSAGE_TIMEOUT':
        txt = 'Customer chat timeout';
        icon = 'timer-off';
        break;
      case 'OPERATOR_MESSAGE_TIMEOUT':
        txt = 'Operator chat timeout';
        icon = 'timer-off';
        break;
      default:
        txt = 'Session End';
        icon = 'timer-off';
        break;
    }

    return (
      <div className="message system-message" data-msg={''}>
        <i className={`phxico phx-${icon}`}></i>
        <div className="sysmsg-text">{txt}</div>
        <div className="message-timestamp">{this._parseTimestamp(details.endTime)}</div>
      </div>
    )
  }

  _renderAttentionMessage() {
    return (
      <div className="message system-message">
        <div className="sysmsg-text">You are not authorize to message this user</div>
      </div>
    )
  }

  render() {
    return (
      <div className="messages">
        {this.selectedSession && !this.selectedSession.messages &&
          <div className="loading tcenter">
            <i className="phxico phx-spinner phx-spin"></i>
          </div>
        }

        {this.selectedSession && this.selectedSession.messages && this.selectedSession.messages.map((message) =>
          <Message timestamp={this._parseTimestamp(message.timestamp)} origin={message.origin} message={message.message} key={message.id} />
        )}

        {this.selectedSession && this.selectedSession.ended &&
          this._renderSysMessage(this.selectedSession.details)
        }

        {
          this.selectedSession &&
          this.selectedSession.customerDetails &&
          this.selectedSession.customerDetails.securityLevelRequired > this.props.operatorSecurityLevel &&
          this._renderAttentionMessage()
        }
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Messages);