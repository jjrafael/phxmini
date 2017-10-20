import { performHttpCall } from '../../../services/apiUtils'
import httpMethods from '../../../constants/httpMethods'
import constants from './constants'

let operatorManagerXHR = null

export function fetchOperatorGroups(filterId) {
  const url = `/rest/operatorgroups?lineid=2&statusId=${filterId}`;
  return performHttpCall(operatorManagerXHR, httpMethods.HTTP_GET, url, null)
    .then((response) => ({ response }))
    .catch((xhr) => ({ xhr }))
}

let applicationsXHR = null

export function fetchApplications(type, id) {
  const url = `/rest/${type}/${id}/applications`;
  return performHttpCall(applicationsXHR, httpMethods.HTTP_GET, url, null)
    .then((response) => ({ response }))
    .catch((xhr) => ({ xhr }))
}

let actionsXHR = null

export function fetchActions(type, id) {
  const url = `/rest/${type}/${id}/actions`;
  return performHttpCall(actionsXHR, httpMethods.HTTP_GET, url, null)
    .then((response) => ({ response }))
    .catch((xhr) => ({ xhr }))
}

let reportsXHR = null

export function fetchReports(operatorGroupId, operatorId) {
  operatorId = operatorId || -1
  const url = `/rest/reports?groupOperatorId=${operatorGroupId}&operatorId=${operatorId}`;
  return performHttpCall(reportsXHR, httpMethods.HTTP_GET, url, null)
    .then((response) => ({ response }))
    .catch((xhr) => ({ xhr }))
}

let submitDataXHR = null

export function submitOperatorData(mode, contentType, data, id) {
  const httpMethod = (mode===constants.FORM_MODE_EDIT) ? httpMethods.HTTP_PUT : httpMethods.HTTP_POST
  let operatorURL = (contentType===constants.OPERATORGROUP) ? 'operatorgroups' : 'operators'
  //////// TODO::::::::: need to add logic on sending data
  const url = `/rest/${operatorURL}/${id}`

  return performHttpCall(reportsXHR, httpMethod, url, data)
    .then((response) => ({ response }))
    .catch((xhr) => ({ xhr }))
}

export const exportOperatorsGroup = () => {
  const url = `/rest/operatorgroups/export`
  return performHttpCall(reportsXHR, httpMethods.HTTP_GET, url, null)
  .then((response) => response)
  .catch((xhr) => ({ xhr }))
}

export const exportOperators = () => {
  const url = `/rest/operators/export`
  return performHttpCall(reportsXHR, httpMethods.HTTP_GET, url, null)
  .then((response) => response)
  .catch((xhr) => ({ xhr }))
}

export const updateGroup = (groupid) => {
  const url = `/rest/operatorgroups/${groupid}`
  return performHttpCall(reportsXHR, httpMethods.HTTP_GET, url, null)
  .then((response) => ({response}))
  .catch((xhr) => ({ xhr }))
}