'use strict';
import { performHttpCall } from 'phxServices/apiUtils';
import httpMethods from 'phxConstants/httpMethods';
import api from 'phxServices/api';

let fetchMarketsXhr = null;
let fetchMarketXhr = null;
let fetchMarketBooksXhr = null;
let fetchMarketTypesXhr = null;
let fetchMarketPeriodsXhr = null;
let updateMarketDetailsXhr = null;
let updateMarketOutcomesXhr = null;
let updateMarketBooksXhr = null;
let createNewMarketsXhr = null;
let deleteMarketXhr = null;
let headers = {
    'X-LVS-Datasource': 'database'
}

export function fetchMarkets(eventId) {
    const url = `/rest/marketTypes/instances?eventId=${eventId}`;
    return performHttpCall(fetchMarketsXhr, httpMethods.HTTP_GET, url, null)
        .then((response) => ({ response }))
        .catch((xhr) => ({ xhr }));
}

export function fetchMarket(marketId) {
    const url = `/rest/markets/${marketId}?lineId=2&includePrices=true&includeMarketTypes=true`;
    return performHttpCall(fetchMarketXhr, httpMethods.HTTP_GET, url, null, headers)
        .then((response) => ({ response }))
        .catch((xhr) => ({ xhr }));
}

export function fetchMarketBooks(marketId) {
    const url = `/rest/books?marketId=${marketId}&lineId=2`;
    return performHttpCall(fetchMarketBooksXhr, httpMethods.HTTP_GET, url, null, headers)
        .then((response) => ({ response }))
        .catch((xhr) => ({ xhr }));
}

export function fetchMarketTypes(eventId) {
    const url = `/rest/marketTypes/instances?eventId=${eventId}&lineId=2`;
    return performHttpCall(fetchMarketTypesXhr, httpMethods.HTTP_GET, url, null, headers)
        .then((response) => ({ response }))
        .catch((xhr) => ({ xhr }));
}

export function fetchMarketPeriods(eventId) {
    const url = `/rest/periods?eventId=${eventId}&lineId=2`;
    return performHttpCall(fetchMarketPeriodsXhr, httpMethods.HTTP_GET, url, null, headers)
        .then((response) => ({ response }))
        .catch((xhr) => ({ xhr }));
}

export function updateMarketDetails(marketId, data) {
    const url = `/rest/markets/${marketId}?lineId=2`;
    return performHttpCall(updateMarketDetailsXhr, httpMethods.HTTP_PUT, url, data)
        .then((response) => ({ response }))
        .catch((xhr) => ({ xhr }));
}

export function updateMarketOutcomes(marketId, data) {
    const url = `/rest/markets/${marketId}/outcomes?lineId=2`;
    return performHttpCall(updateMarketOutcomesXhr, httpMethods.HTTP_PUT, url, data)
        .then((response) => ({ response }))
        .catch((xhr) => ({ xhr }));
}

export function updateMarketBooks(marketId, data) {
    const url = `/rest/managebooks/${marketId}?lineId=2`;
    return performHttpCall(updateMarketBooksXhr, httpMethods.HTTP_POST, url, data)
        .then((response) => ({ response }))
        .catch((xhr) => ({ xhr }));
}

export function createNewMarkets(eventId, data, hideOutcomesOnCreate) {
    const url = `/rest/events/${eventId}/markets/generate?lineId=2${hideOutcomesOnCreate ? '&hideOutcomes=true' : ''}`;
    return performHttpCall(createNewMarketsXhr, httpMethods.HTTP_POST, url, data)
        .then((response) => ({ response }))
        .catch((xhr) => ({ xhr }));
}

export function deleteMarket(marketId) {
    const url = `/rest/markets/${marketId}?lineId=2`;
    return performHttpCall(deleteMarketXhr, httpMethods.HTTP_DELETE, url, null, headers)
        .then((response) => ({ response }))
        .catch((xhr) => ({ xhr }));
}

export function deleteMarkets(marketIds) {
    const url = `/rest/markets/${marketIds.join(',')}?lineId=2`;
    return performHttpCall(deleteMarketXhr, httpMethods.HTTP_DELETE, url, null, headers)
        .then((response) => ({ response }))
        .catch((xhr) => ({ xhr }));
}

let requests = {};
export function fetchMarketPlayers(players, eventId) {
    let promises = [];
    let playersMap = {};
    for (let i = 0; i < players.length; i++) {
        let id = players[i]
        if (id < 0) { continue; }
        let url = `/rest/opponents/${id}/players?lineId=2`;
        let promise = new Promise (
            (resolve, reject) => {
                if(requests[id]) {
                    requests[id].abort();
                }
                requests[id] = api.get(url, {
                    successCallback: (response) => {
                        playersMap[id] = response;
                        delete requests[id];
                        resolve(response);
                    },
                    errorCallback: (xhr, status, error) => {
                        delete requests[id];
                        reject(xhr);
                    }
                })
            });
        promises.push(promise);
    }

    return Promise.all(promises)
        .then((response) => {
            response = playersMap;
            return { response, eventId }
        })
        .catch((xhr) => ({ xhr }))
}