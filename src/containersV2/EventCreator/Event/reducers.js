'use strict';
import constants from './constants';
import { constants as marketConstants } from '../EventMarkets/constants'
import pathConstants from '../Path/constants';

const initialState = {
    eventStatus: null,
    event: null,
    opponents: [],
    isCreatingNewEvent: false,
    isCreatingNewEventFailed: false,

    isFetchingSelectedOpponents: false,
    isFetchingSelectedOpponentsFailed: false,

    isUpdatingEvent: false,
    isUpdatingEventFailed: false,

    isDeletingEvent: false,
    isDeletingEventFailed: false,

    isFetchingPlayersA: false,
    isFetchingPlayersAFailed: false,

    isFetchingPlayersB: false,
    isFetchingPlayersBFailed: false,

    defaultMarketId: null,
    selectedOpponents: [],
    newSelectedOpponents: [],
    eventPlayersMap: {},
    playersA:[],
    playersB:[],
}

let eventPlayersMap;
const eventCreatorEvent = (state = initialState, action) => {
    switch(action.type) {
        case marketConstants.FETCH_MARKET:
            // always clear the opponents state when fetching market
            // so that when new market popup is opened, opponents data will be refetched...
            return {
                ...state,
                opponents: []
            }
        case marketConstants.FETCH_MARKET_SUCCEEDED:
            eventPlayersMap = { ...state.eventPlayersMap };
            if (action.response.parentType === 'RANKEVENT') {
                eventPlayersMap[action.response.eventId] = {
                    ...eventPlayersMap[action.response.eventId],
                    players: action.response.outcomes
                }
            }
            if (state.event && state.event.id !== action.response.eventId) {
                // clear state.event if market's eventId is not the current event
                return {
                    ...state,
                    event: null,
                    opponents: [],
                    eventPlayersMap
                }
            }
            return {
                ...state,
                opponents: [],
                eventPlayersMap
            }
        case marketConstants.FETCH_MARKET_PLAYERS_SUCCEEDED:
            // save the players for this event.
            // action.response is an object with opponentAId and opponentBId keys.
            return {
                ...state,
                eventPlayersMap: {
                    ...state.eventPlayersMap,
                    [action.eventId]: {
                        ...state.eventPlayersMap[action.eventId],
                        players: action.response
                    }
                }
            }

        case constants.FETCH_EVENT:
            return {
                ...state,
                eventStatus: 'LOADING',
                isCreatingNewEventFailed: false,
                isUpdatingEventFailed: false,
                defaultMarketId: null,
                selectedOpponents: [],
                newSelectedOpponents: [],
                opponents: []
            }
        case constants.FETCH_EVENT_SUCCEEDED:
            eventPlayersMap = { ...state.eventPlayersMap };
            if (action.response.eventType === 'GAMEEVENT') {
                eventPlayersMap[action.response.id] = {
                    ...eventPlayersMap[action.response.id],
                    opponents: [action.response.opponentAId, action.response.opponentBId]
                }
            }
            return {
                ...state,
                eventStatus: null,
                event: {
                    ...action.response,
                    opponentBId: action.response.americanFormat ? action.response.opponentAId : action.response.opponentBId,
                    opponentAId: action.response.americanFormat ? action.response.opponentBId : action.response.opponentAId
                },
                eventPlayersMap
            }
        case constants.FETCH_EVENT_FAILED:
            return {
                ...state,
                eventStatus: 'ERROR'
            }

        case constants.DELETE_EVENT:
        case constants.DELETE_EVENTS:
            return {
                ...state,
                isDeletingEvent: true,
                isDeletingEventFailed: false,
            }
        case constants.DELETE_EVENT_SUCCEEDED:
            return {
                ...state,
                isDeletingEvent: false,
            }
        case constants.DELETE_EVENT_FAILED:
            return {
                ...state,
                isDeletingEvent: false,
                isDeletingEventFailed: true,
            }

        case constants.FETCH_EVENT_OPPONENTS_SUCCEEDED:
            return {
                ...state,
                opponents: action.response
            }
        case constants.CREATE_EVENT:
            return {
                ...state,
                isCreatingNewEvent: true,
                isCreatingNewEventFailed: false,
            }
        case constants.CREATE_EVENT_SUCCEEDED:
            return {
                ...state,
                isCreatingNewEvent: false,
                event: action.response,
                newSelectedOpponents: []
            }
        case constants.CREATE_EVENT_FAILED:
            return {
                ...state,
                isCreatingNewEvent: false,
                isCreatingNewEventFailed: true,
            }

        case constants.UPDATE_EVENT:
            return {
                ...state,
                isUpdatingEvent: true,
                isUpdatingEventFailed: false,
                newSelectedOpponents: []
            }
        case constants.UPDATE_EVENT_SUCCEEDED:
            return {
                ...state,
                isUpdatingEvent: false,
                event: action.response
            }
        case constants.UPDATE_EVENT_FAILED:
            return {
                ...state,
                isUpdatingEvent: false,
                isUpdatingEventFailed: true,
            }

        case constants.FETCH_EVENT_DEFAULT_MARKET:
            return {
                ...state,
                isFetchingSelectedOpponents: true,
                isFetchingSelectedOpponentsFailed: false
            }
        case constants.FETCH_EVENT_DEFAULT_MARKET_SUCCEEDED:
            return {
                ...state,
                defaultMarketId: action.response.id
            }
        case constants.FETCH_EVENT_DEFAULT_MARKET_FAILED:
            return {
                ...state,
                isFetchingSelectedOpponents: false,
                isFetchingSelectedOpponentsFailed: true
            }

        case constants.FETCH_EVENT_SELECTED_OPPONENTS:
            return {
                ...state,
            }
        case constants.FETCH_EVENT_SELECTED_OPPONENTS_SUCCEEDED:
            return {
                ...state,
                isFetchingSelectedOpponents: false,
                selectedOpponents: action.response,
                eventPlayersMap: {
                    ...state.eventPlayersMap,
                    [action.eventId]: {
                        ...state.eventPlayersMap[action.eventId],
                        players: action.response
                    }
                }
            }
        case constants.FETCH_EVENT_SELECTED_OPPONENTS_FAILED:
            return {
                ...state,
                isFetchingSelectedOpponents: false,
                isFetchingSelectedOpponentsFailed: true
            }

        case pathConstants.FETCH_EVENT_PATH_DETAILS:
            return {
                ...state,
                newSelectedOpponents: [],
                selectedOpponents: [],
            }
        case constants.SET_NEW_SELECTED_OPPONENTS:
            return {
                ...state,
                newSelectedOpponents: action.opponents
            }
        case constants.CLEAR_NEW_SELECTED_OPPONENTS:
            return {
                ...state,
                newSelectedOpponents: []
            }

        case constants.FETCH_PLAYERS_OF_OPPONENTA:
            return {
                ...state,
                isFetchingPlayersA: true,
                isFetchingPlayersAFailed: false,
            }
        case constants.FETCH_PLAYERS_OF_OPPONENTA_SUCCEEDED:
            return {
                ...state,
                isFetchingPlayersA: false,
                playersA: action.response,
            }
        case constants.FETCH_PLAYERS_OF_OPPONENTA_FAILED:
            return {
                ...state,
                playersA: [],
                isFetchingPlayersA: false,
                isFetchingPlayersAFailed: true,
            }

        case constants.FETCH_PLAYERS_OF_OPPONENTB:
            return {
                ...state,
                isFetchingPlayersB: true,
            }
        case constants.FETCH_PLAYERS_OF_OPPONENTB_SUCCEEDED:
            return {
                ...state,
                isFetchingPlayersB: false,
                playersB: action.response,
            }
        case constants.FETCH_PLAYERS_OF_OPPONENTB_FAILED:
            return {
                ...state,
                isFetchingPlayersB: false,
                playersB: [],
                isFetchingPlayersBFailed: true,
            }

        case constants.CLEAR_PLAYERS_OF_OPPONENTS_A_B:
            return {
              ...state,
              playersA: [],
              playersB: [],
            }

        default:
            return {...state};
    }
}

export default eventCreatorEvent;
