import constants from './constants';
import { select, put, call } from 'redux-saga/effects';
import { takeLatest } from 'redux-saga';
import * as API from './services';
import { toastr } from 'phxComponents/toastr/index';
import { fetchGameResultsPeriodPoints as fetchGRPP } from './actions';

function* fetchGameResultsPeriodPoints(action) {
    const {response, xhr} = yield call(API.fetchGameResultsPeriodPoints, action.eventId);
    if (response) {
        yield put({type: constants.FETCH_GAME_RESULTS_PERIOD_POINTS_SUCCEEDED, response:response});
    } else {
        yield put({type: constants.FETCH_GAME_RESULTS_PERIOD_POINTS_FAILED});
    }
};

function* updateGameResultsPeriodPoints(action) {
    const {response, xhr} = yield call(API.updateGameResultsPeriodPoints, action.formData);
    const { event } = yield select(state => state.eventCreatorEvent);
    if (response) {
        yield put({type: constants.UPDATE_GAME_RESULTS_PERIOD_POINTS_SUCCEEDED, response});
        toastr.add({message: `Successfully updated game scores.`});
        yield put(fetchGRPP(event.id));

    } else {
        yield put({type: constants.UPDATE_GAME_RESULTS_PERIOD_POINTS_FAILED});
        toastr.add({message: `Unable to update game scores.`, type: 'ERROR'});
    }
};

function* updateGameResultsVoidPeriod(action) {
    const {response, xhr} = yield call(API.updateGameResultsVoidPeriod, action.formData);
    const { event } = yield select(state => state.eventCreatorEvent);
    if (response) {
        yield put({type: constants.UPDATE_GAME_RESULTS_VOID_PERIOD_SUCCEEDED, response});
        toastr.add({message: `Successfully updated void game period.`});
        yield put(fetchGRPP(event.id));

    } else {
        yield put({type: constants.UPDATE_GAME_RESULTS_VOID_PERIOD_FAILED});
        toastr.add({message: `Unable to updated void game period.`, type: 'ERROR'});
    }
};



export default function* eventSaga() {
    yield takeLatest(constants.FETCH_GAME_RESULTS_PERIOD_POINTS, fetchGameResultsPeriodPoints);
    yield takeLatest(constants.UPDATE_GAME_RESULTS_PERIOD_POINTS, updateGameResultsPeriodPoints);
    yield takeLatest(constants.UPDATE_GAME_RESULTS_VOID_PERIOD, updateGameResultsVoidPeriod);
}