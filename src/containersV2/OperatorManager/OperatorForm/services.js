import { performHttpCall } from 'services/apiUtils'
import httpMethods from 'constants/httpMethods'

let operatorPasswordXHR = null

export function updateOperatorPassword(operatorId, formData) {
  // const url = `/rest/operators/${operatorId}`; 
  const url = `/rest/operators/pwd`; 
  return performHttpCall(operatorPasswordXHR, httpMethods.HTTP_PUT, url, formData)
    .then((response) => ({ response }))
    .catch((xhr) => ({ xhr }))
}