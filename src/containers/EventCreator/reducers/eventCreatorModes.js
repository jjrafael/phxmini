'use strict';
import appModesConstants from 'phxConstants/appModes';
import ecModesConstants from 'eventCreatorConstants/eventCreatorModes';

const initialState = {
    currentMode: appModesConstants.READ_MODE,
};

export default function (state = initialState, action) {
    switch (action.type) {
        case ecModesConstants.FETCH_EVENT_CREATOR_MODE:
            return { ...state };
        case ecModesConstants.SET_EVENT_CREATOR_MODE:
            return { ...state, currentMode: action.appMode };
        default:
            return { ...state };
    }
}
