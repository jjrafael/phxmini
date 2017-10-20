import api from './api';
import couponModel from '../models/couponModel';

let fetchAnalysisSummaryXhr = null;
let fetchBetsAnalysisXhr = null;
let fetchBetDataXhr = null;

export function fetchAnalysisSummary(key) {
    return new Promise(
        (resolve, reject) => {
            if(fetchAnalysisSummaryXhr) {
                fetchAnalysisSummaryXhr.abort();
            }
            const url = `/rest/analysis/summary/${key}`;
            fetchAnalysisSummaryXhr = api.get(url, {
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

export function fetchBetData(transactionId, transactionType) {
    return new Promise(
        (resolve, reject) => {
            if(fetchBetDataXhr) {
                fetchBetDataXhr.abort();
            }
            let dataType = transactionType || 'betdata';
            const url = `/rest/analysis/${dataType}/${transactionId}`;
            fetchBetDataXhr = api.get(url, {
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

export function fetchBetsAnalysis(key, betType, fromDate, toDate) {
    return new Promise(
        (resolve, reject) => {
            if(fetchBetsAnalysisXhr) {
                fetchBetsAnalysisXhr.abort();
            }
            let url = `/rest/analysis/${betType}/${key}`;
            if(fromDate) {
                url = `${url}?fromDate=${fromDate}`;
            }
            if(toDate) {
                url = `${url}&toDate=${toDate}`;
            }
            fetchBetsAnalysisXhr = api.get(url, {
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

export function fetchMultipleSummary(key) {
    return new Promise(
        (resolve, reject) => {
            if(fetchBetsAnalysisXhr) {
                fetchBetsAnalysisXhr.abort();
            }
            const url = `/rest/analysis/multiplesummary/${key}`;
            fetchBetsAnalysisXhr = api.get(url, {
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