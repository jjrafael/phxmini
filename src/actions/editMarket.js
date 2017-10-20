import actionTypes from '../constants';

export function setEditMarketMarkets(markets) {
    return {
        type: actionTypes.SET_EDIT_MARKET_MARKETS,
        markets
    }
}

export function setEditMarketSelectedMarketId(marketId) {
    return {
        type: actionTypes.SET_EDIT_MARKET_SELECTED_MARKET_ID,
        marketId
    }
}

export function fetchEditMarketDetails(marketId) {
    return {
        type: actionTypes.FETCH_EDIT_MARKET_DETAILS,
        marketId
    }
}

export function saveEditMarketChanges(marketId, editMarketChanges) {
    return {
        type: actionTypes.SAVE_EDIT_MARKET_CHANGES,
        marketId,
        editMarketChanges
    }
}

export function addEditMarketPriceMargin(marketId) {
    return {
        type: actionTypes.ADD_EDIT_MARKET_PRICE_MARGIN,
        marketId
    }
}

export function removeEditMarketPriceMargin(marketId) {
    return {
        type: actionTypes.REMOVE_EDIT_MARKET_PRICE_MARGIN,
        marketId
    }
}