import api from './api';
import appNames from '../constants/appNames';
import { objectToArray } from '../utils';
import { performHttpCall } from 'phxServices/apiUtils';
import httpMethods from 'phxConstants/httpMethods';

let appsListXhr = null;
let recentAppsListXhr = null;
let useAppXhr = null;
let fetchAppPermissionsXhr = null;
const headers = {
    'X-LVS-Datasource': 'database',
    'X-LVS-Cache': 'bypass',
}

export function fetchAppPermissions(userId, appId) {
    const url = `/rest/accounts/${userId}/permissions?extendedResponse=true`;
    return performHttpCall(fetchAppPermissionsXhr, httpMethods.HTTP_GET, url, null, headers)
        .then((response) => ({ response }))
        .catch((xhr) => ({ xhr }));
}

export function fetchApps(id) {
    return new Promise(
        (resolve, reject) => {
            const url = `/rest/accounts/${id}/applications`;   
            if(appsListXhr) {
                appsListXhr.abort();
            }
            appsListXhr = api.get(url, {
                successCallback: (response) => {
                    const allowedApps = objectToArray(appNames);
                    const allowedAppIds = response.map(app => app.applicationId);
                    const appList = response.filter((app) => {
                        return allowedApps.indexOf(app.description) > -1;
                    });
                    resolve({appList, allowedAppIds});
                },
                errorCallback: (xhr, status, error) => {
                    reject(xhr);
                }
            })
            
        })
        .then((response) => ({ response }))
        .catch((xhr) => ({ xhr }));
}

export function fetchRecentApps(id) {
    return new Promise(
        (resolve, reject) => {
            const url = `/rest/accounts/${id}/applications/recentlyused`;   
            if(recentAppsListXhr) {
                recentAppsListXhr.abort();
            }
            recentAppsListXhr = api.get(url, {
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

export function useApp(userid, appId) {
    return new Promise(
        (resolve, reject) => {
            const url = `/rest/accounts/${userid}/applications/use?applicationId=${appId}`;   
            if(useAppXhr) {
                useAppXhr.abort();
            }
            useAppXhr = api.get(url, {
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