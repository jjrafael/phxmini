import actionTypes from '../constants';

const initialState = {
    markets: [],
    selectedMarketId: null,
    isFetchingEditMarketDetails: null,
    fetchingEditMarketDetailsFailed: null,
    marketDetails: {},
    isSavingChanges: null,
    savingChangesFailed: null,
    editedPriceMargins: []
};

export default function (state = initialState, action) {
    switch (action.type) {
        case actionTypes.SET_EDIT_MARKET_MARKETS:
            return { ...state,  markets: action.markets };
        case actionTypes.SET_EDIT_MARKET_SELECTED_MARKET_ID:
            return { ...state,  selectedMarketId: action.marketId };
        case actionTypes.FETCH_EDIT_MARKET_DETAILS:
            return { ...state,  isFetchingEditMarketDetails: true, fetchingEditMarketDetailsFailed: false };
        case actionTypes.FETCH_EDIT_MARKET_DETAILS_SUCCEEDED:
            return { ...state, isFetchingEditMarketDetails: false, marketDetails: action.marketDetails };
        case actionTypes.FETCH_EDIT_MARKET_DETAILS_FAILED:
            return { ...state,  isFetchingEditMarketDetails: false, fetchingEditMarketDetailsFailed: true };
        case actionTypes.SAVE_EDIT_MARKET_CHANGES:
            return { ...state, isSavingChanges: true, savingChangesFailed: false };
        case actionTypes.SAVE_EDIT_MARKET_CHANGES_SUCCEEDED:
            if (state.editedPriceMargins.includes(action.marketDetails.marketId)) {
                let index = state.editedPriceMargins.findIndex(marketId => action.marketDetails.marketId === marketId);
                return { ...state, isSavingChanges: false, marketDetails: action.marketDetails,
                    editedPriceMargins: [...state.editedPriceMargins.slice(0, index), ...state.editedPriceMargins.slice(index+1)]
                };
            }
            return { ...state, isSavingChanges: false, marketDetails: action.marketDetails };
        case actionTypes.SAVE_EDIT_MARKET_CHANGES_FAILED:
            return { ...state, isSavingChanges: false, savingChangesFailed: true };
        case actionTypes.ADD_EDIT_MARKET_PRICE_MARGIN:
            if (!state.editedPriceMargins.includes(action.marketId)) {
                return {  ...state, editedPriceMargins: [...state.editedPriceMargins, action.marketId] }
            }
            return { ...state };
        case actionTypes.REMOVE_EDIT_MARKET_PRICE_MARGIN:
            if (state.editedPriceMargins.includes(action.marketId)) {
                let index = state.editedPriceMargins.findIndex(marketId => action.marketId === marketId);
                return { ...state,
                    editedPriceMargins: [...state.editedPriceMargins.slice(0, index), ...state.editedPriceMargins.slice(index+1)]
                }
            }
            return { ...state };
        default:
            return { ...state };
    }
}