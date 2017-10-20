import { put, call, fork, select } from 'redux-saga/effects';
import { takeLatest, takeEvery, delay } from 'redux-saga';
import actionTypes from '../constants';
import * as API from '../services/user';
import storageService from '../services/localStorageService';

const errMsg = 'Something went wrong while connecting to server, please try again later.'
const USER_KEY = 'USER_DETAILS';

function* login(action) {
    try {
        const {response, xhr} = yield call(API.login, action.uname, action.pw);
        if(response) {
            yield put({
                type: actionTypes.LOGIN_SUCCEEDED,
                details: response
            });
            localStorage.setItem('username', action.uname);
            localStorage.setItem('userid', response.id);
        } else {
            const parseResponse = JSON.parse(xhr.response);
            const msg = parseResponse.errors[0].message;
            yield put({type: actionTypes.LOGIN_FAILED, errMsg: msg});
        }
    } catch (e) {
        yield put({type: actionTypes.LOGIN_FAILED, errMsg: errMsg});
    }
};

function* logout() {
    // removeItem(USER_KEY);
    API.logout();
};

export default function* userSaga() {
    yield takeLatest(actionTypes.LOGIN, login);
    yield takeLatest(actionTypes.LOGOUT, logout);
}