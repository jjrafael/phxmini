import constants, { paths } from './constants';

const buttonConfig = {
    [paths.SPORT]: ['EVENT'],
    [paths.COUNTRY]: ['EVENT', 'RANKEVENT', 'GAMEEVENT'],
    [paths.LEAGUE]: ['RANKEVENT', 'GAMEEVENT'],
    [paths.LEAGUE_NEWGAME]: [],
    [paths.LEAGUE_NEWRANK]: [],
    [paths.GAME_EVENT]: ['MARKET', 'EDITMARKET'],
    [paths.RANK_EVENT]: ['MARKET', 'EDITMARKET'],
    [paths.MARKET]: ['MARKET', 'EDITMARKET'],
}

export function enableHeaderButtons(type) {
    if([paths.SPORT,
        paths.COUNTRY,
        paths.LEAGUE,
        paths.GAME_EVENT,
        paths.RANK_EVENT,
        paths.LEAGUE_NEWGAME,
        paths.LEAGUE_NEWRANK,
        paths.MARKET
    ].includes(type)) {
        return {
            type: constants.UPDATE_HEADER_BUTTONS,
            activePage: type,
            enableHeaderButtons: buttonConfig[type]
        }
    }
}

export function selectPath(path) {
    return {
        type: constants.SELECT_EVENT_CREATOR_PATH,
        path
    }
}

export function clearSelectedPath() {
    return {
        type: constants.CLEAR_SELECTED_EVENT_CREATOR_PATH,
    }
}

export function fetchSportOtherOptions(code) {
    return {
        type: constants.FETCH_SPORT_OTHER_OPTIONS,
        code
    }
}

export function updateSaveButtonState(isSaveButtonDisabled) {
    return {
        type: constants.UPDATE_SAVE_BUTTON_STATE,
        isSaveButtonDisabled
    }
}

export function toggleBulkUpdate(isBulkUpdateActive) {
    return {
        type: constants.TOGGLE_BULK_UPDATE,
        isBulkUpdateActive
    }
}