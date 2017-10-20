import { put, call, fork, select } from 'redux-saga/effects';
import { takeLatest, delay } from 'redux-saga';
import actionTypes from '../constants';
import * as RiskAnalysisService from '../services/riskAnalysis';
import { objectToArray, formatFilterDates } from '../utils';

function* fetchAnalysisSummary(action) {
    const { response, xhr } = yield call(RiskAnalysisService.fetchAnalysisSummary, action.key);
    if(response) {
        yield put({ type: actionTypes.FETCH_RISK_ANALYSIS_SUMMARY_SUCCEEDED, riskAnalysisSummary: response });
    } else {
        yield put({ type: actionTypes.FETCH_RISK_ANALYSIS_SUMMARY_FAILED });
    }
}

function* fetchBetsAnalysis(action) {
    let fromDate, toDate;
    if(action.fromDate && action.toDate) {
        fromDate = action.fromDate;
        toDate = action.toDate;
    } else {
        fromDate = formatFilterDates(action.date).fromDate;
        toDate = formatFilterDates(action.date).toDate;
    }
    const { response, xhr } = yield call(RiskAnalysisService.fetchBetsAnalysis, action.key, action.betType, fromDate, toDate);
    if(response) {
        yield put({ type: actionTypes.FETCH_BETS_ANALYSIS_SUCCEEDED, betsAnalysis: response });
    } else {
        yield put({ type: actionTypes.FETCH_BETS_ANALYSIS_FAILED });
    }
}

function* fetchMultipleSummary(action) {
    const { response, xhr } = yield call(RiskAnalysisService.fetchMultipleSummary, action.key);
    if(response) {
        yield put({ type: actionTypes.FETCH_RISK_MULTIPLE_SUMMARY_SUCCEEDED, multipleSummary: response });
    } else {
        yield put({ type: actionTypes.FETCH_RISK_MULTIPLE_SUMMARY_FAILED });
    }
}

function* fetchBetData(action) {
    const { response, xhr } = yield call(RiskAnalysisService.fetchBetData, action.transactionId, action.transactionType);
    if(response) {
        yield put({ type: actionTypes.FETCH_BET_DATA_SUCCEEDED, betData: response });
    } else {
        yield put({ type: actionTypes.FETCH_BET_DATA_FAILED });
    }
}

export default function* riskAnalysisSaga() {
    yield takeLatest(actionTypes.FETCH_RISK_ANALYSIS_SUMMARY, fetchAnalysisSummary);
    yield takeLatest(actionTypes.FETCH_BETS_ANALYSIS, fetchBetsAnalysis);
    yield takeLatest(actionTypes.FETCH_RISK_MULTIPLE_SUMMARY, fetchMultipleSummary);
    yield takeLatest(actionTypes.FETCH_BET_DATA, fetchBetData);
}