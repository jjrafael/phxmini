import constants from './constants';

export function fetchApplications(operatorType, operatorId) {
  return {
    type: constants.FETCH_APPLICATIONS,
    operatorType: operatorType,
    operatorId: operatorId
  }
}

export function fetchActions(operatorType, operatorId) {
  return {
    type: constants.FETCH_ACTIONS,
    operatorType: operatorType,
    operatorId: operatorId
  }
}

export function fetchReports(operatorGroupId, operatorId) {
  return {
    type: constants.FETCH_REPORTS,
    operatorGroupId : operatorGroupId,
    operatorId : operatorId
  }
}

export function setApplicationPermissionSelected(assigned, unassigned) {
  return {
    type: constants.SET_APPLICATION_PERMISSION_SELECTED,
    assigned,
    unassigned
  }
}

export function setOriginalApplicationPermission(options) {
  return {
    type: constants.SET_ORIGINAL_ACTION_PERMISSION_LIST_BOX_SELECTED,
    options
  }
}

export function setActionPermissionSelected(assigned, unassigned) {
  return {
    type: constants.SET_ACTION_PERMISSION_SELECTED,
    assigned,
    unassigned
  }
}

export function updateActionPermissionList(newList) {
  return {
    type: constants.UPDATE_ACTION_PERMISSION_LIST_BOX,
    newList
  }
}

export function setReportPermissionSelected(selected) {
  return {
    type: constants.SET_REPORT_PERMISSIONS,
    selected
  }
}

// export function updateDefaultSelectedApplicationPermission(newList) {
//   return {
//     type: constants.UPDATE_DEFAULT_SELECTED_APPLICATION_PERMISSION,
//     newList
//   }
// }

// export function updateDefaultSelectedActionPermission(newList) {
//   return {
//     type: constants.UPDATE_DEFAULT_SELECTED_ACTION_PERMISSION,
//     newList
//   }
// }

// export function updateDefaultSelectedReportPermission(newList) {
//   return {
//     type: constants.UPDATE_DEFAULT_SELECTED_REPORT_PERMISSION,
//     newList
//   }
// }

export function updateDefaultSelectedPermissions() {
  return {
    type: constants.UPDATE_DEFAULT_SELECTED_PERMISSIONS,
  }
}

export function resetModifiedPermission() {
  return {
    type: constants.RESET_MODIFIED_PERMISSIONS,
  }
}

export function updateResetModifiedPermission() {
  return {
    type: constants.UPDATE_RESET_MODIFIED_PERMISSIONS,
  }
}

export function updateReport(report) {
  return {
    type: constants.UPDATE_REPORT,
    report,
  }
}
export function updateReports(reports) {
  return {
    type: constants.UPDATE_REPORTS,
    reports,
  }
}

export function moveReports(reports, direction) {
  return {
    type: constants.MOVE_REPORTS,
    reports,
    direction
  }
}

export function updateAllPermissions(
  originalAssignedApplicationPermissions,
  originalUnassignedApplicationPermissions,
  originalAssignedActionPermissions,
  originalUnassignedActionPermissions,
){
  return {
    type: constants.UPDATE_ALL_PERMISSIONS,
    originalAssignedApplicationPermissions,
    originalUnassignedApplicationPermissions,
    originalAssignedActionPermissions,
    originalUnassignedActionPermissions
  }
}



