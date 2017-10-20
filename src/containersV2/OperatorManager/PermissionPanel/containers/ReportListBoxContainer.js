import React from 'react';
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { makeIterable } from 'phxUtils';
import {setApplicationPermissionSelected, setReportPermissionSelected, moveReports} from '../actions';
import ReportPanel from '../components/ReportPanel';
import { mapPermissionsToProps } from 'componentsV2/checkPermission/index'
import constants from '../../App/constants'

const mapStateToProps = (state) => {
  return {
    isFetchingReportsPermissions : state.permissionPanel.isFetchingReportsPermissions,
    assignedReportsList: state.permissionPanel.assignedReportsList,
    unassignedReportsList: state.permissionPanel.unassignedReportsList,
    reportsMap: state.permissionPanel.reportsMap,
    assignedAndCheckedCount: state.permissionPanel.assignedAndCheckedCount,
    unassignedAndCheckedCount: state.permissionPanel.unassignedAndCheckedCount,
    assignedReportsArray: state.permissionPanel.assignedReportsArray,
    unassignedReportsArray: state.permissionPanel.unassignedReportsArray,
    groupList: state.operatorList.groupIndex,
    operatorid: state.operatorList.operatorid,
    groupid:  state.operatorList.groupid
  }
}

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({
      setApplicationPermissionSelected,
      setReportPermissionSelected,
      moveReports
  }, dispatch)
}

class ReportListBoxContainer extends React.Component {

  constructor(props) {
    super(props);
    this._handleSelectAssignedAll = this._handleSelectAssignedAll.bind(this);
    this._handleSelectUnassignedAll = this._handleSelectUnassignedAll.bind(this);
    this._handleSelectAssigned = this._handleSelectAssigned.bind(this);
    this._handleSelectUnassigned = this._handleSelectUnassigned.bind(this);
  }

  _handleSelectAssignedAll() {
    let { reportsMap, moveReports } = this.props;
    moveReports([...makeIterable(reportsMap)]);
  }

  _handleSelectUnassignedAll() {
    let { reportsMap, moveReports } = this.props;
    moveReports([...makeIterable(reportsMap)], 'left');
  }
  _handleSelectAssigned(){
    let { reportsMap, moveReports } = this.props;
    moveReports([...makeIterable(reportsMap)].filter(report => report[`isChecked_unassigned`]));
  }
  _handleSelectUnassigned(){
    let { reportsMap, moveReports } = this.props;
    moveReports([...makeIterable(reportsMap)].filter(report => report[`isChecked_assigned`]), 'left');
  }
  render() {
    const {
      isFetchingReportsPermissions,
      assignedAndCheckedCount,
      unassignedAndCheckedCount,
      assignedReportsArray,
      unassignedReportsArray,
      unassignedReportsList,
      assignedReportsList,
      permissions,
      groupList,
      operatorid,
      groupid
    } = this.props;
    const isAdmin = groupList.find((group)=> group.id === 1) //check if user is in admin group
    
    const createGroupPermission =  isAdmin || permissions.includes(
      constants.permissionsCode.CREATE_GROUP
    )
    const createUserPermission = isAdmin || permissions.includes(
      constants.permissionsCode.CREATE_USER
    )
    const updatePermission = operatorid ? createUserPermission : groupid !== null ? createGroupPermission : false
    return (
      <div className="report-permission">
         <div className="react-dual-listbox">
              <ReportPanel
                isLoading={isFetchingReportsPermissions}
                reportsList={unassignedReportsList}
                group="unassigned"
              />
              <div className="rdl-actions">
                  <div className="rdl-actions-right">
                      <button onClick={this._handleSelectAssignedAll} aria-label="Move all right" className="rdl-move rdl-move-all rdl-move-right" title="Move all right" type="button" disabled={!updatePermission || isFetchingReportsPermissions || !unassignedReportsArray.length}><span className="phx-ico phx-chevron-double-right"></span></button>
                      <button onClick={this._handleSelectAssigned} aria-label="Move right" className="rdl-move rdl-move-right" title="Move right" type="button" disabled={!updatePermission || isFetchingReportsPermissions || !unassignedAndCheckedCount}><span className="phx-ico phx-chevron-right"></span></button>
                  </div>
                  <div className="rdl-actions-left">
                      <button onClick={this._handleSelectUnassigned} aria-label="Move left" className="rdl-move rdl-move-left" title="Move left" type="button" disabled={!updatePermission || isFetchingReportsPermissions || !assignedAndCheckedCount}><span className="phx-ico phx-chevron-left"></span></button>
                      <button onClick={this._handleSelectUnassignedAll} aria-label="Move all left" className="rdl-move rdl-move-all rdl-move-left" title="Move all left" type="button" disabled={!updatePermission || isFetchingReportsPermissions || !assignedReportsArray.length}><span className="phx-ico phx-chevron-double-left"></span></button>
                  </div>
              </div>
              <ReportPanel
                isLoading={isFetchingReportsPermissions}
                reportsList={assignedReportsList}
                group="assigned"
              />
          </div> 
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(mapPermissionsToProps(ReportListBoxContainer))
