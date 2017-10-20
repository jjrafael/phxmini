'use strict';
import { performHttpCall } from 'phxServices/apiUtils';
import httpMethods from 'phxConstants/httpMethods';

let GameResultsXhr = null;
const headers = {
    'X-LVS-Datasource': 'database',
    'X-LVS-Cache' : 'bypass',
    'content-type':'application/json'
}

export function fetchGameResultsPeriodPoints(eventId) {
    const url = `/rest/events/${eventId}/periodscores?lineid=2`;
    return performHttpCall(GameResultsXhr, httpMethods.HTTP_GET, url, null, headers)
        .then((response) => ({ response }))
        .catch((xhr) => ({ xhr }));
}

export function updateGameResultsPeriodPoints(formData) {
    const url = `/rest/periodscores?lineid=2`;
    return performHttpCall(GameResultsXhr, httpMethods.HTTP_POST, url, formData, headers)
        .then((response) => ({ response }))
        .catch((xhr) => ({ xhr }));
}

export function updateGameResultsVoidPeriod(formData) {
    const url = `/rest/periodscores/voidperiod?lineid=2`;
    return performHttpCall(GameResultsXhr, httpMethods.HTTP_POST, url, formData, headers)
        .then((response) => ({ response }))
        .catch((xhr) => ({ xhr }));
}

