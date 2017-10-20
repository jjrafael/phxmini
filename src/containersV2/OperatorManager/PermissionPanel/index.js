import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import _ from 'underscore';
import {fetchApplications,fetchActions, fetchReports, setApplicationPermissionSelected, setPermissionSelected, loadPermissionSelected} from './actions';
import PermissionContainer from './containers/PermissionContainer';

const mapStateToProps = (state) => {
  const {
    operatorid,
    groupid,
    groupStatus
  } = state.operatorList;

  return {
    operatorid,
    groupid,
    groupStatus,
    operatorApplications : state.permissionPanel.operatorApplications,
    isFetchingApplicationPermissions : state.permissionPanel.isFetchingApplicationPermissions,
    isFetchingApplicationActionPermissions : state.permissionPanel.isFetchingApplicationActionPermissions,
  }
}

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({
  	fetchApplications,
  	fetchActions,
  	fetchReports,
  	setApplicationPermissionSelected, setPermissionSelected, loadPermissionSelected
  }, dispatch)
}

class ApplicationPanel extends React.Component {
	constructor(props) {
	    super(props);
	    this._fetchPermissions = this._fetchPermissions.bind(this);
	}
	componentWillMount() {
		if(this.props.operatorid || this.props.groupid) {
	  		this._fetchPermissions(this.props.operatorid, this.props.groupid);
	  	}
	}
	componentWillReceiveProps(nextProps) {
	  	if(!_.isEqual(this.props.operatorid, nextProps.operatorid) || !_.isEqual(this.props.groupid,nextProps.groupid) ) {
	  		this._fetchPermissions(nextProps.operatorid, nextProps.groupid);
	  	}
	}
	_fetchPermissions(operatorid, groupid){
	    let fetchId;
	    let fetchType;
	    if (operatorid) {
	      fetchType = 'operators'
	      fetchId = operatorid
	    } else {
	      fetchType = 'operatorgroups'
	      fetchId = groupid
	    }

	    this.props.fetchApplications(fetchType, fetchId)
	    this.props.fetchActions(fetchType, fetchId)
	    this.props.fetchReports(groupid, operatorid)
	}
	render() {
		const hasOperatorId = this.props.operatorid;
	    return (
	      <div className={`desktop-full permission-panel ${hasOperatorId && 'operator-open'}`}>
	      	<PermissionContainer {...this.props}/>
	      </div>
	    );
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(ApplicationPanel)
