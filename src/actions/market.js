import actionTypes from '../constants';

export function changeMarketStatus(marketKey, status) {
    return {
        type: actionTypes.CHANGE_MARKET_STATUS,
        marketKey,
        status
    }
}