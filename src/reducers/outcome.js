import actionTypes from '../constants';

const initialState = {
    outcomeKeysTogglingVisibility: [],
    isFetchingOutcomePriceByLine: null,
    fetchingOutcomePriceByLineFailed: null,
    outcomePriceByLine: null,
    outcomeId: null
};

export default function (state = initialState, action) {
    switch (action.type) {
        case actionTypes.TOGGLE_OUTCOME_VISIBILITY:
            return { ...state, outcomeKeysTogglingVisibility: [ ...state.outcomeKeysTogglingVisibility, action.outcomeData.key ] };
        case actionTypes.TOGGLE_OUTCOME_VISIBILITY_SUCCEEDED:
        case actionTypes.TOGGLE_OUTCOME_VISIBILITY_FAILED:
            const index = state.outcomeKeysTogglingVisibility.indexOf(action.key);
            return {
                ...state, outcomeKeysTogglingVisibility: [
                    ...state.outcomeKeysTogglingVisibility.slice(0, index),
                    ...state.outcomeKeysTogglingVisibility.slice(index + 1)
                ]
            }

        case actionTypes.FETCH_OUTCOME_PRICE_BY_LINE:
            return { ...state, isFetchingOutcomePriceByLine: true, fetchingOutcomePriceByLineFailed: false, outcomeId: action.outcomeId || null };
        case actionTypes.FETCH_OUTCOME_PRICE_BY_LINE_SUCCEEDED:
            return { ...state, isFetchingOutcomePriceByLine: false, outcomePriceByLine: action.price, outcomeId: null };
        case actionTypes.FETCH_OUTCOME_PRICE_BY_LINE_FAILED:
            return { ...state, isFetchingOutcomePriceByLine: false, fetchingOutcomePriceByLineFailed: true, outcomeId: null };

        case actionTypes.CANCEL_FETCH_OUTCOME_PRICE_BY_LINE:
            return { ...state, isFetchingOutcomePriceByLine: false, fetchingOutcomePriceByLineFailed: false, outcomeId: null };
        case actionTypes.CLEAR_OUTCOME_PRICE_BY_LINE:
            return { ...state, outcomePriceByLine: null, isFetchingOutcomePriceByLine: false, fetchingOutcomePriceByLineFailed: false, outcomeId: null };

        default:
            return { ...state };
    }
}