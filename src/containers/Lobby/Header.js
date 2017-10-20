import React from "react";
import moment from 'moment';
import { connect } from 'react-redux';
import { hashHistory } from "react-router";
import { bindActionCreators } from 'redux';
import { openModal } from '../../actions/modal';
import { logout } from '../../actions/user';
import Clock from '../../components/clock';

function mapStateToProps(state) {
  return {
    user: state.user
  };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({ 
      logout
    }, dispatch)
}

class Header extends React.Component {
  constructor(props) {
      super(props);
      this._logout = this._logout.bind(this);
  }

  _logout() {
    this.props.logout();
    hashHistory.replace('/login');
  }

  render() {
      const { username, id } = this.props.user.details;

      return (
        <header className="width-wrapper header-container clearfix">
          <div className="header-content">
            <section className="brand clearfix fleft">
              <div className="logo fleft push-right" src="https://placehold.it/60x60"></div> 
            </section>
            <section className="user-section fright">
                <div className="user-details">
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


export default connect(mapStateToProps, mapDispatchToProps)(Header);
