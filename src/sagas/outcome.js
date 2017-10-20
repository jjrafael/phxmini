import { put, call, fork, select } from 'redux-saga/effects';
import { takeLatest,takeEvery, delay } from 'redux-saga';
import actionTypes from '../constants';
import filterTypes from '../constants/filterTypes';
import * as OutcomeService from '../services/outcome';
import * as RiskDataService from '../services/riskData';
import { objectToArray, formatFilterDates } from '../utils';

function* toggleOutcomeVisibility(action) {
    const riskParameters = yield select(state => state.riskParameters);
    const activeRiskDataCodeWhenStarted = riskParameters.code;
    const key = action.outcomeData.key;
    const serviceAction = action.isVisible ? OutcomeService.hideOutcome : OutcomeService.unhideOutcome;
    const { response, xhr } = yield call(serviceAction, action.outcomeData.id);
    if(response) {
        yield delay(800);
        let params = yield select(state => state.riskParameters);
        if(params.code === activeRiskDataCodeWhenStarted) {
            params = { ...params, ...formatFilterDates(params.date), code: action.outcomeData.key };
            const { chunk, error } = yield call(RiskDataService.fetchChunkRiskData, params);
            if(chunk.success) {
                yield put({ type: actionTypes.TOGGLE_OUTCOME_VISIBILITY_SUCCEEDED, key });
            } else {
                yield put({ type: actionTypes.TOGGLE_OUTCOME_VISIBILITY_FAILED, key });
            }
        } else {
            yield put({ type: actionTypes.TOGGLE_OUTCOME_VISIBILITY_SUCCEEDED, key });
        }
    } else {
        yield put({ type: actionTypes.TOGGLE_OUTCOME_VISIBILITY_FAILED, key });
    }
}

function* saveOutcomePriceChanges() {
    const code = yield select(state => state.riskParameters.code);
    const outcomes = yield select(state => state.riskDataChanges.unsavedOutcomePriceChanges);
    let lineId = Number(yield select(state => state.riskParameters.line));
    if(lineId === 0) {
        lineId = 2;
    }
    let request = [];
    for(var key in outcomes) {
        request.push({
            decimal: outcomes[key],
            lineId,
            outcomeId: key.substr(1, key.length)
        });
    }
    const { response, xhr } = yield call(OutcomeService.changeOutcomePrices, request);
    if(response) {
        yield delay(800);
        let params = yield select(state => state.riskParameters);
        params = { ...params, ...formatFilterDates(params.date), code };
        const { chunk, error } = yield call(RiskDataService.fetchChunkRiskData, params);
        if(chunk.success || error) {  
            yield put({ type: actionTypes.SAVE_OUTCOME_PRICE_CHANGES_SUCCEEDED });
        }
    } else {
        yield put({ type: actionTypes.SAVE_OUTCOME_PRICE_CHANGES_FAILED });
    }
}

function* fetchOutcomeLinePrice(action) {
    const { response, xhr } = yield call(OutcomeService.fetchOutcomeLinePrice, action.outcomeId, action.lineId);
    if(response) {
        yield put({ type: actionTypes.FETCH_OUTCOME_PRICE_BY_LINE_SUCCEEDED, price: response.format, outcomeId: action.outcomeId});
    } else {
        yield put({ type: actionTypes.FETCH_OUTCOME_PRICE_BY_LINE_FAILED });
    }
}

function* cancelFetchOutcomeLinePrice() {
    OutcomeService.cancelFetchOutcomeLinePrice();
}

export default function* outcomeSaga() {
    yield takeEvery(actionTypes.TOGGLE_OUTCOME_VISIBILITY, toggleOutcomeVisibility);
    yield takeLatest(actionTypes.SAVE_OUTCOME_PRICE_CHANGES, saveOutcomePriceChanges);


    yield takeLatest(actionTypes.FETCH_OUTCOME_PRICE_BY_LINE, fetchOutcomeLinePrice);
    yield takeLatest(actionTypes.CANCEL_FETCH_OUTCOME_PRICE_BY_LINE, cancelFetchOutcomeLinePrice);


}