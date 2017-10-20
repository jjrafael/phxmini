import constants from './constants';

export function fetchGameResultsPeriodPoints(eventId) {
    return {
        type: constants.FETCH_GAME_RESULTS_PERIOD_POINTS,
        eventId
    }
}

export function updateGameResultsPeriodPoints(formData) {
    return {
        type: constants.UPDATE_GAME_RESULTS_PERIOD_POINTS,
        formData
    }
}

export function updateGameResultsVoidPeriod(formData) {
    return {
        type: constants.UPDATE_GAME_RESULTS_VOID_PERIOD,
        formData
    }
}


