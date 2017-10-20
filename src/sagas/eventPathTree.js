import { put, call, fork, select } from 'redux-saga/effects';
import { takeLatest, takeEvery } from 'redux-saga';
import actionTypes from '../constants';
import channelConfig from '../configs/channelConfig';
import * as EventPathTreeService from '../services/eventPathTree';
import { formatFilterDates } from '../utils';

function* fetchEventPathTree(action) {
    try {
        const { response, xhr } = yield call(EventPathTreeService.fetchEventPathTree, action.eventPathId, action.parameters, action.allowedSports);
        if(response && response.eventPaths && response.eventPaths.length) {
            yield put({
                type: actionTypes.FETCH_EVENT_PATH_TREE_SUCCEEDED,
                tree: response.eventPaths
            });
            //select default sport or first sport response if default sport does not exist on response
            const { defaultSportId } = channelConfig;
            const  selectedSport = yield select(state => state.eventPathTree.selectedSport);
            let sportId = defaultSportId;
            if(selectedSport) {
                sportId = selectedSport.id;
            }
            const { chunk, error } = yield call(EventPathTreeService.getChunk, sportId);
            if(!chunk) {
                sportId = response.eventPaths[0].id;
            }
            if (chunk) {
                yield put({
                    type: actionTypes.SELECT_EVENT_PATH_TREE_SPORT,
                    sportId
                });
            }
        } else if(response.eventPaths && !response.eventPaths.length) {
            yield put({
                type: actionTypes.FETCH_EVENT_PATH_TREE_SUCCEEDED,
                tree: []
            });
            yield put({
                type: actionTypes.SET_RISK_FILTER_CODE,
                code: null
            });
            yield put({
                type: actionTypes.SET_RESULTS_VIEWER_FILTER_CODE,
                code: null
            });
        }else {
            yield put({ type: actionTypes.FETCH_EVENT_PATH_TREE_FAILED});
            yield put({
                type: actionTypes.SET_RISK_FILTER_CODE,
                code: null
            });
            yield put({
                type: actionTypes.SET_RESULTS_VIEWER_FILTER_CODE,
                code: null
            });
        }
    } catch (error) {
        yield put({ type: actionTypes.FETCH_EVENT_PATH_TREE_FAILED});
    }
}

function* fetchEventMarkets(action) {
    const { response, xhr } = yield call(EventPathTreeService.fetchEventMarkets, action.eventId, action.parameters);
    if(response) {
        yield put({
            type: actionTypes.FETCH_EVENT_MARKETS_SUCCEEDED,
            eventId: action.eventId,
            markets: response
        })
    } else {
        yield put({
            type: actionTypes.FETCH_EVENT_MARKETS_FAILED,
            eventId: action.eventId
        })
    }
}

function* selectEventPathTreeSport(action) {
    try {
        let { chunk, error } = yield call(EventPathTreeService.getChunk, action.sportId);
        if(chunk) {
            const searchString = yield select(state => state.eventPathTreeFilter.searchString);
            if(searchString.length) {
                chunk = { ...chunk, eventPaths: EventPathTreeService.mapEventPathsToFilter(chunk.eventPaths, searchString) };
            }
            yield put({
                type: actionTypes.SELECT_EVENT_PATH_TREE_SPORT_SUCCEEDED,
                sport: chunk
            });
            yield put({
                type: actionTypes.SET_RISK_FILTER_CODE,
                code: null
            });
            yield put({
                type: actionTypes.SET_RESULTS_VIEWER_FILTER_CODE,
                code: null
            });
        } else {
            yield put({
                type: actionTypes.SELECT_EVENT_PATH_TREE_SPORT_SUCCEEDED,
                sport: {empty: true, id: action.sportId}
            });
        }
    } catch (error) {
        const tree = yield select(state => state.eventPathTree.tree);
        yield put({ type: actionTypes.FETCH_EVENT_PATH_TREE_FAILED});
        yield put({
            type: actionTypes.SELECT_EVENT_PATH_TREE_SPORT,
            sportId: tree[0].id
        });
        // TODO: how to remove this from here
        // it's better if it's on risk manager and results viewer respectively
        yield put({
            type: actionTypes.SET_RISK_FILTER_CODE,
            code: null
        });
        yield put({
            type: actionTypes.SET_RESULTS_VIEWER_FILTER_CODE,
            code: null
        });
        // -----------------------------------
    }
}

function* fetchEventMarketsCancel(action) {
    EventPathTreeService.fetchEventMarketsCancel(action.eventId);
}

function* searchEventPathTree(action) {
    const { selectedSport } = yield select(state => state.eventPathTree);
    const { searchString } = yield select(state => state.eventPathTreeFilter);
    const result = { ...selectedSport, eventPaths: EventPathTreeService.mapEventPathsToFilter(selectedSport.eventPaths, searchString) };
    yield put({
        type: actionTypes.SEARCH_EVENT_PATH_TREE_SUCCEEDED,
        result
    });
}

function* resetEventPathTree(action) {
    EventPathTreeService.resetEventPathTree();
}

export default function* eventPathTreeSaga() {
    yield takeLatest(actionTypes.FETCH_EVENT_PATH_TREE, fetchEventPathTree);
    yield takeLatest(actionTypes.SELECT_EVENT_PATH_TREE_SPORT, selectEventPathTreeSport);
    yield takeLatest(actionTypes.SEARCH_EVENT_PATH_TREE, searchEventPathTree);
    yield takeLatest(actionTypes.RESET_EVENT_PATH_TREE, resetEventPathTree);
    yield takeEvery(actionTypes.FETCH_EVENT_MARKETS, fetchEventMarkets);
    yield takeEvery(actionTypes.FETCH_EVENT_MARKETS_CANCEL, fetchEventMarketsCancel);
}