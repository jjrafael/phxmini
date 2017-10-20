'use strict';
import { performHttpCall } from 'phxServices/apiUtils';
import httpMethods from 'phxConstants/httpMethods';

let FeedHistoryXhr = null;
const headers = {
    'X-LVS-Datasource': 'database',
    'X-LVS-Cache' : 'bypass',
    'content-type':'application/json'
}

export function fetchFeedHistoryLineup(eventId) {
    const url = `/rest/events/${eventId}/lineup?lineid=2`;
    return performHttpCall(FeedHistoryXhr, httpMethods.HTTP_GET, url, null, headers)
        .then((response) => ({ response }))
        .catch((xhr) => ({ xhr }));
}

export function fetchFeedHistoryFeeds(eventId, searchQuery) {
    let searchParams = searchQuery ? '&filter='+searchQuery: "";
    const url = `/rest/events/${eventId}/feeds?lineid=2${searchParams}`;
    return performHttpCall(FeedHistoryXhr, httpMethods.HTTP_GET, url, null, headers)
        .then((response) => ({ response }))
        .catch((xhr) => ({ xhr }));
}

export function fetchFeedHistoryFeedXML(feedId) {
    const url = `/rest/events/feeds/${feedId}?lineid=2`;
    return performHttpCall(FeedHistoryXhr, httpMethods.HTTP_GET, url, null, headers)
        .then((response) => ({ response }))
        .catch((xhr) => ({ xhr }));
}

export function parseFeedHistoryFeedXML(data) {
    const url = `/rest/feeds/parse?lineid=2`;
    return performHttpCall(FeedHistoryXhr, httpMethods.HTTP_POST, url, data, headers)
        .then((response) => ({ response }))
        .catch((xhr) => ({ xhr }));

}

export function processFeedHistoryFeedXML(data) {
    const url = `/rest/feeds/process?lineid=2`;
    return performHttpCall(FeedHistoryXhr, httpMethods.HTTP_POST, url, data, headers)
        .then((response) => ({ response }))
        .catch((xhr) => ({ xhr }));

}