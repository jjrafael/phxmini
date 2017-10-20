import actionTypes from '../constants';

const initialState = {
    selectedOutcomeId: null,
    selectedWagerLimitsGroupId: null,
    isFetchingOutcomeWagerLimitsGroup: null,
    fetchingOutcomeWagerLimitsGroupFailed: null,
    limits: [],
};

export default function (state = initialState, action) {
    switch (action.type) {
        case actionTypes.SET_OUTCOME_WAGER_LIMITS_SELECTED_OUTCOME_ID:
            return { ...state, selectedOutcomeId: action.outcomeId };
        case actionTypes.SET_OUTCOME_WAGER_LIMITS_SELECTED_WAGER_LIMITS_GROUP_ID:
            return { ...state, selectedWagerLimitsGroupId: action.wagerLimitsGroupId };
        case actionTypes.FETCH_OUTCOME_WAGER_LIMITS_BY_GROUP:
            return { ...state, isFetchingOutcomeWagerLimitsGroup: true, fetchingOutcomeWagerLimitsGroupFailed: false};
        case actionTypes.FETCH_OUTCOME_WAGER_LIMITS_BY_GROUP_SUCCEEDED:
            return { ...state, isFetchingOutcomeWagerLimitsGroup: false, limits: action.limits};
        case actionTypes.FETCH_OUTCOME_WAGER_LIMITS_BY_GROUP_FAILED:
            return { ...state, isFetchingOutcomeWagerLimitsGroup: false, fetchingOutcomeWagerLimitsGroupFailed: true};
        default:
            return { ...state };
    }
}