import { put, call, fork, select } from 'redux-saga/effects';
import { takeLatest, delay } from 'redux-saga';
import actionTypes from '../constants';
import appNames from '../constants/appNames';
import apiConstantsKeys from '../constants/apiConstantsKeys';
import { objectToArray, formatFilterDates } from '../utils';
import * as ApiConstantsService from '../services/apiConstants';
import riskDataConfig from '../configs/riskDataConfig';
import * as UserService from '../services/user';
import { fetchApps } from '../actions/apps';
import localStorageService from '../services/localStorageService';
import * as windowLocationService from '../services/windowLocation';
import { fetchUserRiskSports, editUserRiskSports, fetchUserRiskColumns, editUserRiskColumns } from '../services/userRiskPreferences';


const USER_KEY = 'USER_DETAILS';

function* startupApp(action) {
    const app = action.appName;
    const keys = apiConstantsKeys[app];
    const isAppListLoaded = yield select(state => state.apps.isAppListLoaded);
    if (!isAppListLoaded) {
        const userId = yield select(state => state.user.details.id); 
        yield put(fetchApps(userId)); // fetch assigned applications first
    }
    if (keys) {
        const { response, xhr } = yield call(ApiConstantsService.fetchConstants, keys);
        if (response) {
            yield put({ type: actionTypes.FETCH_API_CONSTANTS_SUCCEEDED, values: response });
        } else {
            yield put({ type: actionTypes.FETCH_API_CONSTANTS_FAILED });
        }
    }
    const userDetails = yield select(state => state.user.details);
    if (app === appNames.RISK_MANAGER) { //TODO: separate function for each app
        const { userSports } = yield call(fetchUserRiskSports, userDetails.id);
        const { userColumns } = yield call(fetchUserRiskColumns, userDetails.id);
        if (userSports) {
            yield put({ type: actionTypes.FETCH_USER_RISK_SPORTS_SUCCEEDED, sports: userSports });
        } else {
            yield put({ type: actionTypes.FETCH_USER_RISK_SPORTS_FAILED });
        }
        if (userColumns) {
            yield put({ type: actionTypes.FETCH_USER_RISK_COLUMNS_SUCCEEDED, columns: userColumns });
        } else {
            yield put({ type: actionTypes.FETCH_USER_RISK_COLUMNS_FAILED });
        }
        if (userSports && userColumns) {
            const allColumns = yield select(state => state.apiConstants.values.riskColumns);
            riskDataConfig.setColumnsVisibility(allColumns, userColumns);
            yield put({ type: actionTypes.STARTUP_APP_SUCCEEDED, appName: app });
        } else {
            yield put({ type: actionTypes.STARTUP_APP_FAILED, appName: app });
        }
    } else {
        yield put({ type: actionTypes.STARTUP_APP_SUCCEEDED, appName: app });
    }
}

function* startupGlobal() {
    //get accountId and token from url
    //this is used for starting up apps from the abp toolbar
    //backend redirects to /#/<appName>?acc=<accountId>&token=<userToken>
    const accFromUrl = windowLocationService.getParameterByName('acc');
    const tokenFromUrl = windowLocationService.getParameterByName('token');
    if (accFromUrl && tokenFromUrl) {
        localStorage.setItem('MIFY_U_TOKEN', tokenFromUrl);
        const { response, xhr } = yield call(UserService.fetchUserDetails, accFromUrl);
        if (response && response.username) {
            localStorage.setItem('username', response.username);
            localStorage.setItem('userid', response.id);
        }
    }

    const { isLoggedIn } = yield call(UserService.isLoggedIn);
    const username = window.localStorage.getItem('username');
    const id = window.localStorage.getItem('userid');
    if (isLoggedIn && username && id) {
        yield put({
            type: actionTypes.LOGIN_SUCCEEDED,
            details: {
                id,
                username
            }
        });
    } else {
        // yield put({ type: actionTypes.STARTUP_SUCCEEDED });
        // return
    }
    try {
        yield put({ type: actionTypes.FETCH_API_CONSTANTS });
        const globalKeys = apiConstantsKeys['Global'];
        const { response, xhr } = yield call(ApiConstantsService.fetchConstants, globalKeys);
        if (response) {
            yield put({ type: actionTypes.FETCH_API_CONSTANTS_SUCCEEDED, values: response });
            yield put({ type: actionTypes.STARTUP_SUCCEEDED });
        } else {
            yield put({ type: actionTypes.FETCH_API_CONSTANTS_FAILED });
            yield put({ type: actionTypes.STARTUP_FAILED });
        }
    } catch (error) {
        yield put({ type: actionTypes.STARTUP_FAILED });
    } finally {
    }
}

export default function* startupSaga() {
    yield takeLatest(actionTypes.STARTUP, startupGlobal);
    yield takeLatest(actionTypes.STARTUP_APP, startupApp);
}