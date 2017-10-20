import React from "react";
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import ensureAppIsAllowed from 'componentsV2/ensureAppIsAllowed/index';
import { saveState } from 'localStorage';
import Header from './Header';
import Sidebar from './Sidebar';
import Main from './Main';
import { rehydrateState } from './actions';
import { useApp } from 'actions/apps';
import { startupApp } from 'actions/startup';
import appNames from 'constants/appNames';

const mapStateToProps = (state) => {
  return {
    operatorId: state.user.details.id,
    state: state.instantAction
  }
}

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({
    rehydrateState,
    useApp,
    startupApp,
  }, dispatch);
};

const appName = appNames.INSTANT_ACTION;

class App extends React.Component {
  componentWillMount() {
    const { startupApp, useApp, operatorId } = this.props;
    this.props.rehydrateState();
    useApp(operatorId, 28);
    startupApp(appName);
  }

  componentWillUpdate() {
    saveState('instantAction', this.props.state);
  }

  render() {
    return (
      <div id="app-instant-action">
        <Header />
        <section className="page-container">
          <Sidebar />
          <Main />
        </section>
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ensureAppIsAllowed({appKey: 'INSTANT_ACTION'})(App));