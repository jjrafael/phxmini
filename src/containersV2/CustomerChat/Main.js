import React from "react";
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { sendMessage, endSession, changeTextValue, changeSendMessageStatus } from './actions';
import CustomerInfo from './CustomerInfo';
import Messages from './Messages';
import Text from './Text';
import Buttons from './Buttons';

const mapStateToProps = (state) => {
  return {
    selectedSessionId: state.customerChat.selectedSessionId,
    assignedSessions: state.customerChat.assignedSessions,
    sendMessageStatus: state.customerChat.sendMessageStatus,
    text: state.customerChat.text,
    operatorSecurityLevel: state.customerChat.operatorSecurityLevel
  }
}

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({
    sendMessage,
    endSession,
    changeTextValue,
    changeSendMessageStatus
  }, dispatch);
};

class Main extends React.Component {
  constructor(props) {
    super(props);
    this._sendMessage = this._sendMessage.bind(this);
    this._endSession = this._endSession.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    this.selectedSession = nextProps.assignedSessions.find((session) => session.id === nextProps.selectedSessionId) || null;
    if (nextProps.sendMessageStatus === 'SUCCESS') {
      this.props.changeTextValue('');
      this.props.changeSendMessageStatus('');
    }
  }

  _sendMessage() {
    if (this.props.text) {
      this.props.sendMessage(this.selectedSession.id, this.props.text);
    }
  }

  _endSession() {
    this.props.endSession(this.selectedSession.id);
  }

  render() {
    return (
      <div className="page-main no-footer">
        <div className="main-head">Chat</div>
        <div className="main-body">
          <CustomerInfo endSession={this._endSession} disabled={!this.selectedSession || this.selectedSession.ended} />
          <Messages />
        </div>
        <div className="textarea-wrapper">
          <Text handleChange={this.props.changeTextValue} />
          <Buttons
            sendMessage={this._sendMessage}
            disabled={
              !this.selectedSession ||
              this.selectedSession.ended ||
              (this.selectedSession.customerDetails && this.selectedSession.customerDetails.securityLevelRequired > this.props.operatorSecurityLevel)
            }
          />
        </div>
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Main);


