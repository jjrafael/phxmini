import React from "react";
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

const mapStateToProps = (state) => {
  return {
    connected: state.instantAction.connected,
    activeTabIndex: state.instantAction.activeTabIndex
  }
}

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({}, dispatch);
};

class Connected extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      connected: null
    }
  }

  componentWillReceiveProps(nextProps) {
    const { connected, activeTabIndex } = nextProps;
    switch (activeTabIndex) {
      case 0:
        this.setState(() => ({ connected: connected.bets }));
        break;
      case 1:
        this.setState(() => ({ connected: connected.accounts }));
        break;
      case 2:
        this.setState(() => ({ connected: connected.payments }));
        break;
      case 3:
        this.setState(() => ({ connected: connected.failedBets }));
        break;
      default:
        break;
    }
  }

  render() {
    const { connected } = this.state;
    return (
      <div>
        {connected !== null &&
          <div className="connected-button">
            {connected && <div className="connected">CONNECTED</div>}
            {!connected && <div className="disconnected">DISCONNECTED</div>}
          </div>}
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Connected);