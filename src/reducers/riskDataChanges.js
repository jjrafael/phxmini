import actionTypes from '../constants';

const initialState = {
    unsavedOutcomePriceChanges: {},
    isSavingChanges: null,
    saveChangesFailed: null,
    codeAfterSavingChanges: null,
    descAfterSavingChanges: null,
    belowMinimunPriceMargins: {},
    editedPriceMargins: []
};

export default function (state = initialState, action) {
    let newState, newEditedPriceMargins, priceMarginKey;
    switch (action.type) {
        case actionTypes.ADD_UNSAVED_OUTCOME_PRICE_CHANGE:
            priceMarginKey = `${action.marketId}-${action.key}`;
            if (state.editedPriceMargins.includes(priceMarginKey)) {
                newEditedPriceMargins = state.editedPriceMargins;
            } else {
                newEditedPriceMargins = [...state.editedPriceMargins, priceMarginKey];
            }
            return {
                ...state,
                unsavedOutcomePriceChanges: {
                    ...state.unsavedOutcomePriceChanges,
                    [action.key]: action.value
                },
                editedPriceMargins: newEditedPriceMargins
            }
            
        case actionTypes.REMOVE_UNSAVED_OUTCOME_PRICE_CHANGE:
            newState = { ...state };
            priceMarginKey = `${action.marketId}-${action.key}`;
            if (state.editedPriceMargins.includes(priceMarginKey)) {
                let index = state.editedPriceMargins.findIndex(marketId => priceMarginKey === marketId);
                newEditedPriceMargins = [...state.editedPriceMargins.slice(0, index), ...state.editedPriceMargins.slice(index + 1)];
            } else {
                newEditedPriceMargins = state.editedPriceMargins;
            }
            newState.editedPriceMargins = newEditedPriceMargins;
            if(newState.unsavedOutcomePriceChanges[action.key]) {
                delete newState.unsavedOutcomePriceChanges[action.key];
            }
            return { ...newState };

        case actionTypes.ADD_BELOW_MINIMUM_PRICE_MARGIN:
            return {
                ...state,
                belowMinimunPriceMargins: {
                    ...state.belowMinimunPriceMargins,
                    [action.key]: action.value
                }
            }
        case actionTypes.REMOVE_BELOW_MINIMUM_PRICE_MARGIN:
            newState = { ...state };
            if(newState.belowMinimunPriceMargins[action.key]) {
                delete newState.belowMinimunPriceMargins[action.key];
            }
            return { ...newState };
        case actionTypes.CLEAR_UNSAVED_OUTCOME_PRICE_CHANGES:
            return { ...state, unsavedOutcomePriceChanges: {}, belowMinimunPriceMargins: {}, editedPriceMargins: [] };
        case actionTypes.CLEAR_SPECIFIC_UNSAVED_OUTCOME_PRICE_CHANGES:
            let newUnsavedOutcomePriceChanges = { ...state.unsavedOutcomePriceChanges };
            let newBelowMinimumPriceMargins = {  ...state.belowMinimunPriceMargins };
            let marketKey = `m${action.marketDetails.marketId}`;
            action.marketDetails.marketResults.outcomeResults.map(outcome => `o${outcome.outcomeId}`).map(key => {
                if (newUnsavedOutcomePriceChanges[key]) {
                    delete newUnsavedOutcomePriceChanges[key];
                }
            });
            if (newBelowMinimumPriceMargins[marketKey]) {
                delete newBelowMinimumPriceMargins[marketKey];
            }
            return { ...state, unsavedOutcomePriceChanges: newUnsavedOutcomePriceChanges, belowMinimunPriceMargins: newBelowMinimumPriceMargins};
        case actionTypes.SAVE_OUTCOME_PRICE_CHANGES:
            return { ...state, isSavingChanges: true, saveChangesFailed: false };
        case actionTypes.SAVE_OUTCOME_PRICE_CHANGES_SUCCEEDED:
            return { ...state, isSavingChanges: false, unsavedOutcomePriceChanges: {}, belowMinimunPriceMargins: {}, editedPriceMargins: [] };
        case actionTypes.SAVE_OUTCOME_PRICE_CHANGES_FAILED:
            return { ...state, isSavingChanges: false, saveChangesFailed: true };
        case actionTypes.SET_CODE_AFTER_SAVING_CHANGES:
            return { ...state, codeAfterSavingChanges: action.code };
        case actionTypes.SET_DESC_AFTER_SAVING_CHANGES:
            return { ...state, descAfterSavingChanges: action.desc };
        default:
            return { ...state };
    }
}