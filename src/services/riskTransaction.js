import api from './api';
import couponModel from '../models/couponModel';

let fetchTransactionDetailsXhr = null;
let manualSettleRiskTransactionXhr = null;

export function fetchRiskTransactionDetails(transactionId) {
    return new Promise(
        (resolve, reject) => {
            if(fetchTransactionDetailsXhr) {
                fetchTransactionDetailsXhr.abort();
            }
            const url = `/rest/analysis/transactions/${transactionId}`;
            fetchTransactionDetailsXhr = api.get(url, {
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

export function manualSettleRiskTransaction(transactionId, isVoid, credit, voidReasonId) {
    return new Promise(
        (resolve, reject) => {
            if(manualSettleRiskTransactionXhr) {
                manualSettleRiskTransactionXhr.abort();
            }
            const url = `/rest/transactions/${transactionId}/manualSettle`;
            const requestBody = {};
            if(isVoid !== null) {
                requestBody.isVoid = isVoid;
            }
            if(credit !== null && typeof credit !== 'undefined') {
                requestBody.credit = credit;
            }
            if(voidReasonId >= 0) {
                requestBody.voidReasonId = voidReasonId;
            }
            manualSettleRiskTransactionXhr = api.put(url, {
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