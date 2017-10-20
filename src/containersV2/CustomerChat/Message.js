import React from "react";

class Message extends React.Component {
  render() {
    const { message, origin, timestamp } = this.props;
    const messageClasses = `message ${origin.toLowerCase()}-message`;
    return (
    	<div className="message-wrapper">
	      <div className={messageClasses}>
	        <div className="message-subhead">{timestamp} - {origin}</div>
	        <div className="message-content">{message}</div>
	      </div>
      	</div>
    )
  }
}

export default Message;