import actionTypes from '../../constants';

export function selectPath(path) {
	return {
		type: actionTypes.SELECT_EVENT_CREATOR_PATH,
		path
	}
}

export function setLoadingVisibility(isLoading) {
    return {
        type: actionTypes.SET_EVENT_CREATOR_LOADING_VISIBILITY,
        isLoading
    }
}

export function deleteEventPath(eventPathId) {
    return {
        type: actionTypes.DELETE_EVENT_PATH,
        eventPathId
    }
}

export function deleteEvent(eventId) {
    return {
        type: actionTypes.DELETE_EVENT,
        eventId
    }
}

export function clearDeleteEventPathErrors() {
    return {
        type: actionTypes.CLEAR_DELETE_EVENT_PATH_ERRORS
    }
}

export function saveReorder(printOrders) {
    return {
        type: actionTypes.SAVE_REORDER,
        printOrders
    }
}
