'use strict';
import constants from './constants';
import actionTypes from 'constants/index';
import filterTypes from 'constants/filterTypes';
import { makeIterable } from 'phxUtils';

const initialState = {
    marketStatus: null,
    markets: [],
    outcomes: [],

    market: {},
    marketBooks: [],
    marketTypes: [],
    gameResultMarketTypes: [],
    marketPeriods: [],
    gameResultMarketPeriods: [],
    marketPlayers: {},
    updatedMarketBook: null,
    newMarketPayload: {},
    newMarketFilters: {
        filteredMarketTypes: [],
        defaultFilters: [],
        periodTypeIds: [],
        periodIds: [],
        defaultFilter: null,
        searchStr: '',
    },
    gameResultMarketFilters: {
        filteredMarketTypes: [],
        defaultFilters: [],
        periodTypeIds: [],
        periodIds: [],
        defaultFilter: null,
        searchStr: '',
    },
    hideOutcomesOnCreate: false,
    hasSPBook: false,

    isFetchingMarket: false,
    isFetchingMarketFailed: false,

    isUpdatingMarketDetails: false,
    isUpdatingMarketDetailsFailed: false,

    isUpdatingMarketOutcomes: false,
    isUpdatingMarketOutcomesFailed: false,

    isDeletingMarket: false,
    isDeletingMarketFailed: false,

    isUpdatingMarketBooks: false,
    isUpdatingMarketBooksFailed: false,

    isFetchingMarketBooks: false,
    isFetchingMarketBooksFailed: false,

    isFetchingMarketTypes: false,
    isFetchingMarketTypesFailed: false,

    isFetchingMarketPlayers: false,
    isFetchingMarketPlayersFailed: false,

    isFetchingMarketPeriods: false,
    isFetchingMarketPeriodsFailed: false,

    isCreatingNewMarkets: false,
    isCreatingNewMarketsFailed: false,

    isFetchingGameResultPeriods: false,
    isFetchingGameResultPeriodsFailed: false,

    isFetchingGameResultMarketTypes: false,
    isFetchingGameResultMarketTypesFailed: false,
}

const eventCreatorEventMarkets = (state = initialState, action) => {
    switch(action.type) {
        case constants.FETCH_MARKETS:
            return {
                ...state,
                marketStatus: 'LOADING'
            }
        case constants.FETCH_MARKETS_SUCCEEDED:
            return {
                ...state,
                marketStatus: null,
                markets: action.response
            }
        case constants.FETCH_MARKETS_FAILED:
            return {
                ...state,
                marketStatus: 'ERROR'
            }

        case constants.FETCH_MARKETS_OPPONENTS_SUCCEEDED:
            return {
                ...state,
                opponents: action.response
            }

        case constants.FETCH_MARKET:
            return {
                ...state,
                isFetchingMarket: true,
                isFetchingMarketFailed: false
            }
        case constants.FETCH_MARKET_SUCCEEDED:
            return {
                ...state,
                isFetchingMarket: false,
                market: action.response,
                outcomes: [...action.response.outcomes],
                hasSPBook: action.response.hasSPBook
            }
        case constants.FETCH_MARKET_FAILED:
            return {
                ...state,
                isFetchingMarket: false,
                isFetchingMarketFailed: true
            }

        case constants.UPDATE_MARKET_DETAILS:
            return {
                ...state,
                isUpdatingMarketDetails: true,
                isUpdatingMarketDetailsFailed: false
            }
        case constants.UPDATE_MARKET_DETAILS_SUCCEEDED:
            return {
                ...state,
                isUpdatingMarketDetails: false,
                market: {
                    ...action.response,
                    book: state.market.book,
                    period: state.market.period,
                    outcomes: state.market.outcomes,
                    marketTypeInfo: state.market.marketTypeInfo
                }
            }
        // Listen to edit market modal changes
        case actionTypes.SAVE_EDIT_MARKET_CHANGES_SUCCEEDED:
            if (true) { // create a new block scope
                const market = {...state.market};
                const payload = action.marketDetails;
                const marketStatusId = payload.marketDetails.marketStatusId;
                if (payload.marketId === market.id) {
                    const status = [...makeIterable(filterTypes.STANDARD_MARKET_STATUSES)]
                        .find(status => Number(status.value) === marketStatusId);
                    market.statusId = marketStatusId;
                    if (status) {
                        market.status = status.desc.toLowerCase();
                    }
                }
                return {...state, market }
            }
        case constants.UPDATE_MARKET_DETAILS_FAILED:
            return {
                ...state,
                isUpdatingMarketDetails: false,
                isUpdatingMarketDetailsFailed: true
            }

        case constants.UPDATE_MARKET_OUTCOMES:
            return {
                ...state,
                isUpdatingMarketOutcomes: true,
                isUpdatingMarketOutcomesFailed: false
            }
        case constants.UPDATE_MARKET_OUTCOMES_SUCCEEDED:
            return {
                ...state,
                isUpdatingMarketOutcomes: false,
                market: {
                    ...state.market,
                    outcomes: action.response
                },
                outcomes: action.response
            }
        case constants.UPDATE_MARKET_OUTCOMES_FAILED:
            return {
                ...state,
                isUpdatingMarketOutcomes: false,
                isUpdatingMarketOutcomesFailed: true
            }

        case constants.UPDATE_MARKET_BOOKS:
            return {
                ...state,
                isUpdatingMarketBooks: true,
                isUpdatingMarketBooksFailed: false
            }
        case constants.UPDATE_MARKET_BOOKS_SUCCEEDED:
            return {
                ...state,
                isUpdatingMarketBooks: false,
                updatedMarketBook: null
            }
        case constants.UPDATE_MARKET_BOOKS_FAILED:
            return {
                ...state,
                isUpdatingMarketBooks: false,
                isUpdatingMarketBooksFailed: true
            }

        case constants.FETCH_MARKET_BOOKS:
            return {
                ...state,
                isFetchingMarketBooks: true,
                isFetchingMarketBooksFailed: false
            }
        case constants.FETCH_MARKET_BOOKS_SUCCEEDED:
            return {
                ...state,
                isFetchingMarketBooks: false,
                marketBooks: action.response
            }
        case constants.FETCH_MARKET_BOOKS_FAILED:
            return {
                ...state,
                isFetchingMarketBooks: false,
                isFetchingMarketBooksFailed: true
            }

        case constants.FETCH_MARKET_TYPES:
            return {
                ...state,
                isFetchingMarketTypes: true,
                isFetchingMarketTypesFailed: false
            }
        case constants.FETCH_MARKET_TYPES_SUCCEEDED:
            return {
                ...state,
                isFetchingMarketTypes: false,
                marketTypes: action.response
            }
        case constants.FETCH_MARKET_TYPES_FAILED:
            return {
                ...state,
                isFetchingMarketTypes: false,
                isFetchingMarketTypesFailed: true
            }

        case constants.FETCH_MARKET_PLAYERS:
            return {
                ...state,
                isFetchingMarketPlayers: true,
                isFetchingMarketPlayersFailed: false
            }
        case constants.FETCH_MARKET_PLAYERS_SUCCEEDED:
            return {
                ...state,
                isFetchingMarketPlayers: false,
                marketPlayers: action.response
            }
        case constants.FETCH_MARKET_PLAYERS_FAILED:
            return {
                ...state,
                isFetchingMarketPlayers: false,
                isFetchingMarketPlayersFailed: true
            }

        case constants.FETCH_MARKET_PERIODS:
            return {
                ...state,
                isFetchingMarketPeriods: true,
                isFetchingMarketPeriodsFailed: false
            }
        case constants.FETCH_MARKET_PERIODS_SUCCEEDED:
            return {
                ...state,
                isFetchingMarketPeriods: false,
                marketPeriods: action.response,
            }
        case constants.FETCH_MARKET_PERIODS_FAILED:
            return {
                ...state,
                isFetchingMarketPeriods: false,
                isFetchingMarketPeriodsFailed: true
            }

        case constants.CREATE_NEW_MARKETS:
            return {
                ...state,
                isCreatingNewMarkets: true,
                isCreatingNewMarketsFailed: false
            }
        case constants.CREATE_NEW_MARKETS_SUCCEEDED:
            return {
                ...state,
                isCreatingNewMarkets: false
            }
        case constants.CREATE_NEW_MARKETS_FAILED:
            return {
                ...state,
                isCreatingNewMarkets: false,
                isCreatingNewMarketsFailed: true
            }

        case constants.DELETE_MARKET:
        case constants.DELETE_MARKETS:
            return {
                ...state,
                isDeletingMarket: true,
                isDeletingMarketFailed: false
            }
        case constants.DELETE_MARKET_SUCCEEDED:
            return {
                ...state,
                isDeletingMarket: false,
                market: {},
                outcomes: []
            }
        case constants.DELETE_MARKET_FAILED:
            return {
                ...state,
                isDeletingMarket: false,
                isDeletingMarketFailed: true
            }

        case constants.SET_NEW_MARKET_OUTCOMES:
            return {
                ...state,
                outcomes: [...action.outcomes]
            }

        case constants.SET_UPDATED_MARKET_BOOK:
            return {
                ...state,
                updatedMarketBook: action.book,
                hasSPBook: action.hasSPBook
            }
        case constants.CLEAR_UPDATED_MARKET_BOOK:
            return {
                ...state,
                updatedMarketBook: null
            }
        case constants.CLEAR_MARKET_TYPES:
            return {
                ...state,
                marketTypes: []
            }

        case constants.UPDATE_NEW_MARKET_PAYLOAD:
            return {
                ...state,
                newMarketPayload: {
                    ...state.newMarketPayload,
                    [action.id]: action.data
                }
            }
        case constants.RESET_NEW_MARKET_PAYLOAD:
            return {
                ...state,
                newMarketPayload: {}
            }
        case constants.SET_HIDE_OUTCOMES_ON_CREATE_OPTION:
            return {
                ...state,
                hideOutcomesOnCreate: action.hideOutcomesOnCreate
            }

        case constants.UPDATE_NEW_MARKET_FILTERS:
            return {
                ...state,
                newMarketFilters: {
                    ...state.newMarketFilters,
                    ...action.newMarketFilters
                }
            }

        case constants.RESET_NEW_MARKET_FILTERS:
            return {
                ...state,
                newMarketFilters: initialState.newMarketFilters,
            }

        case constants.FETCH_GAME_RESULT_PERIODS:
            return {
                ...state,
                isFetchingGameResultPeriods: true,
                isFetchingGameResultPeriodsFailed: false
            }
        case constants.FETCH_GAME_RESULT_PERIODS_SUCCEEDED:
            return {
                ...state,
                isFetchingGameResultPeriods: false,
                gameResultMarketPeriods : action.response
            }
        case constants.FETCH_GAME_RESULT_PERIODS_FAILED:
            return {
                ...state,
                isFetchingGameResultPeriods: false,
                isFetchingGameResultPeriodsFailed: true
            }

        case constants.FETCH_GAME_RESULT_MARKET_TYPES:
            return {
                ...state,
                isFetchingGameResultMarketTypes: true,
                isFetchingGameResultMarketTypesFailed: false
            }

        case constants.FETCH_GAME_RESULT_MARKET_TYPES_SUCCEEDED:
            return {
                ...state,
                isFetchingGameResultMarketTypes: false,
                gameResultMarketTypes: action.response
            }

        case constants.FETCH_GAME_RESULT_MARKET_TYPES_FAILED:
            return {
                ...state,
                isFetchingGameResultMarketTypes: false,
                isFetchingGameResultMarketTypesFailed: true
            }

        case constants.UPDATE_GAME_RESULT_FILTERS:
            return {
                ...state,
                gameResultMarketFilters : {
                    ...state.gameResultsFilters,
                    ...action.gameResultsFilters
                }
            }
        default:
            return {...state};
    }
}

export default eventCreatorEventMarkets;