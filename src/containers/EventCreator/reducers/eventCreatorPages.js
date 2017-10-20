'use strict';
import ecPagesConstants from 'eventCreatorConstants/eventCreatorPages';

const initialState = {
    currentEventCreatorPage: ecPagesConstants.EVENT_PATH,
};

export default function(state = initialState, action) {
    switch (action.type) {
        case ecPagesConstants.GET_EVENT_CREATOR_PAGE:
            return { ...state };
        case ecPagesConstants.SET_EVENT_CREATOR_PAGE:
            return { ...state, currentEventCreatorPage: action.eventCreatorPage };
        default:
            return { ...state };
    }
}
