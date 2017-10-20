import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import _ from 'lodash';
import {setApplicationPermissionSelected, setPermissionSelected, loadPermissionSelected} from '../actions';
import ErrorModal from '../components/ErrorModal';
import { closeModal, openModal } from 'actions/modal';
import { mapPermissionsToProps } from 'componentsV2/checkPermission/index'
import constants from '../../App/constants'

const mapStateToProps = (state) => {
  const  {
  isSettingApplicationPermission,
  selectedApplicationPermissions,
  optionApplicationPermissions,
  operatorApplications,
  operatorApplicationActions,
  selectedPermissions,
  isFetchingApplicationPermissions,
  isFetchingApplicationActionPermissions,
  isResettingModifiedPermissions,
  applicationPermissionsMap,
  assignedApplicationPermissions,
  unassignedApplicationPermissions,
  assignedActionPermissions,
  actionPermissionsMap,
  } = state.permissionPanel;

  const {
    operatorid,
    groupid,
    groupIndex  
  } = state.operatorList;

  return {
    isSettingApplicationPermission,
    selectedApplicationPermissions,
    operatorid,
    groupid,
    operatorApplications,
    operatorApplicationActions,
    selectedPermissions,
    isFetchingApplicationPermissions,
    isFetchingApplicationActionPermissions,
    isResettingModifiedPermissions,
    applicationPermissionsMap,
    assignedApplicationPermissions,
    unassignedApplicationPermissions,
    assignedActionPermissions,
    actionPermissionsMap,
    modals : state.modals,
    groupList: groupIndex    
  }
}

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({
   setApplicationPermissionSelected,
   setPermissionSelected,
   loadPermissionSelected,
   closeModal, openModal
  }, dispatch)
}

class ApplicationListBoxContainer extends React.Component {

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

  _handleSelect(options, selectedVal) {
      const {unassignedApplicationPermissions} = this.props;
      this.props.setApplicationPermissionSelected(unassignedApplicationPermissions);
        // this.setState({selected : toAssigned, options : options});
    
  }

  _handleSelectAssignedAll() {
      // this.props.setApplicationPermissionSelected(this.state.options);
      // this.setState({selected : this.state.options, options:[]});
      const {unassignedApplicationPermissions, assignedApplicationPermissions} = this.props;

      this.props.setApplicationPermissionSelected([...unassignedApplicationPermissions, ...assignedApplicationPermissions], []);

  }

  _handleSelectUnassignedAll() {
      const {unassignedApplicationPermissions, assignedApplicationPermissions, actionPermissionsMap} = this.props;
      let assignedActionPermissions = [...this.props.assignedActionPermissions];
      let toBeUnassigned = [...this.state.toBeUnassigned]
      let assigned = [...this.props.assignedApplicationPermissions];
      let hasActionSelected = false;

      
      assignedActionPermissions.forEach(action => {
          if(assigned.indexOf(actionPermissionsMap[action].applicationId) !== -1)
            hasActionSelected = true;
      })

      if(hasActionSelected) {
        this.props.openModal('errorModal');
      }else {
        this.props.setApplicationPermissionSelected([], [...assignedApplicationPermissions, ...unassignedApplicationPermissions]);
      }
      // let {selectedPermissions, selectedApplicationPermissions} = this.props;
      // if(selectedPermissions.length) {
      //   let hasActionSelected = false;

      //   selectedPermissions.forEach(action => {
      //     selectedApplicationPermissions.forEach(application => {
      //        if(action.applicationId === application.applicationId){
      //           hasActionSelected = true
      //        }
      //     });
      //   })

      //   if(hasActionSelected) {
      //     // alert("Please Remove action permission first");
      //     this.props.openModal('errorModal');
      //   }else {
      //     this.props.setApplicationPermissionSelected([]);
      //     this.setState({selected : [], options:[...this.props.operatorApplications.unassignedApplications]});
      //   }
      // } else {
      //   this.props.setApplicationPermissionSelected([]);
      //   this.setState({selected : [], options:[...this.props.operatorApplications.unassignedApplications]});
      // }
     
  }

  _handleSelectAssigned(){
    let toBeAssigned = [...this.state.toBeAssigned]
    let unassigned = [...this.props.unassignedApplicationPermissions];

    toBeAssigned.forEach(appId => {
        let index = unassigned.indexOf(appId)
        unassigned.splice(index, 1)
    })
    
    this.props.setApplicationPermissionSelected([ ...toBeAssigned,...this.props.assignedApplicationPermissions], unassigned);
    this.setState({toBeAssigned:[]});

  }
  _handleSelectUnassigned(){
    let {actionPermissionsMap} = this.props;
    let assignedActionPermissions = [...this.props.assignedActionPermissions];
    let toBeUnassigned = [...this.state.toBeUnassigned]
    let assigned = [...this.props.assignedApplicationPermissions];
    let hasActionSelected = false;

    toBeUnassigned.forEach(appId => {
        let index = assigned.indexOf(appId)
        assigned.splice(index, 1)
    })

    assignedActionPermissions.forEach(action => {
        if(toBeUnassigned.indexOf(actionPermissionsMap[action].applicationId) !== -1)
          hasActionSelected = true;
    })
    if(hasActionSelected) {
      this.props.openModal('errorModal');
    }else {
      this.props.setApplicationPermissionSelected(assigned, [ ...toBeUnassigned,...this.props.unassignedApplicationPermissions]);
      this.setState({toBeUnassigned:[]});
    }
    
    
    // let parentSelection = document.querySelectorAll('.application-permission input.rp-assigned-parent-selection:checked');
    // let originalOptions = this.props.options;
    // let selected = [...this.state.selected];
    // let toUnassigned = [...this.state.options];
    // let {selectedPermissions} = this.props;
    // if(parentSelection.length) {
    //     if(selectedPermissions.length) {
    //       let hasActionSelected = false;

    //       selectedPermissions.forEach(app => {
    //         parentSelection.forEach(input => {
    //           let { optionindex, pvalue } = input.dataset;
    //            if(app.applicationId === selected[optionindex].applicationId){
    //               hasActionSelected = true
    //            }
    //         });
    //       })

    //       if(hasActionSelected) {
    //         this.props.openModal('errorModal');
    //       }else {
    //         parentSelection.forEach(input => {
    //           let { optionindex, pvalue } = input.dataset;
    //           toUnassigned.push(selected[optionindex]);
    //           selected.splice(optionindex, 1);
    //           input.click();
    //         });
    //       }
    //     } else {
    //       parentSelection.forEach(input => {
    //         let { optionindex, pvalue } = input.dataset;
    //         toUnassigned.push(selected[optionindex]);
    //         selected.splice(optionindex, 1);
    //         input.click();
    //       });
    //     }
    // }
    // this.setState({selected : selected, options:toUnassigned});

    // this.props.setApplicationPermissionSelected(selected);

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

  render() {
    const {operatorApplications, applicationPermissionsMap, assignedApplicationPermissions, unassignedApplicationPermissions, isFetchingApplicationPermissions, permissions, groupList, groupid, operatorid} = this.props;
    const {toBeUnassigned, toBeAssigned} = this.state;
    const assigned = [...assignedApplicationPermissions];
    const assignedLabel = [...assignedApplicationPermissions].map(appId => {
        return {
          id : appId,
          description : applicationPermissionsMap[appId].hasOwnProperty('applicationDescription') ? applicationPermissionsMap[appId].applicationDescription :  applicationPermissionsMap[appId].description
        }
    });
    const unassigned = [...unassignedApplicationPermissions];
    const unassignedLabel = [...unassignedApplicationPermissions].map(appId => {
        return {
          id : appId,
          description : applicationPermissionsMap[appId].hasOwnProperty('applicationDescription') ? applicationPermissionsMap[appId].applicationDescription :  applicationPermissionsMap[appId].description
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
      <div className="application-permission">
         <div className="react-dual-listbox">
              <div className="rdl-listbox rdl-available">
                  <div className="rdl-control-container">
                      <label className="rdl-control-label">Available</label>
                      {
                        isFetchingApplicationPermissions === false ? <ul className="list-box">
                        {
                           unassigned.length ? _.orderBy(unassignedLabel, [app => app.description.toLowerCase()], "asc").map((app, index) => {
                              return <li className="parent flex flex--column">
                                <div className="parent-selection"> 
                                  <label className={toBeAssigned.indexOf(app.id) !== -1 ? "active" : ""}><input type="checkbox" disabled={!updatePermission} className="rp-unassigned-parent-selection" checked={toBeAssigned.indexOf(app.id) !== -1} onChange={(e) => this._handleCheckboxState(e, app.id, 'unassigned') }/>&nbsp;{app.description}</label>
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
                      <button onClick={this._handleSelectAssignedAll} aria-label="Move all right" className="rdl-move rdl-move-all rdl-move-right" title="Move all right" type="button" disabled={!updatePermission || isFetchingApplicationPermissions || !unassignedApplicationPermissions.length}><span className="phx-ico phx-chevron-double-right"></span></button>
                      <button onClick={this._handleSelectAssigned} aria-label="Move right" className="rdl-move rdl-move-right" title="Move right" type="button" disabled={!updatePermission || isFetchingApplicationPermissions || !toBeAssigned.length}><span className="phx-ico phx-chevron-right"></span></button>
                  </div>
                  <div className="rdl-actions-left">
                      <button onClick={this._handleSelectUnassigned} aria-label="Move left" className="rdl-move rdl-move-left" title="Move left" type="button" disabled={!updatePermission || isFetchingApplicationPermissions || !toBeUnassigned.length}><span className="phx-ico phx-chevron-left"></span></button>
                      <button onClick={this._handleSelectUnassignedAll} aria-label="Move all left" className="rdl-move rdl-move-all rdl-move-left" title="Move all left" type="button" disabled={!updatePermission || isFetchingApplicationPermissions || !assignedApplicationPermissions.length}><span className="phx-ico phx-chevron-double-left"></span></button>
                  </div>
              </div>
              <div className="rdl-listbox rdl-selected">
                  <div className="rdl-control-container">
                      <label className="rdl-control-label">Selected</label>
                      {
                        isFetchingApplicationPermissions === false ? <ul className="list-box">
                        {
                            assigned.length ? _.orderBy(assignedLabel, [app => app.description.toLowerCase()], "asc").map((app, index) => {
                              return <li className="parent flex flex--column">
                                <div className="parent-selection"> 
                                  <label className={toBeUnassigned.indexOf(app.id) !== -1 ? "active" : ""}><input type="checkbox" disabled={!updatePermission}  className="rp-assigned-parent-selection" checked={toBeUnassigned.indexOf(app.id) !== -1} onChange={(e) => this._handleCheckboxState(e, app.id, 'assigned') }/>&nbsp;{app.description}</label>
                                </div>
                              </li>
                            }) : null
                        }
                      </ul>: <div  className="list-box">
                          <div className="loading tcenter">
                              <i className="phxico phx-spinner phx-spin"></i>
                          </div>
                      </div>
                      }
                  </div>
              </div>
          </div>
          <ErrorModal {...this.props}/> 
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(mapPermissionsToProps(ApplicationListBoxContainer))
