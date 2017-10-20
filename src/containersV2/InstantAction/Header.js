import React from "react";
import { connect } from 'react-redux';
import { hashHistory } from "react-router";
import { bindActionCreators } from 'redux';
import { logout } from 'actions/user';
import { lockTable, unlockTable, showPreferencesModal } from './actions';
import Clock from 'components/clock';
import { toggleSideBar } from 'actions/apps';

function mapStateToProps(state) {
  return {
    user: state.user,
    locks: state.instantAction.locks,
    activeTabIndex: state.instantAction.activeTabIndex,
    isSideBarOpen: state.apps.isSideBarOpen
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    logout,
    lockTable,
    unlockTable,
    showPreferencesModal,
    toggleSideBar
  }, dispatch)
}

class Header extends React.Component {
  constructor(props) {
    super(props);
    this._logout = this._logout.bind(this);
    this._goLobby = this._goLobby.bind(this);
    this._handleLock = this._handleLock.bind(this);
    this._toggleSidePanel = this._toggleSidePanel.bind(this);
    this.state = {
      locked: false,
      activeTable: 'bets'
    }
  }

  componentWillReceiveProps(nextProps) {
    const { locks, activeTabIndex } = nextProps;
    switch (activeTabIndex) {
      case 0:
        this.setState(() => ({ locked: locks.bets, activeTable: 'bets' }));
        break;
      case 1:
        this.setState(() => ({ locked: locks.accounts, activeTable: 'accounts' }));
        break;
      case 2:
        this.setState(() => ({ locked: locks.payments, activeTable: 'payments' }));
        break;
      case 3:
        this.setState(() => ({ locked: locks.failedBets, activeTable: 'failedBets' }));
        break;
      default:
        break;
    }
  }

  _logout() {
    this.props.logout();
    hashHistory.replace('/login');
  }

  _goLobby() {
    hashHistory.replace('/');
  }

  _handleLock() {
    if (this.state.locked) {
      this.props.unlockTable(this.state.activeTable);
    } else {
      this.props.lockTable(this.state.activeTable);
    }
  }

  _toggleSidePanel() {
    this.props.toggleSideBar(!this.props.isSideBarOpen);
  }

  render() {
    const { username, id } = this.props.user.details;
    const { isSideBarOpen } = this.props

    return (
      <header className="width-wrapper header-container clearfix">
        <div className="header-content">
          <section className="brand clearfix fleft">
            <div className="logo fleft push-right" src="https://placehold.it/60x60" onClick={this._goLobby}></div>
          </section>
          <nav className="navigation-container fleft">
            <ul className="nav">
              <li>
                <a className="active">Instant Action</a>
              </li>
            </ul>
          </nav>
          <section className="control-buttons fleft header-actions">
            <ul className="list-reset button-group">
              <li className="button btn-box toggle-side" onClick={this._toggleSidePanel}>
                <a>
                  <i className={`phxico icon-medium ${isSideBarOpen ? 'phx-layout-left' : 'phx-layout-left-hide' }`}></i>
                </a>
              </li>
              <li className="button btn-box lock" onClick={this._handleLock}>
                <a>
                  {this.state.locked ? <i className="phxico phx-lock icon-medium"></i> : <i className="phxico phx-lock-open icon-medium"></i>}
                </a>
              </li>
              <li className="button btn-box" onClick={() => this.props.showPreferencesModal()}>
                <a>
                  <i className="phxico phx-settings icon-medium"></i>
                </a>
              </li>
            </ul>
          </section>
          <section className="user-section fright">
            <div className="user-details">
              <div className="user-id">
                {username} [{id}]
                  </div>
              <Clock />
            </div>
            <div className="btn btn-outline btn-logout" onClick={this._logout}>Logout</div>
          </section>
        </div>
      </header>
    );
  }
}


export default connect(mapStateToProps, mapDispatchToProps)(Header);