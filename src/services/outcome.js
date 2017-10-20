import api from './api';
import couponModel from '../models/couponModel';

let toggleOutcomeVisibilityXhr = {};
let outcomePriceChangeXhr = null;
let fetchOutcomeLinePriceXhr = null;


export function hideOutcome(outcomeId) {
    return new Promise(
        (resolve, reject) => {
            if(toggleOutcomeVisibilityXhr[outcomeId]) {
                toggleOutcomeVisibilityXhr[outcomeId].abort();
            }
            const url = `/rest/outcomes/${outcomeId}/hide`;
            const requestBody = {
                "flags" : [{
                    "type" : "OPERATOR"
                }]
            };
            toggleOutcomeVisibilityXhr[outcomeId] = api.put(url, {
                body: JSON.stringify(requestBody),
                successCallback: (response) => {
                    delete toggleOutcomeVisibilityXhr[outcomeId];
                    resolve({success: true});
                },
                errorCallback: (xhr, status, error) => {
                    delete toggleOutcomeVisibilityXhr[outcomeId];
                    reject(xhr);
                }
            })
        })
        .then((response) => ({ response }))
        .catch((xhr) => ({ xhr }));
}

export function unhideOutcome(outcomeId) {
    return new Promise(
        (resolve, reject) => {
            if(toggleOutcomeVisibilityXhr[outcomeId]) {
                toggleOutcomeVisibilityXhr[outcomeId].abort();
            }
            const url = `/rest/outcomes/${outcomeId}/hide`;
            const requestBody = {
                "flags" : []
            };
            toggleOutcomeVisibilityXhr[outcomeId] = api.put(url, {
                body: JSON.stringify(requestBody),
                successCallback: (response) => {
                    delete toggleOutcomeVisibilityXhr[outcomeId];
                    resolve({success: true});
                },
                errorCallback: (xhr, status, error) => {
                    delete toggleOutcomeVisibilityXhr[outcomeId];
                    reject(xhr);
                }
            })
        })
        .then((response) => ({ response }))
        .catch((xhr) => ({ xhr }));
}

export function changeOutcomePrices(outcomes) {
    return new Promise(
        (resolve, reject) => {
            if(outcomePriceChangeXhr) {
                outcomePriceChangeXhr.abort();
            }
            const url = `/rest/prices/batch`;
            outcomePriceChangeXhr = api.post(url, {
                body: JSON.stringify(outcomes),
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

export function fetchOutcomeLinePrice(outcomeId, lineId) {
    return new Promise(
        (resolve, reject) => {
            if(fetchOutcomeLinePriceXhr) {
                fetchOutcomeLinePriceXhr.abort();
            }
            const url = `/rest/prices?outcomeId=${outcomeId}&lineId=${lineId}`;
            fetchOutcomeLinePriceXhr = api.get(url, {
                successCallback: (response) => {
                    resolve(response);
                },
                errorCallback: (xhr, status, error) => {
                    reject(xhr);
                }
            })
        })
        .then((response) => ({ response }))
        .catch((xhr) => ({ xhr }));
}

export function cancelFetchOutcomeLinePrice() {
    if(fetchOutcomeLinePriceXhr) {
        fetchOutcomeLinePriceXhr.abort();
    }
}