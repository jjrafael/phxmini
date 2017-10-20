'use strict';
import { put, call, select } from 'redux-saga/effects';
import { takeLatest } from 'redux-saga';
import { push, replace } from 'react-router-redux';
import qs from 'query-string';
import { makeIterable } from 'phxUtils';
import httpMethods from 'phxConstants/httpMethods';
import { parseErrorMessageInXhr } from 'phxServices/apiUtils';
import actionTypes from './constants';
import * as API from './services';
import { updatePath, updatePaths, fetchEventMarkets as eptFetchEventMatkets } from './actions';
import { getParentPaths } from './helpers';
import { toastr } from 'phxComponents/toastr/index';


function* fetchEPT(action) {
    const { activeAppId } = yield select(state => state.apps);
    const { parameters, options  } = action;
    let sportId = action.sportId;
    switch (activeAppId) {
        case 19: // set sportId to null if current app is Risk Manager
        case 48: // set sportId to null if current app is Results Viewer
            sportId = null;
        break;
    }
    const { response, xhr } = yield call(API.fetchEPT, sportId, parameters);
    const { isFirstLoad } = yield select(state => state.sportsTree);
    if (response) {
        yield put({ type: actionTypes.FETCH_EPT_SUCCEEDED, response: response, persistOldPathsMap: !!options.persistOldPathsMap });
        const { pathsMap, activePathAncestors, activePathId, parameters, isFiltered } = yield select(state => state.sportsTree);
        let firstPathIdFound, firstPathFound;
        for (let i = 0, length = activePathAncestors.length; i < length; i++) {
            firstPathIdFound = activePathAncestors[i];
            let path = pathsMap[firstPathIdFound];
            if (path) {
                if (!isFiltered) {
                    firstPathFound = path;
                    break;
                } else {
                    if (activeAppId === 19) { // if currentApp is Risk Manager
                        if (path.type === 'path' || path.type === 'event') {
                            firstPathFound = path;
                            break;
                        }
                    } else {
                        if ((path.type === 'path' && path.eventCount) || (path.type === 'event' && path.marketCount)) {
                            firstPathFound = path;
                            break;
                        }
                    }
                }
            }
        }
        // find all expanded events and collapse them
        let expandedEvents = [...makeIterable(pathsMap)].filter(path => path.eventType);
        if (expandedEvents.length) {
            yield put(updatePaths(expandedEvents.map(event => ({id: event.id, data: {isExpanded: false}}))));
        }
        if (firstPathFound && firstPathFound.id !== activePathId && !isFirstLoad) {
            if (firstPathFound.eventType) { // if firstPathFound is an event, fetch its markets and expand it
                if (!firstPathFound.isExpanded) {
                    yield put(updatePath(firstPathFound.id, {isExpanded: true}))
                }
                yield put(eptFetchEventMatkets(firstPathFound.id, parameters, {autoOpenParentPaths: true}));
            } else {
                // change route to the first available path's url
                yield put(push(firstPathFound.url))
            }
        }
        if (options.location) {
            let dateFilter = qs.parse(options.location.search).dateFilter;
            if (dateFilter) {
                yield put(replace(options.location.pathname));
            }
        }
    } else {
        yield put({ type: actionTypes.FETCH_EPT_FAILED, errorMessage: 'Error' });
    }
}

function* fetchRestrictionEPT(action) {
    const { response } = yield call(API.fetchRestrictionEPT, action.code);
    if (response) {
        yield put({ type: actionTypes.FETCH_EPT_SUCCEEDED, response: response})
    } else {
        yield put({ type: actionTypes.FETCH_EPT_FAILED, errorMessage: 'Error' });
    }
}

const flattenMarkets = (markets, accu) => {
    markets.forEach(market => {
        accu.push(market)
        if (market.childMarkets && market.childMarkets.length) {
            flattenMarkets(market.childMarkets, accu);
        }
    })
    return accu;
}

function* fetchEventMarkets(action) {
    const { eventId, parameters  } = action;
    const { response, xhr } = yield call(API.fetchEventMarkets, eventId, parameters);
    if (response) {
        yield put({ type: actionTypes.FETCH_EVENT_MARKETS_SUCCEEDED, response: response, eventId });
        const { pathsMap, activePathId } = yield select(state => state.sportsTree);
        const path = pathsMap[activePathId];
        if (path && action.options.autoOpenParentPaths) {
            const parentPath = pathsMap[path.parentId];
            if (parentPath && !parentPath.isExpanded) {
                let parentPaths = getParentPaths(pathsMap[parentPath.id], pathsMap, []);
                if (parentPaths.length) {
                    yield put(updatePaths(parentPaths));
                }
            }
        }
        if (action.options.updateEventMarketCount) {
            let flatMarkets = flattenMarkets(response, []);
            let marketCount = flatMarkets.length;
            yield put(updatePath(eventId, {marketCount}));
        }
    } else {
        yield put({ type: actionTypes.FETCH_EVENT_MARKETS_FAILED, errorMessage: 'Error' });
    }
}

function* saveNewPathsOrder(action) {
    const { pathsOrder } = action;
    const { response, xhr } = yield call(API.saveNewPathsOrder, pathsOrder);
    if (response) {
        yield put({ type: actionTypes.SAVE_NEW_PATHS_ORDER_SUCCEEDED, response: response });
        toastr.add({message: `Paths order successfully saved.`});
    } else {
        const msg = parseErrorMessageInXhr(httpMethods.HTTP_PUT, xhr);
        yield put({ type: actionTypes.SAVE_NEW_PATHS_ORDER_FAILED, errorMessage: 'Error' });
        toastr.add({message: `Unable to delete event. ${msg}`, type: 'ERROR'});
    }
}

export default function* eventCreatorPathTreeSaga() {
    yield takeLatest(actionTypes.FETCH_EPT, fetchEPT);
    yield takeLatest(actionTypes.FETCH_RESTRICTION_EPT, fetchRestrictionEPT);
    yield takeLatest(actionTypes.FETCH_EVENT_MARKETS, fetchEventMarkets);
    yield takeLatest(actionTypes.SAVE_NEW_PATHS_ORDER, saveNewPathsOrder);
}