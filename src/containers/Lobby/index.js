import React from "react";
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Header from './Header';
import AppList from './AppList';
import AppRecentList from './AppRecentList';
import LoadingIndicator from '../../components/loadingIndicator';

function mapStateToProps(state) {
  return {
    startup: state.startup
  };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
    }, dispatch);
}

class Lobby extends React.Component {
  constructor(props) {
      super(props);
  }

  _renderLoadingIndicator() {
    return <LoadingIndicator/>
  }

  _renderLobby() {
    return (
      <div>
        <Header/>
        <section className="page-container">
          <AppRecentList/>
          <AppList/>
        </section>
        <footer></footer>
      </div>
    )
  }

  render() {
    return (
      <div id="app-lobby">
        {this._renderLobby()}
      </div>
    )
  }
}


export default connect(mapStateToProps, mapDispatchToProps)(Lobby);
