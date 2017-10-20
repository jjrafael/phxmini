import actionTypes from '../constants';

export function fetchOutcomeWagerLimitsByGroup(outcomeId, wagerLimitGroupId) {
    return {
        type: actionTypes.FETCH_OUTCOME_WAGER_LIMITS_BY_GROUP,
        outcomeId,
        wagerLimitGroupId
    }
}

export function setSelectedOutcomeId(outcomeId) {
    return {
        type: actionTypes.SET_OUTCOME_WAGER_LIMITS_SELECTED_OUTCOME_ID,
        outcomeId
    }
}

export function setSelectedWagerLimitsGroupId(wagerLimitsGroupId) {
    return {
        type: actionTypes.SET_OUTCOME_WAGER_LIMITS_SELECTED_WAGER_LIMITS_GROUP_ID,
        wagerLimitsGroupId
    }
}