import { put, call, fork, select } from 'redux-saga/effects';
import { takeLatest, delay } from 'redux-saga';
import actionTypes from '../../constants';
import * as EventCreatorPathTreeService from '../../services/eventCreator/eventCreatorPathTree';

function* deleteEventPath(action) {
    const { response, xhr } = yield call(EventCreatorPathTreeService.deleteEventPath, action.eventPathId);
    if(response) {
        yield put({ type: actionTypes.DELETE_EVENT_PATH_SUCCEEDED, deletedKey: `p${action.eventPathId}` });
    } else {
        const errorMessage = 'Failed to remove event path';
        yield put({ type: actionTypes.DELETE_EVENT_PATH_FAILED, errorMessage });
    }
}

function* deleteEvent(action) {
    const { response, xhr } = yield call(EventCreatorPathTreeService.deleteEvent, action.eventId);
    if(response) {
        yield put({ type: actionTypes.DELETE_EVENT_SUCCEEDED, deletedKey: `e${action.eventId}` });
    } else {
        const errorMessage = 'Failed to remove event';
        yield put({ type: actionTypes.DELETE_EVENT_FAILED, errorMessage });
    }
}

function* saveReorder(action) {
    const { response, xhr } = yield call(EventCreatorPathTreeService.saveReorder, action.printOrders);
    if(response) {
        yield put({ type: actionTypes.SAVE_REORDER_SUCCEEDED });
    } else {
        const errorMessage = 'Failed to save ordering changes';
        yield put({ type: actionTypes.SAVE_REORDER_FAILED, errorMessage });
    }
}

export default function* eventCreatorPathTreeSaga() {
    yield takeLatest(actionTypes.DELETE_EVENT_PATH, deleteEventPath);
    yield takeLatest(actionTypes.DELETE_EVENT, deleteEvent);
    yield takeLatest(actionTypes.SAVE_REORDER, saveReorder);
}