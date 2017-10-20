import React from "react";
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { hashHistory } from "react-router";
import { login } from '../actions/user';

function mapStateToProps(state) {
  return {
    user: state.user
  };
}

function mapDispatchToProps(dispatch) {
	return bindActionCreators({
        login
    }, dispatch);
}

class Login extends React.Component {
	constructor(props) {
        super(props);
        this.state = {
			username: '',
			password: ''
		};
		this._handleUsernameChange = this._handleUsernameChange.bind(this);
		this._handlePasswordChange = this._handlePasswordChange.bind(this);
		this._login = this._login.bind(this);
    }

    componentDidMount() {
        if(this.props.user.isLoggedIn) {
            hashHistory.replace('/');
        }
    }

    componentDidUpdate(prevProps, prevState) {
        if(prevProps.user.isLoggingIn && !this.props.user.isLoggingIn && this.props.user.isLoggedIn) {
            hashHistory.replace('/');
        }
        if(!prevProps.user.isLoggedIn && this.props.user.isLoggedIn) {
            hashHistory.replace('/');
        }
    }

	_handleUsernameChange(e) {
		this.setState({
			username: e.target.value
		})
	}

	_handlePasswordChange(e) {
		this.setState({
			password: e.target.value
		})
	}

	_login(e) {
        e.preventDefault();
		const { username, password } = this.state;
  		const isLoggedIn = this.props.user.isLoggedIn;
  		const errMsg = 'Error: We\'ve encountered a problem, please try again later.';
  		if(!isLoggedIn){
  			this.props.login(username, password);
  		}
    }

  	render() {
  		const userState = this.props.user;
  		const logInFailed = userState.logInFailed;
	    let _hasErr = false;
	    let _infoMsg = '';
	    let _errMsg = null;

	    if(logInFailed){
	      _errMsg = userState.errMsg
	      _hasErr = true;
	    }

	    if(_hasErr){
	      _infoMsg = <div className="info-message error clearfix">
	                    <i className="phxico phx-warning"></i>
	                    <span>{_errMsg}</span>
	                  </div>
	    }
	    return (
	        <div className="main-bg">
		        <div className="login-wrapper">
		          <div className="login-head">
		            <div className="logo-onbody">
		            </div>
		          </div>
		          <form onSubmit={this._login}>
			          <div className="input-group login-container">
			            <input type="text" onChange={this._handleUsernameChange} value={this.state.username} className="form-control uname" aria-label="..." placeholder="Username"/>
			            <input type="password" onChange={this._handlePasswordChange} value={this.state.password} className="form-control pword" aria-label="..." placeholder="Password"/>
			          </div>
			          <button type="submit" className="btn btn-primary btn-action btn-long">Login</button>
			          {_infoMsg}
			          { userState.isLoggingIn &&
			          	<div className="loading-overlay">
			          		<i className="phxico phx-spinner phx-spin"></i>
			          	</div>
			          }
		          </form>
		        </div>
		      </div>
      	)
  	}
}

export default connect(mapStateToProps, mapDispatchToProps)(Login);
