import { performHttpCall } from '../../../services/apiUtils'
import httpMethods from '../../../constants/httpMethods'
import constants from './constants'

let permisisonXHR = null

export function fetchApplications(type, id) {
  const url = `/rest/${type}/${id}/applications`;
  return performHttpCall(permisisonXHR, httpMethods.HTTP_GET, url, null)
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
