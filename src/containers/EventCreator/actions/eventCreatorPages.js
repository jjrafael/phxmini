'use strict';
import ecPagesConstants from 'eventCreatorConstants/eventCreatorPages';

export function getEventCreatorPage() {
    return {
        type: ecPagesConstants.GET_EVENT_CREATOR_PAGE,
    }
}

export function setEventCreatorPage(eventCreatorPage) {
    return {
        type: ecPagesConstants.SET_EVENT_CREATOR_PAGE,
        eventCreatorPage
    }
}
