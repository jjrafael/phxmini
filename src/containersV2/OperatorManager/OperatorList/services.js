import { performHttpCall } from '../../../services/apiUtils'
import httpMethods from '../../../constants/httpMethods'
import constants from './constants'

let operatorManagerXHR = null

export function fetchOperatorGroups() {
  const url = `/rest/operatorgroups`;//remove filter once in test
  return performHttpCall(operatorManagerXHR, httpMethods.HTTP_GET, url, null)
    .then((response) => ({ response }))
    .catch((xhr) => ({ xhr }))
}

export function fetchOperatorGroupsByStatus(id) {
  const url = `rest/operatorgroups?lineid=2&statusId=${id}`;//remove filter once in test
  return performHttpCall(operatorManagerXHR, httpMethods.HTTP_GET, url, null)
    .then((response) => ({ response }))
    .catch((xhr) => ({ xhr }))
}


export function addGroup(groupDetails) {
  const url = `/rest/operatorgroups`;
  return performHttpCall(operatorManagerXHR, httpMethods.HTTP_POST, url, groupDetails)
    .then((response) => ({ response }))
    .catch((xhr) => ({ xhr }))
}

export function duplicateGroup(groupid,groupName) {
  const url = `/rest/operatorgroups/${groupid}`;
  return performHttpCall(operatorManagerXHR, httpMethods.HTTP_POST, url, {description:groupName})
    .then((response) => ({ response }))
    .catch((xhr) => ({ xhr }))
}

export function editGroup(id,groupDetails) {
  const url = `/rest/operatorgroups/${id}`;
  return performHttpCall(operatorManagerXHR, httpMethods.HTTP_PUT, url, groupDetails)
    .then((response) => ({ response }))
    .catch((xhr) => ({ xhr }))
}

export function deleteGroup(groupDetails) {
  const url = `/rest/operatorgroups/${groupDetails}`;
  return performHttpCall(operatorManagerXHR, httpMethods.HTTP_DELETE, url, null)
    .then((response) => {
      return response
    })
    .catch((xhr) => ({ xhr }))
}

export function addOperator(operatorDetails) {
  const url = `/rest/operators/create`; 
  return performHttpCall(operatorManagerXHR, httpMethods.HTTP_POST, url, operatorDetails)
    .then((response) => ({ response }))
    .catch((xhr) => ({ xhr }))
}

export function updateOperator(id, operatorDetails) {
  const url = `/rest/operators/${id}`; 
  return performHttpCall(operatorManagerXHR, httpMethods.HTTP_PUT, url, operatorDetails)
    .then((response) => ({ response }))
    .catch((xhr) => ({ xhr }))
}

export function duplicateOperator(id, operatorDetails) {
  const url = `/rest/operators/${id}`; 
  return performHttpCall(operatorManagerXHR, httpMethods.HTTP_POST, url, operatorDetails)
    .then((response) => ({ response }))
    .catch((xhr) => ({ xhr }))
}