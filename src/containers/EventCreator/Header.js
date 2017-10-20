import React, { PropTypes } from "react";
import moment from 'moment';
import { connect } from 'react-redux';
import { hashHistory } from "react-router";
import { bindActionCreators } from 'redux';
import { logout } from '../../actions/user';
// import { deleteEventPath, deleteEvent } from '../../containersV2/EventCreator/EventPathTree/actions';
import Clock from '../../components/clock';
import ModalWindow from '../../components/modal';
import appModes from 'phxConstants/appModes';



function mapStateToProps(state) {
  return {
    user: state.user,
    eventCreatorPathTree: state.eventCreatorEventPath,
    currentMode: state.eventCreatorModes.currentMode,
  };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
      logout,
      deleteEventPath,
      deleteEvent,
      // setEventCreatorMode,
    }, dispatch)
}

class Header extends React.Component {
    constructor(props) {
        super(props);
        this._goLobby = this._goLobby.bind(this);
        this._logout = this._logout.bind(this);
    }


  _logout() {
    this.props.logout();
    hashHistory.replace('/#/login');
  }

  _goLobby() {
    hashHistory.replace('/');
  }

  _handleDeleteClick(e) {
    e.preventDefault();
    const { selectedPath } = this.props.eventCreatorPathTree;
    const id = selectedPath.key.substr(1, selectedPath.key.length);
    const key = selectedPath.key;
    if(key.charAt(0) === 'p') {
      this.props.deleteEventPath(id);
    } else if(key.charAt(0) === 'e') {
      this.props.deleteEvent(id);
    }
  }

  _menuClickedHandler(e, menuAction) {
      if (this.props.menuClickHandler) {
          this.props.menuClickHandler(e, menuAction)
      }
  }

  _renderAddMenu(currentMode, disableNewEventPath) {
      let menu;
      let disabled = disableNewEventPath || (currentMode !== appModes.READ_MODE);

      menu = (
          <li className={disabled ? 'disabled button btn-box add' : 'enabled button btn-box add'}>
              <a title="New Event Path" onClick={(e)=> {
                if (!disabled) {
                      this._menuClickedHandler(e, 'createPath');
                }
              }}>
                <i className="phxico phx-event-path icon-large"></i>
              </a>
          </li>
      );

      return menu;
  }

  _renderEditOrCancelMenu(currentMode, hasSelectedPath) {
      let menu;

      if (currentMode === appModes.READ_MODE) {
          menu = (
              <li className={hasSelectedPath ? 'enabled button btn-box edit' : 'disabled button btn-box'}>
                  <a title="Edit Selected" onClick={(e)=> {
                    if (hasSelectedPath) {
                        this._menuClickedHandler(e, 'edit');
                    }
                  }}>
                    <i className="phxico phx-market-edit icon-large"></i>
                  </a>
              </li>
        )
      } else {
          menu = (
              <li className={hasSelectedPath || currentMode === appModes.CREATE_MODE ? 'enabled button btn-box endcall' : 'disabled button btn-box endcall'}>
                  <a title="Cancel Editing" onClick={(e)=> {
                      if (hasSelectedPath || currentMode === appModes.CREATE_MODE) {
                          this._menuClickedHandler(e, 'cancel');
                      }
                  }}>
                    <i className="phxico phx-cancel"></i>
                  </a>
              </li>
          );
      }

      return menu;
  }

  _renderSaveOrDeleteMenu(currentMode, hasSelectedPath) {
      let menu;
        const { isDeletingEventPath } = this.props.eventCreatorPathTree;
      if (currentMode === appModes.READ_MODE) {
          menu = (
              <li className={hasSelectedPath ? 'enabled button btn-box delete' : 'disabled button btn-box delete'}>
                    <a title="Delete Selected" onClick={(e)=> {
                        if(hasSelectedPath && !isDeletingEventPath) {
                            this._handleDeleteClick(e);
                        }
                    }}>
                    {!isDeletingEventPath && <i className="phxico phx-delete"></i>}
                    {isDeletingEventPath && <i className="phxico phx-spinner phx-spin"></i>}
                  </a>
              </li>
          )
      } else {
          menu = (
              <li className={hasSelectedPath || currentMode === appModes.CREATE_MODE ? 'enabled button btn-box save' : 'disabled button btn-box save'}>
                  <a title="Save" onClick={(e)=> {
                      if (hasSelectedPath || currentMode === appModes.CREATE_MODE) {
                          this._menuClickedHandler(e, 'save');
                      }
                  }}>
                    <i className="phxico phx-save"></i>
                  </a>
              </li>
          )
      }

      return menu;
  }

  render() {
      const { user, eventCreatorPathTree, currentMode } = this.props;
      const { username, id } = this.props.user.details;
      const hasSelectedPath = eventCreatorPathTree.selectedPath !== null;
      const { isDeletingEventPath } = eventCreatorPathTree;
      const disableNewEventPath = eventCreatorPathTree.selectedPath && (eventCreatorPathTree.selectedPath.key.charAt(0) === 'm' || eventCreatorPathTree.selectedPath.key.charAt(0) === 'e')
      const disableNewMarket = !eventCreatorPathTree.selectedPath || eventCreatorPathTree.selectedPath.key.charAt(0) !== 'e';
      const disableNewEvent = eventCreatorPathTree.selectedPath && (eventCreatorPathTree.selectedPath.key.charAt(0) !== 'p');
      return (
        <header className="width-wrapper header-container clearfix">
          <div className="header-content">
            <section className="brand clearfix fleft">
              <div className="logo fleft push-right" onClick={this._goLobby}></div>
            </section>
            <nav className="navigation-container fleft">
                <ul className="nav">
                    <li>
                        <a className="active">Event Creator</a>
                    </li>
                </ul>
            </nav>
            <section className="control-buttons fleft header-actions">
              <ul className="list-reset button-group">
                  { this._renderAddMenu(currentMode, disableNewEventPath) }
                  <li className={disableNewEvent ? 'disabled button btn-box add' : 'enabled button btn-box add'}>
                      <a title="New Rank Event" onClick={(e)=> {this._menuClickedHandler(e, 'createRank');}}>
                        <i className="phxico phx-rank-event icon-large"></i>
                      </a>
                  </li>
                  <li className={disableNewEvent ? 'disabled button btn-box add' : 'enabled button btn-box add'}>
                      <a title="New Game Event" onClick={(e)=> {this._menuClickedHandler(e, 'createGame');}}>
                        <i className="phxico phx-game-event icon-large"></i>
                      </a>
                  </li>
                  <li className={disableNewMarket ? 'disabled button btn-box add' : 'enabled button btn-box add'}>
                      <a title="New Market" onClick={(e)=> {this._menuClickedHandler(e, 'createMarket');}}>
                        <i className="phxico phx-market-new icon-large"></i>
                      </a>
                  </li>
                  { this._renderEditOrCancelMenu(currentMode, hasSelectedPath) }
                  { this._renderSaveOrDeleteMenu(currentMode, hasSelectedPath) }
              </ul>
            </section>
            <section className="user-section fright">
                <div className="user-details user-section-item">
                  <div className="user-id">
                    {username} [{id}]
                  </div>
                  <Clock/>
                </div>
                <div className="btn btn-outline btn-logout" onClick={this._logout}>Logout</div>
            </section>
          </div>
        </header>
      );
  }
}

Header.propTypes = {
    menuClickHandler:  PropTypes.func, // menuClickHandler(event, menuAction)
}


export default connect(mapStateToProps, mapDispatchToProps)(Header);
