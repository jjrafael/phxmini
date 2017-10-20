import actionTypes from '../constants';

export function addUnsavedOutcomePriceChange(key, value, marketId) {
    return {
        type: actionTypes.ADD_UNSAVED_OUTCOME_PRICE_CHANGE,
        key,
        value,
        marketId
    }
}

export function removeUnsavedOutcomePriceChange(key, marketId) {
    return {
        type: actionTypes.REMOVE_UNSAVED_OUTCOME_PRICE_CHANGE,
        key,
        marketId
    }
}

export function addBelowMinimumPriceMargin(key, value) {
    return {
        type: actionTypes.ADD_BELOW_MINIMUM_PRICE_MARGIN,
        key,
        value
    }
}

export function removeBelowMinimumPriceMargin(key) {
    return {
        type: actionTypes.REMOVE_BELOW_MINIMUM_PRICE_MARGIN,
        key
    }
}

export function clearUnsavedOutcomePriceChange(key) {
    return {
        type: actionTypes.CLEAR_UNSAVED_OUTCOME_PRICE_CHANGES
    }
}

export function saveOutcomePriceChanges() {
    return {
        type: actionTypes.SAVE_OUTCOME_PRICE_CHANGES
    }
}

export function setCodeAfterSavingChanges(code) {
    return {
        type: actionTypes.SET_CODE_AFTER_SAVING_CHANGES,
        code
    }
}

export function setDescAfterSavingChanges(desc) {
    return {
        type: actionTypes.SET_DESC_AFTER_SAVING_CHANGES,
        desc
    }
}