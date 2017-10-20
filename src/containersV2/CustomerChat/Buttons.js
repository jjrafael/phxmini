import React from "react";

class ChatPanel extends React.Component {
  render() {
    const { sendMessage, disabled } = this.props;
    return (
      <div className="buttons">
        <button className="btn-send" onClick={sendMessage} disabled={disabled}>
        	<i className="phxico phx-send" title="Send"></i>
        </button>
      </div>
    )
  }
}

export default ChatPanel;