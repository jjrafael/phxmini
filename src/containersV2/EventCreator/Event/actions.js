import constants from './constants';

export function fetchEvent(eventId, isRankEvent=false) {
    return {
        type: constants.FETCH_EVENT,
        eventId,
        isRankEvent
    }
}

export function fetchEventDefaultMarket(eventId) {
    return {
        type: constants.FETCH_EVENT_DEFAULT_MARKET,
        eventId
    }
}

export function fetchEventSelectedOpponents(marketId, eventId) {
    return {
        type: constants.FETCH_EVENT_SELECTED_OPPONENTS,
        marketId,
        eventId
    }
}

export function deleteEvent(eventId) {
    return {
        type: constants.DELETE_EVENT,
        eventId
    }
}

export function deleteEvents(eventIds) {
    return {
        type: constants.DELETE_EVENTS,
        eventIds
    }
}

export function createEvent(eventPathId, data) {
    return {
        type: constants.CREATE_EVENT,
        eventPathId,
        data
    }
}

export function updateEvent(eventId, data) {
    return {
        type: constants.UPDATE_EVENT,
        eventId,
        data
    }
}

export function fetchOpponents(eventPathId) {
    return {
        type: constants.FETCH_EVENT_OPPONENTS,
        eventPathId
    }
}

export function setNewSelectedOpponents(opponents) {
    return {
        type: constants.SET_NEW_SELECTED_OPPONENTS,
        opponents
    }
}

export function clearNewSelectedOpponents() {
    return {
        type: constants.CLEAR_NEW_SELECTED_OPPONENTS
    }
}

export function fetchPlayersOfOpponentA(opponentId) {
    return {
        type: constants.FETCH_PLAYERS_OF_OPPONENTA,
        opponentId,
    }
}

export function fetchPlayersOfOpponentB(opponentId) {
    return {
        type: constants.FETCH_PLAYERS_OF_OPPONENTB,
        opponentId,
    }
}

export function clearPlayersOfOpponentsAB() {
    return {
        type: constants.CLEAR_PLAYERS_OF_OPPONENTS_A_B,
    }
}
