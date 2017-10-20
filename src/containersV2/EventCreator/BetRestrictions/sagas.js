'use strict';
import { put, call, fork, select } from 'redux-saga/effects';
import { takeLatest, takeEvery, delay } from 'redux-saga';
import actionTypes from './constants';
import * as API from './services';
import { fetchMatrixData as fetchMatrixDataAction, updateNewMatrixData, updateBetRestrictionKeys } from './actions';
import { parseErrorMessageInXhr } from 'phxServices/apiUtils';
import httpMethods from 'phxConstants/httpMethods';
import { toastr } from 'phxComponents/toastr/index';

function* fetchBetRestrictionKeys(action) {
    const { id } = action;
    const { response, xhr } = yield call(API.fetchBetRestrictionKeys, id);
    if (response) {
        const { activeAppId } = yield select(state => state.apps);
        yield put({ type: actionTypes.FETCH_BET_RESTRICTION_KEYS_SUCCEEDED, response: response });
        let betType = response[0];
        let param = {
            betRestrictionTypeId: betType.betRestrictionTypeId,
            betTypeGroupId: betType.keys[0].betTypeGroupId,
            transSubTypeId: betType.keys[0].transSubTypeId,
            eventTypeId: betType.keys[0].eventTypeId
        }
        if (activeAppId === 1) {
            const { pathIdForEvent } = yield select(state => state.betRestrictions);
            const { activePathId } = yield select(state => state.sportsTree);
            param.eventPathId = activePathId;
            if (pathIdForEvent) {
                param.eventPathId = pathIdForEvent;
            }
        }
        yield put(fetchMatrixDataAction(param));
    } else {
        yield put({ type: actionTypes.FETCH_BET_RESTRICTION_KEYS_FAILED, errorMessage: 'Error' });
    }
}

function* fetchUnusedBetRestrictionKeys(action) {
    const { id } = action;
    const { response, xhr } = yield call(API.fetchUnusedBetRestrictionKeys, id);
    if (response) {
        const { newMatrixBetType } = yield select(state => state.betRestrictions.newBetRestrictionData);
        if (!newMatrixBetType.betRestrictionTypeId) {
            let betType = response[0];
            let selectedType = {...betType.keys[0], subTypes: [], betRestrictionTypeId: betType.betRestrictionTypeId}
            let param = {
                betRestrictionTypeId: betType.betRestrictionTypeId,
                betTypeGroupId: betType.keys[0].betTypeGroupId,
                transSubTypeId: betType.keys[0].transSubTypeId,
                eventTypeId: betType.keys[0].eventTypeId
            }
            yield put(updateNewMatrixData({newMatrixBetType: param, selectedType}));
        }
        yield put({ type: actionTypes.FETCH_UNUSED_BET_RESTRICTION_KEYS_SUCCEEDED, response: response });

    } else {
        yield put({ type: actionTypes.FETCH_UNUSED_BET_RESTRICTION_KEYS_FAILED, errorMessage: 'Error' });
    }
}

function* fetchSportPeriods(action) {
    const { code } = action;
    const { response, xhr } = yield call(API.fetchSportPeriods, code);
    if (response) {
        yield put({ type: actionTypes.FETCH_SPORT_PERIODS_SUCCEEDED, response: response });
    } else {
        yield put({ type: actionTypes.FETCH_SPORT_PERIODS_FAILED, errorMessage: 'Error' });
    }
}

function* fetchMarketTypeGroups(action) {
    const { params } = action;
    const { response, xhr } = yield call(API.fetchMarketTypeGroups, params);
    if (response) {
        yield put({ type: actionTypes.FETCH_MARKET_TYPE_GROUPS_SUCCEEDED, response: response });
    } else {
        yield put({ type: actionTypes.FETCH_MARKET_TYPE_GROUPS_FAILED, errorMessage: 'Error' });
    }
}

function* fetchBetRestrictionsHistory(action) {
    const { betType } = action;
    const { response, xhr } = yield call(API.fetchBetRestrictionsHistory, betType);
    if (response) {
        yield put({ type: actionTypes.FETCH_BET_RESTRICTIONS_HISTORY_SUCCEEDED, response: response });
    } else {
        yield put({ type: actionTypes.FETCH_BET_RESTRICTIONS_HISTORY_FAILED, errorMessage: 'Error' });
    }
}

function* updateBetRestrictions(action) {
    const { restrictions } = action;
    const { response, xhr } = yield call(API.updateBetRestrictions, restrictions);
    if (response) {
        yield put({ type: actionTypes.UPDATE_BET_RESTRICTIONS_SUCCEEDED, response: response });
        toastr.add({message: `Bet restrictions successfully updated.`});
    } else {
        const msg = parseErrorMessageInXhr(httpMethods.HTTP_POST, xhr);
        yield put({ type: actionTypes.UPDATE_BET_RESTRICTIONS_FAILED, errorMessage: 'Error' });
        toastr.add({message: `Unable to update bet restrictions. ${msg}`, type: 'ERROR'});
    }
}

function* updateBetRestrictionsHistory(action) {
    const { data } = action;
    const { response, xhr } = yield call(API.updateBetRestrictionsHistory, data);
    if (response) {
        yield put({ type: actionTypes.UPDATE_BET_RESTRICTIONS_HISTORY_SUCCEEDED, response: response, data });
        toastr.add({message: `Bet restrictions history successfully updated.`});
    } else {
        const msg = parseErrorMessageInXhr(httpMethods.HTTP_POST, xhr);
        yield put({ type: actionTypes.UPDATE_BET_RESTRICTIONS_HISTORY_FAILED, errorMessage: 'Error' });
        toastr.add({message: `Unable to update bet restrictions history. ${msg}`, type: 'ERROR'});
    }
}

function* restoreBetRestrictionsHistory(action) {
    const { id } = action;
    const { response, xhr } = yield call(API.restoreBetRestrictionsHistory, id);
    if (response) {
        yield put({ type: actionTypes.RESTORE_BET_RESTRICTIONS_HISTORY_SUCCEEDED, response: response, id });
        toastr.add({message: `Bet restrictions history successfully re-stored.`});
        const { activeBetType } = yield select(state => state.betRestrictions);
        yield put(fetchMatrixDataAction(activeBetType));
    } else {
        const msg = parseErrorMessageInXhr(httpMethods.HTTP_POST, xhr);
        yield put({ type: actionTypes.RESTORE_BET_RESTRICTIONS_HISTORY_FAILED, errorMessage: 'Error' });
        toastr.add({message: `Unable to re-store bet restrictions history. ${msg}`, type: 'ERROR'});
    }
}

function* addNewBetRestrictions(action) {
    const { betType, restrictions, newlyAddedRestrictionKey } = action;
    const { response, xhr } = yield call(API.addNewBetRestrictions, betType, restrictions);
    if (response) {
        yield put({
            type: actionTypes.ADD_NEW_BET_RESTRICTION_SUCCEEDED,
            response: response,
            restrictions,
            newlyAddedRestrictionKey
        });
    } else {
        const msg = parseErrorMessageInXhr(httpMethods.HTTP_POST, xhr);
        yield put({ type: actionTypes.ADD_NEW_BET_RESTRICTION_FAILED, errorMessage: 'Error' });
        toastr.add({message: `Unable to add new bet restriction. ${msg}`, type: 'ERROR'});
    }
}

function* createNewBetRestrictionsMatrix(action) {
    const { betType, restrictions, newlyAddedRestrictionKey } = action;
    const { response, xhr } = yield call(API.addNewBetRestrictions, betType, restrictions);
    if (response) {
        const { betTypes, newBetRestrictionData } = yield select(state => state.betRestrictions);
        const { selectedType, isNewMatrix } = newBetRestrictionData;

        let index = betTypes.findIndex(type => type.betRestrictionTypeId === selectedType.betRestrictionTypeId);
        let restrictionType = {...betTypes[index]};
        let targetIndex = restrictionType.keys.findIndex(type => {
            return (type.betTypeGroupId === selectedType.betTypeGroupId &&
                type.transSubTypeId === selectedType.transSubTypeId
            )
        });
        if (targetIndex >= 0) { // it means it exists already
            let target = {...restrictionType.keys[targetIndex]};
            // insert the selected type's subtypes into the target's subtypes
            target.subTypes = [...target.subTypes, ...selectedType.subTypes]
            restrictionType.keys = [
                ...restrictionType.keys.slice(0, targetIndex),
                target,
                ...restrictionType.keys.slice(targetIndex + 1)
            ];

        } else { // just add the selected type to existing keys
            restrictionType.keys = [...restrictionType.keys, selectedType];
        }
        let newBetTypes = [...betTypes.slice(0, index), restrictionType, ...betTypes.slice(index + 1)];
        yield put(updateBetRestrictionKeys(newBetTypes));
        yield put({
            type: actionTypes.CREATE_NEW_BET_RESTRICTIONS_MATRIX_SUCCEEDED,
            response: response,
            betType,
            restrictions,
            newlyAddedRestrictionKey
        });
    } else {
        const msg = parseErrorMessageInXhr(httpMethods.HTTP_POST, xhr);
        yield put({ type: actionTypes.CREATE_NEW_BET_RESTRICTIONS_MATRIX_FAILED, errorMessage: 'Error' });
        toastr.add({message: `Unable to add new bet restriction. ${msg}`, type: 'ERROR'});
    }
}

function* deleteBetRestrictions(action) {
    const { betType, restrictions } = action;
    const { response, xhr } = yield call(API.deleteBetRestrictions, betType, restrictions);
    if (response) {
        yield put({ type: actionTypes.DELETE_BET_RESTRICTIONS_SUCCEEDED, response: response });
        toastr.add({message: `Bet restrictions successfully deleted.`});
    } else {
        const msg = parseErrorMessageInXhr(httpMethods.HTTP_POST, xhr);
        yield put({ type: actionTypes.DELETE_BET_RESTRICTIONS_FAILED, errorMessage: 'Error' });
        toastr.add({message: `Unable to delete bet restrictions. ${msg}`, type: 'ERROR'});
    }
}

function* deleteBetRestrictionsHistory(action) {
    const { id } = action;
    const { response, xhr } = yield call(API.deleteBetRestrictionsHistory, id);
    if (response) {
        yield put({ type: actionTypes.DELETE_BET_RESTRICTIONS_HISTORY_SUCCEEDED, response: response, id });
        toastr.add({message: `Bet restrictions history successfully deleted.`});
    } else {
        const msg = parseErrorMessageInXhr(httpMethods.HTTP_DELETE, xhr);
        yield put({ type: actionTypes.DELETE_BET_RESTRICTIONS_HISTORY_FAILED, errorMessage: 'Error' });
        toastr.add({message: `Unable to delete bet restrictions history. ${msg}`, type: 'ERROR'});
    }
}

function* fetchMatrixData(action) {
    const { activeBetType } = action;
    const { response, xhr } = yield call(API.fetchMatrixData, activeBetType);
    if (response) {
        yield put({ type: actionTypes.FETCH_MATRIX_DATA_SUCCEEDED, response: response });
    } else {
        yield put({ type: actionTypes.FETCH_MATRIX_DATA_FAILED, errorMessage: 'Error' });
    }
}

export default function* eventCreatorPathTreeSaga() {
    yield takeLatest(actionTypes.FETCH_BET_RESTRICTION_KEYS, fetchBetRestrictionKeys);
    yield takeLatest(actionTypes.FETCH_UNUSED_BET_RESTRICTION_KEYS, fetchUnusedBetRestrictionKeys);
    yield takeLatest(actionTypes.FETCH_MATRIX_DATA, fetchMatrixData);
    yield takeLatest(actionTypes.FETCH_SPORT_PERIODS, fetchSportPeriods);
    yield takeLatest(actionTypes.FETCH_MARKET_TYPE_GROUPS, fetchMarketTypeGroups);
    yield takeLatest(actionTypes.FETCH_BET_RESTRICTIONS_HISTORY, fetchBetRestrictionsHistory);
    yield takeLatest(actionTypes.UPDATE_BET_RESTRICTIONS, updateBetRestrictions);
    yield takeLatest(actionTypes.UPDATE_BET_RESTRICTIONS_HISTORY, updateBetRestrictionsHistory);
    yield takeLatest(actionTypes.RESTORE_BET_RESTRICTIONS_HISTORY, restoreBetRestrictionsHistory);
    yield takeLatest(actionTypes.ADD_NEW_BET_RESTRICTION, addNewBetRestrictions);
    yield takeLatest(actionTypes.CREATE_NEW_BET_RESTRICTIONS_MATRIX, createNewBetRestrictionsMatrix);
    yield takeLatest(actionTypes.DELETE_BET_RESTRICTIONS, deleteBetRestrictions);
    yield takeLatest(actionTypes.DELETE_BET_RESTRICTIONS_HISTORY, deleteBetRestrictionsHistory);
}