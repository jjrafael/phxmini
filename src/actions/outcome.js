import actionTypes from '../constants';

export function toggleOutcomeVisibility(outcomeData, isVisible) {
    return {
        type: actionTypes.TOGGLE_OUTCOME_VISIBILITY,
        outcomeData,
        isVisible
    }
}

export function fetchOutcomeLinePrice(outcomeId, lineId) {
    return {
        type: actionTypes.FETCH_OUTCOME_PRICE_BY_LINE,
        outcomeId,
        lineId
    }
}

export function clearOutcomeLinePrice() {
    return {
        type: actionTypes.CLEAR_OUTCOME_PRICE_BY_LINE
    }
}

export function cancelFetchOutcomeLinePrice() {
    return {
        type: actionTypes.CANCEL_FETCH_OUTCOME_PRICE_BY_LINE
    }
}