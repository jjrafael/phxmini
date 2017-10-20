'use strict'
import constants from './constants';
import {
  UPDATE_OPERATOR_SUCCEEDED,
  ADD_UPDATE_GROUP_SUCCEEDED,
} from '../OperatorList/constants';
import { makeIterable } from 'phxUtils';
import { generateReportsMap, generateReportsList, updateReportMap, sortReports, getReportsArray, countAssignedWithCheck } from './helpers';
import _ from 'lodash';

const initialState = {

  isFetchingApplicationPermissions : false,
  isModifiedApplicationPermission : false,
  applicationPermissionsMap: [],
  unassignedApplicationPermissions : [],
  assignedApplicationPermissions : [],
  originalAssignedApplicationPermissions : [],
  originalUnassignedApplicationPermissions : [],


  isFetchingActionPermissions : false,
  isModifiedActionPermission : false,
  actionPermissionsMap: [],
  unassignedActionPermissions : [],
  assignedActionPermissions : [],
  originalAssignedActionPermissions : [],
  originalUnassignedActionPermissions : [],
  allActionPermissions : [],


  isFetchingReportsPermissions : false,
  isModifiedReportPermission : false,

  reportsMap: {},
  assignedReportsList: [],
  unassignedReportsList: [],
  assignedReportsArray: [],
  unassignedReportsArray: [],
  originalAssignedReportPermissions: [],
  originalReportsMap: {},
  assignedAndCheckedCount: 0,
  unassignedAndCheckedCount: 0,

  isResettingModifiedPermissions : false,
  selectedReportPermissions : [],
}

const permissionPanel = (state = initialState, action) => {
  switch(action.type) {
    case constants.UPDATE_ALL_PERMISSIONS:
    return{
      ...state,
      originalAssignedActionPermissions : state.assignedActionPermissions,
      originalAssignedApplicationPermissions: state.assignedApplicationPermissions,
      originalUnassignedActionPermissions: state.unassignedActionPermissions,
      originalUnassignedApplicationPermissions: state.unassignedApplicationPermissions
    }
    case constants.FETCH_APPLICATIONS:
      return {
        ...state,
        isFetchingApplicationPermissions: true
      }
    case constants.FETCH_APPLICATIONS_SUCCEEDED:
      let applications = [...action.operatorApplications.unassignedApplications,...action.operatorApplications.assignedApplications];
      let applicationPermissionsMap = [];

      applications.forEach(app => {
          applicationPermissionsMap[app.applicationId] = app;
       })
      
      let assignedApplications = _.map(action.operatorApplications.assignedApplications, app => {return app.applicationId});
      let unassignedApplications =  _.map(action.operatorApplications.unassignedApplications, app => {return app.applicationId});
      return {
        ...state,
        isFetchingApplicationPermissions: false,
        applicationPermissionsMap : applicationPermissionsMap,
        originalAssignedApplicationPermissions :assignedApplications, 
        assignedApplicationPermissions : assignedApplications,
        originalUnassignedApplicationPermissions : unassignedApplications, 
        unassignedApplicationPermissions : unassignedApplications

      }
    case constants.FETCH_APPLICATIONS_FAILED:
      return {
        ...state,
        isFetchingApplicationPermissions: false
      }


    case constants.SET_APPLICATION_PERMISSION_SELECTED:
      
      // return (state => {
        let currSelectedApps = [...action.assigned];
        let currAssignedActionPermission = [...state.assignedActionPermissions];
        let unassignedActionsListUpdate = _.filter(state.allActionPermissions, action => {
            return currAssignedActionPermission.indexOf(action.id) === -1 && currSelectedApps.indexOf(action.applicationId) !== -1;
        });
        unassignedActionsListUpdate = _.map(unassignedActionsListUpdate, app => {return app.id});
        return {
          ...state,
          isModifiedApplicationPermission : !_.isEqual(action.assigned, state.originalAssignedApplicationPermissions),
          assignedApplicationPermissions : action.assigned,
          unassignedApplicationPermissions : action.unassigned,
          unassignedActionPermissions : unassignedActionsListUpdate
          // isSettingApplicationPermission : true,
        }
      // })(state)


    case constants.FETCH_ACTIONS:
      return {
        ...state,
        isFetchingActionPermissions: true
      }

    case constants.FETCH_ACTIONS_SUCCEEDED:
      let actions = [...action.operatorActions.unassignedActions,...action.operatorActions.assignedActions];
      let selectedApps = [...state.assignedApplicationPermissions];
      let actionPermissionsMap = [];

      actions.forEach(app => {
          actionPermissionsMap[app.id] = app;
      })

      let unassignedActionsList = _.filter(action.operatorActions.unassignedActions, action => {
          return selectedApps.indexOf(action.applicationId) !== -1;
      })

      let assignedActions = _.map(action.operatorActions.assignedActions, app => {return app.id});
      let unassignedActions =  _.map(action.operatorActions.unassignedActions, app => {return app.id});
      unassignedActionsList = _.map(unassignedActionsList, app => {return app.id});
      return {
        ...state,
        isFetchingActionPermissions: false,
        actionPermissionsMap : actionPermissionsMap,
        originalAssignedActionPermissions :assignedActions, 
        assignedActionPermissions : assignedActions,
        allActionPermissions : action.operatorActions.unassignedActions,
        originalUnassignedActionPermissions : unassignedActionsList, 
        unassignedActionPermissions : unassignedActionsList
      }
    case constants.FETCH_ACTIONS_FAILED:
      return {
        ...state,
        isFetchingActionPermissions: false
      }

    case constants.SET_ACTION_PERMISSION_SELECTED:
      return {
        ...state,
        isModifiedActionPermission : !_.isEqual(action.assigned, state.originalAssignedActionPermissions),
        assignedActionPermissions : action.assigned,
        unassignedActionPermissions : action.unassigned,
        // isSettingApplicationPermission : true,
      }

    case constants.FETCH_REPORTS:
      return {
        ...state,
        isFetchingReportsPermissions: true
      }

    case constants.FETCH_REPORTS_SUCCEEDED:
      return (state => {
        const { assignedReports, unassignedReports } = action.operatorReports;
        const reportsMap = generateReportsMap({
          assigned: assignedReports,
          unassigned: unassignedReports
        });
        const assignedReportsArray = getReportsArray({group: 'assigned', isSorted: true, reportsMap});
        return {
          ...state,
          operatorReports: action.operatorReports,
          isFetchingReportsPermissions: false,
          assignedReportsList: generateReportsList({group: 'assigned', reportsMap}),
          unassignedReportsList: generateReportsList({group: 'unassigned', reportsMap}),
          unassignedReportsArray: getReportsArray({group: 'unassigned', reportsMap}),
          originalAssignedReportPermissions: [...assignedReportsArray],
          originalReportsMap: {...reportsMap},
          isModifiedReportPermission: false,
          assignedReportsArray,
          reportsMap
        }
      })(state)
    case constants.FETCH_REPORTS_FAILED:
      return {
        ...state,
        isFetchingReportsPermissions: false
      }

    case constants.UPDATE_ACTION_PERMISSION_LIST_BOX:
      return {
        ...state,
        isFetchingApplicationActionPermissions : true,
      }

    case constants.UPDATE_ACTION_PERMISSION_LIST_BOX_SUCEEDED:
      return {
        ...state,
        isFetchingApplicationActionPermissions : false,
        operatorApplicationActions: action.response,

      }

    case constants.UPDATE_ACTION_PERMISSION_LIST_BOX_FAILED:
      return {
        ...state,
        isFetchingApplicationActionPermissions : false,
      }

    case constants.SET_REPORT_PERMISSIONS:
      return {
        ...state,
        isSettingReportPermission : true,
      }
    case constants.SET_REPORT_PERMISSIONS_SUCCEEDED:
      return {
        ...state,
        isSettingReportPermission : false,
        isModifiedReportPermission : !_.isEqual(action.selected, state.operatorReports.assignedReports),
        selectedReportPermissions: action.selected
      }
    case constants.SET_REPORT_PERMISSIONS_FAILED:
      return {
        ...state,
        isSettingReportPermission : false,
      }

    case constants.SET_ORIGINAL_ACTION_PERMISSION_LIST_BOX_SELECTED:
      return {
        ...state,
        isSettingOriginalApplicationPermission : true,
      }
    case constants.SET_ORIGINAL_ACTION_PERMISSION_LIST_BOX_SELECTED_SUCEEDED:
      return {
        ...state,
        isSettingOriginalApplicationPermission : false,
        originalApplicationPermissions: action.options,

      }
    case constants.SET_ORIGINAL_ACTION_PERMISSION_LIST_BOX_SELECTED_FAILED:
      return {
        ...state,
        isSettingOriginalApplicationPermission : false
      }

    case constants.UPDATE_DEFAULT_SELECTED_PERMISSIONS:
      return {
        ...state,
        selectedApplicationPermissions : state.selectedApplicationPermissions,
        isModifiedApplicationPermission : false,
        selectedPermissions : state.selectedPermissions,
        isModifiedActionPermission : false,
        selectedReportPermissions : state.selectedReportPermissions,
        isModifiedReportPermission : false
      }

    case constants.RESET_MODIFIED_PERMISSIONS:
      return (state => {
        const reportsMap = { ...state.originalReportsMap };
        return {
          ...state,
          assignedApplicationPermissions : state.originalAssignedApplicationPermissions,
          unassignedApplicationPermissions : state.originalUnassignedApplicationPermissions,
          isModifiedApplicationPermission : false,
          assignedActionPermissions : state.originalAssignedActionPermissions,
          unassignedActionPermissions : state.originalUnassignedActionPermissions,
          isModifiedActionPermission : false,
          assignedReportsList: generateReportsList({group: 'assigned', reportsMap}),
          unassignedReportsList: generateReportsList({group: 'unassigned', reportsMap}),
          assignedReportsArray: [...state.originalAssignedReportPermissions],
          unassignedReportsArray: getReportsArray({group: 'unassigned', reportsMap}),
          assignedAndCheckedCount: 0,
          unassignedAndCheckedCount: 0,
          isModifiedReportPermission: false,
          reportsMap
        }
      })(state);
      

    case constants.UPDATE_RESET_MODIFIED_PERMISSIONS:
      return {
        ...state,
        assignedApplicationPermissions : state.assignedApplicationPermissions,
        unassignedApplicationPermissions : state.unassignedApplicationPermissions,
        isModifiedApplicationPermission : false,
        assignedActionPermissions : state.assignedActionPermissions,
        unassignedActionPermissions : state.unassignedActionPermissions,
        isModifiedActionPermission : false,
        // selectedReportPermissions : state.operatorReports.assignedReports,
        // isModifiedReportPermission : false
      }

    case constants.UPDATE_REPORT: // toggle collapse/expand
      return {
        ...state,
        reportsMap: updateReportMap({report: action.report, reportsMap: state.reportsMap})
      }
    case constants.UPDATE_REPORTS: // check/uncheck of report/s
      return (state => {
        let reportsMap = {...state.reportsMap};
        action.reports.forEach(report => {
          reportsMap = updateReportMap({reportsMap, report})
        })
        return {
          ...state,
          assignedAndCheckedCount: countAssignedWithCheck({reportsMap, group: 'assigned'}),
          unassignedAndCheckedCount: countAssignedWithCheck({reportsMap, group: 'unassigned'}),
          reportsMap
        }
      })(state);

    case constants.MOVE_REPORTS:
      return (state => {
        const reportsMap = {...state.reportsMap};
        let from = 'unassigned';
        let to = 'assigned';
        let assignedAndCheckedCount = countAssignedWithCheck({reportsMap, group: 'assigned'});
        let unassignedAndCheckedCount = countAssignedWithCheck({reportsMap, group: 'unassigned'});
        if (action.direction === 'left') {
          from = 'assigned';
          to = 'unassigned';
          assignedAndCheckedCount = 0; // checked reports are cleared upon moving of reports
        } else {
          unassignedAndCheckedCount = 0; // checked reports are cleared upon moving of reports
        }
        action.reports.forEach(report => {
          reportsMap[report.key] = {
            ...report,
            [`isChecked_${from}`]: false,
            [`isExpanded_${from}`]: false,
          }
          if (report.parentKey) {
            let parentReport = reportsMap[report.parentKey];
            if (!parentReport[to].includes(report.key)) {
              parentReport[to] = [...parentReport[to], report.key];
            }
            if (parentReport && parentReport.parentKey) { // level 2 report
              // add the parentReport's key to grand parent's as well
              let grandparentReport = reportsMap[parentReport.parentKey];
              if (!grandparentReport[to].includes(parentReport.key)) {
                grandparentReport[to] = [...grandparentReport[to], parentReport.key];
              }
            }
            parentReport[from] = parentReport[from].filter(key => key !== report.key);
          }
        });
        const assignedReportsArray = getReportsArray({group: 'assigned', isSorted: true, reportsMap});
        const unassignedReportsArray = getReportsArray({group: 'unassigned', reportsMap});
        return {
          ...state,
          assignedReportsList: generateReportsList({group: 'assigned', reportsMap}),
          unassignedReportsList: generateReportsList({group: 'unassigned', reportsMap}),
          reportsMap: sortReports(reportsMap),
          isModifiedReportPermission: !_.isEqual(assignedReportsArray, state.originalAssignedReportPermissions),
          assignedReportsArray,
          unassignedReportsArray,
          assignedAndCheckedCount,
          unassignedAndCheckedCount,
        }
      })(state);

    case UPDATE_OPERATOR_SUCCEEDED:
    case ADD_UPDATE_GROUP_SUCCEEDED:
      return {
        ...state,
        isModifiedReportPermission: false,
        originalAssignedActionPermissions:[...state.assignedActionPermissions],
        originalAssignedApplicationPermissions:[...state.assignedApplicationPermissions],
        originalAssignedReportPermissions: [...state.assignedReportsArray],
        originalReportsMap: {...state.reportsMap}
      }
    default:
      return {...state}
  }
}

export default permissionPanel;
