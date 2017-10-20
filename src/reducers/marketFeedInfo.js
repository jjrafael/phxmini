import actionTypes from '../constants';

const initialState = {
    markets: [],
    marketsConnected: [],
    linesConnected: [],
    isFetchingMarketFeedInfo: null,
    fetchingMarketFeedInfoFailed: null,
    marketsToDisconnect: [],
    linesToDisconnect: [],
    isDisconnectingMarketFromPriceFeed: null,
    disconnectingMarketFromPriceFeedFailed: null,

};

export default function (state = initialState, action) {
    switch (action.type) {
        case actionTypes.SET_MARKET_FEED_INFO_MARKETS:
            return { ...state, markets: action.markets };
        case actionTypes.FETCH_MARKET_FEED_INFO: 
            return { ...state, isFetchingMarketFeedInfo: true, fetchingMarketFeedInfoFailed: false };
        case actionTypes.FETCH_MARKET_FEED_INFO_SUCCEEDED: 
            return { ...state, isFetchingMarketFeedInfo: false, marketsConnected: action.marketsConnected, linesConnected: action.linesConnected };
        case actionTypes.FETCH_MARKET_FEED_INFO_FAILED: 
            return { ...state, isFetchingMarketFeedInfo: false, fetchingMarketFeedInfoFailed: true };
        case actionTypes.TOGGLE_MARKET_TO_DISCONNECT: 
            const marketIndex = state.marketsToDisconnect.indexOf(action.market);
            if(marketIndex === -1) {
                return { ...state, marketsToDisconnect: [ ...state.marketsToDisconnect, action.market ] };
            } else {
                return { ...state, marketsToDisconnect: [
                        ...state.marketsToDisconnect.slice(0, marketIndex),
                        ...state.marketsToDisconnect.slice(marketIndex + 1)
                    ]
                };
            }
        case actionTypes.TOGGLE_LINE_TO_DISCONNECT: 
            const lineIdIndex = state.linesToDisconnect.indexOf(action.line);
            if(lineIdIndex === -1) {
                return { ...state, linesToDisconnect: [ ...state.linesToDisconnect, action.line ] };
            } else {
                return { ...state, linesToDisconnect: [
                        ...state.linesToDisconnect.slice(0, lineIdIndex),
                        ...state.linesToDisconnect.slice(lineIdIndex + 1)
                    ]
                };
            }
        case actionTypes.DISCONNECT_MARKET_FROM_PRICE_FEED:
            return { ...state, isDisconnectingMarketFromPriceFeed: true }
        case actionTypes.DISCONNECT_MARKET_FROM_PRICE_FEED_SUCCEEDED:
            return { ...state, isDisconnectingMarketFromPriceFeed: false }
        case actionTypes.DISCONNECT_MARKET_FROM_PRICE_FEED_FAILED:
            return { ...state, isDisconnectingMarketFromPriceFeed: false, disconnectingMarketFromPriceFeedFailed: true }
        case actionTypes.RESET_MARKET_FEED_INFO: {
            return { ...initialState }
        }
        default:
            return { ...state };
    }
}