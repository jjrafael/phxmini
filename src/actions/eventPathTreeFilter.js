import actionTypes from '../constants';

export function setEventPathTreeSearchValue(searchString) {
    return {
        type: actionTypes.SET_EVENT_PATH_TREE_SEARCH_VALUE,
        searchString
    }
}

export function clearEventPathTreeSearchValue() {
    return {
        type: actionTypes.CLEAR_EVENT_PATH_TREE_SEARCH_VALUE
    }
}

export function searchEventPathTree() {
    return {
        type: actionTypes.SEARCH_EVENT_PATH_TREE
    }
}