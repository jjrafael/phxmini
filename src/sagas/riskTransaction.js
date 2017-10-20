import { put, call, fork, select } from 'redux-saga/effects';
import { takeLatest, delay } from 'redux-saga';
import actionTypes from '../constants';
import * as RiskTransactionService from '../services/riskTransaction';
import { objectToArray, formatFilterDates } from '../utils';

function* fetchRiskTransactionDetails(action) {
    const { response, xhr } = yield call(RiskTransactionService.fetchRiskTransactionDetails, action.transactionId);
    if(response) {
        yield put({ type: actionTypes.FETCH_RISK_TRANSACTION_DETAILS_SUCCEEDED, transactionDetails: response });
    } else {
        yield put({ type: actionTypes.FETCH_RISK_TRANSACTION_DETAILS_FAILED });
    }
}

function* manualSettleRiskTransaction(action) {
    var { response, xhr } = yield call(RiskTransactionService.manualSettleRiskTransaction, action.transactionId, action.isVoid, action.credit, action.voidReasonId);
    if(response && response.success) {
        yield put({ type: actionTypes.MANUAL_SETTLE_RISK_TRANSACTION_SUCCEEDED });
    } else {
        yield put({ type: actionTypes.MANUAL_SETTLE_RISK_TRANSACTION_FAILED });
    }
}

export default function* riskTransactionSaga() {
    yield takeLatest(actionTypes.FETCH_RISK_TRANSACTION_DETAILS, fetchRiskTransactionDetails);
    yield takeLatest(actionTypes.MANUAL_SETTLE_RISK_TRANSACTION, manualSettleRiskTransaction);
}