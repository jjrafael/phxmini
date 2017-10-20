import constants from './constants';
import { put, call } from 'redux-saga/effects';
import { takeLatest } from 'redux-saga';
import * as API from './services';

function* fetchSportOtherOptions(action) {
    const {response, xhr} = yield call(API.fetchSportOtherOptions, action.code);
    if (response) {
        yield put({type: constants.FETCH_SPORT_OTHER_OPTIONS_SUCCEEDED, response:response});
    } else {
        yield put({type: constants.FETCH_SPORT_OTHER_OPTIONS_FAILED});
    }
};

export default function* eventSaga() {
    yield takeLatest(constants.FETCH_SPORT_OTHER_OPTIONS, fetchSportOtherOptions);
}