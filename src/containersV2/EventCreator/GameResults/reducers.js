'use strict';
import constants from './constants';

const initialState = {
    periodPoints : [],

    isFetchingGameResultsPeriodPoints : false,
    isFetchingGameResultsPeriodPointsFailed : false,

    isUpdatingGameResultsPeriodPoints : false,
    isUpdatingGameResultsPeriodPointsFailed : false,

    isUpdatingGameResultsVoidPeriod : false,
    isUpdatingGameResultsVoidPeriodFailed : false,
}

const eventCreatorApp = (state = initialState, action) => {
    switch(action.type) {
        case constants.FETCH_GAME_RESULTS_PERIOD_POINTS:
            return {
                ...state,
                isFetchingGameResultsPeriodPoints : true,
            }
        case constants.FETCH_GAME_RESULTS_PERIOD_POINTS_SUCCEEDED:
            return {
                ...state,
                periodPoints: action.response,
                isFetchingGameResultsPeriodPoints : false
            }
        case constants.FETCH_GAME_RESULTS_PERIOD_POINTS_FAILED:
            return {
                ...state,
                isFetchingGameResultsPeriodPoints : false,
                isFetchingGameResultsPeriodPointsFailed: true
            }

        case constants.UPDATE_GAME_RESULTS_PERIOD_POINTS:
            return {
                ...state,
                isUpdatingGameResultsPeriodPoints : true,
            }
        case constants.UPDATE_GAME_RESULTS_PERIOD_POINTS_SUCCEEDED:
            return {
                ...state,
                isUpdatingGameResultsPeriodPoints : false,
            }
        case constants.UPDATE_GAME_RESULTS_PERIOD_POINTS_FAILED:
            return {
                ...state,
                isUpdatingGameResultsPeriodPoints : false,
                isUpdatingGameResultsPeriodPointsFailed: true
            }

        case constants.UPDATE_GAME_RESULTS_VOID_PERIOD:
            return {
                ...state,
                isUpdatingGameResultsVoidPeriod : true,
            }
        case constants.UPDATE_GAME_RESULTS_VOID_PERIOD_SUCCEEDED:
            return {
                ...state,
                isUpdatingGameResultsVoidPeriod : false,
            }
        case constants.UPDATE_GAME_RESULTS_VOID_PERIOD_FAILED:
            return {
                ...state,
                isUpdatingGameResultsVoidPeriod : false,
                isUpdatingGameResultsVoidPeriodFailed: true
            }
        default:
            return {...state};
    }
}

export default eventCreatorApp;