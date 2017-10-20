import React from "react";

class SessionsItem extends React.Component {
  componentWillUnmount() {
    clearInterval(this.timer);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.session.details) {
      if (!this.timer && nextProps.session.details.customerTimeoutWarning) {
        this.timer = setInterval(() => {
          nextProps.toggleWarning(nextProps.session.id);
        }, 500);
      }

      if (this.timer && nextProps.session.ended) {
        clearInterval(this.timer);
      }

      if (this.timer && !nextProps.session.details.customerTimeoutWarning) {
        clearInterval(this.timer);
      }
    }
  }

  render() {
    const { session, isGuest, selectSession, selected, closeSession } = this.props;
    let classes;
    if (session.ended && selected) classes = 'session-item ended selected';
    if (session.ended && !selected) classes = 'session-item ended';
    if (!session.ended && selected) classes = 'session-item selected';
    if (!session.ended && !selected) classes = 'session-item';
    return (
      <div
        className={classes}
        data-warning={session.warning && !session.ended ? 'true' : 'false'}
        onClick={() => selectSession(session.id)}
      >
        {isGuest ? <div>Guest</div> :
          <div>
            <div>{session.customerDetails.username}</div>
            <div><span>{session.customerDetails.firstName} </span><span>{session.customerDetails.lastName}</span></div>
            <div className="seclvl">{session.customerDetails.securityLevelRequired}</div>
          </div>}
        {session.ended && <button className="btn-reject" onClick={(e) => { e.stopPropagation(); closeSession(session) }}><i className="phxico phx-comment-remove-outline"></i></button>}
      </div>
    )
  }
}

export default SessionsItem;