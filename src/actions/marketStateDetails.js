import actionTypes from '../constants';

export function viewMarketStateDetails(id) {
    return {
        type: actionTypes.VIEW_MARKET_STATE_DETAILS,
        id
    }
}

export function fetchEventDetails() {
    return {
        type: actionTypes.FETCH_EVENT_DETAILS
    }
}

export function changeMarketStatus(marketIds, status) {
    return {
        type: actionTypes.CHANGE_MARKETS_STATUS,
        marketIds,
        status
    }
}

export function abandonMarkets(marketIds, reasonId, reasonNotes) {
    return {
        type: actionTypes.ABANDON_MARKETS,
        marketIds,
        reasonId,
        reasonNotes
    }
}

export function changeMarketCutOffTime(marketIds, dateString) {
    return {
        type: actionTypes.CHANGE_MARKET_CUTOFF_TIME,
        marketIds,
        dateString
    }
}

export function changeMarketAutoOpenTime(marketIds, dateString) {
    return {
        type: actionTypes.CHANGE_MARKET_AUTO_OPEN_TIME,
        marketIds,
        dateString
    }
}

export function fetchMarketPeriodDetails(eventIds) {
    return {
        type: actionTypes.FETCH_MARKET_PERIOD_DETAILS,
        eventIds
    }
}

export function updateMarketCutOffAndAutoOpenDateTime(formData) {
    return {
        type: actionTypes.UPDATE_MARKET_CUTOFF_AND_AUTOOPEN_DATETIME,
        formData
    }
}