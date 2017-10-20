import actionTypes from './constants';

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
export function deleteEventPaths(eventPathIds) {
    return {
        type: actionTypes.DELETE_EVENT_PATHS,
        eventPathIds
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

// Event Path Tags
export function fetchEventPathTags() {
    return {
        type: actionTypes.FETCH_EVENT_PATH_TAGS,
    }
}

export function clearEventPathTagsError() {
    return {
        type: actionTypes.CLEAR_EVENT_PATH_TAGS_ERROR,
    }
}


// Event Path Details

export function fetchEventPathDetails(eventPathId) {
    return {
        type: actionTypes.FETCH_EVENT_PATH_DETAILS,
        eventPathId
    }
}

export function addEventPath(newEventPathDetails) {
    return {
        type: actionTypes.ADD_EVENT_PATH,
        newEventPathDetails
    }
}

export function editEventPath(eventPathId, editedEventPathDetails) {
    return {
        type: actionTypes.EDIT_EVENT_PATH,
        eventPathId,
        editedEventPathDetails
    }
}

export function clearEventPathDetailsError() {
    return {
        type: actionTypes.CLEAR_EVENT_PATH_DETAILS_ERROR,
    }
}

export function setEventPathActiveTabIndex(activeTabIndex) {
    return {
        type: actionTypes.SET_EVENT_PATH_ACTIVE_TAB_INDEX,
        activeTabIndex
    }
}
export function setEventPathMode(mode) {
    return {
        type: actionTypes.SET_EVENT_PATH_MODE,
        mode
    }
}
