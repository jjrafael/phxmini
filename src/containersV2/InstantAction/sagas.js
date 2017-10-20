import constans from './constants';
import { put, call } from 'redux-saga/effects';
import { takeLatest, takeEvery } from 'redux-saga';
import * as API from './services';

function* getInitialBetsData() {
  const { response, xhr } = yield call(API.fetchInitialBetsData);
  if (response) {
    yield put({ type: constans.FETCH_INITIAL_BETS_DATA_SUCCEEDED, results: response });
  } else {
    yield put({ type: constans.FETCH_INITIAL_BETS_DATA_FAILED });
  }
};

function* getSubsequentBetsData(action) {
  const { response, xhr } = yield call(API.fetchSubsequentBetsData, action.lastKey);
  if (response) {
    yield put({ type: constans.FETCH_SUBSEQUENT_BETS_DATA_SUCCEEDED, results: response });
  } else {
    yield put({ type: constans.FETCH_SUBSEQUENT_BETS_DATA_FAILED });
  }
};

function* getInitialAccountsData() {
  const { response, xhr } = yield call(API.fetchInitialAccountsData);

  if (response) {
    yield put({ type: constans.FETCH_INITIAL_ACCOUNTS_DATA_SUCCEEDED, results: response });
  } else {
    yield put({ type: constans.FETCH_INITIAL_ACCOUNTS_DATA_FAILED });
  }
};

function* getSubsequentAccountsData(action) {
  const { response, xhr } = yield call(API.fetchSubsequentAccountsData, action.lastKey);

  if (response) {
    yield put({ type: constans.FETCH_SUBSEQUENT_ACCOUNTS_DATA_SUCCEEDED, results: response });
  } else {
    yield put({ type: constans.FETCH_SUBSEQUENT_ACCOUNTS_DATA_FAILED });
  }
};

function* getInitialPaymentsData() {
  const { response, xhr } = yield call(API.fetchInitialPaymentsData);

  if (response) {
    yield put({ type: constans.FETCH_INITIAL_PAYMENTS_DATA_SUCCEEDED, results: response });
  } else {
    yield put({ type: constans.FETCH_INITIAL_PAYMENTS_DATA_FAILED });
  }
};

function* getSubsequentPaymentsData(action) {
  const { response, xhr } = yield call(API.fetchSubsequentPaymentsData, action.lastKey);

  if (response) {
    yield put({ type: constans.FETCH_SUBSEQUENT_PAYMENTS_DATA_SUCCEEDED, results: response });
  } else {
    yield put({ type: constans.FETCH_SUBSEQUENT_PAYMENTS_DATA_FAILED });
  }
};

function* getInitialFailedBetsData() {
  const { response, xhr } = yield call(API.fetchInitialFailedBetsData);

  if (response) {
    yield put({ type: constans.FETCH_INITIAL_FAILEDBETS_DATA_SUCCEEDED, results: response });
  } else {
    yield put({ type: constans.FETCH_INITIAL_FAILEDBETS_DATA_FAILED });
  }
};

function* getSubsequentFailedBetsData(action) {
  const { response, xhr } = yield call(API.fetchSubsequentFailedBetsData, action.lastKey);

  if (response) {
    yield put({ type: constans.FETCH_SUBSEQUENT_FAILEDBETS_DATA_SUCCEEDED, results: response });
  } else {
    yield put({ type: constans.FETCH_SUBSEQUENT_FAILEDBETS_DATA_FAILED });
  }
};

export default function* instantActionSaga() {
  yield takeLatest(constans.FETCH_INITIAL_BETS_DATA, getInitialBetsData);
  yield takeEvery(constans.FETCH_SUBSEQUENT_BETS_DATA, getSubsequentBetsData);

  yield takeLatest(constans.FETCH_INITIAL_ACCOUNTS_DATA, getInitialAccountsData);
  yield takeEvery(constans.FETCH_SUBSEQUENT_ACCOUNTS_DATA, getSubsequentAccountsData);

  yield takeLatest(constans.FETCH_INITIAL_PAYMENTS_DATA, getInitialPaymentsData);
  yield takeEvery(constans.FETCH_SUBSEQUENT_PAYMENTS_DATA, getSubsequentPaymentsData);

  yield takeLatest(constans.FETCH_INITIAL_FAILEDBETS_DATA, getInitialFailedBetsData);
  yield takeEvery(constans.FETCH_SUBSEQUENT_FAILEDBETS_DATA, getSubsequentFailedBetsData);
}