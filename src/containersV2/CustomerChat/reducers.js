import constants from './constants';

const initialState = {
	assignedSessions: [],
	unassignedSessions: [],
	operatorSecurityLevel: null,
	selectedSessionId: null,
	sendMessageStatus: '',
	acceptSessionLoading: false,
	text: '',
	firstUnassignedSessionsRequest: true
}

function compareSessions(currentSessions, newSessions, firstUnassignedSessionsRequest) {
	currentSessions.forEach((currentSession) => {
		if (!newSessions.some((session) => session.id === currentSession.id)) {
			currentSession.ended = true;
		}
		newSessions.forEach((session) => {
			if (session.id === currentSession.id) {
				if (session.customerId && !currentSession.customerId) {
					currentSession.customerId = session.customerId;
					currentSession.customerDetails = { ...session.customerDetails }
				}
			}
		})
	});

	newSessions.forEach((newSession) => {
		if (!currentSessions.some((session) => session.id === newSession.id)) {
			if (!firstUnassignedSessionsRequest) newSession.flash = true;
			currentSessions.push(newSession);
		}
	});

	return currentSessions;
}

function removeSession(sessions, sessionId) {
	return sessions.filter((session) => session.id !== sessionId);
}

function updateMessages(sessions, sessionId, messages) {
	sessions.forEach((session) => {
		if (session.id === sessionId) {
			session.messages = messages;
		}
	});
	return sessions;
}

function updateSessionDetails(sessions, sessionId, sessionDetails) {
	sessions.forEach((session) => {
		if (session.id === sessionId) {
			session.details = { ...sessionDetails }
		}
	});
	return sessions;
}

function toggleWarning(sessions, sessionId) {
	sessions.forEach((session) => {
		if (session.id === sessionId) session.warning = !session.warning;
	});
	return sessions;
}

const customerChat = (state = initialState, action) => {
	switch (action.type) {
		case constants.FETCH_OPERATOR_DETAILS:
			return {
				...state
			}
		case constants.FETCH_OPERATOR_DETAILS_SUCCEEDED:
			return {
				...state,
				operatorSecurityLevel: action.result.securityLevel,
			}
		case constants.FETCH_OPERATOR_DETAILS_FAILED:
			return {
				...state
			}

		case constants.FETCH_ASSIGNED_SESSIONS:
			return {
				...state
			}
		case constants.FETCH_ASSIGNED_SESSIONS_SUCCEEDED:
			return {
				...state,
				assignedSessions: compareSessions([...state.assignedSessions], action.result, state.firstUnassignedSessionsRequest)
			}
		case constants.FETCH_ASSIGNED_SESSIONS_FAILED:
			return {
				...state
			}

		case constants.FETCH_UNASSIGNED_SESSIONS:
			return {
				...state
			}
		case constants.FETCH_UNASSIGNED_SESSIONS_SUCCEEDED:
			return {
				...state,
				unassignedSessions: compareSessions([...state.unassignedSessions], action.result, state.firstUnassignedSessionsRequest),
				firstUnassignedSessionsRequest: false
			}
		case constants.FETCH_UNASSIGNED_SESSIONS_FAILED:
			return {
				...state
			}

		case constants.SELECT_SESSION:
			return {
				...state,
				selectedSessionId: action.sessionId
			}

		case constants.END_SESSION:
			return {
				...state
			}

		case constants.END_SESSION_SUCCEEDED:
			return {
				...state,
				assignedSessions: removeSession(state.assignedSessions, action.sessionId),
				selectedSessionId: null
			}

		case constants.END_SESSION_FAILED:
			return {
				...state
			}

		case constants.FETCH_MESSAGES:
			return {
				...state
			}
		case constants.FETCH_MESSAGES_SUCCEEDED:
			return {
				...state,
				assignedSessions: updateMessages([...state.assignedSessions], action.sessionId, action.messages)
			}
		case constants.FETCH_MESSAGES_FAILED:
			return {
				...state
			}

		case constants.SEND_MESSAGE:
			return {
				...state,
				sendMessageStatus: 'LOADING'
			}
		case constants.SEND_MESSAGE_SUCCEEDED:
			return {
				...state,
				sendMessageStatus: 'SUCCESS'
			}
		case constants.SEND_MESSAGE_FAILED:
			return {
				...state,
				sendMessageStatus: 'ERROR'
			}

		case constants.CLOSE_ASSIGNED_SESSION:
			return {
				...state,
				assignedSessions: removeSession(state.assignedSessions, action.sessionId)
			}

		case constants.CLOSE_UNASSIGNED_SESSION:
			return {
				...state,
				unassignedSessions: removeSession(state.unassignedSessions, action.sessionId)
			}

		case constants.ACCEPT_SESSION:
			return {
				...state,
				acceptSessionLoading: true
			}

		case constants.ACCEPT_SESSION_SUCCEEDED:
			return {
				...state,
				selectedSessionId: action.session.id,
				acceptSessionLoading: false,
				assignedSessions: [...state.assignedSessions, action.session],
				unassignedSessions: removeSession(state.unassignedSessions, action.session.id)
			}

		case constants.ACCEPT_SESSION_FAILED:
			return {
				...state,
				acceptSessionLoading: false
			}

		case constants.CHANGE_TEXT_VALUE:
			return {
				...state,
				text: action.value
			}

		case constants.CHANGE_SEND_MESSAGE_STATUS:
			return {
				...state,
				sendMessageStatus: action.value
			}

		case constants.FETCH_ASSIGNED_SESSION_DETAILS:
			return {
				...state
			}
		case constants.FETCH_ASSIGNED_SESSION_DETAILS_SUCCEEDED:
			return {
				...state,
				assignedSessions: updateSessionDetails([...state.assignedSessions], action.sessionId, action.sessionDetails)
			}
		case constants.FETCH_ASSIGNED_SESSION_DETAILS_FAILED:
			return {
				...state
			}

		case constants.FETCH_UNASSIGNED_SESSION_DETAILS:
			return {
				...state
			}
		case constants.FETCH_UNASSIGNED_SESSION_DETAILS_SUCCEEDED:
			return {
				...state,
				unassignedSessions: updateSessionDetails([...state.unassignedSessions], action.sessionId, action.sessionDetails)
			}
		case constants.FETCH_UNASSIGNED_SESSION_DETAILS_FAILED:
			return {
				...state
			}

		case constants.TOGGLE_ASSIGNED_SESSION_WARNING:
			return {
				...state,
				assignedSessions: toggleWarning([...state.assignedSessions], action.sessionId)
			}

		case constants.TOGGLE_UNASSIGNED_SESSION_WARNING:
			return {
				...state,
				unassignedSessions: toggleWarning([...state.unassignedSessions], action.sessionId)
			}

		default:
			return { ...state }
	}
}

export default customerChat;
