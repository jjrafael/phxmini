'use strict';
import { put, call, fork, select } from 'redux-saga/effects';
import { takeLatest, takeEvery, delay } from 'redux-saga';
import { push, replace } from 'react-router-redux';
import globalConstants from '../App/constants';
import actionTypes, { modes } from './constants';
import * as API from './services';
import { setEventCreatorMode } from 'eventCreatorActions/eventCreatorModes';
import { setEventPathMode } from './actions';
import { selectPath, toggleBulkUpdate } from '../App/actions';
import { updatePath, finalizePath, deletePath, deletePaths } from '../../SportsTree/actions';
import _ from 'underscore';
import httpMethods from 'phxConstants/httpMethods';
import { parseErrorMessageInXhr } from 'phxServices/apiUtils';
import { toastr } from 'phxComponents/toastr/index';

const appModes = {
    'READ_MODE': 'read',
    'CREATE_MODE': 'create',
    'EDIT_MODE': 'edit',
    'DELETE_MODE': 'delete'
};
// Event Path Tree

const errMsg = 'Something went wrong while connecting to server, please try again later.';
const deletePathBaseErrorMsg = 'Failed to remove event path. Please try to remove everything under the selected item first. There might be events which are not visible in your current view.'
function* deleteEventPath(action) {
    const { response, xhr } = yield call(API.deleteEventPath, action.eventPathId);
    if(response) {
        yield put({ type: actionTypes.DELETE_EVENT_PATH_SUCCEEDED, deletedKey: `p${action.eventPathId}` });
        toastr.add({message: 'Successfully deleted event path.'});
        let { pathsMap } = yield select(state => state.sportsTree);
        let path = pathsMap[action.eventPathId];
        let parentPath = pathsMap[path.parentId];
        yield put(replace(parentPath.url)); // replace history state with parent path's url
        yield put(deletePath(action.eventPathId));

    } else {
        const msg = parseErrorMessageInXhr(httpMethods.HTTP_DELETE, xhr);
        const errorMessage = `${deletePathBaseErrorMsg} ${msg}`;
        yield put({ type: actionTypes.DELETE_EVENT_PATH_FAILED, errorMessage });
        toastr.add({message: errorMessage, type: 'ERROR'});
    }
}

function* deleteEventPaths(action) {
    const { response, xhr } = yield call(API.deleteEventPaths, action.eventPathIds);
    if(response) {
        yield put({ type: actionTypes.DELETE_EVENT_PATH_SUCCEEDED });
        toastr.add({message: 'Successfully deleted event paths.'});
        let { pathsMap, activePathId } = yield select(state => state.sportsTree);
        if (action.eventPathIds.includes(activePathId)) {
            let path = pathsMap[activePathId];
            let parentPath = pathsMap[path.parentId];
            yield put(replace(parentPath.url)); // replace history state with parent path's url
        }
        yield put(deletePaths(action.eventPathIds));
        yield put(toggleBulkUpdate(false));
    } else {
        const msg = parseErrorMessageInXhr(httpMethods.HTTP_DELETE, xhr);
        const errorMessage = `${deletePathBaseErrorMsg} ${msg}`;
        yield put({ type: actionTypes.DELETE_EVENT_PATH_FAILED, errorMessage });
        toastr.add({message: errorMessage, type: 'ERROR'});
    }
}

function* deleteEvent(action) {
    const { response, xhr } = yield call(API.deleteEvent, action.eventId);
    if(response) {
        yield put({ type: actionTypes.DELETE_EVENT_SUCCEEDED, deletedKey: `e${action.eventId}` });
    } else {
        const msg = parseErrorMessageInXhr(httpMethods.HTTP_DELETE, xhr);
        const errorMessage = `Failed to remove event. ${msg}`;
        yield put({ type: actionTypes.DELETE_EVENT_FAILED, errorMessage });
    }
}

function* saveReorder(action) {
    const { response, xhr } = yield call(API.saveReorder, action.printOrders);
    if(response) {
        yield put({ type: actionTypes.SAVE_REORDER_SUCCEEDED });
    } else {
        const errorMessage = 'Failed to save ordering changes';
        yield put({ type: actionTypes.SAVE_REORDER_FAILED, errorMessage });
    }
}

// Event Path Details
function* fetchEventPathDetails(action) {
    const { eventPathId } = action;
    const { response, xhr } = yield call(API.fetchEventPathDetails, eventPathId);
    if(response) {
        yield put({ type: actionTypes.FETCH_EVENT_PATH_DETAILS_SUCCEEDED, eventPathDetails: response });
    } else {
        const parseResponse = JSON.parse(xhr.response);
        let msg;
        try {
            msg = parseResponse.errorMessage || parseResponse.exception.message;
        } catch(e) {
            msg = 'Error fetching path details';
        }
        yield put({ type: actionTypes.FETCH_EVENT_PATH_DETAILS_FAILED, errorMessage: msg });
    }
}

function* addEventPath(action) {
    const { newEventPathDetails } = action;
    var { response, xhr } = yield call(API.addEventPath, newEventPathDetails);
    if (response) {
        // yield delay(3000); // why add delay?
        yield put({ type: actionTypes.ADD_EVENT_PATH_SUCCEEDED, eventPathDetails: response });
        toastr.add({message: 'Successfully created a new event path.'});
        yield put(finalizePath(response.id, {id: response.id, parentId: response.parentId, description: response.description}));
        let { pathsMap } = yield select(state => state.sportsTree);
        let path = pathsMap[response.id];
        yield put(replace(path.url));
        yield put(setEventPathMode(modes.VIEW));
        yield put(setEventCreatorMode(appModes.READ_MODE));
    } else {
        const parseResponse = JSON.parse(xhr.response);

        let msg = null;
        if (_.has(parseResponse, 'errors')) {
            let messages = _.pluck( parseResponse.errors, 'message' );
            let messagesWithoutLast = _.initial( messages );
            msg = '';
            _.each( messagesWithoutLast, ( message ) => {
              msg += message + ', ';
            } );
            msg += _.last( messages );

        } else {
            msg = parseResponse.errorMessage || parseResponse.exception.message;
        }
        yield put({ type: actionTypes.ADD_EVENT_PATH_FAILED, errorMessage: msg });
        toastr.add({message: msg, type: 'ERROR'});
    }
}

function* editEventPath(action) {
    const { eventPathId, editedEventPathDetails } = action;
    var { response, xhr } = yield call(API.editEventPath, eventPathId, editedEventPathDetails);
    if (response) {
        yield put({ type: actionTypes.EDIT_EVENT_PATH_SUCCEEDED, eventPathDetails: response });
        yield put(updatePath(response.id, {description: response.description}));
        yield put(setEventPathMode(modes.VIEW));
        yield put(setEventCreatorMode(appModes.READ_MODE));
        toastr.add({message: 'Updated Successfully'});

    } else {
        // const parseResponse = JSON.parse(xhr.response);
        // const msg = parseResponse.errorMessage || parseResponse.exception.message;
        const parseResponseMsg = parseErrorMessageInXhr('HTTP_PUT', xhr);
        const msg = parseResponseMsg || errMsg;

        yield put({ type: actionTypes.EDIT_EVENT_PATH_FAILED, errorMessage: msg });
        toastr.add({message: msg, type: 'ERROR'});
    }
}

// Event Path Tags

function* fetchEventPathTags(action) {
    const { response, xhr } = yield call(API.fetchEventPathTags);
    if(response) {
        yield put({ type: actionTypes.FETCH_EVENT_PATH_TAGS_SUCCEEDED, eventPathTagList: response });
    } else {
        const parseResponse = JSON.parse(xhr.response);
        const msg = parseResponse.errorMessage || parseResponse.exception.message;
        yield put({ type: actionTypes.FETCH_EVENT_PATH_TAGS_FAILED, errorMessage: msg });
    }
}

export default function* eventCreatorPathTreeSaga() {
    yield takeLatest(actionTypes.FETCH_EVENT_PATH_DETAILS, fetchEventPathDetails);
    yield takeLatest(actionTypes.ADD_EVENT_PATH, addEventPath);
    yield takeLatest(actionTypes.EDIT_EVENT_PATH, editEventPath);
    yield takeLatest(actionTypes.FETCH_EVENT_PATH_TAGS, fetchEventPathTags);
    yield takeLatest(actionTypes.DELETE_EVENT_PATH, deleteEventPath);
    yield takeLatest(actionTypes.DELETE_EVENT_PATHS, deleteEventPaths);
    yield takeLatest(actionTypes.DELETE_EVENT, deleteEvent);
    yield takeLatest(actionTypes.SAVE_REORDER, saveReorder);
}