import constants from './constants';

export function fetchBetRestrictionKeys(id) {
    return {
        type: constants.FETCH_BET_RESTRICTION_KEYS,
        id,
    }
}

export function fetchUnusedBetRestrictionKeys(id) {
    return {
        type: constants.FETCH_UNUSED_BET_RESTRICTION_KEYS,
        id,
    }
}

export function fetchSportPeriods(code) {
    return {
        type: constants.FETCH_SPORT_PERIODS,
        code,
    }
}
export function fetchMarketTypeGroups(params) {
    return {
        type: constants.FETCH_MARKET_TYPE_GROUPS,
        params
    }
}
export function fetchBetRestrictionsHistory(betType) {
    return {
        type: constants.FETCH_BET_RESTRICTIONS_HISTORY,
        betType,
    }
}
export function updateBetRestrictions(restrictions) {
    return {
        type: constants.UPDATE_BET_RESTRICTIONS,
        restrictions,
    }
}
export function updateBetRestrictionsHistory(data) {
    return {
        type: constants.UPDATE_BET_RESTRICTIONS_HISTORY,
        data,
    }
}
export function updateBetRestrictionKeys(betTypes) {
    return {
        type: constants.UPDATE_BET_RESTRICTION_KEYS,
        betTypes,
    }
}
export function restoreBetRestrictionsHistory(id) {
    return {
        type: constants.RESTORE_BET_RESTRICTIONS_HISTORY,
        id,
    }
}

export function fetchMatrixData(activeBetType) {
    return {
        type: constants.FETCH_MATRIX_DATA,
        activeBetType,
    }
}

export function setActiveBetType(activeBetType) {
    return {
        type: constants.SET_ACTIVE_BET_TYPE,
        activeBetType,
    }
}

export function setActiveCell(activeCell) {
    return {
        type: constants.SET_ACTIVE_CELL,
        activeCell,
    }
}

export function setActiveHistory(activeHistory) {
    return {
        type: constants.SET_ACTIVE_HISTORY,
        activeHistory,
    }
}

export function setPathIdForEvent(pathIdForEvent) {
    return {
        type: constants.SET_PATH_ID_FOR_EVENT,
        pathIdForEvent,
    }
}

export function updateCellData(data) {
    return {
        type: constants.UPDATE_CELL_DATA,
        data,
    }
}

export function resetCurrentData() {
    return {
        type: constants.RESET_CURRENT_DATA,
    }
}

export function nextStep() {
    return {
        type: constants.NEXT_STEP,
    }
}
export function previousStep() {
    return {
        type: constants.PREVIOUS_STEP,
    }
}
export function updateStep(key, data) {
    return {
        type: constants.UPDATE_STEP,
        key,
        data
    }
}
export function resetSteps() {
    return {
        type: constants.RESET_STEPS,
    }
}
export function resetHistoryData() {
    return {
        type: constants.RESET_HISTORY_DATA,
    }
}
export function updateNewMatrixData(data) {
    return {
        type: constants.UPDATE_NEW_MATRIX_DATA,
        data,
    }
}
export function addNewBetRestrictions(betType, restrictions, newlyAddedRestrictionKey) {
    return {
        type: constants.ADD_NEW_BET_RESTRICTION,
        betType,
        restrictions,
        newlyAddedRestrictionKey
    }
}
export function createNewBetRestrictionsMatrix(betType, restrictions, newlyAddedRestrictionKey) {
    return {
        type: constants.CREATE_NEW_BET_RESTRICTIONS_MATRIX,
        betType,
        restrictions,
        newlyAddedRestrictionKey
    }
}
export function deleteBetRestrictions(betType, restrictions) {
    return {
        type: constants.DELETE_BET_RESTRICTIONS,
        betType,
        restrictions,
    }
}
export function deleteBetRestrictionsTemporarily(deletedRestrictionsMap, response) {
    return {
        type: constants.DELETE_BET_RESTRICTIONS_TEMPORARILY,
        deletedRestrictionsMap,
        response
    }
}

export function deleteBetRestrictionsHistory(id) {
    return {
        type: constants.DELETE_BET_RESTRICTIONS_HISTORY,
        id
    }
}

export function setEvaluationOrderVisibility(isEvaluationOrderVisible) {
    return {
        type: constants.SET_EVALUATION_ORDER_VISIBILITY,
        isEvaluationOrderVisible
    }
}

export function undoChanges(activeBetTypeKey) {
    return {
        type: constants.UNDO_CHANGES,
        activeBetTypeKey
    }
}



