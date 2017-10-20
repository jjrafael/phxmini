import React from 'react';
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import _ from 'underscore';
import {setActionPermissionSelected, updateActionPermissionList, setOriginalApplicationPermission} from '../actions';
import { mapPermissionsToProps } from 'componentsV2/checkPermission/index'
import constants from '../../App/constants'

const mapStateToProps = (state) => {
  const  {
    isSettingApplicationPermission,
    selectedApplicationPermissions,
    isSettingPermission,
    selectedPermissions,
    operatorApplications,
    operatorApplicationActions,
    isFetchingApplicationPermissions,
    originalApplicationPermissions,
    applicationPermissionsMap,
    actionPermissionsMap, assignedActionPermissions, unassignedActionPermissions, isFetchingActionPermissions, 
    } = state.permissionPanel
    const {
      groupIndex,
      operatorid,
      groupid
    }  = state.operatorList
  return {
    isSettingApplicationPermission,
    selectedApplicationPermissions,
    isSettingPermission,
    selectedPermissions,
    operatorApplications,
    operatorApplicationActions,
    isFetchingApplicationPermissions,
    originalApplicationPermissions,
    applicationPermissionsMap,
    actionPermissionsMap, assignedActionPermissions, unassignedActionPermissions, isFetchingActionPermissions,
    groupList: groupIndex,
    operatorid,
    groupid    
  }
}

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({
   setActionPermissionSelected,
   updateActionPermissionList,
   setOriginalApplicationPermission
  }, dispatch)
}

class PermissionListBoxContainer extends React.Component {

  constructor(props) {
    super(props);
    this._handleSelect = this._handleSelect.bind(this);
    this._handleSelectAssignedAll = this._handleSelectAssignedAll.bind(this);
    this._handleSelectUnassignedAll = this._handleSelectUnassignedAll.bind(this);
    this._handleSelectAssigned = this._handleSelectAssigned.bind(this);
    this._handleSelectUnassigned = this._handleSelectUnassigned.bind(this);
    this._handleCheckboxState = this._handleCheckboxState.bind(this);

    this.state = {
      toBeAssigned : [],
      toBeUnassigned : [],
    }
  }

  _handleSelect(options) {
      const {selectedPermissions} = this.props;
      const {originalOptions} = this.state;
      let newOptions = [];
      const selectedApplicationPermissions = [...this.props.selectedApplicationPermissions];  
      selectedApplicationPermissions.forEach(selectedApp => {
          options.forEach(action => {
              if(action.applicationId.toString() === selectedApp.applicationId.toString()){
                newOptions.push(action);
              }
          })
      })
      
      this.setState({options : newOptions});
  }

  _handleSelectAssignedAll() {
    // this.setState({selected : this.state.options, options:[]});
    // this.props.setPermissionSelected(this.state.options);
    const {unassignedActionPermissions, assignedActionPermissions} = this.props;
    this.props.setActionPermissionSelected([...unassignedActionPermissions, ...assignedActionPermissions], []);
  }

  _handleSelectUnassignedAll() {
    // this.setState({selected : [], options:this.state.selected});
    // this.props.setPermissionSelected([]);
    const {unassignedActionPermissions, assignedActionPermissions} = this.props;
    this.props.setActionPermissionSelected([], [...assignedActionPermissions, ...unassignedActionPermissions]);
  }

  _handleSelectAssigned(){
    // let parentSelection = document.querySelectorAll('.action-permission input.rp-unassigned-parent-selection:checked');
    // // let childSelection = document.querySelectorAll('input.rp-unassigned-child-selection:checked');
    // let originalOptions = this.props.options;
    // let {options, selected} = this.state;
    // let toAssigned = selected;

    // if(parentSelection.length) {
    //     parentSelection.forEach(input => {
    //         let { optionindex, pvalue } = input.dataset;
    //         toAssigned.push(options[optionindex]);
    //         options.splice(optionindex, 1);
    //         input.click();
    //     })
    // }
    // this.setState({selected : toAssigned, options:options});
    // this.props.setPermissionSelected(toAssigned);
    const {unassignedActionPermissions, assignedActionPermissions} = this.props;
    let toBeAssigned = [...this.state.toBeAssigned]
    let unassigned = [...this.props.unassignedActionPermissions];

    toBeAssigned.forEach(appId => {
        let index = unassigned.indexOf(appId)
        unassigned.splice(index, 1)
    })
    
    this.props.setActionPermissionSelected([ ...toBeAssigned,...this.props.assignedActionPermissions], unassigned);
    this.setState({toBeAssigned:[]});
  }
  _handleSelectUnassigned(){
    // let parentSelection = document.querySelectorAll('.action-permission input.rp-assigned-parent-selection:checked');
    // // let childSelection = document.querySelectorAll('input.rp-assigned-child-selection:checked');
    // let originalOptions = this.props.options;
    // let {options, selected} = this.state;
    // let toUnassigned = options;

    // if(parentSelection.length) {
    //     parentSelection.forEach(input => {
    //         let { optionindex, pvalue } = input.dataset;
    //         toUnassigned.push(selected[optionindex]);
    //         selected.splice(optionindex, 1);
    //         input.click();
    //     })
    // }

    // this.setState({selected : selected, options:toUnassigned});
    // this.props.setPermissionSelected(selected);
    const {unassignedActionPermissions, assignedActionPermissions} = this.props;
    let toBeUnassigned = [...this.state.toBeUnassigned]
    let assigned = [...this.props.assignedActionPermissions];

    toBeUnassigned.forEach(appId => {
        let index = assigned.indexOf(appId)
        assigned.splice(index, 1)
    })
    
    this.props.setActionPermissionSelected(assigned, [ ...toBeUnassigned,...this.props.unassignedActionPermissions]);
    this.setState({toBeUnassigned:[]});

  }
  
  _handleCheckboxState(e, appId, type){
    let el = e.target;
    let toBeAssigned = [...this.state.toBeAssigned];
    let toBeUnassigned = [...this.state.toBeUnassigned];

    if(type === 'unassigned') {
      if(el.checked === true) {
          // el.closest('label').classList.add('active');
          toBeAssigned.push(appId);
      }else {
          // el.closest('label').classList.remove('active');
          toBeAssigned = toBeAssigned.filter((app)=> app !== appId)
      }
    } else {
      if(el.checked === true) {
          // el.closest('label').classList.add('active');
          toBeUnassigned.push(appId);
      }else {
          // el.closest('label').classList.remove('active');
          toBeUnassigned = toBeUnassigned.filter((app)=> app !== appId)
      }
    }
    this.setState({toBeAssigned : toBeAssigned, toBeUnassigned : toBeUnassigned});
  }

  // componentDidUpdate(prevProps){
 
  //   if((prevProps.isFetchingApplicationActionPermissions && this.props.isFetchingApplicationActionPermissions === false ) /*&& !_.isEqual(this.props.selectedApplicationPermissions, this.props.selectedApplicationPermissions)*/){
  //     this.setState({selected : [...this.props.operatorApplicationActions.assignedActions], originalOptions: [...this.props.operatorApplicationActions.unassignedActions]})
  //     this._handleSelect([...this.props.operatorApplicationActions.unassignedActions]);
  //     this.props.setPermissionSelected([...this.props.operatorApplicationActions.assignedActions]);
  //   }
  //   if((this.props.isFetchingApplicationActionPermissions === false && this.props.isSettingApplicationPermission === false) && !_.isEqual(this.props.selectedApplicationPermissions, prevProps.selectedApplicationPermissions)){
  //     this.props.setPermissionSelected([...this.props.operatorApplicationActions.assignedActions]);
  //     this._handleSelect([...this.props.operatorApplicationActions.unassignedActions]);
  //     this.setState({selected : [...this.props.operatorApplicationActions.assignedActions], originalOptions: [...this.props.operatorApplicationActions.unassignedActions]})
  //   }
  // }

  render() {
  	const {actionPermissionsMap, applicationPermissionsMap, assignedActionPermissions, unassignedActionPermissions, isFetchingActionPermissions, permissions, groupList, operatorid, groupid } = this.props;
    const {toBeUnassigned, toBeAssigned} = this.state;
    const assigned = [...assignedActionPermissions];
    const assignedLabel = [...assignedActionPermissions].map(appId => {
        const Application = applicationPermissionsMap[actionPermissionsMap[appId].applicationId];
        return {
          id : appId,
          description : actionPermissionsMap[appId].hasOwnProperty('applicationDescription') ? actionPermissionsMap[appId].applicationDescription :  `${Application.hasOwnProperty('applicationDescription') ? Application.applicationDescription: Application.description } - ${actionPermissionsMap[appId].description}`
        }
    });
    const unassigned = [...unassignedActionPermissions];
    const unassignedLabel = [...unassignedActionPermissions].map(appId => {
        const Application = applicationPermissionsMap[actionPermissionsMap[appId].applicationId];
        return {
          id : appId,
          description : actionPermissionsMap[appId].hasOwnProperty('applicationDescription') ? actionPermissionsMap[appId].applicationDescription :  `${Application.hasOwnProperty('applicationDescription') ? Application.applicationDescription: Application.description } - ${actionPermissionsMap[appId].description}`
        }
    });
    const isAdmin = groupList.find((group)=> group.id === 1) //check if user is in admin group
    
    const createGroupPermission =  isAdmin || permissions.includes(
      constants.permissionsCode.CREATE_GROUP
    )
    const createUserPermission = isAdmin || permissions.includes(
      constants.permissionsCode.CREATE_USER
    )
    const updatePermission = operatorid ? createUserPermission : groupid !== null ? createGroupPermission : false
    return (
      <div className="action-permission">
         <div className="react-dual-listbox">
              <div className="rdl-listbox rdl-available">
                  <div className="rdl-control-container">
                      <label className="rdl-control-label">Available</label>
                      {
                        isFetchingActionPermissions === false ? <ul className="list-box">
                          {
                             unassigned.length ? _.sortBy(unassignedLabel, "description").map((app, index) => {
                                return <li className="parent">
                                  <div className="parent-selection"> 
                                    <label className={toBeAssigned.indexOf(app.id) !== -1 ? "active" : ""}><input type="checkbox" className="rp-unassigned-parent-selection" disabled={!updatePermission}  checked={toBeAssigned.indexOf(app.id) !== -1} onChange={(e) => this._handleCheckboxState(e, app.id, 'unassigned') }/>&nbsp;{app.description}</label>
                                  </div>
                                </li>
                             }) : null
                          }
                        </ul> : <div  className="list-box">
                          <div className="loading tcenter">
                              <i className="phxico phx-spinner phx-spin"></i>
                          </div>
                        </div>
                      }
                      
                  </div>
              </div>
              <div className="rdl-actions">
                  <div className="rdl-actions-right">
                      <button onClick={this._handleSelectAssignedAll} aria-label="Move all right" className="rdl-move rdl-move-all rdl-move-right" title="Move all right" type="button" disabled={!updatePermission  || isFetchingActionPermissions || !unassignedActionPermissions.length}>
                        <span className="phx-ico phx-chevron-double-right"></span>
                        </button>
                      <button onClick={this._handleSelectAssigned} aria-label="Move right" className="rdl-move rdl-move-right" title="Move right" type="button" disabled={!updatePermission  || isFetchingActionPermissions || !toBeAssigned.length}><span className="phx-ico phx-chevron-right"></span></button>
                  </div>
                  <div className="rdl-actions-left">
                      <button onClick={this._handleSelectUnassigned} aria-label="Move left" className="rdl-move rdl-move-left" title="Move left" type="button" disabled={!updatePermission || isFetchingActionPermissions || !toBeUnassigned.length}><span className="phx-ico phx-chevron-left"></span></button>
                      <button onClick={this._handleSelectUnassignedAll} aria-label="Move all left" className="rdl-move rdl-move-all rdl-move-left" title="Move all left" type="button" disabled={!updatePermission  || isFetchingActionPermissions || !assignedActionPermissions.length}><span className="phx-ico phx-chevron-double-left"></span></button>
                  </div>
              </div>
              <div className="rdl-listbox rdl-selected">
                  <div className="rdl-control-container">
                      <label className="rdl-control-label">Selected</label>
                      {
                        isFetchingActionPermissions === false ? <ul className="list-box">
                          {
                              assigned.length ? _.sortBy(assignedLabel, "description").map((app, index) => {
                                return <li className="parent">
                                  <div className="parent-selection"> 
                                    <label className={toBeUnassigned.indexOf(app.id) !== -1 ? "active" : ""}><input type="checkbox" className="rp-assigned-parent-selection" disabled={!updatePermission} checked={toBeUnassigned.indexOf(app.id) !== -1} onChange={(e) => this._handleCheckboxState(e, app.id, 'assigned') }/>&nbsp;{app.description}</label>
                                  </div>
                                </li>
                              }) : null
                          }
                        </ul> : <div  className="list-box">
                          <div className="loading tcenter">
                              <i className="phxico phx-spinner phx-spin"></i>
                          </div>
                        </div>
                      }
                  </div>
              </div>
          </div> 
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(mapPermissionsToProps(PermissionListBoxContainer))
