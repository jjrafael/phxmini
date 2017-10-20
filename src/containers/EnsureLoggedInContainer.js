import React from "react";
import { connect } from 'react-redux';
import { hashHistory } from "react-router";
import { bindActionCreators } from 'redux';
import { startup as startupGlobalApp } from '../actions/startup';
import LoadingIndicator from '../components/loadingIndicator';


function mapStateToProps(state) {
  return {
    user: state.user,
    startup: state.startup
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
      startupGlobalApp
    }, dispatch);
}

class EnsureLoggedInContainer extends React.Component {
  componentDidMount() {
    this.props.startupGlobalApp();
  }

  componentDidUpdate(prevProps, prevState) {
    if(prevProps.startup.isStartingUp && this.props.startup.isStartingUp === false && !this.props.startupFailed && !this.props.user.isLoggedIn) {
      hashHistory.replace('/login')
    }
    if(prevProps.user.isLoggedIn && !this.props.user.isLoggedIn) {
      hashHistory.replace('/login')
    }
  }

  _renderLoadingIndicator() {
    return (
      <div>
        <LoadingIndicator/>
        <h3>Loading Dependencies</h3>
      </div>
    )
  }

  render() {
    const { user, startup } = this.props;
    if(!startup.isStartingUp && !startup.startupFailed && !user.isLoggedIn) {
      return null
    }
    return (
      <div>
        {startup.isStartingUp && this._renderLoadingIndicator()}
        {!startup.isStartingUp && !startup.startupFailed && user.isLoggedIn && this.props.children}
      </div>
    )
  }
}


export default connect(mapStateToProps, mapDispatchToProps)(EnsureLoggedInContainer);