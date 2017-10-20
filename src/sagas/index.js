import { put, call, fork, select } from 'redux-saga/effects';
import actionTypes from '../constants';
import startupSaga from './startup';
import eventPathTreeSaga from './eventPathTree';
import riskDataSaga from './riskData';
import riskAnalysisSaga from './riskAnalysis';
import userRiskPreferencesSaga from './userRiskPreferences';
import marketSaga from './market';
import outcomeSaga from './outcome';
import outcomeWagerLimitsSaga from './outcomeWagerLimits';
import marketStateDetailsSaga from './marketStateDetails';
import riskTransactionSaga from './riskTransaction';
import marketFeedInfoSaga from './marketFeedInfo';
import editMarketSaga from './editMarket';
import userSaga from './user';
import appsSaga from './apps';
import opponentsSaga from 'eventCreatorOpponentsSagas/opponentsSaga';
import playersSaga from 'eventCreatorOpponentsSagas/playersSaga';

import eventSaga from 'containersV2/EventCreator/Event/sagas';
import eventMarketsSaga from 'containersV2/EventCreator/EventMarkets/sagas';
import eventCreatorPathTreeSaga from 'containersV2/EventCreator/Path/sagas';
import sportsTreeSaga from 'containersV2/SportsTree/sagas';
import eventCreatorAppSaga from 'containersV2/EventCreator/App/sagas';
import betRestrictionsSaga from 'containersV2/EventCreator/BetRestrictions/sagas';

import feedHistorySaga from 'containersV2/EventCreator/Event/FeedHistory/sagas';
import gameResultsSaga from 'containersV2/EventCreator/GameResults/sagas';

import instantAction from 'containersV2/InstantAction/sagas';

import operatorManagerSaga from 'containersV2/OperatorManager/App/sagas';
import permissionPanelSaga from 'containersV2/OperatorManager/PermissionPanel/sagas';

import constantsSaga from './constants';

import customerChatSaga from 'containersV2/CustomerChat/sagas';
import operatorListSaga from 'containersV2/OperatorManager/OperatorList/sagas';

import changePasswordSaga from 'containersV2/OperatorManager/OperatorForm/sagas';
import eventCreatorApplicableTemplateSaga from 'containersV2/EventCreator/BulkUpdate/sagas';

// main saga generators
export function* sagas() {
    yield fork(startupSaga);
    yield fork(eventPathTreeSaga);
    yield fork(riskDataSaga);
    yield fork(riskAnalysisSaga);
    yield fork(marketSaga);
    yield fork(outcomeSaga);
    yield fork(outcomeWagerLimitsSaga);
    yield fork(marketStateDetailsSaga);
    yield fork(marketFeedInfoSaga);
    yield fork(editMarketSaga);
    yield fork(riskTransactionSaga);
    yield fork(userSaga);
    yield fork(appsSaga);
    yield fork(userRiskPreferencesSaga);
    yield fork(opponentsSaga);
    yield fork(playersSaga);

    yield fork(eventSaga);
    yield fork(eventMarketsSaga);
    yield fork(eventCreatorPathTreeSaga);
    yield fork(betRestrictionsSaga);
    yield fork(sportsTreeSaga);
    yield fork(eventCreatorAppSaga);

    yield fork(feedHistorySaga);
    yield fork(gameResultsSaga);

    yield fork(instantAction);

    yield fork(operatorManagerSaga);
    yield fork(permissionPanelSaga);

    yield fork(constantsSaga);
    yield fork(customerChatSaga);
    yield fork(operatorListSaga);
    yield fork(changePasswordSaga)
    yield fork(eventCreatorApplicableTemplateSaga);
}
