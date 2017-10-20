'use strict';
import { performHttpCall } from 'phxServices/apiUtils';
import httpMethods from 'phxConstants/httpMethods';

import api from './api';
import couponModel from '../models/couponModel';

let changeMarketStatusXhr = null;
let fetchEventXhr = null;
const headers = {
    'X-LVS-Datasource': 'database',
    'X-LVS-Cache' : 'bypass'
}

export function fetchEventDetails(eventId) {
    return new Promise(
        (resolve, reject) => {
            const eventDetails = couponModel.getChunk(eventId);
            if(eventDetails) {
                resolve(eventDetails);
            } else {
                reject('Error');
            }
        })
        .then((response) => ({ response }))
        .catch((xhr) => ({ xhr }));
}

export function changeMarketStatus(marketIds, status) {
    return new Promise(
        (resolve, reject) => {
            if(changeMarketStatusXhr) {
                changeMarketStatusXhr.abort();
            }
            const url = `/rest/markets/${marketIds}`;
            const requestBody = {
                status
            }
            changeMarketStatusXhr = api.put(url, {
                body: JSON.stringify(requestBody),
                successCallback: (response) => {
                    resolve({success: true});
                },
                errorCallback: (xhr, status, error) => {
                    reject(xhr);
                }
            })
        })
        .then((response) => ({ response }))
        .catch((xhr) => ({ xhr }));
}

export function abandonMarkets(marketIds, voidReasonId, voidReasonNotes) {
    return new Promise(
        (resolve, reject) => {
            if(changeMarketStatusXhr) {
                changeMarketStatusXhr.abort();
            }
            const url = `/rest/markets/${marketIds}/abandon`;
            const requestBody = {
                voidReasonId,
                voidReasonNotes
            }
            changeMarketStatusXhr = api.put(url, {
                body: JSON.stringify(requestBody),
                successCallback: (response) => {
                    resolve({success: true});
                },
                errorCallback: (xhr, status, error) => {
                    reject(xhr);
                }
            })
        })
        .then((response) => ({ response }))
        .catch((xhr) => ({ xhr }));
}

export function fetchMarketPeriodDetails(eventIds) {
    const url = `/rest/markets?lineId=2&eventIds=${eventIds}`;
    return performHttpCall(fetchEventXhr, httpMethods.HTTP_GET, url, null, headers)
        .then((response) => ({ response }))
        .catch((xhr) => ({ xhr }));
}

export function updateMarketCutOffAndAutoOpenDateTime(formData) {
    const url = `/rest/markets?lineId=2`;
     return performHttpCall(fetchEventXhr, httpMethods.HTTP_PUT, url, formData)
        .then((response) => ({ response }))
        .catch((xhr) => ({ xhr }));
}