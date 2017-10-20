import React, { Component } from 'react'
import { connect } from 'react-redux'
import { updateForm, resetModified } from './actions'
import { setOperator, resetOperatorFormModified } from '../OperatorForm/actions'
import { mapPermissionsToProps } from 'componentsV2/checkPermission/index'
import constants from '../App/constants'
import isEqual from 'lodash.isequal'

const mapStateToProps = state => {
  const { modifiedGroupForm, operatorList, operatorDetailsForm } = state
  const { groupid, operatorid, groupIndex } = operatorList
  const { operatorDetails } = operatorDetailsForm
  const group = groupIndex.find(group => group.id == groupid)
  return {
    groupid,
    operatorid,
    groups: groupIndex,
    group,
    operatorDetails,
    operatorFormModified: operatorDetails.modified,
    modifiedForm: modifiedGroupForm.modified
      ? { ...modifiedGroupForm.groupdetails }
      : {
          ...group,
          groupid
        }
  }
}

class GroupForm extends Component {
  handleChange = event => {
    const value = {
      ...this.props.modifiedForm,
      [event.target.name]: event.target.value
    }
    this.props.dispatch(updateForm(value))

    if (this.props.operatorid) {
      //operator
      if (isEqual(Number(value.groupid), Number(this.props.groupid))) {
        this.props.dispatch(resetModified())
      }
    } else if (this.props.groupid) {
      //group
      if (
        isEqual(
          {
            description: this.props.group.description,
            email: this.props.group.email
          },
          {
            description: value.description,
            email: value.email ? value.email : null
          }
        )
      ) {
        this.props.dispatch(resetModified())
      }
    }

    if (this.props.operatorid && event.target.name === 'groupid') {
      const value = {
        ...this.props.operatorDetails,
        groupId: Number(event.target.value)
      }
      this.props.dispatch(setOperator(value))
    }
  }

  render() {
    const {
      groupid,
      operatorid,
      group,
      groups,
      modifiedForm,
      permissions
    } = this.props
    const hasUpdatePermission = !permissions.includes(
      constants.permissionsCode.UPDATE
    )
    const hasMoveGroupPermission = !permissions.includes(
      constants.permissionsCode.MOVE_USER_GROUP
    )

    let disabled = false
    let isOperator = null
    if (groupid && !operatorid) {
      isOperator = false
      //group is selected
    } else if (groupid && operatorid) {
      isOperator = true
    } else {
      disabled = true
    }

    return (
      <div className="operator-group-details">
        <div type="row" className="col-xs col-sm col-md col-lg-12">
          <div className="form-inner">
            <div className="form-wrapper">
              <h4>Operator Group Details</h4>
              <div className="row">
                <div className="column-1 col-xs-12 col-sm-4 col-md-4 col-lg-4">
                  <div className="form-group">
                    <label className="form-group-label">Description</label>
                    <div className="form-group-control">
                      {disabled && <input type="text" disabled={disabled} />}
                      {!disabled && //is group
                      !isOperator && (
                        <input
                          name="description"
                          value={modifiedForm.description || ''}
                          type="text"
                          disabled={hasUpdatePermission}
                          onChange={this.handleChange}
                        />
                      )}
                      {!disabled && //is operator
                      isOperator && (
                        <select
                          name="groupid"
                          value={modifiedForm.groupid || groupid}
                          onChange={this.handleChange}
                          disabled={hasMoveGroupPermission}>
                          {groups.map(group => {
                            return (
                              <option value={group.id} key={group.id}>
                                {group.description}
                              </option>
                            )
                          })}
                        </select>
                      )}
                    </div>
                  </div>
                </div>
                <div className="column-1 col-xs-12 col-sm-4 col-md-4 col-lg-4">
                  <div className="form-group">
                    <label className="form-group-label">Email</label>
                    <div className="form-group-control">
                      <input
                        name="email"
                        value={modifiedForm.email || ''}
                        type="text"
                        disabled={
                          isOperator ? (
                            true
                          ) : groupid ? (
                            hasUpdatePermission
                          ) : (
                            true
                          )
                        }
                        onChange={this.handleChange}
                      />
                    </div>
                  </div>
                </div>
                <div className="column-1 col-xs-12 col-sm-4 col-md-4 col-lg-4">
                  <div className="form-group">
                    <label className="form-group-label">Currency</label>
                    <div className="form-group-control">
                      <input
                        name="currency"
                        placeholder={'no currency'}
                        type="text"
                        disabled={true}
                      />
                      {/* isOperator ? (true) : groupid ? (hasUpdatePermission) : (true) */}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default connect(mapStateToProps)(mapPermissionsToProps(GroupForm))
