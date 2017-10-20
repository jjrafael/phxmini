import { put, call, fork, select } from 'redux-saga/effects';
import { takeLatest, delay } from 'redux-saga';
import actionTypes from '../constants';
import * as UserRiskPreferencesService from '../services/userRiskPreferences';
import { objectToArray, formatFilterDates } from '../utils';
import { fetchRiskData } from 'actions/riskData';

function* editUserRiskColumnsAndSports(action) {
    let userId = yield select(state => state.user.details.id);
    const { response, xhr } = yield call(UserRiskPreferencesService.editUserRiskColumnsAndSports, userId, action.columnIds, action.sportCodes);
    if(response) {
        yield put({ type: actionTypes.EDIT_USER_RISK_COLUMNS_AND_SPORTS_SUCCEEDED, columns: action.columnIds, sports: action.sportCodes })
        yield put(fetchRiskData());
    } else {
        yield put({ type: actionTypes.EDIT_USER_RISK_COLUMNS_AND_SPORTS_FAILED })
    }
}

export default function* userRiskPreferencesSaga() {
    yield takeLatest(actionTypes.EDIT_USER_RISK_COLUMNS_AND_SPORTS, editUserRiskColumnsAndSports);
}