import actionTypes from '../constants';

export function setRiskFilterCode(code) {
    return {
        type: actionTypes.SET_RISK_FILTER_CODE,
        code
    }
}

export function setRiskFilterDesc(desc) {
    return {
        type: actionTypes.SET_RISK_FILTER_DESC,
        desc
    }
}

export function setRiskFilterDate(date) {
    return {
        type: actionTypes.SET_RISK_FILTER_DATE,
        date
    }
}

export function addCustomDateFilter(customDate) {
    return {
        type: actionTypes.ADD_CUSTOM_DATE_FILTER,
        customDate
    }
}

export function setRiskFilterMarketStatusIds(marketStatusIds) {
    return {
        type: actionTypes.SET_RISK_FILTER_MARKET_STATUS_IDS,
        marketStatusIds
    }
}

export function setRiskFilterMarket(market) {
    return {
        type: actionTypes.SET_RISK_FILTER_MARKET,
        market
    }
}

export function setRiskFilterLine(line) {
    return {
        type: actionTypes.SET_RISK_FILTER_LINE,
        line
    }
}

export function setRiskFilterPeriod(period) {
    return {
        type: actionTypes.SET_RISK_FILTER_PERIOD,
        period
    }
}

export function setRiskFilterBookType(bookType) {
    return {
        type: actionTypes.SET_RISK_FILTER_BOOKTYPE,
        bookType
    }
}

export function setRiskFilterLiabilityType(liabilityType) {
    return {
        type: actionTypes.SET_RISK_FILTER_LIABILITY_TYPE,
        liabilityType
    }
}

export function setRiskFilterPriceType(priceType) {
    return {
        type: actionTypes.SET_RISK_FILTER_PRICE_TYPE,
        priceType
    }
}

export function setRiskFilterWinPlace(winPlace) {
    return {
        type: actionTypes.SET_RISK_FILTER_WIN_PLACE,
        winPlace
    }
}

export function setEventSearchValue(eventSearchString) {
    return {
        type: actionTypes.SET_EVENT_SEARCH_VALUE,
        eventSearchString
    }
}

export function searchEvents() {
    return {
        type: actionTypes.SEARCH_EVENTS
    }
}

export function resetRiskFilters() {
    return {
        type: actionTypes.RESET_RISK_FILTERS
    }
}

export function setRiskRowHeight(rowHeight) {
    return {
        type: actionTypes.SET_RISK_ROW_HEIGHT,
        rowHeight
    }
}

