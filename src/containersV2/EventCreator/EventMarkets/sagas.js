import constants from './constants';
import { put, call, fork, select } from 'redux-saga/effects';
import { takeLatest, takeEvery, delay } from 'redux-saga';
import { push, replace } from 'react-router-redux';
import httpMethods from 'phxConstants/httpMethods';
import { parseErrorMessageInXhr } from 'phxServices/apiUtils';
import * as API from './services';
import { reFetchMarket, fetchMarketPlayers } from './actions';
import { updatePath, fetchEventMarkets, deletePath, deletePaths } from '../../SportsTree/actions';
import { toastr } from 'phxComponents/toastr/index';

function* getMarkets(action) {
    const {response, xhr} = yield call(API.fetchMarkets, action.eventId);
    if(response) {
        yield put({type: constants.FETCH_MARKETS_SUCCEEDED, response:response});
    } else {
        yield put({type: constants.FETCH_MARKETS_FAILED});
    }
};

function* getMarket(action) {
    const {response, xhr} = yield call(API.fetchMarket, action.marketId);
    if (response) {
        yield put({type: constants.FETCH_MARKET_SUCCEEDED, response:response});
    } else {
        yield put({type: constants.FETCH_MARKET_FAILED});
    }
};

function* getMarketBooks(action) {
    const {response, xhr} = yield call(API.fetchMarketBooks, action.marketId);
    if (response) {
        yield put({type: constants.FETCH_MARKET_BOOKS_SUCCEEDED, response:response});
    } else {
        yield put({type: constants.FETCH_MARKET_BOOKS_FAILED});
    }
};

function* getMarketTypes(action) {
    const {response, xhr} = yield call(API.fetchMarketTypes, action.eventId);
    if (response) {
        yield put({type: constants.FETCH_MARKET_TYPES_SUCCEEDED, response:response});
    } else {
        yield put({type: constants.FETCH_MARKET_TYPES_FAILED});
    }
};

function* getMarketPlayers(action) {
    const {response, xhr, eventId} = yield call(API.fetchMarketPlayers, action.players, action.eventId);
    if (response) {
        yield put({type: constants.FETCH_MARKET_PLAYERS_SUCCEEDED, response:response, eventId});
    } else {
        yield put({type: constants.FETCH_MARKET_PLAYERS_FAILED});
    }
};

function* getMarketPeriods(action) {
    const {response, xhr} = yield call(API.fetchMarketPeriods, action.eventId);
    if (response) {
        yield put({type: constants.FETCH_MARKET_PERIODS_SUCCEEDED, response:response});
    } else {
        yield put({type: constants.FETCH_MARKET_PERIODS_FAILED});
    }
};

function* updateMarketDetails(action) {
    const {response, xhr} = yield call(API.updateMarketDetails, action.marketId, action.data);
    if (response) {
        yield put({type: constants.UPDATE_MARKET_DETAILS_SUCCEEDED, response:response});
        toastr.add({message: `Successfully updated market details.`});
        yield put(updatePath(response.id, {
            statusId: response.statusId,
            description: response.description,
            cutOffTime: response.cutoffTime // has different "cut off time" props
        }));
    } else {
        const msg = parseErrorMessageInXhr(httpMethods.HTTP_POST, xhr);
        yield put({type: constants.UPDATE_MARKET_DETAILS_FAILED});
        toastr.add({message: `Unable to update market details. ${msg}`, type: 'ERROR'});
    }
};

function* updateMarketOutcomes(action) {
    const {response, xhr} = yield call(API.updateMarketOutcomes, action.marketId, action.data);
    if (response) {
        yield put({type: constants.UPDATE_MARKET_OUTCOMES_SUCCEEDED, response:response});
        toastr.add({message: `Successfully updated market outcomes.`});
    } else {
        const msg = parseErrorMessageInXhr(httpMethods.HTTP_POST, xhr);
        yield put({type: constants.UPDATE_MARKET_OUTCOMES_FAILED});
        toastr.add({message: `Unable to update market outcomes. ${msg}`, type: 'ERROR'});
    }
};

function* updateMarketBooks(action) {
    const {response, xhr} = yield call(API.updateMarketBooks, action.marketId, action.data);
    if (response) {
        yield put({type: constants.UPDATE_MARKET_BOOKS_SUCCEEDED, response:response});
        toastr.add({message: `Successfully updated market books.`});
        yield put(reFetchMarket(action.marketId));
    } else {
        const msg = parseErrorMessageInXhr(httpMethods.HTTP_POST, xhr);
        yield put({type: constants.UPDATE_MARKET_BOOKS_FAILED});
        toastr.add({message: `Unable to update market books. ${msg}`, type: 'ERROR'});
    }
};

function* createNewMarkets(action) {
    const {response, xhr} = yield call(API.createNewMarkets, action.eventId, action.data, action.hideOutcomesOnCreate);
    if (response) {
        yield put({type: constants.CREATE_NEW_MARKETS_SUCCEEDED, response:response});
        toastr.add({message: `Successfully created new markets.`});
        const { parameters } = yield select(state => state.sportsTree);
        yield put(fetchEventMarkets(action.eventId, parameters, {updateEventMarketCount: true}))
    } else {
        const msg = parseErrorMessageInXhr(httpMethods.HTTP_POST, xhr);
        yield put({type: constants.CREATE_NEW_MARKETS_FAILED});
        toastr.add({message: `Unable to create new markets. ${msg}`, type: 'ERROR'});
    }
};

function* deleteMarket(action) {
    const {response, xhr} = yield call(API.deleteMarket, action.marketId);
    if (response) {
        yield put({type: constants.DELETE_MARKET_SUCCEEDED});
        toastr.add({message: `Market successfully deleted.`});
        let { pathsMap } = yield select(state => state.sportsTree);
        let path = pathsMap[action.marketId];
        let parentPath = pathsMap[path.parentId];
        yield put(replace(parentPath.url)); // replace history state with parent path's url
        yield put(deletePath(action.marketId));
    } else {
        const msg = parseErrorMessageInXhr(httpMethods.HTTP_DELETE, xhr);
        yield put({type: constants.DELETE_MARKET_FAILED});
        toastr.add({message: `Unable to delete market. ${msg}`, type: 'ERROR'});
    }
};

function* deleteMarkets(action) {
    const {response, xhr} = yield call(API.deleteMarkets, action.marketIds);
    if (response) {
        yield put({type: constants.DELETE_MARKET_SUCCEEDED});
        toastr.add({message: `Markets successfully deleted.`});
        let { pathsMap, activePathId } = yield select(state => state.sportsTree);
        if (action.marketIds.includes(activePathId)) {
            let path = pathsMap[activePathId];
            let parentPath = pathsMap[path.parentId];
            yield put(replace(parentPath.url)); // replace history state with parent path's url
        }
        yield put(deletePaths(action.marketIds));
    } else {
        const msg = parseErrorMessageInXhr(httpMethods.HTTP_DELETE, xhr);
        yield put({type: constants.DELETE_MARKET_FAILED});
        toastr.add({message: `Unable to delete market. ${msg}`, type: 'ERROR'});
    }
};

function* getGameResultPeriods(action) {
    const {response, xhr} = yield call(API.fetchMarketPeriods, action.eventId);
    if (response) {
        yield put({type: constants.FETCH_GAME_RESULT_PERIODS_SUCCEEDED, response:response});
    } else {
        yield put({type: constants.FETCH_GAME_RESULT_PERIODS_FAILED});
    }
};

function* getGameResultMarketTypes(action) {
    const {response, xhr} = yield call(API.fetchMarketTypes, action.eventId);
    if (response) {
        yield put({type: constants.FETCH_GAME_RESULT_MARKET_TYPES_SUCCEEDED, response:response});
    } else {
        yield put({type: constants.FETCH_GAME_RESULT_MARKET_TYPES_FAILED});
    }
};

export default function* eventMarketsSaga() {
    yield takeLatest(constants.CREATE_NEW_MARKETS, createNewMarkets);
    yield takeLatest(constants.FETCH_MARKETS, getMarkets);
    yield takeLatest(constants.FETCH_MARKET, getMarket);
    yield takeLatest(constants.REFETCH_MARKET, getMarket);
    yield takeLatest(constants.FETCH_MARKET_BOOKS, getMarketBooks);
    yield takeLatest(constants.FETCH_MARKET_TYPES, getMarketTypes);
    yield takeLatest(constants.FETCH_MARKET_PLAYERS, getMarketPlayers);
    yield takeLatest(constants.FETCH_MARKET_PERIODS, getMarketPeriods);
    yield takeLatest(constants.UPDATE_MARKET_DETAILS, updateMarketDetails);
    yield takeLatest(constants.UPDATE_MARKET_OUTCOMES, updateMarketOutcomes);
    yield takeLatest(constants.UPDATE_MARKET_BOOKS, updateMarketBooks);
    yield takeLatest(constants.DELETE_MARKET, deleteMarket);
    yield takeLatest(constants.DELETE_MARKETS, deleteMarkets);
    yield takeLatest(constants.FETCH_GAME_RESULT_PERIODS, getGameResultPeriods);
    yield takeLatest(constants.FETCH_GAME_RESULT_MARKET_TYPES, getGameResultMarketTypes);
}