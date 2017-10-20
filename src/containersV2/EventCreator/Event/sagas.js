import constants from './constants';
import { fetchEventDefaultMarket, fetchEventSelectedOpponents } from './actions';
import { put, call, fork, select } from 'redux-saga/effects';
import { push, replace } from 'react-router-redux';
import { takeLatest, takeEvery, delay } from 'redux-saga';
import httpMethods from 'phxConstants/httpMethods';
import { parseErrorMessageInXhr } from 'phxServices/apiUtils';
import { fetchMarketPlayers } from '../EventMarkets/actions';
import { toggleBulkUpdate } from '../App/actions';
import { updatePath, finalizePath, deletePath, fetchEventMarkets, deletePaths } from '../../SportsTree/actions';
import * as API from './services';
import _ from 'underscore';
import { toastr } from 'phxComponents/toastr/index';

function* getEvent(action) {
    // const {response, xhr} = yield call(API.fetchEvent, action.eventPathId, action.eventId);
    const {response, xhr} = yield call(API.fetchEvent, action.eventId);
    if(response) {
        const eventPathId = _.last(response.eventPaths).id;
        yield call(getOpponents, {eventPathId});
        yield put({type: constants.FETCH_EVENT_SUCCEEDED, response:response});
        if (action.isRankEvent) {
            yield put(fetchEventDefaultMarket(action.eventId));
        }
    } else {
        yield put({type: constants.FETCH_EVENT_FAILED});
    }
};

function* getEventDefaultMarket(action) {
    const {response, xhr} = yield call(API.fetchEventDefaultMarket, action.eventId);
    if (response) {
        yield put({type: constants.FETCH_EVENT_DEFAULT_MARKET_SUCCEEDED, response:response});
        yield put(fetchEventSelectedOpponents(response.id, action.eventId));
    } else {
        yield put({type: constants.FETCH_EVENT_DEFAULT_MARKET_FAILED});
    }
}

function* getEventSelectedOpponents(action) {
    const {response, xhr} = yield call(API.fetchEventSelectedOpponents, action.marketId, action.eventId);
    if (response) {
        yield put({type: constants.FETCH_EVENT_SELECTED_OPPONENTS_SUCCEEDED, response:response, eventId: action.eventId});
    } else {
        yield put({type: constants.FETCH_EVENT_SELECTED_OPPONENTS_FAILED});
    }
}

function* deleteEvent(action) {
    const {response, xhr} = yield call(API.deleteEvent, action.eventId);
    if(response) {
        yield put({type: constants.DELETE_EVENT_SUCCEEDED, response:response});
        toastr.add({message: `Event successfully deleted.`});
        let { pathsMap } = yield select(state => state.sportsTree);
        let path = pathsMap[action.eventId];
        let parentPath = pathsMap[path.parentId];
        yield put(replace(parentPath.url)); // replace history state with parent path's url
        yield put(deletePath(action.eventId));
    } else {
        const msg = parseErrorMessageInXhr(httpMethods.HTTP_DELETE, xhr);
        yield put({type: constants.DELETE_EVENT_FAILED});
        toastr.add({message: `Unable to delete event. ${msg}`, type: 'ERROR'});
    }
};

function* deleteEvents(action) {
    const {response, xhr} = yield call(API.deleteEvents, action.eventIds);
    if(response) {
        yield put({type: constants.DELETE_EVENT_SUCCEEDED, response:response});
        toastr.add({message: `Events successfully deleted.`});
        let { pathsMap, activePathId } = yield select(state => state.sportsTree);
        if (action.eventIds.includes(activePathId)) {
            let path = pathsMap[activePathId];
            let parentPath = pathsMap[path.parentId];
            yield put(replace(parentPath.url)); // replace history state with parent path's url
        }
        yield put(deletePaths(action.eventIds));
        yield put(toggleBulkUpdate(false));
    } else {
        const msg = parseErrorMessageInXhr(httpMethods.HTTP_DELETE, xhr);
        yield put({type: constants.DELETE_EVENT_FAILED});
        toastr.add({message: `Unable to delete event. ${msg}`, type: 'ERROR'});
    }
};

function* createEvent(action) {
    const {response, xhr} = yield call(API.createEvent, action.eventPathId, action.data);
    if(response) {
        yield put({type: constants.CREATE_EVENT_SUCCEEDED, response:response});
        toastr.add({message: `Successfully created ${response.description}.`});
        yield put(finalizePath(response.id, {
            id: response.id,
            parentId: action.eventPathId,
            description: response.description,
            startTime: response.startDateTime
        }));
        let { pathsMap, parameters } = yield select(state => state.sportsTree);
        let path = pathsMap[response.id];
        yield put(replace(path.url));
        yield put(fetchEventMarkets(path.id, parameters, {updateEventMarketCount: true}))
    } else {
        const msg = parseErrorMessageInXhr(httpMethods.HTTP_POST, xhr);
        yield put({type: constants.CREATE_EVENT_FAILED});
        toastr.add({message: `Unable to create event. ${msg}`, type: 'ERROR'});
    }
}

function* updateEvent(action) {
    const {response, xhr} = yield call(API.updateEvent, action.eventId, action.data);
    if(response) {
        yield put({type: constants.UPDATE_EVENT_SUCCEEDED, response:response});
        toastr.add({message: `Successfully updated ${response.description}.`});
        yield put(updatePath(response.id, {description: response.description, startTime: response.startDateTime}));
        if (action.data.outcomes && action.data.outcomes.length) {
            const defaultMarketId = yield select(state => state.eventCreatorEvent.defaultMarketId);
            yield put(fetchEventSelectedOpponents(defaultMarketId, action.eventId));
        }
    } else {
        const msg = parseErrorMessageInXhr(httpMethods.HTTP_POST, xhr);
        yield put({type: constants.UPDATE_EVENT_FAILED});
        toastr.add({message: `Unable to update event. ${msg}`, type: 'ERROR'});
    }
}

function* getOpponents(action) {
    const {response, xhr} = yield call(API.fetchOpponents, action.eventPathId);
    if(response) {
        yield put({type: constants.FETCH_EVENT_OPPONENTS_SUCCEEDED, response:response});
    } else {
        yield put({type: constants.FETCH_EVENT_OPPONENTS_FAILED});
    }
}

function* fetchPlayersOfOpponentA(action) {
    const {response, xhr} = yield call(API.fetchPlayersOfOpponent, action.opponentId);
    if(response) {
        yield put({type: constants.FETCH_PLAYERS_OF_OPPONENTA_SUCCEEDED, response:response});
    } else {
        const msg = parseErrorMessageInXhr(httpMethods.HTTP_GET, xhr);
        yield put({type: constants.FETCH_PLAYERS_OF_OPPONENTA_FAILED});
        toastr.add({message: `Unable to fetch players. ${msg}`, type: 'ERROR'});
    }
}

function* fetchPlayersOfOpponentB(action) {
    const {response, xhr} = yield call(API.fetchPlayersOfOpponent, action.opponentId);
    if(response) {
        yield put({type: constants.FETCH_PLAYERS_OF_OPPONENTB_SUCCEEDED, response:response});
    } else {
        const msg = parseErrorMessageInXhr(httpMethods.HTTP_GET, xhr);
        yield put({type: constants.FETCH_PLAYERS_OF_OPPONENTB_FAILED});
        toastr.add({message: `Unable to fetch players. ${msg}`, type: 'ERROR'});
    }
}

export default function* eventSaga() {
    yield takeLatest(constants.FETCH_EVENT, getEvent);
    yield takeLatest(constants.FETCH_EVENT_DEFAULT_MARKET, getEventDefaultMarket);
    yield takeLatest(constants.FETCH_EVENT_SELECTED_OPPONENTS, getEventSelectedOpponents);
    yield takeLatest(constants.DELETE_EVENT, deleteEvent);
    yield takeLatest(constants.DELETE_EVENTS, deleteEvents);
    yield takeLatest(constants.CREATE_EVENT, createEvent);
    yield takeLatest(constants.UPDATE_EVENT, updateEvent);
    yield takeLatest(constants.FETCH_EVENT_OPPONENTS, getOpponents);
    yield takeLatest(constants.FETCH_PLAYERS_OF_OPPONENTA, fetchPlayersOfOpponentA);
    yield takeLatest(constants.FETCH_PLAYERS_OF_OPPONENTB, fetchPlayersOfOpponentB);
}
