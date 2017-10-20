import { put, call, fork, select } from 'redux-saga/effects';
import { takeLatest, takeEvery, delay } from 'redux-saga';
import actionTypes from '../constants';
import filterTypes from '../constants/filterTypes';
import * as MarketService from '../services/market';
import * as RiskDataService from '../services/riskData';
import { objectToArray, formatFilterDates } from '../utils';

function* changeMarketStatus(action) {
    const riskParameters = yield select(state => state.riskParameters);
    const activeRiskDataCodeWhenStarted = riskParameters.code;
    const { marketKey,status } = action;
    const { response, xhr } = yield call(MarketService.changeMarketStatus, marketKey.substr(1,marketKey.length), status );
    if(response.success) {
        yield delay(800);
        let params = yield select(state => state.riskParameters);
        if(params.code === activeRiskDataCodeWhenStarted) {
            params = { ...params, ...formatFilterDates(params.date), code: marketKey };
            const { chunk, error } = yield call(RiskDataService.fetchChunkRiskData, params);
            if(chunk.success || error) {
                yield put({ type: actionTypes.CHANGE_MARKET_STATUS_SUCCEEDED, key: marketKey });
            }
        } else {
            yield put({ type: actionTypes.CHANGE_MARKET_STATUS_FAILED, key: marketKey });
        }
    } else {
        yield put({ type: actionTypes.CHANGE_MARKET_STATUS_FAILED, key: marketKey });
    }
}

export default function* marketSaga() {
    yield takeEvery(actionTypes.CHANGE_MARKET_STATUS, changeMarketStatus);
}