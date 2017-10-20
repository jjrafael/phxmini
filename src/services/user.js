import api from './api';

let userXhr = {};

export function fetchUserDetails(userId) {
    return new Promise(
        (resolve, reject) => {
            const url = `/rest/accounts/${userId}`;   
            if(userXhr[url]) {
                userXhr[url].abort();
            }
            userXhr[url] = api.get(url, {
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

export function login(uname, pw) {
    return new Promise(
        (resolve, reject) => {
            const url = `/rest/accounts/operator/${uname}?password=${pw}`;   
            if(userXhr[url]) {
                userXhr[url].abort();
            }
            userXhr[url] = api.get(url, {
                successCallback: (response) => {
                    const userDetails = {
                        id: response.id,
                        username: uname
                    }
                    resolve(userDetails);
                },
                errorCallback: (xhr, status, error) => {
                    reject(xhr);
                }
            })
        })
        .then((response) => ({ response }))
        .catch((xhr) => ({ xhr }));
}

export function logout() {
    api.logout();
}

export function isLoggedIn() {
    return new Promise(
        (resolve, reject) => {
            api.isLoggedIn((response) => {
                if(typeof response !== 'undefined') { 
                    resolve(!!response);
                } else{
                    reject(null)
                }
            });
        })
        .then((isLoggedIn) => ({ isLoggedIn }))
        .catch((xhr) => ({ xhr }));
}