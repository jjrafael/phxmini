'use strict';
import { performHttpCall } from 'phxServices/apiUtils';
import httpMethods from 'phxConstants/httpMethods';

let fetchEventXhr = null;
const headers = {
    'X-LVS-Datasource': 'database'
}

export function fetchEvent(eventId) {
    const url = `/rest/events/${eventId}`;
    return performHttpCall(fetchEventXhr, httpMethods.HTTP_GET, url, null, headers)
        .then((response) => ({ response }))
        .catch((xhr) => ({ xhr }));
}

export function fetchEventDefaultMarket(eventId) {
    const url = `/rest/events/defaultMarket?&eventIds=${eventId}&lineId=2`;
    return performHttpCall(fetchEventXhr, httpMethods.HTTP_GET, url, null, headers)
        .then((response) => ({ response }))
        .catch((xhr) => ({ xhr }));
}

export function fetchEventSelectedOpponents(marketId) {
    const url = `/rest/outcomes?marketId=${marketId}&lineId=2`;
    return performHttpCall(fetchEventXhr, httpMethods.HTTP_GET, url, null, headers)
        .then((response) => ({ response }))
        .catch((xhr) => ({ xhr }));
}

export function deleteEvent(eventId) {
    const url = `/rest/events/${eventId}?lineId=2`;
    return performHttpCall(fetchEventXhr, httpMethods.HTTP_DELETE, url, null)
        .then((response) => ({ response }))
        .catch((xhr) => ({ xhr }));
}
export function deleteEvents(eventIds) {
    const url = `/rest/events/${eventIds.join(',')}?lineId=2`;
    return performHttpCall(fetchEventXhr, httpMethods.HTTP_DELETE, url, null)
        .then((response) => ({ response }))
        .catch((xhr) => ({ xhr }));
}

export function updateEvent(eventId, data) {
    const url = `/rest/events/${eventId}?lineId=2`;
    return performHttpCall(fetchEventXhr, httpMethods.HTTP_PUT, url, data)
        .then((response) => ({ response }))
        .catch((xhr) => ({ xhr }));
}

export function fetchOpponents(eventPathId) {
    const url = `/rest/eventpaths/${eventPathId}/opponents`;
    return performHttpCall(fetchEventXhr, httpMethods.HTTP_GET, url, null, headers)
        .then((response) => ({ response }))
        .catch((xhr) => ({ xhr }));
}

export function createEvent(eventPathId, data) {
    const url = `/rest/eventpaths/${eventPathId}/events?lineId=2`;
    return performHttpCall(fetchEventXhr, httpMethods.HTTP_POST, url, data)
        .then((response) => ({ response }))
        .catch((xhr) => ({ xhr }));
}

export function fetchPlayersOfOpponent(opponentId) {
    let url = `/rest/opponents/${opponentId}/players`;
    return performHttpCall( fetchEventXhr, httpMethods.HTTP_GET, url, null )
        .then((response) => ({ response }))
        .catch((xhr) => ({ xhr }));
}
