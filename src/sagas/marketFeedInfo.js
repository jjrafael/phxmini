import { put, call, fork, select } from 'redux-saga/effects';
import { takeLatest, delay } from 'redux-saga';
import actionTypes from '../constants';
import filterTypes from '../constants/filterTypes';
import couponModel from '../models/couponModel';
import * as MarketFeedInfoService from '../services/marketFeedInfo';
import * as RiskDataService from '../services/riskData';
import { objectToArray, formatFilterDates } from '../utils';

function* fetchMarketFeedInfo(action) {
    let marketIds = action.marketIds;
    let markets = [];
    if(typeof marketIds === 'undefined') {
        marketIds = [];
        const outcomes = yield select(state => state.riskDataChanges.unsavedOutcomePriceChanges);
        for(var key in outcomes) {
            const parentMarket = couponModel.getChunk(key).parentPath;
            const parentMarketId = parentMarket.key.substr(1, parentMarket.key.length);
            if(marketIds.indexOf(parentMarketId) === -1) {
                marketIds.push(parentMarketId);
            }
        }
    }
    for(var i = 0; i < marketIds.length; i++) {
        const market = couponModel.getChunk(`m${marketIds[i]}`);
        markets.push(market);
    }
    yield put({ type: actionTypes.SET_MARKET_FEED_INFO_MARKETS, markets });
    const { response, xhr } = yield call(MarketFeedInfoService.fetchMarketFeedInfo, marketIds);
    if(response) {
        yield put({ type: actionTypes.FETCH_MARKET_FEED_INFO_SUCCEEDED, marketsConnected: response.marketsConnected, linesConnected: response.linesConnected });
    } else {
        yield put({ type: actionTypes.FETCH_MARKET_FEED_INFO_FAILED });
    }
}

function* disconnectMarketFromPriceFeed() {
    const { markets, marketsToDisconnect, linesToDisconnect } = yield select(state => state.marketFeedInfo);
    const marketIds = markets.map((market)=> market.key.substr(1, market.key.length));
    const marketIdsToDisconnect = marketsToDisconnect.map((market)=> market.substr(1, market.length));
    const { response, xhr } = yield call(MarketFeedInfoService.disconnectMarketFromPriceFeed, marketIds, marketIdsToDisconnect, linesToDisconnect);
    if(response) {
        yield put({ type: actionTypes.DISCONNECT_MARKET_FROM_PRICE_FEED_SUCCEEDED });
        yield put({ type: actionTypes.RESET_MARKET_FEED_INFO });
    } else {
        yield put({ type: actionTypes.DISCONNECT_MARKET_FROM_PRICE_FEED_FAILED });
    }
}

export default function* marketFeedInfoSaga() {
    yield takeLatest(actionTypes.FETCH_MARKET_FEED_INFO, fetchMarketFeedInfo);
    yield takeLatest(actionTypes.DISCONNECT_MARKET_FROM_PRICE_FEED, disconnectMarketFromPriceFeed);
}