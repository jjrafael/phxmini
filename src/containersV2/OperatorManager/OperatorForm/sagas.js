'use strict';
import { put, call, select } from 'redux-saga/effects';
import { takeLatest } from 'redux-saga';
import { push, replace } from 'react-router-redux';
import qs from 'query-string';
import { makeIterable } from 'phxUtils';
import httpMethods from 'phxConstants/httpMethods';
import { parseErrorMessageInXhr } from 'phxServices/apiUtils';
import {UPDATE_PASSWORD, UPDATE_PASSWORD_SUCCEEDED, UPDATE_PASSWORD_FAILED} from './actions';
import * as API from './services';
import { toastr } from 'phxComponents/toastr/index';
import { closeModal, openModal } from 'actions/modal';
import { reset } from 'redux-form';

function* updateOperatorPassword(action) {
    const { response, xhr } = yield call(API.updateOperatorPassword, action.operatorid, action.formData);
    if (response) {
        yield put({ type: UPDATE_PASSWORD_SUCCEEDED, response: response });
        yield put(closeModal('changePasswordModal'));
        yield put(reset('ChangePasswordModal'));
        toastr.add({message: `Operator password successfully updated.`});
    } else {
        const msg = parseErrorMessageInXhr(httpMethods.HTTP_PUT, xhr);
        yield put({ type: UPDATE_PASSWORD_FAILED, errorMessage: 'Error' });
        toastr.add({message: `Failed to update operator password. ${msg}`, type: 'ERROR'});
    }
}

export default function* changeOperatorPasswordSaga() {
    yield takeLatest(UPDATE_PASSWORD, updateOperatorPassword);
}