import constants from './constants';

export function fetchMarkets(eventId) {
    return {
        type: constants.FETCH_MARKETS,
        eventId
    }
}

export function fetchMarket(marketId) {
    return {
        type: constants.FETCH_MARKET,
        marketId
    }
}

export function reFetchMarket(marketId) {
    return {
        type: constants.REFETCH_MARKET,
        marketId
    }
}

export function updateMarketDetails(marketId, data) {
    return {
        type: constants.UPDATE_MARKET_DETAILS,
        marketId,
        data
    }
}

export function updateMarketOutcomes(marketId, data) {
    return {
        type: constants.UPDATE_MARKET_OUTCOMES,
        marketId,
        data
    }
}

export function setNewMarketOutcomes(outcomes) {
    return {
        type: constants.SET_NEW_MARKET_OUTCOMES,
        outcomes
    }
}

export function deleteMarket(marketId) {
    return {
        type: constants.DELETE_MARKET,
        marketId
    }
}
export function deleteMarkets(marketIds) {
    return {
        type: constants.DELETE_MARKETS,
        marketIds
    }
}

export function setUpdatedMarketBook(book, hasSPBook) {
    return {
        type: constants.SET_UPDATED_MARKET_BOOK,
        book,
        hasSPBook
    }
}
export function clearUpdatedMarketBook() {
    return {
        type: constants.CLEAR_UPDATED_MARKET_BOOK,
    }
}
export function updateMarketBooks(marketId, data) {
    return {
        type: constants.UPDATE_MARKET_BOOKS,
        marketId,
        data
    }
}
export function fetchMarketBooks(marketId) {
    return {
        type: constants.FETCH_MARKET_BOOKS,
        marketId
    }
}
export function fetchMarketTypes(eventId) {
    return {
        type: constants.FETCH_MARKET_TYPES,
        eventId
    }
}
export function fetchMarketPeriods(eventId) {
    return {
        type: constants.FETCH_MARKET_PERIODS,
        eventId
    }
}
export function clearMarketTypes() {
    return {
        type: constants.CLEAR_MARKET_TYPES,
    }
}
export function fetchMarketPlayers(players, eventId) {
    return {
        type: constants.FETCH_MARKET_PLAYERS,
        players,
        eventId
    }
}
export function createNewMarkets(eventId, data, hideOutcomesOnCreate) {
    return {
        type: constants.CREATE_NEW_MARKETS,
        eventId,
        data,
        hideOutcomesOnCreate
    }
}
export function updateNewMarketPayload(id, data) {
    return {
        type: constants.UPDATE_NEW_MARKET_PAYLOAD,
        id,
        data
    }
}
export function setHideOutcomesOnCreateOption(hideOutcomesOnCreate) {
    return {
        type: constants.SET_HIDE_OUTCOMES_ON_CREATE_OPTION,
        hideOutcomesOnCreate
    }
}
export function resetNewMarketPayload() {
    return {
        type: constants.RESET_NEW_MARKET_PAYLOAD,
    }
}
export function updateNewMarketFilters(newMarketFilters) {
    return {
        type: constants.UPDATE_NEW_MARKET_FILTERS,
        newMarketFilters
    }
}
export function resetNewMarketFilters() {
    return {
        type: constants.RESET_NEW_MARKET_FILTERS,
    }
}

export function fetchGameResultPeriods(eventId) {
    return {
        type: constants.FETCH_GAME_RESULT_PERIODS,
        eventId
    }
}

export function fetchGameResultMarketTypes(eventId) {
    return {
        type: constants.FETCH_GAME_RESULT_MARKET_TYPES,
        eventId
    }
}

export function updateGameResultsFilters(gameResultsFilters) {
    return {
        type: constants.UPDATE_GAME_RESULT_FILTERS,
        gameResultsFilters
    }
}
