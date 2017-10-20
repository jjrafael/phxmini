import actionTypes from '../constants';

const initialState = {
    marketKeysChangingStatus: []
};

export default function (state = initialState, action) {
    switch (action.type) {
        case actionTypes.CHANGE_MARKET_STATUS:
            return { ...state, marketKeysChangingStatus: [ ...state.marketKeysChangingStatus, action.marketKey ] };
        case actionTypes.CHANGE_MARKET_STATUS_SUCCEEDED:
        case actionTypes.CHANGE_MARKET_STATUS_FAILED:
            const index = state.marketKeysChangingStatus.indexOf(action.key);
            return {
                ...state, marketKeysChangingStatus: [
                    ...state.marketKeysChangingStatus.slice(0, index),
                    ...state.marketKeysChangingStatus.slice(index + 1)
                ]
            }
        default:
            return { ...state };
    }
}