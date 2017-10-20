'use strict';
import constants from './constants';

const initialState = {
    activePage: null,
    selectedPath: null,
    activeCode: null,
    enableHeaderButtons: [],
    sportOtherOptions: {
        bestOfSetsOptions: [1,3,5,7,9]
    },
    isSaveButtonDisabled: true,
    isBulkUpdateActive: false,
}

const eventCreatorApp = (state = initialState, action) => {
    switch(action.type) {
        case constants.UPDATE_HEADER_BUTTONS:
            return {
                ...state,
                activePage: action.activePage,
                enableHeaderButtons: action.enableHeaderButtons
            }
        case constants.SELECT_EVENT_CREATOR_PATH:
            return {
                ...state,
                selectedPath: action.path
            }
        case constants.CLEAR_SELECTED_EVENT_CREATOR_PATH:
            return {
                ...state,
                selectedPath: null
            }
        case constants.UPDATE_SAVE_BUTTON_STATE:
            return {
                ...state,
                isSaveButtonDisabled: action.isSaveButtonDisabled
            }
        case constants.FETCH_SPORT_OTHER_OPTIONS_SUCCEEDED:
            return {
                ...state,
                sportOtherOptions: action.response[0]
            }
        case constants.TOGGLE_BULK_UPDATE:
            return {...state, isBulkUpdateActive: action.isBulkUpdateActive}
        default:
            return {...state};
    }
}

export default eventCreatorApp;