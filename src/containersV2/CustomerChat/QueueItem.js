import React from "react";

class QueueItem extends React.Component {
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
    const { isGuest, session, acceptSession, disabled, customerDetails, closeSession } = this.props;
    let classes;
    if (disabled && session.flash) classes = 'queue-item queue-item-disabled flash-item';
    if (disabled && !session.flash) classes = 'queue-item queue-item-disabled';
    if (!disabled && session.flash) classes = 'queue-item flash-item';
    if (!disabled && !session.flash) classes = 'queue-item';
    if (session.ended) classes = 'queue-item ended';
    return (
      <div
        className={classes}
        data-warning={session.warning && !session.ended ? 'true' : 'false'}
      >
        {isGuest ? <div>Guest</div> :
          <div>
            <div>{customerDetails.username}</div>
            <div><span>{customerDetails.firstName} </span><span>{customerDetails.lastName}</span></div>
            <div className="seclvl">{customerDetails.securityLevelRequired}</div>
          </div>}

        {!session.ended && <button className="btn-accept" onClick={(e) => { e.stopPropagation(); acceptSession(session) }} disabled={disabled}><i className="phxico phx-comment-check-outline"></i></button>}
        {session.ended && <button className="btn-reject" onClick={(e) => { e.stopPropagation(); closeSession(session.id) }}><i className="phxico phx-comment-remove-outline"></i></button>}
      </div>
    )
  }
}

export default QueueItem;