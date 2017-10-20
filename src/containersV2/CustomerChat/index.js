import React from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import ensureAppIsAllowed from 'componentsV2/ensureAppIsAllowed/index';
import { fetchUnassignedSessions, getOperatorSecurityLevel, fetchAssignedSessions } from './actions';
import Header from './Header';
import Sidebar from "./Sidebar";
import Main from "./Main";
import { useApp } from 'actions/apps';
import { startupApp } from 'actions/startup';
import appNames from 'constants/appNames';

const mapStateToProps = state => {
  return {
    operatorId: state.user.details.id
  };
};

const mapDispatchToProps = dispatch => {
  return bindActionCreators({
    fetchUnassignedSessions,
    fetchAssignedSessions,
    getOperatorSecurityLevel,
    useApp,
    startupApp,
  }, dispatch);
};

const appName = appNames.CUSTOMER_CHAT;

class App extends React.Component {
  componentWillMount() {
    const { startupApp, useApp, operatorId } = this.props;
    useApp(operatorId, 37);
    startupApp(appName);
  }
  async componentDidMount() {
    this.props.fetchUnassignedSessions();
    await this.props.getOperatorSecurityLevel(this.props.operatorId);
    this.props.fetchAssignedSessions(this.props.operatorId);

    this.timer = setInterval(() => {
      this.props.fetchUnassignedSessions();
      this.props.fetchAssignedSessions(this.props.operatorId);
    }, 2000);
  }

  componentWillUnmount() {
    clearTimeout(this.timer);
  }

  render() {
    return (
      <div id="app-customer-chat">
        <Header />
        <section className="page-container">
          <Sidebar />
          <Main />
        </section>
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ensureAppIsAllowed({appKey: 'CUSTOMER_CHAT'})(App));
