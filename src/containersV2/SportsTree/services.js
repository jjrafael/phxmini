'use strict';
import { performHttpCall } from 'phxServices/apiUtils';
import httpMethods from 'phxConstants/httpMethods';

let fetchEPTXhr = null;
const headers = {
    'X-LVS-Datasource': 'database',
    'X-LVS-Cache': 'bypass',
}

export function fetchEPT(sportId, parameters) {
    let url = `/rest/service/eventpaths`;
    if (sportId) {
        url = `${url}/${sportId}/tree`;
    }
    url = `${url}?${parameters}`;
    return performHttpCall(fetchEPTXhr, httpMethods.HTTP_GET, url, null, headers)
        .then((response) => ({ response }))
        .catch((xhr) => ({ xhr }));
}

export function fetchRestrictionEPT(code) {
    let url = `/rest/service/eventpaths/${code}`;
    return performHttpCall(fetchEPTXhr, httpMethods.HTTP_GET, url, null, headers)
        .then((response) => ({ response }))
        .catch((xhr) => ({ xhr }));
}

export function fetchEventMarkets(eventId, parameters) {
    let url = `/rest/service/eventpaths/event/${eventId}/markets?${parameters}`;
    return performHttpCall(fetchEPTXhr, httpMethods.HTTP_GET, url, null, headers)
        .then((response) => ({ response }))
        .catch((xhr) => ({ xhr }));
}

export function saveNewPathsOrder(pathsOrder) {
    let url = `/rest/eventpaths/updateprintorders`;
    return performHttpCall(fetchEPTXhr, httpMethods.HTTP_PUT, url, pathsOrder)
        .then((response) => ({ response }))
        .catch((xhr) => ({ xhr }));
}