import constants from './constants';

export function fetchOperatorGroups(filterId) {
  return {
    type: constants.FETCH_OPERATOR_GROUPS,
    filterId
  }
}

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

export function submitOperatorData(mode, contentType, data, id) {
  return {
    type: constants.SUBMIT_OPERATOR_DATA,
    mode: mode,
    contentType: contentType,
    data : data,
    id : id
  }
}

export function showNewOperatorModal() {
  return {
    type: constants.SHOW_OPERATOR_MODAL
  };
}

export function hideNewOperatorModal() {
  return {
    type: constants.HIDE_OPERATOR_MODAL
  };
}

export function showNewOperatorGroupModal() {
  return {
    type: constants.SHOW_OPERATOR_GROUP_MODAL
  };
}

export function hideNewOperatorGroupModal() {
  return {
    type: constants.HIDE_OPERATOR_GROUP_MODAL
  };
}