import constants from './constants';

export function reset() {
    return {type: constants.RESET}
}

export function fetchEPT(sportId, parameters, options={}) {
    return {
        type: constants.FETCH_EPT,
        sportId,
        parameters,
        options
    }
}

export function fetchRestrictionEPT(code) {
    return {
        type: constants.FETCH_RESTRICTION_EPT,
        code
    }
}

export function fetchEventMarkets(eventId, parameters, options={}) {
    return {
        type: constants.FETCH_EVENT_MARKETS,
        eventId,
        parameters,
        options
    }
}

export function updatePath(id, data) {
    return {
        type: constants.UPDATE_PATH,
        id,
        data
    }
}
export function updatePaths(pathsArray) {
    return {
        type: constants.UPDATE_PATHS,
        pathsArray
    }
}
export function updateActiveSportCodeAndId(activeSportId, activeSportCode) {
    return {
        type: constants.UPDATE_ACTIVE_SPORT_CODE_AND_ID,
        activeSportId,
        activeSportCode
    }
}
export function updateActivePathId(activePathId) {
    return {
        type: constants.UPDATE_ACTIVE_PATH_ID,
        activePathId,
    }
}
export function updateActivePathAncestors(activePathAncestors) {
    return {
        type: constants.UPDATE_ACTIVE_PATH_ANCESTORS,
        activePathAncestors,
    }
}
export function updateToggleState(toggleState) {
    return {
        type: constants.UPDATE_TOGGLE_STATE,
        toggleState
    }
}
export function updateFilterState(isFiltered) {
    return {
        type: constants.UPDATE_FILTER_STATE,
        isFiltered
    }
}
export function updateSortState(isSorted) {
    return {
        type: constants.UPDATE_SORT_STATE,
        isSorted
    }
}
export function setDatesFilter(datesFilter) {
    return {
        type: constants.SET_DATES_FILTER,
        datesFilter,
    }
}
export function setMarketStatusFilter(marketStatusFilter) {
    return {
        type: constants.SET_MARKET_STATUS_FILTER,
        marketStatusFilter,
    }
}
export function updateSearchStr(searchStr) {
    return {
        type: constants.UPDATE_SEARCH_STR,
        searchStr,
    }
}
export function updatePathBaseUrl(baseUrl) {
    return {
        type: constants.UPDATE_PATH_BASE_URL,
        baseUrl,
    }
}
export function createPath(id, data) { // creates a new path placeholder
    return {
        type: constants.CREATE_PATH,
        id,
        data
    }
}
export function finalizePath(id, data) { // finalize path placeholder with correct data
    return {
        type: constants.FINALIZE_PATH,
        id,
        data
    }
}
export function deletePath(id) {
    return {
        type: constants.DELETE_PATH,
        id,
    }
}
export function deletePaths(ids) {
    return {
        type: constants.DELETE_PATHS,
        ids,
    }
}
export function setNewPathsOrder(pathsOrder) {
    return {
        type: constants.SET_NEW_PATHS_ORDER,
        pathsOrder,
    }
}
export function saveNewPathsOrder(pathsOrder) {
    return {
        type: constants.SAVE_NEW_PATHS_ORDER,
        pathsOrder,
    }
}
export function setAsFirstLoad(isFirstLoad) {
    return {
        type: constants.SET_AS_FIRST_LOAD,
        isFirstLoad,
    }
}
export function addToPathSelections(path) {
    return {
        type: constants.ADD_PATH_TO_SELECTIONS,
        path,
    }
}
export function removeFromPathSelections(path) {
    return {
        type: constants.REMOVE_PATH_FROM_SELECTIONS,
        path,
    }
}
export function removeIdsfromPathSelections(ids) {
    return {
        type: constants.REMOVE_IDS_FROM_SELECTIONS,
        ids,
    }
}

export function updateConfig(config) {
    return {
        type: constants.UPDATE_CONFIG,
        config
    }
}

export function setParameters(parameters) {
    return {
        type: constants.SET_PARAMETERS,
        parameters,
    }
}

export function setDefaultParams(defaultParams) {
    return {
        type: constants.SET_DEFAULT_PARAMETERS,
        defaultParams,
    }
}

export function setDatesParamFormat(datesParamFormat) {
    return {
        type: constants.SET_DATES_PARAM_FORMAT,
        datesParamFormat,
    }
}

export function setInitialStateProps(props) {
    return {
        type: constants.SET_INITIAL_STATE_PROPS,
        props,
    }
}

