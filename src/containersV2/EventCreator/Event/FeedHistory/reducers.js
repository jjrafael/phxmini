'use strict';
import constants from './constants';

const initialState = {
    lineup : null,
    feeds : null,
    feedXML : null,
    parsedFeedXMLData : null,
    processedFeedXMLData : null,

    isFetchingFeedHistoryLineup : true,
    isFetchingFeedHistoryLineupFailed : false,

    isFetchingFeedHistoryFeeds : true,
    isFetchingFeedHistoryFeedsFailed : false,

    isFetchingFeedHistoryFeedXML : true,
    isFetchingFeedHistoryFeedXMLFailed : false,

    isParsingFeedHistoryFeedXML : true,
    isParsingFeedHistoryFeedXMLFailed : false,

    isProcessingFeedHistoryFeedXML : false,
    isProcessingFeedHistoryFeedXMLFailed : false,
}

const eventCreatorAppFeedHistory = (state = initialState, action) => {
    switch(action.type) {
        case constants.FETCH_FEED_HISTORY_LINEUP:
            return {
                ...state,
                isFetchingFeedHistoryLineup : true
            }
        case constants.FETCH_FEED_HISTORY_LINEUP_SUCCEEDED:
            return {
                ...state,
                lineup: action.response,
                isFetchingFeedHistoryLineup : false
            }
        case constants.FETCH_FEED_HISTORY_LINEUP_FAILED:
            return {
                ...state,
                isFetchingFeedHistoryLineupFailed: true
            }

        case constants.FETCH_FEED_HISTORY_FEEDS:
            return {
                ...state,
                isFetchingFeedHistoryFeeds : true
            }
        case constants.FETCH_FEED_HISTORY_FEEDS_SUCCEEDED:
            return {
                ...state,
                feeds: action.response,
                isFetchingFeedHistoryFeeds : false
            }
        case constants.FETCH_FEED_HISTORY_FEEDS_FAILED:
            return {
                ...state,
                isFetchingFeedHistoryFeedsFailed: true
            }

        case constants.FETCH_FEED_HISTORY_FEED_XML:
            return {
                ...state,
                isFetchingFeedHistoryFeedXML : true
            }
        case constants.FETCH_FEED_HISTORY_FEED_XML_SUCCEEDED:
            return {
                ...state,
                feedXML: action.response,
                isFetchingFeedHistoryFeedXML : false
            }
        case constants.FETCH_FEED_HISTORY_FEED_XML_FAILED:
            return {
                ...state,
                isFetchingFeedHistoryFeedXMLFailed: true
            }

        case constants.PARSE_FEED_HISTORY_FEED_IMPORT_XML:
            return {
                ...state,
                isParsingFeedHistoryFeedXML : true
            }
        case constants.PARSE_FEED_HISTORY_FEED_IMPORT_XML_SUCCEEDED:
            return {
                ...state,
                parsedFeedXMLData: action.response,
                isParsingFeedHistoryFeedXML : false
            }
        case constants.PARSE_FEED_HISTORY_FEED_IMPORT_XML_FAILED:
            return {
                ...state,
                isParsingFeedHistoryFeedXMLFailed: true
            }

        case constants.PROCESS_FEED_HISTORY_FEED_IMPORT_XML:
            return {
                ...state,
                isProcessingFeedHistoryFeedXML : true
            }
        case constants.PROCESS_FEED_HISTORY_FEED_IMPORT_XML_SUCCEEDED:
            const parsedFeedXMLData = {...state.parsedFeedXMLData};
            const processedFeedXMLData = {...action.response.contents[0]};
            parsedFeedXMLData.contents[0].queueType = processedFeedXMLData.queueType;
            return {
                ...state,
                // processedFeedXMLData: action.response,
                parsedFeedXMLData: processedFeedXMLData.eventDescription === null ? parsedFeedXMLData : action.response,
                isProcessingFeedHistoryFeedXML : false
            }
        case constants.PROCESS_FEED_HISTORY_FEED_IMPORT_XML_FAILED:
            return {
                ...state,
                isProcessingFeedHistoryFeedXML: false
            }
        default:
            return {...state};
    }
}

export default eventCreatorAppFeedHistory;