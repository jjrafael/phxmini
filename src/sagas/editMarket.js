import { put, call, fork, select } from 'redux-saga/effects';
import { takeLatest, delay } from 'redux-saga';
import actionTypes from '../constants';
import * as EditMarketService from '../services/editMarket';
import * as RiskDataService from '../services/riskData';
import { objectToArray, formatFilterDates } from '../utils';
import { fetchEventMarkets } from 'containersV2/SportsTree/actions';
import { getParentEvent } from 'containersV2/SportsTree/helpers';
import { toastr } from 'phxComponents/toastr/index';
import httpMethods from 'phxConstants/httpMethods';
import { parseErrorMessageInXhr } from 'phxServices/apiUtils';

function* fetchEditMarketDetails(action) {
    const { response, xhr } = yield call(EditMarketService.fetchEditMarketDetails, action.marketId);
    if(response) {
        yield put({ type: actionTypes.FETCH_EDIT_MARKET_DETAILS_SUCCEEDED, marketDetails: response });
    } else {
        yield put({ type: actionTypes.FETCH_EDIT_MARKET_DETAILS_FAILED });
    }
}

function* saveEditMarketChanges(action) {
    const { marketId, editMarketChanges } = action;
    var { response, xhr } = yield call(EditMarketService.saveEditMarketChanges, marketId, editMarketChanges);
    if(response) {
        yield delay(800);
        //get new edit market form details
        var { response, xhr } = yield call(EditMarketService.fetchEditMarketDetails, action.marketId);
        if(response) {
            //update risk data table
            let params = yield select(state => state.riskParameters);
            params = { ...params, ...formatFilterDates(params.date), code: `m${marketId}` };
            const { chunk, error } = yield call(RiskDataService.fetchChunkRiskData, params);
            if(chunk.success || error) {
                yield put({ type: actionTypes.CLEAR_SPECIFIC_UNSAVED_OUTCOME_PRICE_CHANGES, marketDetails: response });
                yield put({ type: actionTypes.SAVE_EDIT_MARKET_CHANGES_SUCCEEDED, marketDetails: response });
                const { parameters, pathsMap, activePathId } = yield select(state => state.sportsTree);
                const activePath = pathsMap[activePathId];
                if (activePath) {
                    let eventId;
                    const parentPath = pathsMap[activePath.parentId];
                    if (parentPath.type === 'event') {
                        eventId = parentPath.id;
                    } else if (parentPath.type === 'market') {
                        const event = getParentEvent({pathsMap, path: pathsMap[parentPath.parentId], event: null});
                        if (event) { eventId = event.id; }
                    }
                    if (eventId) {
                        yield put(fetchEventMarkets(eventId, parameters));
                    }
                }
                toastr.add({message: `Market details successfully updated.`});
            } else {
                yield put({ type: actionTypes.SAVE_EDIT_MARKET_CHANGES_FAILED });
                const msg = parseErrorMessageInXhr(httpMethods.HTTP_PUT, xhr);
                toastr.add({message: `Unable to update market details. ${msg}`, type: 'ERROR'});
            }
        } else {
            yield put({ type: actionTypes.SAVE_EDIT_MARKET_CHANGES_FAILED });
            const msg = parseErrorMessageInXhr(httpMethods.HTTP_PUT, xhr);
            toastr.add({message: `Unable to update market details. ${msg}`, type: 'ERROR'});
        }
    } else {
        yield put({ type: actionTypes.SAVE_EDIT_MARKET_CHANGES_FAILED });
        const msg = parseErrorMessageInXhr(httpMethods.HTTP_PUT, xhr);
        toastr.add({message: `Unable to update market details. ${msg}`, type: 'ERROR'});
    }
}

export default function* editMarketSaga() {
    yield takeLatest(actionTypes.FETCH_EDIT_MARKET_DETAILS, fetchEditMarketDetails);
    yield takeLatest(actionTypes.SAVE_EDIT_MARKET_CHANGES, saveEditMarketChanges);
}