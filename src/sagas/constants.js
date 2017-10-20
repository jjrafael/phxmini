import { put, call, fork, select } from 'redux-saga/effects';
import { takeLatest, delay } from 'redux-saga';
import actionTypes from '../constants';
import { toastr } from 'phxComponents/toastr/index';

const errMsg = 'Something went wrong while connecting to server, please try again later.';

function* renderGenericErrorToastMessage() {
    toastr.add({message: errMsg, type: 'ERROR'})
};

export default function* constantsSaga() {
    // yield takeLatest(actionTypes.FETCH_OUTCOME_WAGER_LIMITS_BY_GROUP, fetchOutcomeWagerLimitsByGroup);
}
export {renderGenericErrorToastMessage}