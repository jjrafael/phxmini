import constants from './constants';
import { select, put, call } from 'redux-saga/effects';
import { takeLatest } from 'redux-saga';
import * as API from './services';
import { toastr } from 'phxComponents/toastr/index';
import { fetchFeedHistoryLineup as fetchLineup } from './actions';
import _ from 'underscore';

function* fetchFeedHistoryLineup(action) {
    const {response, xhr} = yield call(API.fetchFeedHistoryLineup, action.eventId);
    if (response) {
        yield put({type: constants.FETCH_FEED_HISTORY_LINEUP_SUCCEEDED, response:response});
    } else {
        yield put({type: constants.FETCH_FEED_HISTORY_LINEUP_FAILED});
    }
};

function* fetchFeedHistoryFeeds(action) {
    const {response, xhr} = yield call(API.fetchFeedHistoryFeeds, action.eventId, action.searchQuery);
    if (response) {
        yield put({type: constants.FETCH_FEED_HISTORY_FEEDS_SUCCEEDED, response:response});
    } else {
        yield put({type: constants.FETCH_FEED_HISTORY_FEEDS_FAILED});
    }
};

function* fetchFeedHistoryFeedXML(action) {
    const {response, xhr} = yield call(API.fetchFeedHistoryFeedXML, action.feedId);
    if (response) {
        yield put({type: constants.FETCH_FEED_HISTORY_FEED_XML_SUCCEEDED, response:response});
    } else {
        yield put({type: constants.FETCH_FEED_HISTORY_FEED_XML_FAILED});
    }
};

function* parseFeedHistoryFeedXML(action) {
    const {response, xhr} = yield call(API.parseFeedHistoryFeedXML, action.data);
    if (response) {
        yield put({type: constants.PARSE_FEED_HISTORY_FEED_IMPORT_XML_SUCCEEDED, response:response});
    } else {
        yield put({type: constants.PARSE_FEED_HISTORY_FEED_IMPORT_XML_FAILED});
    }
};

function* processFeedHistoryFeedXML(action) {
    const {response, xhr} = yield call(API.processFeedHistoryFeedXML, action.data);
    if (response) {
        let event = {};
        if(response.contents.length){
             event = response.contents[0];
        }
        yield put({type: constants.PROCESS_FEED_HISTORY_FEED_IMPORT_XML_SUCCEEDED, response:response});

        if(!_.isEmpty(event) && event.queueType === "PROCESSED")
            toastr.add({message: `Event imported successfully.`});
        else 
            toastr.add({message: `Event has errors, import cancelled.`, type: 'ERROR'});
    } else {
        yield put({type: constants.PROCESS_FEED_HISTORY_FEED_IMPORT_XML_FAILED});
    }
};

export default function* eventSaga() {
    yield takeLatest(constants.FETCH_FEED_HISTORY_LINEUP, fetchFeedHistoryLineup);
    yield takeLatest(constants.FETCH_FEED_HISTORY_FEEDS, fetchFeedHistoryFeeds);
    yield takeLatest(constants.FETCH_FEED_HISTORY_FEED_XML, fetchFeedHistoryFeedXML);
    yield takeLatest(constants.PARSE_FEED_HISTORY_FEED_IMPORT_XML, parseFeedHistoryFeedXML);
    yield takeLatest(constants.PROCESS_FEED_HISTORY_FEED_IMPORT_XML, processFeedHistoryFeedXML);
}