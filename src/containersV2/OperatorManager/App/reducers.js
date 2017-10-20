'use strict'
import constants from './constants'

const initialState = {
  filterStatus: 'OPEN',
  operatorGroups: {},
  operatorGroupsIndex: [],
  operatorGroupsStatus: null,
  operatorDetails: {},

  operatorApplications: {},
  operatorApplicationsStatus: null,

  operatorActions: {},
  operatorActionsStatus: null,

  operatorReports: {},
  operatorReportsStatus: null,

  submitOperatorDataResponse: null,
  submitOperatorDataStatus: null,

  showNewOperatorModal: null,
  showNewOperatorGroupModal: null
}

const operatorManagerApp = (state = initialState, action) => {
  switch(action.type) {
    case 'dasda':
      return {
        ...state,
        operatorGroupsStatus: 'LOADING'
      }
    case 'dasdasds':
      return {
        ...state,
        operatorGroups: action.operatorGroups,
        operatorGroupsIndex: action.operatorGroupsIndex,
        operatorGroupsStatus: 'LOADED'

      }
    case 'dasdas':
      return {
        ...state,
        operatorGroupsStatus: 'ERROR'
      }

    // case constants.FETCH_APPLICATIONS:
    //   return {
    //     ...state,
    //     operatorApplicationsStatus: 'LOADING'
    //   }

    // case constants.FETCH_APPLICATIONS_SUCCEEDED:
    //   return {
    //     ...state,
    //     operatorApplications: action.operatorApplications,
    //     operatorApplicationsStatus: 'LOADED'
    //   }
    // case constants.FETCH_APPLICATIONS_FAILED:
    //   return {
    //     ...state,
    //     operatorApplicationsStatus: 'ERROR'
    //   }

    // case constants.FETCH_ACTIONS:
    //   return {
    //     ...state,
    //     operatorActionsStatus: 'LOADING'
    //   }

    // case constants.FETCH_ACTIONS_SUCCEEDED:
    //   return {
    //     ...state,
    //     operatorActions: action.operatorActions,
    //     operatorActionsStatus: 'LOADED'
    //   }
    // case constants.FETCH_ACTIONS_FAILED:
    //   return {
    //     ...state,
    //     operatorActionsStatus: 'ERROR'
    //   }

    // case constants.FETCH_REPORTS:
    //   return {
    //     ...state,
    //     operatorReportsStatus: 'LOADING'
    //   }

    // case constants.FETCH_REPORTS_SUCCEEDED:
    //   return {
    //     ...state,
    //     operatorReports: action.operatorReports,
    //     operatorReportsStatus: 'LOADED'
    //   }
    // case constants.FETCH_REPORTS_FAILED:
    //   return {
    //     ...state,
    //     operatorReportsStatus: 'ERROR'
    //   }

    case constants.SUBMIT_OPERATOR_DATA:
      return {
        ...state,
        submitOperatorDataStatus: 'LOADING'
      }

    case constants.SUBMIT_OPERATOR_DATA_SUCCEEDED:

      return {
        ...state,
        submitOperatorDataResponse: action.response,
        submitOperatorDataStatus: 'LOADED'
      }
    case constants.SUBMIT_OPERATOR_DATA_FAILED:

      return {
        ...state,
        operatorActionsStatus: 'ERROR'
      }

    case constants.SHOW_OPERATOR_MODAL:
      return {
        ...state,
        showNewOperatorModal: true
      }

    case constants.HIDE_OPERATOR_MODAL:
      return {
        ...state,
        showNewOperatorModal: false
      }

    case constants.SHOW_OPERATOR_GROUP_MODAL:
      return {
        ...state,
        showNewOperatorGroupModal: true
      }

    case constants.HIDE_OPERATOR_GROUP_MODAL:
      return {
        ...state,
        showNewOperatorGroupModal: false
      }

    default:
      return {...state}
  }
}

export default operatorManagerApp
