import React, { Component } from 'react'
import { connect } from 'react-redux'
import { hashHistory } from 'react-router'
import { bindActionCreators } from 'redux'
import appConstants from '../App/constants'
import { hideNewOperatorModal, toggleDuplicateOperatorModal, hideNewOperatorGroupModal } from '../App/actions'
import { addGroup, addOperator, duplicateOperator } from '../OperatorList/actions'
import { makeIterable } from 'phxUtils'
import {
    setGroupValue,
    clearGroupValue,
    setOperatorValue,
    clearOperatorValue,
    hideDuplicateOperatorModal,
    setDuplicateOperatorValue } from './actions'
import ModalWindow from 'components/modal'
import GroupForm from '../GroupForm'
import OperatorForm from '../OperatorForm'
import PermissionPanel from '../PermissionPanel'
import { validate } from 'email-validator'
import { removedStatusFilter } from '../OperatorList/constants'

function mapStateToProps(state) {
  return {
    showNewOperatorModal: state.operatorManagerApp.showNewOperatorModal,
    showNewOperatorGroupModal: state.operatorManagerApp.showNewOperatorGroupModal,
    isShowDuplicateOperatorModal: state.operatorManagerModal.isShowDuplicateOperatorModal,
    duplicateOperatorDetails: state.operatorManagerModal.duplicateOperatorDetails,
    group: state.operatorManagerModal.group,
    newOperator: state.operatorManagerModal.newOperator,
    origins: state.apiConstants.values.origins,
    currencies: state.apiConstants.values.currencies,
    groupList: state.operatorList.groupIndex,
    selectedGroup: state.operatorList.groupid,
    selectedOperatorId: state.operatorList.operatorid,
    selectedOperator: state.operatorList.selectedOperator,
    newOperatorStatus: state.operatorList.newOperatorStatus,
  }
}

class Main extends Component {
  state = {
    descriptionError: false,
    emailError: false,
    operator_nameError: false,
    operator_pwError: false,
    duplicateOperatorUsernameError: false,
    duplicateOperatorPasswordError: false
  }

  handleGroupChange = event => {
    let value = {
      ...this.props.group,
      [event.target.name]: event.target.value
    }
    this.props.dispatch(setGroupValue(value))
  }

  handleOperatorChange = event => {
    const { username, password } = this.props.newOperator;
    let _val = event.target.value
    if (event.target.name !== 'username' && event.target.name !== 'password') {
      _val = Number(event.target.value)
    }
    let value = {
      ...this.props.newOperator,
      [event.target.name]: _val
    }
    
    this.props.dispatch(setOperatorValue(value))
  }

  handleDuplicateOperatorChange = event => {
    let value = {
      ...this.props.duplicateOperatorDetails,
      [event.target.name]: event.target.value
    }
    this.props.dispatch(setDuplicateOperatorValue(value))
  }

  closeGroupModal = () => {
    this.setState({ descriptionError: false, emailError: false })
    this.props.dispatch(clearGroupValue())
    this.props.dispatch(hideNewOperatorGroupModal())
  }

  closeOperatorModal = () => {
    this.setState({ operator_nameError: false, operator_pwError: false })
    this.props.dispatch(clearOperatorValue())
    this.props.dispatch(hideNewOperatorModal())
  }

  hideDuplicateModal = () => {
    const { selectedGroup, selectedOperatorId } = this.props
    if (selectedOperatorId) {
      //duplicate operator
      this.setState({
        username: '',
        password: '',
        duplicateOperatorUsernameError: false,
        duplicateOperatorPasswordError: false
      })
      this.props.dispatch(hideDuplicateOperatorModal());
    }
  }

  saveDuplicate = () => {
    const { selectedGroup, selectedOperatorId, duplicateOperatorDetails, selectedOperator } = this.props
    const { username, password } =  duplicateOperatorDetails
    if (selectedOperatorId) {
      this.setState({ duplicateOperatorUsernameError: !username ? true : false});
      this.setState({ duplicateOperatorPasswordError: !password ? true : false});
      if (username && password) {
        if(username.length > 50){
          this.state.duplicateOperatorUsernameError = true;
        }
        if(password.length > 12){
          this.state.duplicateOperatorPasswordError = true;
        }

        if(!this.state.duplicateOperatorUsernameError && !this.state.duplicateOperatorPasswordError){
          this.setState({
            duplicateOperatorUsernameError: false,
            duplicateOperatorPasswordError: false
          })
          this.props.dispatch(
            duplicateOperator(selectedOperatorId, {username, password}, selectedOperator)
          )
        }
      }
    }
  } 

  addOperator = () => {
    const { newOperator } = this.props;
    const {
      username,
      password,
      statusId,
      groupId,
      currencyId,
      originId
    } = newOperator
    if (!username) {
      this.setState({ operator_nameError: true })
    }
    if (!password) {
      this.setState({ operator_pwError: true })
    }
    if (username && password) {
      if(username.length > 50){
        this.state.operator_nameError = true;
      }
      if(password.length > 12){
        this.state.operator_pwError = true;
      }

      if(!(this.state.operator_nameError && this.state.operator_pwError) ){
        this.setState({
          operator_nameError: false,
          operator_pwError: false
        })
        this.props.dispatch(
          addOperator({
            username,
            password,
            statusId,
            groupId,
            currencyId,
            originId
          })
        )
      }
    }
  }

  addGroup = () => {
    const { email, description } = this.props.group
    if (!description.trim()) {
      this.setState({ descriptionError: true, emailError: false })
    } else if (!email.trim() || !validate(email)) {
      this.setState({ emailError: true, descriptionError: false })
    } else {
      this.setState({
        emailError: false,
        descriptionError: false
      })
      this.props.dispatch(
        addGroup({
          description,
          email
        })
      )
    }
  }

  _renderOptions(field) {
    const {
      origins,
      currencies,
      groupKeys,
      newOperator,
      selectedGroup,
      groupList
    } = this.props
    const _newOperator = { ...newOperator }
    const statusList = [...makeIterable(appConstants.STATUS_ID_LIST, true)]
    switch (field) {
      case 'groupId':
        if (!groupList) {
          return
        }
        let num_group = 0
        return groupList.map(group => {
          if (!selectedGroup && num_group === 0) {
            if (newOperator.groupId === '') {
              this.props.newOperator.groupId = group.id
            } else {
              _newOperator.groupId = group.id
            }
          }

          if (selectedGroup && num_group === 0) {
            if (newOperator.groupId === '') {
              this.props.newOperator.groupId = selectedGroup
            } else {
              _newOperator.groupId = selectedGroup
            }
          }

          num_group++
          return (
            <option key={group.id} value={group.id}>
              {group.description}
            </option>
          )
        })
        break
      case 'statusId':
        if (!statusList) {
          return
        }
        let num_status = 0
        return statusList.filter(status => !removedStatusFilter.includes(Number(status.key))).map(status => {
          if (status.value !== 'All') {
            if (num_status === 0) {
              if (newOperator.statusId === '') {
                this.props.newOperator.statusId = Number(status.key)
              } else {
                _newOperator.statusId = Number(status.key)
              }
            }
            num_status++
            return (
              <option key={status.key} value={status.key}>
                {status.value}
              </option>
            )
          }
        })
        break
      case 'currencyId':
        if (!currencies) {
          return
        }
        let num_curr = 0
        return currencies.map(currency => {
          if (num_curr === 0) {
            if (newOperator.currencyId === '') {
              this.props.newOperator.currencyId = currency.id
            } else {
              _newOperator.currencyId = currency.id
            }
          }
          num_curr++
          return (
            <option key={currency.id} value={currency.id}>
              {currency.description}
            </option>
          )
        })
        break
      case 'originId':
        if (!origins) {
          return
        }
        let num_origin = 0
        return origins.map(origin => {
          if (num_origin === 0) {
            if (newOperator.originId === '') {
              this.props.newOperator.originId = origin.id
            } else {
              _newOperator.originId = origin.id
            }
          }
          num_origin++
          return (
            <option key={origin.id} value={origin.id}>
              {origin.description}
            </option>
          )
        })
        break
      default:
        return
        break
    }
    //this.props.newOperator = _newOperator;
  }

  render() {
    const {
      children,
      showNewOperatorModal,
      showNewOperatorGroupModal,
      isShowDuplicateOperatorModal
    } = this.props
    const { group, newOperator, selectedGroup, selectedOperatorId, newOperatorStatus, duplicateOperatorDetails } = this.props
    const { formApplicationsList, formApplicationsAssigned,
      formActionsList, formActionsAssigned,
      formReportsList, formReportsAssigned } = this.props
    return (
      <div className="page-main no-footer operator-manager-main">
        {selectedGroup ? (
          <div>
          <GroupForm />
          {selectedOperatorId &&
            <OperatorForm />
          }
          <PermissionPanel data={{
              formApplicationsList :formApplicationsList,
              formApplicationsAssigned :formApplicationsAssigned,
              formActionsList :formActionsList,
              formActionsAssigned : formActionsAssigned,
              formReportsList : formReportsList,
              formReportsAssigned : formReportsAssigned,
            }}/>
          </div>
        ) : (
          <div className="message-container tcenter">
            <p className="msg-actionlabel">
              Please select operator or group on side panel
            </p>
          </div>
        )}
        {showNewOperatorModal && (
          <ModalWindow
            onClose={this.closeOperatorModal}
            title="New Operator"
            closeButton={true}
            isVisibleOn={this.props.showNewOperatorModal}
            shouldCloseOnOverlayClick={true}>
            <h4>New Operator</h4>
            <div className="form-inner">
              <div className="form-wrapper">
                <div className="form-group">
                  <label className="form-group-label">Username</label>
                  <div className="form-group-control">
                    <input
                      type="text"
                      name="username"
                      value={newOperator.username}
                      onChange={this.handleOperatorChange} />
                    {this.state.operator_nameError && !newOperator.username &&
                      <span className="field-err">
                        <span>Username is required</span>
                      </span>
                    }
                    {newOperator.username && newOperator.username.length > 50 &&
                      <span className="field-err">
                        <span>Must not be exceeds 50 characters</span>
                      </span>
                    }
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-group-label">Password</label>
                  <div className="form-group-control">
                    <input
                      type="password"
                      name="password"
                      value={newOperator.password}
                      onChange={this.handleOperatorChange} />
                    {this.state.operator_pwError && !newOperator.password &&
                      <span className="field-err">
                        <span>Password is required</span>
                      </span>
                    }
                    {newOperator.password && newOperator.password.length > 12 &&
                      <span className="field-err">
                        <span>Must not be exceeds 12 characters</span>
                      </span>
                    }
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-group-label">Group</label>
                  <div className="form-group-control">
                    <select
                      type="text"
                      name="groupId"
                      value={
                        selectedGroup ? selectedGroup : newOperator.groupId
                      }
                      onChange={this.handleOperatorChange}>
                      {this._renderOptions('groupId')}
                    </select>
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-group-label">Status</label>
                  <div className="form-group-control">
                    <select
                      type="select"
                      name="statusId"
                      value={newOperator.statusId}
                      onChange={this.handleOperatorChange}>
                      {this._renderOptions('statusId')}
                    </select>
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-group-label">Currency</label>
                  <div className="form-group-control">
                    <select
                      type="select"
                      name="currencyId"
                      value={newOperator.currencyId}
                      onChange={this.handleOperatorChange}>
                      {this._renderOptions('currencyId')}
                    </select>
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-group-label">Origin</label>
                  <div className="form-group-control">
                    <select
                      type="select"
                      name="originId"
                      value={newOperator.originId}
                      onChange={this.handleOperatorChange}>
                      {this._renderOptions('originId')}
                    </select>
                  </div>
                </div>
              </div>
            </div>          
            <div className="button-group modal-controls">
              <button
                className="btn btn-action"
                onClick={this.closeOperatorModal}>
                Cancel
              </button>
              <button
                className="btn btn-action btn-primary"
                disabled={!(newOperator.username && newOperator.password)}
                onClick={this.addOperator}>
                Ok
              </button>
            </div>
          </ModalWindow>
        )}
        {showNewOperatorGroupModal && (
          <ModalWindow
            onClose={this.closeGroupModal}
            title="New Operator Group"
            closeButton={true}
            isVisibleOn={showNewOperatorGroupModal}
            shouldCloseOnOverlayClick={true}>
            <h4>New Operator Group</h4>
            <div className="form-inner">
              <div className="form-wrapper">
                <div className="form-group">
                  <label className="form-group-label">Description</label>
                  <div className="form-group-control">
                    <input
                      type="text"
                      name="description"
                      value={group.description}
                      onChange={this.handleGroupChange}
                    />
                    {this.state.descriptionError && (
                      <span className="field-err">
                        <span>Description must be supplied</span>
                      </span>
                    )}
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-group-label">Email</label>
                  <div className="form-group-control">
                    <input
                      type="text"
                      name="email"
                      value={group.email}
                      onChange={this.handleGroupChange}
                    />
                    {this.state.emailError && (
                      <span className="field-err">
                        <span>Invalid email address format</span>
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
            <div className="button-group modal-controls">
              <button className="btn btn-action" onClick={this.closeGroupModal}>
                Cancel
              </button>
              <button
                className="btn btn-action btn-primary"
                onClick={this.addGroup}
                disabled={!group.email.trim()||!group.description.trim()}>
                Ok
              </button>
            </div>
          </ModalWindow>
        )}
        {isShowDuplicateOperatorModal && 
          <ModalWindow
            onClose={this.hideDuplicateModal}
            title="Duplicate Operator"
            closeButton={true}
            isVisibleOn={isShowDuplicateOperatorModal}
            shouldCloseOnOverlayClick={true}>
            <h4>Duplicate Operator</h4>
            <div className="form-inner">
              <div className="form-wrapper">
                <div className="form-group">
                  <label className="form-group-label">Username</label>
                  <div className="form-group-control">
                    <input
                      type="text"
                      name="username"
                      value={this.state.username}
                      onChange={ this.handleDuplicateOperatorChange }/>
                    {this.state.duplicateOperatorUsernameError && !duplicateOperatorDetails.username &&
                      <span className="field-err">
                        <span>Username is required</span>
                      </span>
                    }
                    {duplicateOperatorDetails.username && duplicateOperatorDetails.username.length > 50 &&
                      <span className="field-err">
                        <span>Must not be exceeds 50 characters</span>
                      </span>
                    }
                  </div>
                </div>
                <div className="form-group">
                    <label className="form-group-label">Password</label>
                    <div className="form-group-control">
                      <input
                        type="password"
                        name="password"
                        value={this.state.password}
                        onChange={ this.handleDuplicateOperatorChange } />
                      {this.state.duplicateOperatorPasswordError && !duplicateOperatorDetails.password &&
                        <span className="field-err">
                          <span>Password is required</span>
                        </span>
                      }
                      {duplicateOperatorDetails.password && duplicateOperatorDetails.password.length > 12 &&
                        <span className="field-err">
                          <span>Must not be exceeds 12 characters</span>
                        </span>
                      }
                    </div>
                  </div>
              </div>
            </div>
            <div className="button-group modal-controls">
              <button
                className="btn btn-action"
                onClick={this.hideDuplicateModal}>
                Cancel
              </button>
              <button
                className="btn btn-action btn-primary"
                disabled={!(duplicateOperatorDetails.username && duplicateOperatorDetails.password)}
                onClick={this.saveDuplicate}>
                Ok
              </button>
            </div>
          </ModalWindow>
        }
        {children}
      </div>
    )
  }
}

export default connect(mapStateToProps)(Main)
