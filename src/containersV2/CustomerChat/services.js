import { performHttpCall } from 'phxServices/apiUtils';
import httpMethods from 'phxConstants/httpMethods';

let fetchEventXhr = null;

export function fetchOperatorDetails(operatorId) {
  const url = `/rest/operators/${operatorId}`;
  return performHttpCall(fetchEventXhr, httpMethods.HTTP_GET, url, null)
    .then((response) => ({ response }))
    .catch((xhr) => ({ xhr }));
};

export function fetchAssignedSession(operatorId) {
  const url = `/rest/chat/sessions?operatorId=${operatorId}&ended=false&unassigned=false`;
  return performHttpCall(fetchEventXhr, httpMethods.HTTP_GET, url, null)
    .then((response) => ({ response }))
    .catch((xhr) => ({ xhr }));
}

export function fetchUnassignedSession() {
  const url = '/rest/chat/sessions?unassigned=true&ended=false&hasCustomerMessages=true&logOperator=true';
  return performHttpCall(fetchEventXhr, httpMethods.HTTP_GET, url, null)
    .then((response) => ({ response }))
    .catch((xhr) => ({ xhr }));
}

export function acceptSession(sessionId) {
  const url = `/rest/chat/sessions/${sessionId}/accept`;
  return performHttpCall(fetchEventXhr, httpMethods.HTTP_POST, url, null)
    .then((response) => ({ response }))
    .catch((xhr) => ({ xhr }));
}

export function selectSession(sessionId) {
  const url = `/rest/chat/sessions/${sessionId}/messages`;
  return performHttpCall(fetchEventXhr, httpMethods.HTTP_GET, url, null)
    .then((response) => ({ response }))
    .catch((xhr) => ({ xhr }));
}

export function fetchMessages(sessionId) {
  const url = `/rest/chat/sessions/${sessionId}/messages`;
  return performHttpCall(fetchEventXhr, httpMethods.HTTP_GET, url, null)
    .then((response) => ({ response }))
    .catch((xhr) => ({ xhr }));
}

export function sendMessage(sessionId, message) {
  const url = `/rest/chat/sessions/${sessionId}/messages`;
  const options = {
    chatSessionId: sessionId,
    message,
    origin: 'OPERATOR'
  };
  return performHttpCall(fetchEventXhr, httpMethods.HTTP_POST, url, options)
    .then((response) => ({ response }))
    .catch((xhr) => ({ xhr }));
}

export function endSession(sessionId) {
  const url = `/rest/chat/sessions/${sessionId}/end?origin=OPERATOR`;
  return performHttpCall(fetchEventXhr, httpMethods.HTTP_POST, url, null)
    .then((response) => ({ response }))
    .catch((xhr) => ({ xhr }));
}

export function fetchSessionDetails(sessionId) {
  const url = `/rest/chat/sessions/${sessionId}?populateCustomerTimeoutWarning=true`;
  return performHttpCall(fetchEventXhr, httpMethods.HTTP_GET, url, null)
    .then((response) => ({ response }))
    .catch((xhr) => ({ xhr }));
}