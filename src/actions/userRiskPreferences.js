import actionTypes from '../constants';

export function editUserRiskSports(sportCodes) {
    return {
        type: actionTypes.EDIT_USER_RISK_SPORTS,
        sportCodes
    }
}

export function fetchUserRiskSports() {
    return {
        type: actionTypes.FETCH_USER_RISK_SPORTS,
    }
}

export function editUserRiskColumns(columnIds) {
    return {
        type: actionTypes.EDIT_USER_RISK_COLUMNS,
        columnIds
    }
}

export function fetchUserRiskColumns() {
    return {
        type: actionTypes.FETCH_USER_RISK_COLUMNS,
    }
}

export function editUserRiskColumnsAndSports(columnIds, sportCodes) {
    return {
        type: actionTypes.EDIT_USER_RISK_COLUMNS_AND_SPORTS,
        columnIds,
        sportCodes
    }
}