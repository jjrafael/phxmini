import { put, call, fork, select } from 'redux-saga/effects';
import { takeLatest, delay } from 'redux-saga';
import actionTypes from '../constants';
import * as OutcomeWagerLimitsService from '../services/outcomeWagerLimits';
import { objectToArray, formatFilterDates } from '../utils';

function* fetchOutcomeWagerLimitsByGroup(action) {
    const { response, xhr } = yield call(OutcomeWagerLimitsService.fetchOutcomeWagerLimitsByGroup, action.outcomeId, action.wagerLimitGroupId);
    if(response) {
        yield put({ type: actionTypes.FETCH_OUTCOME_WAGER_LIMITS_BY_GROUP_SUCCEEDED, limits: response });
    } else {
        yield put({ type: actionTypes.FETCH_OUTCOME_WAGER_LIMITS_BY_GROUP_FAILED });
    }
}

export default function* outcomeWagerLimitsSaga() {
    yield takeLatest(actionTypes.FETCH_OUTCOME_WAGER_LIMITS_BY_GROUP, fetchOutcomeWagerLimitsByGroup);
}