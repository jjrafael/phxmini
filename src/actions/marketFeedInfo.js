import actionTypes from '../constants';

export function fetchMarketFeedInfo(marketIds) {
    return {
        type: actionTypes.FETCH_MARKET_FEED_INFO,
        marketIds
    }
}

export function setMarketFeedInfoMarkets(markets) {
    return {
        type: actionTypes.SET_MARKET_FEED_INFO_MARKETS,
        markets
    }
}

export function toggleMarketToDisconnect(market) {
    return {
        type: actionTypes.TOGGLE_MARKET_TO_DISCONNECT,
        market
    }
}

export function toggleLineToDisconnect(line) {
    return {
        type: actionTypes.TOGGLE_LINE_TO_DISCONNECT,
        line
    }
}

export function disconnectMarketFromPriceFeed() {
    return {
        type: actionTypes.DISCONNECT_MARKET_FROM_PRICE_FEED
    }
}

export function resetMarketFeedInfo() {
    return {
        type: actionTypes.RESET_MARKET_FEED_INFO
    }
}