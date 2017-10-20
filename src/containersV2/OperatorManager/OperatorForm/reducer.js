import {
        UPDATE_OPERATOR,
        UPDATE_OPERATOR_SUCCEEDED,
        UPDATE_OPERATOR_FAILED,
        SET_OPERATOR_FORM,
        SET_ORIGINAL_FORM,
        CLEAR_OPERATOR_FORM ,
        RESET_OPERATOR_FORM_MODIFIED,
        RESET_MODIFIED,
        UPDATE_PASSWORD, 
        UPDATE_PASSWORD_SUCCEEDED, 
        UPDATE_PASSWORD_FAILED,
        SET_RENDERED_VALUES
    } from './actions'

const initialState = {
    operatorDetails: {
      username: '',
      password: '',
      groupId: '',
      statusId: '',
      currencyId: '',
      originId: '',
      firstName: '',
      lastName: '',
      email: '',
      priceFormatId: '',
      languageId: '',
      mobile: '',
      securityLevel: 0
    },
    originalOperatorDetails: {
      username: '',
      password: '',
      groupId: '',
      statusId: '',
      currencyId: '',
      originId: '',
      firstName: '',
      lastName: '',
      email: '',
      priceFormatId: '',
      languageId: '',
      mobile: '',
      securityLevel: 0
    },
    renderedValues: {
      username: '',
      password: '',
      groupId: '',
      statusId: '',
      currencyId: '',
      originId: '',
      firstName: '',
      lastName: '',
      email: '',
      priceFormatId: '',
      languageId: '',
      mobile: '',
      securityLevel: 0
    },
    groupid:'',
    modified: false,

    updateOperatorStatus: '',

    isChangingPassword: false,
    isChangingPasswordFailed: false,
}

const operatorDetailsForm = (state = initialState, action) => {
    let operator = action.operatorDetails;
    switch(action.type){
        case SET_OPERATOR_FORM:
          let hasChanged = JSON.stringify(state.originalOperatorDetails) === JSON.stringify(action.formDetails) ? false : true;
          return {
            ...state,
            modified: hasChanged,
            operatorDetails: {
              ...action.formDetails,
              email: action.formDetails.email || ''
            }
          }
        case SET_RENDERED_VALUES:
          return {
            ...state,
            renderedValues: {
              ...operator
            }
          }
        case SET_ORIGINAL_FORM:
          if(operator.details){
            operator = operator.details
          }
          return {
            ...state,
            originalOperatorDetails: {
              username: operator.userName || operator.username,
              password: operator.password || '',
              groupId: operator.operatorGroupId || operator.groupId,
              statusId: operator.statusId,
              currencyId: operator.currencyId,
              originId: operator.originId,
              firstName: operator.firstName || '',
              lastName: operator.lastName || '',
              email: operator.email || '',
              priceFormatId: operator.priceFormatId,
              languageId: operator.languageId,
              mobile: operator.mobile || '',
              securityLevel: operator.securityLevel
            },
            operatorDetails: {
              username: operator.userName || operator.username,
              password: operator.password || '',
              groupId: operator.operatorGroupId,
              statusId: operator.statusId,
              currencyId: operator.currencyId,
              originId: operator.originId,
              firstName: operator.firstName || '',
              lastName: operator.lastName || '',
              email: operator.email || '',
              priceFormatId: operator.priceFormatId,
              languageId: operator.languageId,
              mobile: operator.mobile || '',
              securityLevel: operator.securityLevel
            },
            renderedValues: {
              username: operator.userName || operator.username,
              password: operator.password || '',
              groupId: operator.operatorGroupId,
              statusId: operator.statusId,
              currencyId: operator.currencyId,
              originId: operator.originId,
              firstName: operator.firstName || '',
              lastName: operator.lastName || '',
              email: operator.email || '',
              priceFormatId: operator.priceFormatId,
              languageId: operator.languageId,
              mobile: operator.mobile || '',
              securityLevel: operator.securityLevel
            }
          }
        case UPDATE_OPERATOR:
            return {
                ...state,
                operatorDetails:{
                    ...state.operatorDetails,
                    ...action.formDetails
                },
                modified: true,
                updateOperatorStatus: 'LOADING'
            }
        case UPDATE_OPERATOR_SUCCEEDED:
            return {
              ...state,
              modified: false,
              updateOperatorStatus: 'SUCCESS',
              operatorDetails: {
                ...state.operatorDetails,
                groupId: state.operatorDetails.groupId,
                statusId: state.operatorDetails.statusId,
                currencyId: state.operatorDetails.currencyId,
                originId: state.operatorDetails.originId,
                priceFormatId: state.operatorDetails.priceFormatId,
                securityLevel: state.operatorDetails.securityLevel,
                languageId: state.operatorDetails.languageId,
                email: state.operatorDetails.email,
                firstName: state.operatorDetails.firstName,
                lastName: state.operatorDetails.lastName,
                mobile: state.operatorDetails.mobile
              },
              originalOperatorDetails: {
                username: action.operatorDetails.userName,
                password: action.operatorDetails.password || '',
                groupId: action.operatorDetails.operatorGroupId,
                statusId: action.operatorDetails.statusId,
                currencyId: action.operatorDetails.currencyId,
                originId: action.operatorDetails.originId,
                firstName: action.operatorDetails.firstName || '',
                lastName: action.operatorDetails.lastName || '',
                email: action.operatorDetails.email || '',
                priceFormatId: action.operatorDetails.priceFormatId,
                languageId: action.operatorDetails.languageId,
                mobile: action.operatorDetails.mobile || '',
                securityLevel: action.operatorDetails.securityLevel
              }
            }
        case UPDATE_OPERATOR_FAILED:
            return {
                ...state,
                modified: true,
                updateOperatorStatus: 'FAILED'
            }
        case CLEAR_OPERATOR_FORM:
            return initialState
        case RESET_OPERATOR_FORM_MODIFIED:
            return {
                ...state,
                modified:false,
                updateOperatorStatus: '',
                operatorDetails: {...state.originalOperatorDetails},
                renderedValues: {...state.originalOperatorDetails}
            }
        case RESET_MODIFIED:
            return {
                ...state,
                modified:false
            }

        case UPDATE_PASSWORD:
            return {
                ...state,
                isChangingPassword: true,
            }
        case UPDATE_PASSWORD_SUCCEEDED:
            return {
                ...state,
                isChangingPassword: false,
                isChangingPasswordFailed: false,
            }
        case UPDATE_PASSWORD_FAILED:
            return {
                ...state,
                isChangingPassword: false,
                isChangingPasswordFailed: true,
            }
        case UPDATE_PASSWORD:
            return {
                ...state,
                isChangingPassword: true,
            }
        case UPDATE_PASSWORD_SUCCEEDED:
            return {
                ...state,
                isChangingPassword: false,
            }
        case UPDATE_PASSWORD_FAILED:
            return {
                ...state,
                isChangingPassword: false,
            }
        default:
            return state
    }
}

export default operatorDetailsForm