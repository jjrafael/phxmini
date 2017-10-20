import actionTypes from '../constants';

const initialState = {
    selectedEventId: null,
    eventDetails: {},
    isFetchingEventDetails: null,
    fetchingEventDetailsFailed: null,
    isChangingStatus: null,
    changingStatusFailed: null,
    isAbandoningMarkets: null,
    abandoningMarketsFailed: null,
    isFetchingMarketPeriodDetails : null,
    isFetchingMarketPeriodDetailsFailed : null,
    periodDetails : {},
    isUpdatingCutOffAndAutoOpenDateTime : null,
    isUpdatingCutOffAndAutoOpenDateTimeFailed : null
};

export default function (state = initialState, action) {
    switch (action.type) {
        case actionTypes.VIEW_MARKET_STATE_DETAILS:
            return { ...state,  selectedEventId: action.id };
        case actionTypes.FETCH_EVENT_DETAILS:
            return { ...state,  isFetchingEventDetails: true, fetchingEventDetailsFailed: false };
        case actionTypes.FETCH_EVENT_DETAILS_SUCCEEDED:
            return { ...state,  isFetchingEventDetails: false, eventDetails: action.eventDetails };
        case actionTypes.FETCH_EVENT_DETAILS_FAILED:
            return { ...state,  isFetchingEventDetails: false, fetchingEventDetailsFailed: true, eventDetails: {} };
        case actionTypes.CHANGE_MARKETS_STATUS:
            return { ...state, isChangingStatus: true, changingStatusFailed: false };
        case actionTypes.CHANGE_MARKETS_STATUS_SUCCEEDED:
            return { ...state, isChangingStatus: false };
        case actionTypes.CHANGE_MARKETS_STATUS_FAILED:
            return { ...state, isChangingStatus: false, changingStatusFailed: true };
        case actionTypes.ABANDON_MARKETS:
            return { ...state, isAbandoningMarkets: true, abandoningMarketsFailed: false };
        case actionTypes.ABANDON_MARKETS_SUCCEEDED:
            return { ...state, isAbandoningMarkets: false };
        case actionTypes.ABANDON_MARKETS_FAILED:
            return { ...state, isAbandoningMarkets: false, abandoningMarketsFailed: true };
        case actionTypes.FETCH_MARKET_PERIOD_DETAILS:
            return { ...state, isFetchingMarketPeriodDetails: true, isFetchingMarketPeriodDetailsFailed: false };
        case actionTypes.FETCH_MARKET_PERIOD_DETAILS_SUCCEEDED:
            return { ...state, isFetchingMarketPeriodDetails: false, periodDetails : action.periodDetails };
        case actionTypes.FETCH_MARKET_PERIOD_DETAILS_FAILED:
            return { ...state, isFetchingMarketPeriodDetails: false, isFetchingMarketPeriodDetailsFailed: true };
        case actionTypes.UPDATE_MARKET_CUTOFF_AND_AUTOOPEN_DATETIME:
            return { ...state, isUpdatingCutOffAndAutoOpenDateTime: true, isUpdatingCutOffAndAutoOpenDateTimeFailed: false };
        case actionTypes.UPDATE_MARKET_CUTOFF_AND_AUTOOPEN_DATETIME_SUCCEEDED:
            return { ...state, isUpdatingCutOffAndAutoOpenDateTime: false, response : action.response };
        case actionTypes.UPDATE_MARKET_CUTOFF_AND_AUTOOPEN_DATETIME_FAILED:
            return { ...state, isUpdatingCutOffAndAutoOpenDateTime: false, isUpdatingCutOffAndAutoOpenDateTimeFailed: true };
        default:
            return { ...state };
    }
}