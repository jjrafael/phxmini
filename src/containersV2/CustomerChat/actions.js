import constans from "./constants";

export function getOperatorSecurityLevel(operatorId) {
  return {
    type: constans.FETCH_OPERATOR_DETAILS,
    operatorId
  };
}

export function fetchUnassignedSessions() {
  return {
    type: constans.FETCH_UNASSIGNED_SESSIONS
  };
}

export function fetchAssignedSessions(operatorId) {
  return {
    type: constans.FETCH_ASSIGNED_SESSIONS,
    operatorId
  };
}


export function acceptSession(session) {
  return {
    type: constans.ACCEPT_SESSION,
    session
  };
}

export function selectSession(sessionId) {
  return {
    type: constans.SELECT_SESSION,
    sessionId
  };
}

export function fetchMessages(sessionId) {
  return {
    type: constans.FETCH_MESSAGES,
    sessionId
  };
}

export function sendMessage(sessionId, message) {
  return {
    type: constans.SEND_MESSAGE,
    sessionId,
    message
  };
}

export function endSession(sessionId) {
  return {
    type: constans.END_SESSION,
    sessionId
  };
}

export function closeAssignedSession(sessionId) {
  return {
    type: constans.CLOSE_ASSIGNED_SESSION,
    sessionId
  };
}

export function closeUnassignedSession(sessionId) {
  return {
    type: constans.CLOSE_UNASSIGNED_SESSION,
    sessionId
  };
}

export function changeTextValue(value) {
  return {
    type: constans.CHANGE_TEXT_VALUE,
    value
  };
}

export function changeSendMessageStatus(value) {
  return {
    type: constans.CHANGE_SEND_MESSAGE_STATUS,
    value
  };
}

export function fetchAssignedSessionDetails(sessionId) {
  return {
    type: constans.FETCH_ASSIGNED_SESSION_DETAILS,
    sessionId
  };
}

export function fetchUnassignedSessionDetails(sessionId) {
  return {
    type: constans.FETCH_UNASSIGNED_SESSION_DETAILS,
    sessionId
  };
}

export function toggleAssignedSessionWarning(sessionId) {
  return {
    type: constans.TOGGLE_ASSIGNED_SESSION_WARNING,
    sessionId
  };
}

export function toggleUnassignedSessionWarning(sessionId) {
  return {
    type: constans.TOGGLE_UNASSIGNED_SESSION_WARNING,
    sessionId
  };
}
