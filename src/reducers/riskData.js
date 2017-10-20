import actionTypes from '../constants';

const initialState = {
    isLoadingTree: null,
    isUpdatingTree: null,
    isUpdatingTreeFailed: null,
    isLoadingTreeFailed: null,
    collapsedEvents: [],
    fetchingChunkIds: []
};

export default function (state = initialState, action) {
    switch (action.type) {
        case actionTypes.FETCH_CHUNK_RISK_DATA:
            return { ...state, fetchingChunkIds: [ ...state.fetchingChunkIds, action.key ] };
        case actionTypes.FETCH_CHUNK_RISK_DATA_SUCCEEDED:
        case actionTypes.FETCH_CHUNK_RISK_DATA_FAILED:
            const chunkIdIndex = state.fetchingChunkIds.indexOf(action.key);
            return {
                ...state, fetchingChunkIds: [
                    ...state.fetchingChunkIds.slice(0, chunkIdIndex),
                    ...state.fetchingChunkIds.slice(chunkIdIndex + 1)
                ]
            }
        case actionTypes.FETCH_RISK_DATA:
            return { ...state, isLoadingTree: true, isLoadingTreeFailed: false, isUpdatingTreeFailed: false, hasUpdates: false };
        case actionTypes.SET_RISK_FILTER_MARKET:
        case actionTypes.SET_RISK_FILTER_PERIOD:
        case actionTypes.SEARCH_EVENTS:
            return { ...state, isLoadingTree: true, isLoadingTreeFailed: false, isUpdatingTreeFailed: false };
        case actionTypes.FETCH_RISK_DATA_SUCCEEDED:
            return { ...state, isLoadingTree: false, isLoadingTreeFailed: false, hasUpdates: action.hasUpdates ? true : false };
        case actionTypes.FETCH_RISK_DATA_FAILED:
            return { ...state, isLoadingTreeFailed: true, isLoadingTree: false, hasUpdates: false };
        case actionTypes.UPDATE_RISK_DATA:
            return { ...state, isUpdatingTreeFailed: false, isUpdatingTree: true, hasUpdates: false };
        case actionTypes.UPDATE_RISK_DATA_SUCCEEDED:
        case actionTypes.FETCH_CHUNK_RISK_DATA:
        case actionTypes.CANCEL_UPDATE_RISK_DATA:
            return { ...state, isUpdatingTree: false, isUpdatingTreeFailed: false, isLoadingTreeFailed: false, hasUpdates: action.hasUpdates };
        case actionTypes.UPDATE_RISK_DATA_FAILED:
            return { ...state, isUpdatingTree: false, isUpdatingTreeFailed: true };
        case actionTypes.CLEAR_RISK_DATA:
            return { ...state, isLoadingTreeFailed: false, isLoadingTree: false };
        case actionTypes.EXPAND_ALL_EVENTS:
            return { ...state, collapsedEvents: [] };
        case actionTypes.COLLAPSE_EVENT:
            return { ...state, collapsedEvents: [...state.collapsedEvents, action.eventId] };
        case actionTypes.EXPAND_EVENT:
            const index = state.collapsedEvents.indexOf(action.eventId);
            return {
                ...state, collapsedEvents: [
                    ...state.collapsedEvents.slice(0, index),
                    ...state.collapsedEvents.slice(index + 1)
                ]
            };
        default:
            return { ...state };
    }
}