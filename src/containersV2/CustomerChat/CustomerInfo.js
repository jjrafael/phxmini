import React from "react";
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

const mapStateToProps = (state) => {
  return {
    selectedSessionId: state.customerChat.selectedSessionId,
    assignedSessions: state.customerChat.assignedSessions
  }
}

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({}, dispatch);
};

class CustomerInfo extends React.Component {
  componentWillReceiveProps(nextProps) {
    this.selectedSession = nextProps.assignedSessions.find((session) => session.id === nextProps.selectedSessionId) || null;
  }

  render() {
    const { endSession, sendMessage, disabled } = this.props;

    return (
      <div className="customer-info">
        {this.selectedSession && !this.selectedSession.customerDetails && <div className="info-head">Guest</div>}

        {!this.selectedSession && <div className="info-details">Please select a customer from the queue</div>}

        {this.selectedSession && this.selectedSession.customerDetails &&
          <div>
            <div className="info-head" title={this.selectedSession.customerDetails.username}>{this.selectedSession.customerDetails.username}</div>
            <div className="info-details" title={`${this.selectedSession.customerDetails.firstName} ${this.selectedSession.customerDetails.lastName}`}>
              <div>{this.selectedSession.customerDetails.firstName} {this.selectedSession.customerDetails.lastName}</div>
            </div>
          </div>}
          <button className="btn-endchat" onClick={endSession} disabled={disabled} title="End Chat">
            <i className="phxico phx-end-chat icon-large"></i>
          </button>
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(CustomerInfo);