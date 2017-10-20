import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { reset } from 'redux-form'
import {
  updateForm,
  updateOperatorPassword,
  setOperator,
  setRenderedValues,
  setOriginalOperator
} from './actions'
import appConstants from '../App/constants'
import { makeIterable } from 'phxUtils'
import { closeModal, openModal } from 'actions/modal'
import ChagePasswordModal from './ChangePasswordModal'
import ModalLoader from 'phxV2Components/ModalLoader/'
import { mapPermissionsToProps } from 'componentsV2/checkPermission/index'
import constants from '../App/constants'
import * as validate from 'phxValidations'
import { removedStatusFilter } from '../OperatorList/constants'

const mapStateToProps = state => {
  const { operatorDetailsForm, operatorList, origin, apiConstants } = state
  const {
    groupid,
    operatorid,
    groupIndex,
    selectedOperator,
    newOperatorStatus
  } = operatorList
  const {
    operatorDetails,
    updateOperatorStatus,
    originalOperatorDetails,
    modified,
    renderedValues
  } = operatorDetailsForm

  return {
    operatorDetails,
    operatorDetailsOnList: operatorList.operatorDetails,
    updateOperatorStatus,
    originalOperatorDetails,
    origins: apiConstants.values.origins,
    currencies: apiConstants.values.currencies,
    languages: apiConstants.values.languages,
    priceFormats: apiConstants.values.priceFormatsShort,
    groupList: groupIndex,
    selectedGroup: groupid,
    selectedOperator: selectedOperator,
    modals: state.modals,
    operatorid,
    modified,
    renderedValues,
    newOperatorStatus,
    isChangingPassword: state.operatorDetailsForm.isChangingPassword
  }
}

const mapDispatchToProps = dispatch => {
  return bindActionCreators(
    {
      closeModal,
      openModal,
      setOperator,
      setOriginalOperator,
      setRenderedValues,
      updateOperatorPassword,
      reset
    },
    dispatch
  )
}

class OperatorForm extends Component {
  constructor(props) {
    super(props)
    this.state = {
      renderedValue: {
        ...this.props.operatorDetails
      }
    }
    this.clickChangePassword = this.clickChangePassword.bind(this)
    this._handleChangePasswordSubmit = this._handleChangePasswordSubmit.bind(
      this
    )
  }

  componentDidMount() {
    const { operatorDetails, selectedOperator, selectedGroup } = this.props
  }

  componentWillUpdate(nextProps, nextState) {
    const {
      originalOperatorDetails,
      modified,
      operatorDetails,
      selectedOperator,
      operatorDetailsOnList,
      newOperatorStatus,
      setRenderedValues
    } = this.props
  }

  handleChange = event => {
    let _val = event.target.value
    if (
      event.target.name.indexOf('Id') !== -1 ||
      event.target.name === 'securityLevel'
    ) {
      _val = Number(event.target.value)
    }

    if (event.target.name === 'mobile') {
      if (event.target.value == '' || (/^\d+$/).test(event.target.value)) {
        _val = event.target.value
      } else {
        return
      }
    }

    const value = {
      ...this.props.operatorDetails,
      [event.target.name]: _val
    }
    const {
      operatorDetails,
      originalOperatorDetails,
      setRenderedValues
    } = this.props
    this.state.renderedValue[event.target.name] = _val
    this.props.setOperator(value)
    setRenderedValues(value)
  }

  clickChangePassword() {
    this.props.openModal('changePasswordModal')
  }

  _renderOptions(field) {
    const {
      origins,
      currencies,
      languages,
      priceFormats,
      selectedGroup,
      selectedOperator,
      groupList,
      operatorDetails
    } = this.props
    const statusList = [...makeIterable(appConstants.STATUS_ID_LIST, true)]
    const _operatorDetails = { ...operatorDetails }
    switch (field) {
      case 'groupId':
        if (!groupList) {
          return
        }
        let num_group = 0
        return groupList.map(group => {
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
          return (
            <option key={origin.id} value={origin.id}>
              {origin.description}
            </option>
          )
        })
        break
      case 'languageId':
        if (!languages) {
          return
        }
        let num_lang = 0
        return languages.map(language => {
          return (
            <option key={language.id} value={language.id}>
              {language.description}
            </option>
          )
        })
        break
      case 'priceFormat':
        if (!priceFormats) {
          return
        }
        let num_format = 0
        return priceFormats.map(priceFormat => {
          return (
            <option key={priceFormat.id} value={priceFormat.id}>
              {priceFormat.description}
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

  _handleChangePasswordSubmit(values) {
    this.props.updateOperatorPassword(this.props.operatorid, values)
  }

  render() {
    const {
      groupid,
      operatorid,
      group,
      groupList,
      operatorDetails,
      selectedOperator,
      isChangingPassword,
      permissions,
      renderedValues
    } = this.props
    const {
      CHANGE_USER_PASSWORD,
      CHANGE_NON_ADMIN_USER_PASSWORD,
      CREATE_USER,
      CHANGE_USER_STATUS
    } = constants.permissionsCode
    const { renderedValue } = this.state
    const isAdmin = groupList.find(group => group.id === 1) //check if user is in admin group
    const changePasswordPermission =
      !permissions.includes(CHANGE_USER_PASSWORD) &&
      !permissions.includes(CHANGE_NON_ADMIN_USER_PASSWORD)
        ? false
        : isAdmin
          ? true
          : permissions.includes(CHANGE_USER_PASSWORD)
            ? true
            : [CREATE_USER, CHANGE_NON_ADMIN_USER_PASSWORD].every(id =>
                permissions.includes(id)
              )
              ? true
              : false
    const changeUserStatusPermission =
      isAdmin ||
      [CHANGE_USER_STATUS].some(id => permissions.includes(id))

    const updatePermission =
      isAdmin || permissions.includes(constants.permissionsCode.CREATE_USER)

    return (
      <div className="operator-details">
        <div type="row" className="col-xs col-sm col-md col-lg-12">
          <div className="form-inner">
            <div className="form-wrapper">
              <h4>Operator Details</h4>
              <div className="row">
                <div className="column-1 col-xs-12 col-sm-6 col-md-6 col-lg-4">
                  <div className="form-group">
                    <label className="form-group-label">Username</label>
                    <div className="form-group-control">
                      <input
                        name="username"
                        value={
                          operatorDetails.userName ||
                          selectedOperator.userName ||
                          ''
                        }
                        type="text"
                        disabled={true}
                        onChange={this.handleChange}
                      />
                    </div>
                  </div>
                </div>
                <div className="column-1 col-xs-12 col-sm-6 col-md-6 col-lg-4">
                  <div className="form-group">
                    <label className="form-group-label">Account Status</label>
                    <div className="form-group-control">
                      <select
                        name="statusId"
                        value={renderedValues.statusId}
                        onChange={this.handleChange}
                        disabled={!changeUserStatusPermission}>
                        {this._renderOptions('statusId')}
                      </select>
                    </div>
                  </div>
                </div>
                <div className="column-1 col-xs-12 col-sm-6 col-md-6 col-lg-4">
                  <div className="form-group">
                    <label className="form-group-label">First Name</label>
                    <div className="form-group-control">
                      <input
                        name="firstName"
                        value={renderedValues.firstName}
                        type="text"
                        onChange={this.handleChange}
                        disabled={!updatePermission}
                      />
                    </div>
                  </div>
                </div>
                <div className="column-1 col-xs-12 col-sm-6 col-md-6 col-lg-4">
                  <div className="form-group">
                    <label className="form-group-label">Last Name</label>
                    <div className="form-group-control">
                      <input
                        name="lastName"
                        value={renderedValues.lastName}
                        type="text"
                        onChange={this.handleChange}
                        disabled={!updatePermission}
                      />
                    </div>
                  </div>
                </div>
                <div className="column-1 col-xs-12 col-sm-6 col-md-6 col-lg-4">
                  <div className="form-group">
                    <label className="form-group-label">Email</label>
                    <div className="form-group-control">
                      <input
                        name="email"
                        value={renderedValues.email}
                        type="text"
                        onChange={this.handleChange}
                        disabled={!updatePermission}
                      />
                    </div>
                  </div>
                </div>
                <div className="column-1 col-xs-12 col-sm-6 col-md-6 col-lg-4">
                  <div className="form-group">
                    <label className="form-group-label">Mobile Number</label>
                    <div className="form-group-control">
                      <input
                        name="mobile"
                        type="text"
                        value={renderedValues.mobile}
                        onChange={this.handleChange}
                        disabled={!updatePermission}
                      />
                    </div>
                  </div>
                </div>
                <div className="column-1 col-xs-12 col-sm-6 col-md-6 col-lg-4">
                  <div className="form-group">
                    <label className="form-group-label">Currency</label>
                    <div className="form-group-control">
                      <select
                        name="currencyId"
                        value={renderedValues.currencyId}
                        disabled={true}
                        onChange={this.handleOperatorChange}>
                        {this._renderOptions('currencyId')}
                      </select>
                    </div>
                  </div>
                </div>
                <div className="column-1 col-xs-12 col-sm-6 col-md-6 col-lg-4">
                  <div className="form-group">
                    <label className="form-group-label">Origin</label>
                    <div className="form-group-control">
                      <select
                        name="originId"
                        value={renderedValues.originId}
                        onChange={this.handleChange}
                        disabled={true}>
                        {this._renderOptions('originId')}
                      </select>
                    </div>
                  </div>
                </div>
                <div className="column-1 col-xs-12 col-sm-6 col-md-6 col-lg-4">
                  <div className="form-group">
                    <label className="form-group-label">Language</label>
                    <div className="form-group-control">
                      <select
                        name="languageId"
                        value={renderedValues.languageId}
                        onChange={this.handleChange}
                        disabled={!updatePermission}>
                        {this._renderOptions('languageId')}
                      </select>
                    </div>
                  </div>
                </div>
                <div className="column-1 col-xs-12 col-sm-6 col-md-6 col-lg-4">
                  <div className="form-group">
                    <label className="form-group-label">Security Level</label>
                    <div className="form-group-control">
                      <input
                        name="securityLevel"
                        value={renderedValues.securityLevel}
                        type="number"
                        onChange={this.handleChange}
                        disabled={!updatePermission}
                      />
                    </div>
                  </div>
                </div>
                <div className="column-1 col-xs-12 col-sm-6 col-md-6 col-lg-4">
                  <div className="form-group">
                    <label className="form-group-label">Price Format</label>
                    <div className="form-group-control">
                      <select
                        name="priceFormat"
                        value={renderedValues.priceFormatId}
                        onChange={this.handleChange}
                        disabled={!updatePermission}>
                        {this._renderOptions('priceFormat')}
                      </select>
                    </div>
                  </div>
                </div>
                <button
                  onClick={this.clickChangePassword}
                  disabled={!changePasswordPermission}>
                  Change Password
                </button>
              </div>
            </div>
          </div>
        </div>
        <ChagePasswordModal
          {...this.props}
          _handleSubmit={this._handleChangePasswordSubmit}
          initialValues={{ accountId: operatorid }}
        />
        {isChangingPassword ? <ModalLoader /> : null}
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(
  mapPermissionsToProps(OperatorForm)
)
