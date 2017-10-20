import { put, call, fork, select } from 'redux-saga/effects';
import { takeLatest } from 'redux-saga';
import actionTypes from '../constants';
import channelConfig from '../configs/channelConfig';
import * as RiskDataService from '../services/riskData';
import { formatFilterDates } from '../utils';

function* fetchRiskData(action) {
    try {
        yield put({
            type: actionTypes.CLEAR_UNSAVED_OUTCOME_PRICE_CHANGES
        });
        let params = yield select(state => state.riskParameters);
        params = { ...params, ...formatFilterDates(params.date), ...action.params };
        const { response, xhr } = yield call(RiskDataService.fetchRiskData, params);
        RiskDataService.filterEvents(params.market, params.period, params.eventSearchString);
        if(response.success) {
            yield put({
                type: actionTypes.FETCH_RISK_DATA_SUCCEEDED,
                hasUpdates: true
            });
        } else {
            yield put({ type: actionTypes.FETCH_RISK_DATA_FAILED});
        }
    } catch (error) {
        yield put({ type: actionTypes.FETCH_RISK_DATA_FAILED});
    }
}

function* fetchChunkRiskData(action) {
    try {
        let params = yield select(state => state.riskParameters);
        params = { ...params, ...formatFilterDates(params.date), code: action.key };
        const { response, xhr } = yield call(RiskDataService.fetchChunkRiskData, params);
        RiskDataService.filterEvents(params.market, params.period, params.eventSearchString);
        if(response.success) {
            yield put({
                type: actionTypes.FETCH_CHUNK_RISK_DATA_SUCCEEDED,
                key: action.key
            });
        } else {
            yield put({ type: actionTypes.FETCH_CHUNK_RISK_DATA_FAILED});
        }
    } catch (error) {
        yield put({ type: actionTypes.FETCH_CHUNK_RISK_DATA_FAILED});
    }
}

function* updateRiskData(action) {
    try {
        let params = yield select(state => state.riskParameters);
        params = { ...params, ...formatFilterDates(params.date) };
        const { response, xhr } = yield call(RiskDataService.updateRiskData, params);
        if (response.hasUpdates) { // only filter events if there's an update
            RiskDataService.filterEvents(params.market, params.period, params.eventSearchString);
        }
        if(response.success) {
            yield put({
                type: actionTypes.UPDATE_RISK_DATA_SUCCEEDED,
                hasUpdates: response.hasUpdates
            });
        } else {
            yield put({ type: actionTypes.UPDATE_RISK_DATA_FAILED });
        }
    } catch (error) {
        yield put({ type: actionTypes.UPDATE_RISK_DATA_FAILED });
    }
}

function* filterRiskDataByMarket(action) {
    let params = yield select(state => state.riskParameters);
    RiskDataService.filterEvents(action.market, params.period, params.eventSearchString);
    yield put({
        type: actionTypes.FETCH_RISK_DATA_SUCCEEDED
    });
}

function* filterRiskDataByPeriod(action) {
    let params = yield select(state => state.riskParameters);
    RiskDataService.filterEvents(params.market, action.period, params.eventSearchString);
    yield put({
        type: actionTypes.FETCH_RISK_DATA_SUCCEEDED
    });
}

function* filterRiskDataByEventName() {
    let params = yield select(state => state.riskParameters);
    RiskDataService.filterEvents(params.market, params.period, params.eventSearchString);
    yield put({
        type: actionTypes.FETCH_RISK_DATA_SUCCEEDED
    });

}

export default function* riskDataSaga() {
    yield takeLatest(actionTypes.FETCH_RISK_DATA, fetchRiskData);
    yield takeLatest(actionTypes.FETCH_CHUNK_RISK_DATA, fetchChunkRiskData);
    yield takeLatest(actionTypes.UPDATE_RISK_DATA, updateRiskData);
    yield takeLatest(actionTypes.SET_RISK_FILTER_MARKET, filterRiskDataByMarket);
    yield takeLatest(actionTypes.SET_RISK_FILTER_PERIOD, filterRiskDataByPeriod);
    yield takeLatest(actionTypes.SEARCH_EVENTS, filterRiskDataByEventName);
}