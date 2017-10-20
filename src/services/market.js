import api from './api';
import couponModel from '../models/couponModel';

let changeMarketStatusXhr = {};


export function changeMarketStatus(marketId, status) {
    return new Promise(
        (resolve, reject) => {
            if(changeMarketStatusXhr[marketId]) {
                changeMarketStatusXhr[marketId].abort();
            }
            const url = `/rest/markets/${marketId}`;
            const requestBody = {
                status
            }
            changeMarketStatusXhr = api.put(url, {
                body: JSON.stringify(requestBody),
                successCallback: (response) => {
                    delete changeMarketStatusXhr[marketId];
                    resolve({success: true});
                },
                errorCallback: (xhr, status, error) => {
                    delete changeMarketStatusXhr[marketId];
                    reject(xhr);
                }
            })
        })
        .then((response) => ({ response }))
        .catch((xhr) => ({ xhr }));
}