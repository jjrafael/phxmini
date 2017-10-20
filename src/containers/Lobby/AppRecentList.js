import React from "react";
import { connect } from 'react-redux';
import { hashHistory } from "react-router";
import { bindActionCreators } from 'redux';
import { fetchRecentApps } from '../../actions/apps';
import { appNamesAlias } from '../../constants/appNames';

function mapStateToProps(state) {
  return {
    user: state.user,
    apps: state.apps
  };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({ 
      fetchRecentApps
    }, dispatch)
}

class AppRecentList extends React.Component {
  constructor(props) {
      super(props);
  }

  componentDidUpdate(prevProps, prevState) {
    {prevProps.user.details.id !== this.props.user.details.id &&
      this.props.fetchRecentApps(this.props.user.details.id);
    }
  }

  componentDidMount() {
    this.props.fetchRecentApps(this.props.user.details.id);
  }

  _setLink(desc) {
    return '/'+desc.toLowerCase().split(' ').join('-');
  }


  _renderAppRecentList() {
    const { user } = this.props;
    return this.props.apps.appRecentList.map ((app) => {
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
    const { apps } = this.props;
    if(!!apps.appRecentList.length && !apps.fetchRecentAppsFailed && !apps.isFetchingRecentApps){
      return (
        <div className="section-wrapper">
          <h3>Recently Used Applications</h3>
            <div className="apps-container">
              {this._renderAppRecentList()}
            </div>
        </div>
      );
    } else if(!apps.fetchRecentAppsFailed && apps.isFetchingRecentApps) {
      return (
        <div className="section-wrapper">
          <div className="loading-container tcenter">
            {this._renderLoadingIndicator()}
          </div>
        </div>
      );
    }else{
      return null;
    }
  }
}


export default connect(mapStateToProps, mapDispatchToProps)(AppRecentList);
