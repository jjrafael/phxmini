import api from './api';

let editUserColumnsXhr = null;
let editUserSportsXhr = null;

let fetchUserRiskColumnsXhr = null;
let fetchUserSportsXhr = null;

export function fetchUserRiskSports(userId) {
    return new Promise(
        (resolve, reject) => {
            if(fetchUserSportsXhr) {
                fetchUserSportsXhr.abort();
            }
            const url = `/rest/risksports?accountId=${userId}`;
            fetchUserSportsXhr = api.get(url, {
                successCallback: (response) => {
                    resolve(response);
                },
                errorCallback: (xhr, status, error) => {
                    reject(xhr);
                }
            })
        })
        .then((userSports) => ({ userSports }))
        .catch((xhr) => ({ xhr }));
}

export function fetchUserRiskColumns(userId) {
    return new Promise(
        (resolve, reject) => {
            if(fetchUserRiskColumnsXhr) {
                fetchUserRiskColumnsXhr.abort();
            }
            const url = `/rest/riskcolumns?accountId=${userId}`;
            fetchUserRiskColumnsXhr = api.get(url, {
                successCallback: (response) => {
                    resolve(response);
                },
                errorCallback: (xhr, status, error) => {
                    reject(xhr);
                }
            })
        })
        .then((userColumns) => ({ userColumns }))
        .catch((xhr) => ({ xhr }));
}

export function editUserRiskColumnsAndSports(userId, columnIds, sportCodes) {
    var promise1 = new Promise (
            (resolve, reject) => {
                if(editUserSportsXhr) {
                    editUserSportsXhr.abort();
                }
                const url = `/rest/risksports?accountId=${userId}`;
                const requestBody = sportCodes;
                editUserSportsXhr = api.put(url, {
                    body: JSON.stringify(requestBody),
                    successCallback: (response) => {
                        resolve(response);
                    },
                    errorCallback: (xhr, status, error) => {
                        reject(xhr);
                    }
                })
            });

    var promise2 = new Promise (
        (resolve, reject) => {
            if(editUserColumnsXhr) {
                editUserColumnsXhr.abort();
            }
            const url = `/rest/riskcolumns?accountId=${userId}`;
            const requestBody = columnIds;
            editUserColumnsXhr = api.put(url, {
                body: JSON.stringify(requestBody),
                successCallback: (response) => {
                    resolve(response);
                },
                errorCallback: (xhr, status, error) => {
                    reject(xhr);
                }
            })
        });

    return Promise.all([promise1, promise2])
        .then((response) => ({ response }))
        .catch((xhr) => ({ xhr }))
}