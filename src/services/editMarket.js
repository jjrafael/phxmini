import api from './api';
import couponModel from '../models/couponModel';

let fetchEditMarketDetailsXhr = null;
let saveEditMarketChangesXhr = null;

export function fetchEditMarketDetails(marketId) {
    return new Promise(
        (resolve, reject) => {
            if(fetchEditMarketDetailsXhr) {
                fetchEditMarketDetailsXhr.abort();
            }
            const url = `/rest/editmarket/${marketId}`;
            fetchEditMarketDetailsXhr = api.get(url, {
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

export function saveEditMarketChanges(marketId, editMarketChanges) {
    return new Promise(
        (resolve, reject) => {
            if(saveEditMarketChangesXhr) {
                saveEditMarketChangesXhr.abort();
            }
            const url = `/rest/editmarket/${marketId}`;
            const requestBody = editMarketChanges;
            saveEditMarketChangesXhr = api.put(url, {
                body: JSON.stringify(requestBody),
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