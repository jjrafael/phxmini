import constants from './constants';

export function fetchFeedHistoryLineup(eventId) {
    return {
        type: constants.FETCH_FEED_HISTORY_LINEUP,
        eventId
    }
}

export function fetchFeedHistoryFeeds(eventId, searchQuery = "") {
    return {
        type: constants.FETCH_FEED_HISTORY_FEEDS,
        eventId,
        searchQuery
    }
}

export function fetchFeedHistoryFeedXML(feedId) {
    return {
        type: constants.FETCH_FEED_HISTORY_FEED_XML,
        feedId
    }
}

export function parseFeedHistoryFeedImportXML(data) {
    return {
        type: constants.PARSE_FEED_HISTORY_FEED_IMPORT_XML,
        data
    }
}

export function processFeedHistoryFeedImportXML(data) {
    return {
        type: constants.PROCESS_FEED_HISTORY_FEED_IMPORT_XML,
        data
    }
}