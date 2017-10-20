'use strict';
import ecModesConstants from 'eventCreatorConstants/eventCreatorModes';

export function fetchEventCreatorMode() {
    return {
        type: ecModesConstants.FETCH_EVENT_CREATOR_MODE,
    }
}

export function setEventCreatorMode(appMode) {
    return {
        type: ecModesConstants.SET_EVENT_CREATOR_MODE,
        appMode
    }
}
