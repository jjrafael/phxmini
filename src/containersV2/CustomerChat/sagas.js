import constans from './constants';
import { put, call } from 'redux-saga/effects';
import { takeLatest, takeEvery } from 'redux-saga';
import * as API from './services';

function* getOperatorDetails(action) {
  const { response, xhr } = yield call(API.fetchOperatorDetails, action.operatorId);

  if (response) {
    yield put({ type: constans.FETCH_OPERATOR_DETAILS_SUCCEEDED, result: response });
  } else {
    yield put({ type: constans.FETCH_OPERATOR_DETAILS_FAILED });
  }
};

function* getAssignedSessions(action) {
  const { response, xhr } = yield call(API.fetchAssignedSession, action.operatorId);

  if (response) {
    yield put({ type: constans.FETCH_ASSIGNED_SESSIONS_SUCCEEDED, result: response });
  } else {
    yield put({ type: constans.FETCH_ASSIGNED_SESSIONS_FAILED });
  }
};

function* getUnassignedSessions() {
  const { response, xhr } = yield call(API.fetchUnassignedSession);

  if (response) {
    yield put({ type: constans.FETCH_UNASSIGNED_SESSIONS_SUCCEEDED, result: response });
  } else {
    yield put({ type: constans.FETCH_UNASSIGNED_SESSIONS_FAILED });
  }
};

function* acceptSession(action) {
  const { response, xhr } = yield call(API.acceptSession, action.session.id);

  if (response) {
    yield put({ type: constans.ACCEPT_SESSION_SUCCEEDED, session: action.session });
  } else {
    yield put({ type: constans.ACCEPT_SESSION_FAILED });
  }
};

function* getMessages(action) {
  const { response, xhr } = yield call(API.fetchMessages, action.sessionId);

  if (response) {
    yield put({ type: constans.FETCH_MESSAGES_SUCCEEDED, messages: response, sessionId: action.sessionId });
  } else {
    yield put({ type: constans.FETCH_MESSAGES_FAILED });
  }
};

function* sendMessage(action) {
  const { response, xhr } = yield call(API.sendMessage, action.sessionId, action.message);

  if (response) {
    yield put({ type: constans.SEND_MESSAGE_SUCCEEDED });
  } else {
    yield put({ type: constans.SEND_MESSAGE_FAILED });
  }
};

function* endSession(action) {
  const { response, xhr } = yield call(API.endSession, action.sessionId);

  if (response) {
    yield put({ type: constans.END_SESSION_SUCCEEDED, sessionId: action.sessionId });
  } else {
    yield put({ type: constans.END_SESSION_FAILED });
  }
};

function* getAssignedSessionDetails(action) {
  const { response, xhr } = yield call(API.fetchSessionDetails, action.sessionId);

  if (response) {
    yield put({ type: constans.FETCH_ASSIGNED_SESSION_DETAILS_SUCCEEDED, sessionId: action.sessionId, sessionDetails: response });
  } else {
    yield put({ type: constans.FETCH_ASSIGNED_SESSION_DETAILS_FAILED });
  }
};

function* getUnassignedSessionDetails(action) {
  const { response, xhr } = yield call(API.fetchSessionDetails, action.sessionId);

  if (response) {
    yield put({ type: constans.FETCH_UNASSIGNED_SESSION_DETAILS_SUCCEEDED, sessionId: action.sessionId, sessionDetails: response });
  } else {
    yield put({ type: constans.FETCH_UNASSIGNED_SESSION_DETAILS_FAILED });
  }
};

export default function* eventSaga() {
  yield takeEvery(constans.FETCH_ASSIGNED_SESSIONS, getAssignedSessions);
  yield takeEvery(constans.FETCH_UNASSIGNED_SESSIONS, getUnassignedSessions);
  yield takeEvery(constans.FETCH_ASSIGNED_SESSION_DETAILS, getAssignedSessionDetails);
  yield takeEvery(constans.FETCH_UNASSIGNED_SESSION_DETAILS, getUnassignedSessionDetails);
  yield takeEvery(constans.FETCH_MESSAGES, getMessages);
  yield takeLatest(constans.FETCH_OPERATOR_DETAILS, getOperatorDetails);
  yield takeLatest(constans.ACCEPT_SESSION, acceptSession);
  yield takeLatest(constans.SEND_MESSAGE, sendMessage);
  yield takeLatest(constans.END_SESSION, endSession);
}