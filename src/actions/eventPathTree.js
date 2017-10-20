import actionTypes from '../constants';

export function selectEventPathTreeSport(sportId) {
    return {
        type: actionTypes.SELECT_EVENT_PATH_TREE_SPORT,
        sportId
    }
}

export function fetchEventPathTree(eventPathId, parameters, allowedSports) {
    return {
        type: actionTypes.FETCH_EVENT_PATH_TREE,
        eventPathId,
        parameters,
        allowedSports
    }
}

export function fetchEventMarkets(eventId, parameters) {
    return {
        type: actionTypes.FETCH_EVENT_MARKETS,
        eventId,
        parameters,
    }
}

export function cancelFetchEventMarkets(eventId, parameters) {
    return {
        type: actionTypes.FETCH_EVENT_MARKETS_CANCEL,
        eventId
    }
}


export function resetEventPathTree() {
    return {
        type: actionTypes.RESET_EVENT_PATH_TREE
    }
}
