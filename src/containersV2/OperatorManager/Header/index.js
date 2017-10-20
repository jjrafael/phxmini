import React, { Component } from 'react'
import { connect } from 'react-redux'
import { hashHistory } from 'react-router'
import { bindActionCreators } from 'redux'
import Header, { ListItem } from 'componentsV2/Header'
import constants from '../App/constants'
import { showNewOperatorModal, showNewOperatorGroupModal } from '../App/actions'
import {
  deleteGroup,
  deleteOperator,
  editGroup,
  editOperator,
  duplicateGroup,
  duplicateOperator,
  updateOperator as updateOperatorWithPermission,
  toggleWarningModal
} from '../OperatorList/actions'
import { resetOperatorForm } from '../OperatorForm/actions'
import { showDuplicateOperatorModal } from '../Main/actions'
import { resetModified } from '../GroupForm/actions'
import { resetModifiedPermission, updateAllPermissions } from '../PermissionPanel/actions'
import { logout } from 'actions/user'
import ConfirmModal from 'componentsV2/Modal/ConfirmModal'
import Clock from 'components/clock'
import classNames from 'classnames'
import { toastr } from 'phxComponents/toastr/index'
import { mapPermissionsToProps } from 'componentsV2/checkPermission/index'
import _ from 'underscore'
import isEqual from 'lodash.isequal'
import ModalWindow from 'components/modal'
import { validate } from 'email-validator'


function mapStateToProps(state) {
  const {
    assignedApplicationPermissions,
    assignedActionPermissions,

    originalAssignedActionPermissions,
    originalAssignedApplicationPermissions,
    originalAssignedReportPermissions,

    operatorApplicationActions,
    operatorApplications,
    operatorReports,
    isModifiedActionPermission,
    isModifiedApplicationPermission,
    isModifiedReportPermission,
    assignedReportsArray
  } = state.permissionPanel //permissions
  const { groupIndex, group, groupid, operatorid } = state.operatorList
  const selectedGroup = groupIndex.find(group => group.id == groupid)
  const { isShowDuplicateOperatorModal } = state.operatorManagerModal
  const groupOperatorsCount =
    groupid && selectedGroup && selectedGroup.operators
      ? selectedGroup.operators.length
      : 0

  return {
    selected: {
      groupid,
      operatorid
    },
    user: state.user,
    modified:
      state.modifiedGroupForm.modified ||
      state.operatorDetailsForm.modified ||
      ((groupid || operatorid) &&
        (isModifiedActionPermission ||
          isModifiedApplicationPermission ||
          isModifiedReportPermission)), //check if group permissions and group details have been modified
    permissionsModified: {
      isModifiedActionPermission,
      isModifiedApplicationPermission,
      isModifiedReportPermission
    },
    groupdetails:
      !state.modifiedGroupForm.groupdetails.id && selectedGroup
        ? {
            //select from groupindex becuase no modifications have been made
            email: selectedGroup.email,
            id: selectedGroup.id,
            description: selectedGroup.description
          }
        : { ...state.modifiedGroupForm.groupdetails }, //select from the modified group
    permissionsForm: {
      //get permission changes
      assignedApplicationPermissions,
      assignedActionPermissions,
      assignedReportsArray
    },
    canDelete:
      originalAssignedApplicationPermissions.length < 1 &&
      originalAssignedActionPermissions.length < 1 &&
      originalAssignedReportPermissions.length < 1 &&
      groupOperatorsCount < 1,
    operatorDetails: { ...state.operatorDetailsForm.operatorDetails },
    groupModified: state.modifiedGroupForm.modified,
    groups: groupIndex
  }
}

class App extends Component {
  state = {
    showDeleteConfirmationModal: false,
    showDuplicateConfirmationModal: false,
    groupName: '',
    groupNameError: false
  }

  logout = () => {
    this.props.dispatch(logout())
    hashHistory.replace('/login')
  }

  goLobby = () => {
    hashHistory.replace('/')
  }

  _toggleSidePanel() {
    this.props.toggleSideBar(!this.props.isSideBarOpen)
  }

  showDeleteModal = () => {
    const { groupid, operatorid } = this.props.selected
    // const { groupOperatorsCount } = this.props
    if (operatorid) {
      //delete operator
    } else if (groupid) {
      //check if groupisselected
      //delete group

      //display confirmation modal
      this.setState({
        showDeleteConfirmationModal: true
      })
    }
  }

  toggleDuplicateModal = () => {
    const { groupid, operatorid } = this.props.selected
    const { groupOperatorsCount } = this.props
    if (operatorid) {
      //duplicate operator
      this.props.dispatch(showDuplicateOperatorModal())
    } else if (groupid) {
      //check if groupisselected
      this.setState({
        showDuplicateConfirmationModal: !this.state
          .showDuplicateConfirmationModal,
        groupName: '',
        groupNameError: false,
        groupSameNameError: false
      })
    }
  }
  saveDuplicate = () => {
    const { groups } = this.props
    const { groupid, operatorid } = this.props.selected
    const { duplicateOperatorPassword, duplicateOperatorUsername } = this.state
    if (operatorid) {
      //delete operator
      if (!duplicateOperatorUsername) {
        this.setState({ duplicateOperatorUsernameError: true })
      }
      if (!duplicateOperatorPassword) {
        this.setState({ duplicateOperatorPasswordError: true })
      }
      if (duplicateOperatorUsername && duplicateOperatorPassword) {
        this.setState({
          duplicateOperatorUsernameError: false,
          duplicateOperatorPasswordError: false
        })
        this.props.dispatch(
          duplicateOperator(operatorid, {
            duplicateOperatorUsername,
            duplicateOperatorPassword
          })
        )
      }
    } else if (groupid) {
      if (!this.state.groupName) {
        this.setState({ groupNameError: true })
      } else if (
        groups.find(group => group.description === this.state.groupName.trim())
      ) {
        this.setState({ groupSameNameError: true })
      } else {
        this.props.dispatch(duplicateGroup(groupid, this.state.groupName.trim()))
        this.setState({
          showDuplicateConfirmationModal: !this.state
            .showDuplicateConfirmationModal,
          groupName: '',
          groupNameError: false,
          groupSameNameError: false
        })
      }
    }
  }
  save = () => {
    const { groupid, operatorid } = this.props.selected
    const {
      groupdetails,
      permissions,
      permissionsForm,
      operatorDetails,
      permissionsModified,
      groupModified,
      groups
    } = this.props
    const { MOVE_USER_GROUP, CHANGE_USER_STATUS, CREATE_USER } = constants.permissionsCode
    const isAdmin = groups.find(group => group.id === 1) ? true : false
    
    const assignedActionIds = permissionsForm.assignedActionPermissions
    const assignedApplicationIds = permissionsForm.assignedApplicationPermissions
    const assignedReports = [...permissionsForm.assignedReportsArray]
    const assignedItems = {
      ...((permissionsModified.isModifiedActionPermission ||
        permissionsModified.isModifiedApplicationPermission) && {
        assignedActionIds,
        assignedApplicationIds
      }),
      ...(permissionsModified.isModifiedReportPermission && {
        assignedReports
      })
    }
    if (operatorid) {
      const { groupId, statusId, ...details } = operatorDetails
      this.props.dispatch(
        updateOperatorWithPermission(operatorid, {
          ...(permissions.includes(MOVE_USER_GROUP) && { groupId }),
          ...( (isAdmin || [CHANGE_USER_STATUS, CREATE_USER].some(id => permissions.includes(id)) )&& { statusId }),
          ...((isAdmin  ||permissions.includes(CREATE_USER) )&& {
            ...details,
            email: operatorDetails.email === '' ? null : operatorDetails.email,
            securityLevel:
              operatorDetails.securityLevel === ''
                ? 0
                : Number(operatorDetails.securityLevel),
            ...assignedItems,
            priceFormatId: operatorDetails.priceFormatId || 3
          })
        })
      )
      if(assignedItems){
        this.props.dispatch(updateAllPermissions())
      }
    } else if (groupid) {
      //send update
      if(groupdetails.email && !validate(groupdetails.email)){
        toastr.add({message: 'Invalid Email Format', type: 'ERROR'});
        return
      }
      this.props.dispatch(
        editGroup({
          id: groupid,
          description: groupdetails.description,
          ...groupdetails.email && {email: groupdetails.email},
          ...assignedItems
        })
      )
      if(assignedItems){
        this.props.dispatch(updateAllPermissions())
      }
    }
  }

  reset = () => {
    this.props.dispatch(resetOperatorForm())
    this.props.dispatch(resetModifiedPermission())
    this.props.dispatch(resetModified())
  }

  render() {
    const {
      user,
      selected,
      modified,
      permissions,
      canDelete,
      groups
    } = this.props
    const isAdmin = groups.find(group => group.id === 1) ? true : false
    const { groupid, operatorid } = selected
    const createGroupPermission =  isAdmin || permissions.includes(
      constants.permissionsCode.CREATE_GROUP
    )
    const createUserPermission = isAdmin || permissions.includes(
      constants.permissionsCode.CREATE_USER
    )
    const userOrGroupPermission = operatorid ? !createUserPermission : groupid !== null ? !createGroupPermission : true
    return (
      <Header
        title="Operator Manager"
        user={user.details}
        onClick={e => {
          this.logout()
        }}>
        <ListItem
          actionIds={[constants.permissionsCode.CREATE_USER]}
          override={isAdmin}
          title="New Operator"
          onClick={e => {
            if (modified) {
              this.props.dispatch(toggleWarningModal('newOperator'))
            } else {
              this.props.dispatch(showNewOperatorModal())
            }
          }}>
          <i className="phxico phx-account-plus icon-medium" />
        </ListItem>
        <ListItem
          actionIds={[constants.permissionsCode.CREATE_GROUP]}
          override={isAdmin}
          title="New Operator Group"
          onClick={e => {
            if (modified) {
              this.props.dispatch(toggleWarningModal('newGroup'))
            } else {
              this.props.dispatch(showNewOperatorGroupModal())
            }
          }}>
          <i className="phxico phx-group-new icon-medium" />
        </ListItem>
        <ListItem
          actionIdFilter="ANY"
          actionIds={[
            constants.permissionsCode.CREATE_GROUP,
            constants.permissionsCode.CREATE_USER
          ]}
          disabled={userOrGroupPermission}
          title="Duplicate"
          override={isAdmin}
          onClick={this.toggleDuplicateModal}>
          <i className="phxico phx-account-duplicate icon-medium" />
        </ListItem>
        <ListItem
          actionIds={[constants.permissionsCode.DELETE]}
          title="Delete"
          disabled={isAdmin && groupid && !operatorid ? !canDelete : true}
          onClick={this.showDeleteModal}>
          <i className="phxico phx-delete icon-medium" />
        </ListItem>
        <ListItem
          actionIdFilter="ANY"
          actionIds={[
            constants.permissionsCode.CREATE_GROUP,
            constants.permissionsCode.CREATE_USER,
            constants.permissionsCode.CHANGE_USER_STATUS,
            constants.permissionsCode.MOVE_USER_GROUP
          ]}
          title="Save"
          override={isAdmin}
          disabled={!modified}
          onClick={this.save}>
          <i className="phxico phx-save icon-medium" />
        </ListItem>
        <ListItem
          actionIdFilter="ANY"
          actionIds={[
            constants.permissionsCode.CREATE_GROUP,
            constants.permissionsCode.CREATE_USER,
            constants.permissionsCode.CHANGE_USER_STATUS,
            constants.permissionsCode.MOVE_USER_GROUP
          ]}
          override={isAdmin}
          disabled={!modified}
          title="Undo"
          onClick={this.reset}>
          <i className="phxico phx-undo icon-medium" />
        </ListItem>
        <section className="control-buttons header-actions">
          <ul className="list-reset button-group">
            <ListItem
              actionIdFilter="ANY"
              actionIds={[
                constants.permissionsCode.CREATE_USER,
                constants.permissionsCode.CREATE_GROUP
              ]}
              override={isAdmin}
              title="Export Groups"
              onClick={e => {
                const url = `/rest/operatorgroups/export?token=${localStorage.MIFY_U_TOKEN}`
                window.open(url, '_blank')
              }}>
              <i className="phxico phx-export-group icon-medium" />
            </ListItem>
            <ListItem
              actionIdFilter="ANY"
              actionIds={[
                constants.permissionsCode.CREATE_USER,
                constants.permissionsCode.CREATE_GROUP
              ]}
              override={isAdmin}
              title="Export Users and Groups"
              onClick={e => {
                const url = `/rest/operators/export?token=${localStorage.MIFY_U_TOKEN}`
                window.open(url, '_blank')
              }}>
              <i className="phxico phx-export-group-all icon-medium" />
            </ListItem>
          </ul>
        </section>
        <ConfirmModal
          isVisible={this.state.showDeleteConfirmationModal}
          message={
            <div>
              <p>You are about to delete a group.</p>
              <p>Are you sure you want to proceed?</p>
            </div>
          }
          onConfirm={e => {
            if (groupid) {
              this.props.dispatch(deleteGroup(groupid))
            }
            this.setState({ showDeleteConfirmationModal: false })
          }}
          onCancel={e => {
            this.setState({ showDeleteConfirmationModal: false })
          }}
        />

        <ModalWindow
          onClose={this.toggleDuplicateModal}
          title="Duplicate Group"
          closeButton={true}
          isVisibleOn={this.state.showDuplicateConfirmationModal}
          shouldCloseOnOverlayClick={true}>
          <h4>Duplicate Group</h4>
          <div className="form-inner">
            <div className="form-wrapper">
              <div className="form-group">
                <label className="form-group-label">Description</label>
                <div className="form-group-control">
                  <input
                    type="text"
                    name="description"
                    value={this.state.groupName}
                    onChange={event =>
                      this.setState({ groupName: event.target.value })}
                  />
                  {this.state.groupNameError && (
                    <span className="field-err">
                      <span>Description must be supplied</span>
                    </span>
                  )}
                  {this.state.groupSameNameError && (
                    <span className="field-err">
                      <span>Group Name Already Exists</span>
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className="button-group modal-controls">
            <button
              className="btn btn-action"
              onClick={this.toggleDuplicateModal}>
              Cancel
            </button>
            <button
              className="btn btn-action btn-primary"
              onClick={this.saveDuplicate}>
              Ok
            </button>
          </div>
        </ModalWindow>
      </Header>
    )
  }
}

export default connect(mapStateToProps)(mapPermissionsToProps(App))
