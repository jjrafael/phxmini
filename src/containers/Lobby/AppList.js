import React from "react";
import { connect } from 'react-redux';
import { hashHistory } from "react-router";
import { bindActionCreators } from 'redux';
import { fetchApps } from '../../actions/apps';
import { appNamesAlias } from '../../constants/appNames';

function mapStateToProps(state) {
  return {
    user: state.user,
    apps: state.apps
  };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({ 
      fetchApps
    }, dispatch)
}

class AppList extends React.Component {
  constructor(props) {
      super(props);
  }

  componentDidUpdate(prevProps, prevState) {
    {prevProps.user.details.id !== this.props.user.details.id &&
      this.props.fetchApps(this.props.user.details.id);
    }
  }

  componentDidMount() {
    this.props.fetchApps(this.props.user.details.id);
  }

  _setLink(desc) {
    return '/'+desc.toLowerCase().split(' ').join('-');
  }

  _renderAppList() {
    const { user } = this.props;
    return this.props.apps.appList.map ((app) => {
      const appDesc = app.description;
      const appName = appNamesAlias[appDesc] ? appNamesAlias[appDesc] : appDesc;
      const link = this._setLink(appName);
      return (
        <div className="btn-launch btn-action" key={app.applicationId} data-app={appName} onClick={(e)=> {
            this._redirectToApp(link);
          }}>
          <div className="app-icon"></div>
          <span>{appName}</span>
        </div>
      )
    })
  }

  _renderLoadingIndicator() {
      return(
          <div className="loading tcenter">
              <i className="phxico phx-spinner phx-spin"></i>
          </div>
      )
  }

  _redirectToApp(link) {
    hashHistory.replace(link);
  }

  render() {
    if(!!this.props.apps.appList.length && !this.props.apps.fetchAppsFailed && !this.props.apps.isFetchingApps){
      return (
        <div className="section-wrapper">
          <h3>Applications</h3>
            <div className="apps-container">
              {this._renderAppList()}
            </div>
        </div>
      );
    } else if(this.props.apps.isFetchingApps) {
      return (
        <div className="section-wrapper">
          <div className="loading-container tcenter">
            {this._renderLoadingIndicator()}
          </div>
        </div>
      );
    } else {
      return null;
    }
    
  }
}


export default connect(mapStateToProps, mapDispatchToProps)(AppList);
