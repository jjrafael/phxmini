import React from 'react';
import _ from 'underscore';

import ApplicationListBoxContainer from './ApplicationListBoxContainer';
import PermissionListBoxContainer from './PermissionListBoxContainer';
import ReportListBoxContainer from './ReportListBoxContainer';

class PermissionContainer extends React.Component {

  constructor(props) {
    super(props);
    this._filterActions = this._filterActions.bind(this);
  }


  _filterActions(allActions, applicationAssigned){
    // const allActions = this.state.formAllActionsList
    // const applicationAssigned = this.state.formApplicationsAssigned

    return _.filter(allActions, (action)=>{
      const id = action.applicationId.toString()
      return (applicationAssigned.indexOf(id) !== -1 )
    })
  }

  render() {
  
    return (
  		<div className="form-wrapper">
  			<h4>Permissions</h4>
  			<div className="row">
  				<div className="desktop-full">
  					<label className="form-group-label">Applications</label>
  					<ApplicationListBoxContainer filterActions={this._filterActions}/>
  					<label className="form-group-label">Permissions</label>
  					<PermissionListBoxContainer filterActions={this._filterActions}/>
  					<label className="form-group-label">Reports</label>
  					<ReportListBoxContainer  filterActions={this._filterActions}/>
  				</div>
  			</div>
  		</div>	
    );
  }
}

export default PermissionContainer;
