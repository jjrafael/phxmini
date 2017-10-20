import { put, call, fork, select } from 'redux-saga/effects';
import { takeLatest, takeEvery, delay } from 'redux-saga';
import actionTypes from '../constants';
import * as API from '../services/apps';

const errMsg = 'Something went wrong while connecting to server, please try again later.'

function* fetchApps(action) {
    try {
        const {response, xhr} = yield call(API.fetchApps, action.id);
        if(response) {
            yield put({type: actionTypes.FETCH_APPS_SUCCEEDED, appList: response.appList, allowedAppIds: response.allowedAppIds});
        } else {
            const parseResponse = JSON.parse(xhr.response);
            const msg = parseResponse.errors[0].message;
            yield put({type: actionTypes.FETCH_APPS_FAILED, errMsg: msg});
        }
    } catch (e) {
        yield put({type: actionTypes.FETCH_APPS_FAILED, errMsg: errMsg});
    }
};

function* fetchAppPermissions(action) {
    const {response, xhr} = yield call(API.fetchAppPermissions, action.userId, action.appId);
    if (response) {
        yield put({type: actionTypes.FETCH_APP_PERMISSIONS_SUCCEEDED, response, userId: action.userId, appId: action.appId});
    } else {
        yield put({type: actionTypes.FETCH_APP_PERMISSIONS_FAILED});
    }
};

function* fetchRecentApps(action) {
    try {
        const {response, xhr} = yield call(API.fetchRecentApps, action.id);
        if(response) {
            yield put({type: actionTypes.FETCH_RECENT_APPS_SUCCEEDED, appList: response});
        } else {
            const parseResponse = JSON.parse(xhr.response);
            const msg = parseResponse.errors[0].message;
            yield put({type: actionTypes.FETCH_RECENT_APPS_FAILED, errMsg: msg});
        }
    } catch (e) {
        yield put({type: actionTypes.FETCH_RECENT_APPS_FAILED, errMsg: errMsg});
    }
};

function* useApp(action) {
    try {
        const {response, xhr} = yield call(API.useApp, action.userid, action.appId);
        if(response) {
            yield put({type: actionTypes.USE_APP_SUCCEEDED, response: response});
        } else {
            const parseResponse = JSON.parse(xhr.response);
            const msg = parseResponse.errors[0].message;
            yield put({type: actionTypes.USE_APP_FAILED, errMsg: msg});
        }
    } catch (e) {
        yield put({type: actionTypes.USE_APP_FAILED, errMsg: errMsg});
    }
};

export default function* appsSaga() {
    yield takeLatest(actionTypes.FETCH_APPS, fetchApps);
    yield takeLatest(actionTypes.FETCH_APP_PERMISSIONS, fetchAppPermissions);
    yield takeLatest(actionTypes.FETCH_RECENT_APPS, fetchRecentApps);
    yield takeLatest(actionTypes.USE_APP, useApp);
}