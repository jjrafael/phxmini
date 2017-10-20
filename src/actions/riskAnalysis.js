import actionTypes from '../constants';

export function fetchAnalysisSummary(key) {
    return {
        type: actionTypes.FETCH_RISK_ANALYSIS_SUMMARY,
        key
    }
}

export function clearBetData() {
    return {
        type: actionTypes.CLEAR_BET_DATA
    }
}

export function fetchBetsAnalysis(key, betType, date, fromDate, toDate) {
    return {
        type: actionTypes.FETCH_BETS_ANALYSIS,
        key,
        betType,
        date,
        fromDate,
        toDate
    }
}

export function fetchMultipleSummary(key) {
    return {
        type: actionTypes.FETCH_RISK_MULTIPLE_SUMMARY,
        key
    }
}

export function setKey(key) {
    return {
        type: actionTypes.SET_RISK_ANALYSIS_ACTIVE_KEY,
        key
    }
}

export function fetchBetData(transactionId, transactionType) {
    return {
        type: actionTypes.FETCH_BET_DATA,
        transactionId,
        transactionType
    }
}

export function resetState() {
    return {
        type: actionTypes.RESET_RISK_ANALYSIS
    }
}