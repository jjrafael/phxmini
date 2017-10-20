import React from "react";
import Clock from './clock';
import { hashHistory } from "react-router";

class Header extends React.Component {
  constructor(props) {
      super(props);
      this._goLobby = this._goLobby.bind(this);
  }

  _goLobby() {
    hashHistory.replace('/');
  }

	render(){
		const {title, onClick, user, toggleSideBar} = this.props;
    // console.log(user)
		return (
  		<header className="width-wrapper header-container clearfix">
          <div className="header-content">
              <section className="control-buttons fleft header-actions sidebar-toggle" onClick={toggleSideBar}>
                <i className="phxico phx-bars"></i>
              </section>
              <section className="brand clearfix fleft">
                  <div className="logo fleft push-right" src="https://placehold.it/60x60" onClick={this._goLobby}></div> 
              </section>
              <nav className="navigation-container fleft">
                  <ul className="nav">
                      <li>
                          <a className="active">{title}</a>
                      </li>
                  </ul>
              </nav>
              <section className="control-buttons fleft header-actions">

                {this.props.children}

              </section>
              <section className="user-section fright">
                  <div className="user-details">
                      <div className="user-id">
                          {user.username} [{user.id}]
                      </div>
                      <Clock/>
                  </div>
                  <div className="btn btn-outline btn-logout" onClick={onClick}>Logout</div>
              </section>
          </div>
      </header>
		)
	}
}

export default Header;