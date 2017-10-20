import actionTypes from '../constants';

export function fetchRiskData(params={}) {
    return {
        type: actionTypes.FETCH_RISK_DATA,
        params
    }
}

export function updateRiskData() {
    return {
        type: actionTypes.UPDATE_RISK_DATA
    }
}

export function cancelUpdateRiskData() {
    return {
        type: actionTypes.CANCEL_UPDATE_RISK_DATA
    }
}

export function clearRiskData() {
    return {
        type: actionTypes.CLEAR_RISK_DATA
    }
}

export function collapseEvent(eventId) {
    return {
        type: actionTypes.COLLAPSE_EVENT,
        eventId
    }
}

export function expandEvent(eventId) {
    return {
        type: actionTypes.EXPAND_EVENT,
        eventId
    }
}

export function expandAllEvents() {
    return {
        type: actionTypes.EXPAND_ALL_EVENTS
    }
}