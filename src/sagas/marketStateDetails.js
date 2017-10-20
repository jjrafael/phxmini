import { put, call, fork, select } from 'redux-saga/effects';
import { takeLatest, delay } from 'redux-saga';
import actionTypes from '../constants';
import * as MarketStateDetailsService from '../services/marketStateDetails';
import * as RiskDataService from '../services/riskData';
import { formatFilterDates } from '../utils';
import { toastr } from 'phxComponents/toastr/index';
import { fetchEventMarkets } from '../containersV2/SportsTree/actions';
import { fetchMarketPeriodDetails as fetchMarketPDs } from '../actions/marketStateDetails';
import { closeModal } from 'actions/modal';

function* fetchEventDetails(action) {
    try {
        const eventId = yield select(state => state.marketStateDetails.selectedEventId);
        const { response, xhr } = yield call(MarketStateDetailsService.fetchEventDetails, eventId);
        if(response) {
            yield put({
                type: actionTypes.FETCH_EVENT_DETAILS_SUCCEEDED,
                eventDetails: response
            });
        } else {
            yield put({ type: actionTypes.FETCH_EVENT_DETAILS_FAILED});
        }
    } catch (error) {
        
        yield put({ type: actionTypes.FETCH_EVENT_MARKETS_FAILED});
    }
}

function* changeMarketStatus(action) {
    try {
        const riskParameters = yield select(state => state.riskParameters);
        const activeRiskDataCodeWhenStarted = riskParameters.code;
        const marketIds = action.marketIds.map((marketId) => {
            return marketId.substr(1, marketId.length);
        });
        const { response, xhr } = yield call(MarketStateDetailsService.changeMarketStatus, marketIds.join(','), action.status);
        const { parameters } = yield select(state => state.sportsTree);
        const { event } = yield select(state => state.eventCreatorEvent);
        if(response) {
            yield delay(800);
            let params = yield select(state => state.riskParameters);
            if(params.code === activeRiskDataCodeWhenStarted) {
                const code = yield select(state => state.marketStateDetails.selectedEventId);
                params = { ...params, ...formatFilterDates(params.date), code };
                const { chunk, error } = yield call(RiskDataService.fetchChunkRiskData, params);
                if(chunk.success || error) {
                    yield put({
                        type: actionTypes.CHANGE_MARKETS_STATUS_SUCCEEDED
                    });
                }
            } else {
                yield put({ type: actionTypes.CHANGE_MARKETS_STATUS_SUCCEEDED});   
            }
            toastr.add({message: `Successfully updated market status`});
            yield put(fetchEventMarkets(event.id, parameters, {updateEventMarketCount: true}))
        } else {
            yield put({ type: actionTypes.CHANGE_MARKETS_STATUS_FAILED});
            toastr.add({message: `Falied to updated market status`, type : "ERROR"});
        }
    } catch (error) {
        yield put({ type: actionTypes.CHANGE_MARKETS_STATUS_FAILED});
        toastr.add({message: `Falied to updated market status`, type : "ERROR"});
    }
}

function* abandonMarkets(action) {
    try {
        const riskParameters = yield select(state => state.riskParameters);
        const activeRiskDataCodeWhenStarted = riskParameters.code;
        const marketIds = action.marketIds.map((marketId) => {
            return marketId.substr(1, marketId.length);
        });
        const { response, xhr } = yield call(MarketStateDetailsService.abandonMarkets, marketIds.join(','), action.reasonId, action.reasonNotes);
        const { parameters } = yield select(state => state.sportsTree);
        const { event } = yield select(state => state.eventCreatorEvent);
        if(response) {
            yield delay(800);
            let params = yield select(state => state.riskParameters);
            const code = yield select(state => state.marketStateDetails.selectedEventId);
            params = { ...params, ...formatFilterDates(params.date), code };
            const { chunk, error } = yield call(RiskDataService.fetchChunkRiskData, params);
            if(chunk.success || error) {
                yield put({
                    type: actionTypes.ABANDON_MARKETS_SUCCEEDED
                });
                toastr.add({message: `Successfully abandoned the market.`});
                yield put(fetchEventMarkets(event.id, parameters, {updateEventMarketCount: true}))
            }
        } else {
            yield put({ type: actionTypes.ABANDON_MARKETS_FAILED});
        }
    } catch (error) {
        yield put({ type: actionTypes.ABANDON_MARKETS_FAILED});
    }
}

function* fetchMarketPeriodDetails(action){
    const eventIds = action.eventIds;
    const {response, xhr} = yield call(MarketStateDetailsService.fetchMarketPeriodDetails, eventIds);
    if (response) {
        yield put({type: actionTypes.FETCH_MARKET_PERIOD_DETAILS_SUCCEEDED, periodDetails: response});
    } else {
        yield put({type: actionTypes.FETCH_MARKET_PERIOD_DETAILS_FAILED});
    }
  
}

function* updateMarketCutOffAndAutoOpenDateTime(action) {
    const {response, xhr} = yield call(MarketStateDetailsService.updateMarketCutOffAndAutoOpenDateTime, action.formData);
    if(response) {
        yield put({type: actionTypes.UPDATE_MARKET_CUTOFF_AND_AUTOOPEN_DATETIME_SUCCEEDED, response:response});
        toastr.add({message: `Successfully updated market period details.`});
        const { parameters } = yield select(state => state.sportsTree);
        const { event } = yield select(state => state.eventCreatorEvent);
        yield put(fetchMarketPDs(event.id))
        yield put(fetchEventMarkets(event.id, parameters, {updateEventMarketCount: true}))
        yield put(closeModal('cutOffAndAutoOpenMarket'))
    } else {
        const msg = parseErrorMessageInXhr(httpMethods.HTTP_POST, xhr);
        yield put({type: constants.UPDATE_MARKET_CUTOFF_AND_AUTOOPEN_DATETIME_FAILED});
        toastr.add({message: `Unable to update event. ${msg}`, type: 'ERROR'});
    }
}

export default function* marketStateDetailsSaga() {
    yield takeLatest(actionTypes.FETCH_EVENT_DETAILS, fetchEventDetails);
    yield takeLatest(actionTypes.CHANGE_MARKETS_STATUS, changeMarketStatus);
    yield takeLatest(actionTypes.ABANDON_MARKETS, abandonMarkets);
    yield takeLatest(actionTypes.FETCH_MARKET_PERIOD_DETAILS, fetchMarketPeriodDetails);
    yield takeLatest(actionTypes.UPDATE_MARKET_CUTOFF_AND_AUTOOPEN_DATETIME, updateMarketCutOffAndAutoOpenDateTime);
}