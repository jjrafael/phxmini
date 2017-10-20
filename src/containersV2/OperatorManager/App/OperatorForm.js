import React from "react"
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import constants from './constants'
import PermissionPanel from '../PermissionPanel/';
import { closeModal, openModal } from 'actions/modal';
import GroupForm from '../GroupForm'
import ChagePasswordModal from '../ChangePasswordModal';

const mapStateToProps = (state) => {
  
  return {

    modals : state.modals,

  }
}

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({
  
   closeModal, openModal
  }, dispatch)
}
class OperatorForm extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
    }
  }

  _fieldDisabledStatus (fieldName, fieldDisabled=null) {
    const { formStatus } = this.props

    // fields are disabled by default
    let isDisabled = true

    // fields are enabled when you have formStatus === ready
    if (formStatus === constants.FORM_READY || formStatus === constants.FORM_CHANGED) {
      if (fieldDisabled === null) {
        isDisabled = false
      } else {
        isDisabled = fieldDisabled
      }
      
    }
    // TODO: returns if the field needs to be disbaled or not, for now it is set to true
    return isDisabled
  }

  _renderInputField ({fieldLabel, fieldName, fieldValue, fieldPlaceholder, fieldDisabled, fieldError}) {
    // const disabled = true
    const defaultValue = fieldValue || ''
    const isDisabled = this._fieldDisabledStatus(fieldName, fieldDisabled)
    const { formFieldOnChangeHandler } = this.props
    return (
        <div className="form-group">
            <label className="form-group-label">{fieldLabel}</label>
            <div className="form-group-control">
              <input type="text"  value={defaultValue} placeholder={fieldPlaceholder} disabled={isDisabled} onChange={(e)=>{formFieldOnChangeHandler(fieldName, e.target.value)}} />
              <span className="field-err">{fieldError}</span>
            </div>
        </div> 
    )
  }

  _renderButtonField ({buttonName, buttonText, buttonClickHandler, buttonDisabled = false}) {
    // const disabled = true
    const isDisabled = this._fieldDisabledStatus(buttonName, buttonDisabled)
    
    return (
        <button type="button" onClick={buttonClickHandler} disabled={false}>{buttonText}</button>
    )
  }

  _renderSelectField ({fieldLabel, fieldName, fieldValue, fieldOptions, fieldPlaceholder, fieldDisabled, fieldError}) {
    fieldValue = fieldValue || ''
    fieldOptions = fieldOptions || []
    const isDisabled = this._fieldDisabledStatus(fieldName, fieldDisabled)
    const { formFieldOnChangeHandler } = this.props

    return (
        <div className="form-group">
            <label className="form-group-label">{fieldLabel}</label>
            <div className="form-group-control">
              <select name={fieldName} value={fieldValue} disabled={isDisabled} onChange={(e)=>{formFieldOnChangeHandler(fieldName, e.target.value)}}>
                <option value=''></option>
                { fieldOptions.map((option) => {
                  // return '<div />'
                    return <option key={option.id} value={option.id}>{option.description}</option>
                  })
                }
              </select>
              <span className="field-err">{fieldError}</span>
            </div>
        </div> 
    )
  }

  _renderTitle () {
    const { formData, formContentType, formMode } = this.props
    let title

    if (formContentType === constants.OPERATORGROUP) {
      title = `${formMode} GROUP : ${formData.operatorGroupDescription}`
    } else if (formContentType === constants.OPERATOR) {
      title = `${formMode} OPERATOR : ${formData.userName}`
    } else {
      title = 'OPERATOR MANAGER'
    }

    return (
      <h3>{title}</h3>
    )
  }

  render () {
    const { formStatus, formMode, formContentType, formData, formApplicationsList, formApplicationsAssigned,formApplicationsOnChangeHandler,
      formActionsList, formActionsAssigned,formActionsOnChangeHandler,
      formReportsList, formReportsAssigned,formReportsOnChangeHandler, formResetOnClickHandler,
      languages, currencies, accountStatuses, operatorGroupsIndex, formSubmitOnClickHandler } = this.props

    const disabledOperatorGroups = (formContentType === constants.OPERATOR)
    const disabledOperators = (formContentType === constants.OPERATORGROUP)
    const disabledSubmitButton = (formStatus !== constants.FORM_CHANGED)

    const isEditMode = (formMode === constants.FORM_MODE_EDIT)

    let operatorGroupField

    if (formContentType === constants.OPERATORGROUP) {
      operatorGroupField = this._renderInputField({
                              fieldLabel : 'Group Name',
                              fieldName : 'operatorGroupDescription',
                              fieldValue : formData.operatorGroupDescription || '',
                              fieldPlaceholder : '',
                              fieldError: '',
                              fieldDisabled: disabledOperatorGroups
                            })
    } else {
      operatorGroupField = this._renderSelectField({
                              fieldLabel : 'Operator Group',
                              fieldName : 'operatorGroupId',
                              fieldValue : formData.operatorGroupId,
                              fieldOptions: operatorGroupsIndex,
                              fieldPlaceholder : '',
                              fieldError: '',
                              fieldDisabled: disabledOperators
                            })
    }


    return (
      <div className="main-wrapper">
        <form className="form-createacct clearfix">
          {this._renderTitle()}
          <div className="button-group alignright top-btns">
            {this._renderButtonField({
              buttonName: 'submit',
              buttonText: 'Submit',
              buttonClickHandler: (e) => {
                e.preventDefault()
                formSubmitOnClickHandler()  
              },
              buttonDisabled: disabledSubmitButton
            })}
            {this._renderButtonField({
              buttonName: 'reset',
              buttonText: 'Reset',
              buttonClickHandler: (e) => {
                e.preventDefault()
                formResetOnClickHandler()
              },
              buttonDisabled: disabledSubmitButton
            })}
          </div>

          <div className="container-fluid">
            

            <div className="row">
              <div type="row" className="col-xs col-sm col-md col-lg-12">
                <div className="form-inner">
                  <div className="form-wrapper">
                    <h4>Operator Details</h4>
                    <div className="row">
                      <div className="column-1 col-xs col-sm col-md col-lg-6">
                        {this._renderInputField({
                          fieldLabel : 'Username',
                          fieldName : 'userName',
                          fieldValue : formData.userName || '',
                          fieldPlaceholder : '',
                          fieldError: '',
                          fieldDisabled: (disabledOperators || isEditMode)
                        })}
                      </div>
                      <div className="column-2 col-xs col-sm col-md col-lg-6">
                        {this._renderSelectField({
                          fieldLabel : 'Account Status',
                          fieldName : 'statusId',
                          fieldValue : formData.statusId,
                          fieldOptions: accountStatuses,
                          fieldPlaceholder : '',
                          fieldError: '',
                          fieldDisabled: disabledOperators
                        })}
                      </div>
                      <div className="column-1 col-xs col-sm col-md col-lg-6">
                        {this._renderInputField({
                          fieldLabel : 'First Name',
                          fieldName : 'firstName',
                          fieldValue : formData.firstName || '',
                          fieldPlaceholder : '',
                          fieldError: '',
                          fieldDisabled: disabledOperators
                        })}
                      </div>
                      <div className="column-2 col-xs col-sm col-md col-lg-6">
                        {this._renderInputField({
                          fieldLabel : 'Last Name',
                          fieldName : 'lastName',
                          fieldValue : formData.lastName || '',
                          fieldPlaceholder : '',
                          fieldError: '',
                          fieldDisabled: disabledOperators
                        })}
                      </div>
                      <div className="column-2 col-xs col-sm col-md col-lg-6">
                        {this._renderInputField({
                          fieldLabel : 'Email',
                          fieldName : 'email',
                          fieldValue : formData.email || '',
                          fieldPlaceholder : '',
                          fieldError: '',
                          fieldDisabled: disabledOperators
                        })}
                      </div>
                      <div className="column-2 col-xs col-sm col-md col-lg-6">
                        {this._renderInputField({
                          fieldLabel : 'Mobile Number',
                          fieldName : 'mobile',
                          fieldValue : formData.mobile || '',
                          fieldPlaceholder : '',
                          fieldError: '',
                          fieldDisabled: disabledOperators
                        })}
                      </div>
                      <div className="column-1 col-xs col-sm col-md col-lg-6">
                        {this._renderSelectField({
                          fieldLabel : 'Currency',
                          fieldName : 'currencyId',
                          fieldValue : formData.currencyId || '',
                          fieldOptions: currencies,
                          fieldPlaceholder : '',
                          fieldError: '',
                          fieldDisabled: (disabledOperators || isEditMode)
                        })}
                      </div>
                      <div className="column-2 col-xs col-sm col-md col-lg-6">
                        {this._renderInputField({
                          fieldLabel : 'Origin',
                          fieldName : 'originId',
                          fieldValue : formData.originId || '',
                          // fieldOptions: origins,
                          fieldPlaceholder : '',
                          fieldError: '',
                          fieldDisabled: (disabledOperators || isEditMode)
                        })}
                      </div>
                      <div className="column-1 col-xs col-sm col-md col-lg-6">
                        {this._renderSelectField({
                          fieldLabel : 'Language',
                          fieldName : 'languageId',
                          fieldValue : formData.languageId || '',
                          fieldOptions: languages,
                          fieldPlaceholder : '',
                          fieldError: '',
                          fieldDisabled: disabledOperators
                        })}
                      </div>
                      <div className="column-2 col-xs col-sm col-md col-lg-6">
                        {this._renderInputField({
                          fieldLabel : 'Security Level',
                          fieldName : 'securityLevelId',
                          fieldValue : formData.securityLevelId || '',
                          fieldPlaceholder : '',
                          fieldError: '',
                          fieldDisabled: disabledOperators
                        })}
                      </div>
                      <div className="column-1 col-xs col-sm col-md col-lg-6">
                        {this._renderInputField({
                          fieldLabel : 'Price Format',
                          fieldName : 'priceFormatId',
                          fieldValue : formData.priceFormatId || '',
                          fieldPlaceholder : '',
                          fieldError: '',
                          fieldDisabled: disabledOperators
                        })}
                      </div>
                      <div className="column-1 col-xs col-sm col-md col-lg-6">
                        {this._renderButtonField({
                          buttonName: 'changePassword',
                          buttonText: 'Change Password!',
                          buttonClickHandler: (e) => {this.props.openModal('changePasswordModal')},
                        })}
                      </div>
 
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="row">
              <PermissionPanel data={{
                formApplicationsList :formApplicationsList,
                formApplicationsAssigned :formApplicationsAssigned,
                formActionsList :formActionsList,
                formActionsAssigned : formActionsAssigned,
                formReportsList : formReportsList,
                formReportsAssigned : formReportsAssigned,
              }}/>
            </div>

            {/*<div className="row">
                          <div type="row" className="col-xs col-sm col-md col-lg-12">
                            <div className="form-inner">
                              <div className="form-wrapper">
                                <h4>Permissions</h4>
                                <div className="row">
                                  <div className="column-1 col-xs col-sm col-md col-lg-12">
                                    <label className="form-group-label">Applications</label>
            
                                    <DualListBox
                                      options={formApplicationsList}
                                      selected={formApplicationsAssigned}
                                      onChange={(selected) => {
                                        formApplicationsOnChangeHandler(selected)
                                      }}
                                      disabled={this._fieldDisabledStatus('permissions')}
                                    />
            
                                    <label className="form-group-label">Permissions</label>
                                    <DualListBox
                                      options={formActionsList}
                                      selected={formActionsAssigned}
                                      onChange={(selected) => {
                                        formActionsOnChangeHandler(selected)
                                      }}
                                      disabled={this._fieldDisabledStatus('permissions')}
            
                                    />
            
                                    <label className="form-group-label">Reports</label>
                                    <DualListBox
                                      options={formReportsList}
                                      selected={formReportsAssigned}
                                      onChange={(selected) => {
                                        formReportsOnChangeHandler(selected)
                                      }}
                                      disabled={this._fieldDisabledStatus('permissions')}
            
                                    />
                                  </div>
                                  
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>*/}
          </div>
        </form>
        <ChagePasswordModal {...this.props}/>
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(OperatorForm)

