import filterTypes from 'constants/filterTypes';
import moment from 'moment';
import { getNext7DayText, getLast7DayText, getLastMonthText } from 'phxUtils';


export default {
    RESET: 'EPT::RESET',
    FETCH_EPT: 'EPT::FETCH_EPT',
    FETCH_RESTRICTION_EPT: 'EPT::FETCH_RESTRICTION_EPT',
    FETCH_EPT_SUCCEEDED: 'EPT::FETCH_EPT_SUCCEEDED',
    FETCH_EPT_FAILED: 'EPT::FETCH_EPT_FAILED',

    FETCH_EVENT_MARKETS: 'EPT::FETCH_EVENT_MARKETS',
    FETCH_EVENT_MARKETS_SUCCEEDED: 'EPT::FETCH_EVENT_MARKETS_SUCCEEDED',
    FETCH_EVENT_MARKETS_FAILED: 'EPT::FETCH_EVENT_MARKETS_FAILED',

    SAVE_NEW_PATHS_ORDER: 'EPT::SAVE_NEW_PATHS_ORDER',
    SAVE_NEW_PATHS_ORDER_SUCCEEDED: 'EPT::SAVE_NEW_PATHS_ORDER_SUCCEEDED',
    SAVE_NEW_PATHS_ORDER_FAILED: 'EPT::SAVE_NEW_PATHS_ORDER_FAILED',

    UPDATE_PATH: 'EPT::UPDATE_PATH',
    UPDATE_PATHS: 'EPT::UPDATE_PATHS',
    UPDATE_ACTIVE_SPORT_CODE_AND_ID: 'EPT::UPDATE_ACTIVE_SPORT_CODE_AND_ID',
    UPDATE_ACTIVE_PATH_ID: 'EPT::UPDATE_ACTIVE_PATH_ID',
    UPDATE_ACTIVE_PATH_ANCESTORS: 'EPT::UPDATE_ACTIVE_PATH_ANCESTORS',
    UPDATE_TOGGLE_STATE: 'EPT::UPDATE_TOGGLE_STATE',
    UPDATE_FILTER_STATE: 'EPT::UPDATE_FILTER_STATE',
    UPDATE_SORT_STATE: 'EPT::UPDATE_SORT_STATE',
    UPDATE_SEARCH_STR: 'EPT::UPDATE_SEARCH_STR',
    UPDATE_CONFIG: 'EPT::UPDATE_CONFIG',

    CREATE_PATH: 'EPT::CREATE_PATH',
    FINALIZE_PATH: 'EPT::FINALIZE_PATH',
    DELETE_PATH: 'EPT::DELETE_PATH',
    DELETE_PATHS: 'EPT::DELETE_PATHS',
    SET_NEW_PATHS_ORDER: 'EPT::SET_NEW_PATHS_ORDER',

    SET_DATES_FILTER: 'EPT::SET_DATES_FILTER',
    SET_MARKET_STATUS_FILTER: 'EPT::SET_MARKET_STATUS_FILTER',
    UPDATE_PATH_BASE_URL: 'EPT::UPDATE_PATH_BASE_URL',
    SET_AS_FIRST_LOAD: 'SET_AS_FIRST_LOAD',

    ADD_PATH_TO_SELECTIONS: 'EPT::ADD_PATH_TO_SELECTIONS',
    REMOVE_PATH_FROM_SELECTIONS: 'EPT::REMOVE_PATH_FROM_SELECTIONS',
    REMOVE_IDS_FROM_SELECTIONS: 'EPT::REMOVE_IDS_FROM_SELECTIONS',

    SET_PARAMETERS: 'EPT::SET_PARAMETERS',
    SET_DEFAULT_PARAMETERS: 'EPT::SET_DEFAULT_PARAMETERS',
    SET_DATES_PARAM_FORMAT: 'EPT::SET_DATES_PARAM_FORMAT',
    SET_INITIAL_STATE_PROPS: 'EPT::SET_INITIAL_STATE_PROPS'
}

let dates = filterTypes.DATES
let otherDates = filterTypes.OTHER_DATES;

export const availableDates = [
    `${dates.NEXT_7_DAYS} (${getNext7DayText()})`,
    dates.TODAY,
    dates.TOMORROW,
    dates.FUTURE,
    dates.YESTERDAY,
    `${otherDates.LAST_7_DAYS} (${getLast7DayText()})`,
    `${otherDates.LAST_MONTH} (${getLastMonthText()})`,
    dates.CUSTOM,
];

export const riskAvailableDates = [
    dates.ALL_DATES,
    `${dates.NEXT_7_DAYS} (${getNext7DayText()})`,
    dates.TODAY,
    dates.TOMORROW,
    dates.FUTURE,
    dates.YESTERDAY,
    dates.CUSTOM,
];
export const DUMMY_ID = -123456789;