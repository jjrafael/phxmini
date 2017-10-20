import { put, call, fork, select } from 'redux-saga/effects';
import { takeLatest, takeEvery, delay } from 'redux-saga';
import ecAppConstants from '../App/constants';
import ecEventConstant from '../Event/constants';

import constants from './constants';
import * as API from './services';

import httpMethods from 'phxConstants/httpMethods';
import { parseErrorMessageInXhr } from 'phxServices/apiUtils';
import { toastr } from 'phxComponents/toastr/index';

function* updateApplicableTemplate({payload, pathObj}) {
    const { response, xhr } = yield call(API.putApplicableTemplates, payload);
    if (response) {
        yield put({type: constants.UPDATE_APPLICABLE_TEMPLATES_SUCCEEDED, response});
        yield put({type: ecAppConstants.TOGGLE_BULK_UPDATE, isBulkUpdateActive: false});
        toastr.add({message: `Template successfully updated.`});

        if (pathObj) {
            yield put({type: ecEventConstant.FETCH_EVENT, eventId: pathObj.eventId, isRankEvent: pathObj.isRankEvent});
        }
    } else {
        yield put({type: constants.UPDATE_APPLICABLE_TEMPLATES_FAILED});
        toastr.add({message: `Unable to update template.`, type: 'ERROR'})
    }
}

function* fetchApplicableTemplates({eventPathIds}) {
    const { response, xhr } = yield call(API.fetchApplicableTemplates, eventPathIds);
    if (response) {
        yield put({type: constants.FETCH_APPLICABLE_TEMPLATES_SUCCEEDED, templates: response, eventPathIds: eventPathIds});
    } else {
        const msg = parseErrorMessageInXhr(httpMethods.HTTP_GET, xhr);
        yield put({type: constants.FETCH_APPLICABLE_TEMPLATES_FAILED});
    }
}

export default function* bulkUpdateSaga() {
    yield takeLatest(constants.UPDATE_APPLICABLE_TEMPLATES, updateApplicableTemplate),
    yield takeLatest(constants.FETCH_APPLICABLE_TEMPLATES, fetchApplicableTemplates)
}
