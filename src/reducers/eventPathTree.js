import actionTypes from '../constants';
import channelConfig from '../configs/channelConfig';

const initialState = {
    tree: [],
    selectedSport: null,
    selectingSport: null,
    selectingSportFailed: null,
    isLoadingTree: null,
    isLoadingTreeFailed: null,
    isTreeEmpty: null,
    activeCode: null,
    markets: {},
    eventIdsFetchingMarkets: [],
    eventIdsFailedFetchingMarkets: [],
};

function removeItemFromArray(item, array) {
    return array.filter(function(i) {
        return i != item
    });
}

export default function (state = initialState, action) {
    switch (action.type) {
        case actionTypes.FETCH_EVENT_PATH_TREE:
            return { ...state, isLoadingTree: true, isLoadingTreeFailed: false };
        case actionTypes.FETCH_EVENT_PATH_TREE_SUCCEEDED:
            return { ...state, tree: action.tree, isLoadingTree: false, isLoadingTreeFailed: false };
        case actionTypes.FETCH_EVENT_PATH_TREE_FAILED:
            return { ...state, isLoadingTreeFailed: true, isLoadingTree: false };

        case actionTypes.SELECT_EVENT_PATH_TREE_SPORT:
            return { ...state, selectingSport: true, selectingSportFailed: false };
        case actionTypes.SELECT_EVENT_PATH_TREE_SPORT_SUCCEEDED:
            return { ...state, selectedSport: action.sport, selectingSport: false };
        case actionTypes.SELECT_EVENT_PATH_TREE_SPORT_FAILED:
            return { ...state, selectingSportFailed: true, selectingSport: false };

        case actionTypes.FETCH_EVENT_MARKETS:
            return {
                ...state,
                eventIdsFetchingMarkets: [ ...state.eventIdsFetchingMarkets, action.eventId ],
                eventIdsFailedFetchingMarkets: removeItemFromArray(action.eventId, state.eventIdsFailedFetchingMarkets),
                markets: {
                    ...state.markets,
                    [action.eventId]: []
                }
            };
        case actionTypes.FETCH_EVENT_MARKETS_SUCCEEDED:
            return {
                ...state,
                eventIdsFetchingMarkets: removeItemFromArray(action.eventId, state.eventIdsFetchingMarkets),
                markets: {
                    ...state.markets,
                    [action.eventId]: action.markets
                }
            };
        case actionTypes.FETCH_EVENT_MARKETS_FAILED:
            return {
                ...state,
                eventIdsFetchingMarkets: removeItemFromArray(action.eventId, state.eventIdsFetchingMarkets),
                eventIdsFailedFetchingMarkets: [ ...state.eventIdsFailedFetchingMarkets, action.eventId],
            };
        case actionTypes.FETCH_EVENT_MARKETS_CANCEL:
            return {
                ...state,
                eventIdsFetchingMarkets: removeItemFromArray(action.eventId, state.eventIdsFetchingMarkets)
            };

        case actionTypes.SEARCH_EVENT_PATH_TREE_SUCCEEDED:
            return { ...state, selectedSport: action.result };

        case actionTypes.RESET_EVENT_PATH_TREE:
            return { ...initialState };
        default:
            return { ...state };
    }
}