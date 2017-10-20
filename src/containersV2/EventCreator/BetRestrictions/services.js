'use strict';
import { performHttpCall } from 'phxServices/apiUtils';
import httpMethods from 'phxConstants/httpMethods';

let fetchBetRestrictionKeysXhr = null;
let fetchUnusedBetRestrictionKeysXhr = null;
let fetchMatrixDataXhr = null;
let fetchSportPeriodsXhr = null;
let fetchSportMarketTypeGroupsXhr = null;
let fetchBetRestrictionsHistoryXhr = null;
let updateBetRestrictionsXhr = null;
let updateBetRestrictionsHistoryXhr = null;
let deleteBetRestrictionsHistoryXhr = null;
let restoreBetRestrictionsHistoryXhr = null;
const headers = {
    'X-LVS-Datasource': 'database',
    'X-LVS-Cache': 'bypass',
}

export function fetchBetRestrictionKeys(id) {
    let url = `/rest/betrestrictions/keys`;
    if (id) {
        url = `${url}?eventTypeId=${id}`;
    }
    return performHttpCall(fetchBetRestrictionKeysXhr, httpMethods.HTTP_GET, url, null, headers)
        .then((response) => ({ response }))
        .catch((xhr) => ({ xhr }));
}

export function fetchUnusedBetRestrictionKeys(id) {
    let url = `/rest/betrestrictions/unusedkeys`;
    return performHttpCall(fetchUnusedBetRestrictionKeysXhr, httpMethods.HTTP_GET, url, null, headers)
        .then((response) => ({ response }))
        .catch((xhr) => ({ xhr }));
}

export function fetchSportPeriods(code) {
    let url = `/rest/periods?code=${code}`;
    return performHttpCall(fetchSportPeriodsXhr, httpMethods.HTTP_GET, url, null, headers)
        .then((response) => ({ response }))
        .catch((xhr) => ({ xhr }));
}

export function fetchMarketTypeGroups(params) {
    let url = `/rest/staticdata/markettypegroups${params}`;
    return performHttpCall(fetchSportMarketTypeGroupsXhr, httpMethods.HTTP_GET, url, null, headers)
        .then((response) => ({ response }))
        .catch((xhr) => ({ xhr }));
}

export function fetchBetRestrictionsHistory(betType) {
    let { betTypeGroupId, transSubTypeId, betRestrictionTypeId } = betType;
    let url = `/rest/betrestrictions/history?betTypeGroupId=${betTypeGroupId}&transSubTypeId=${transSubTypeId}&betRestrictionTypeId=${betRestrictionTypeId}`;
    return performHttpCall(fetchBetRestrictionsHistoryXhr, httpMethods.HTTP_GET, url, null, headers)
        .then((response) => ({ response }))
        .catch((xhr) => ({ xhr }));
}

export function updateBetRestrictions(restrictions) {
    let url = `/rest/betrestrictions`;
    return performHttpCall(updateBetRestrictionsXhr, httpMethods.HTTP_POST, url, restrictions)
        .then((response) => ({ response }))
        .catch((xhr) => ({ xhr }));
}

export function updateBetRestrictionsHistory(data) {
    let url = `/rest/betrestrictions/history`;
    return performHttpCall(updateBetRestrictionsHistoryXhr, httpMethods.HTTP_POST, url, data)
        .then((response) => ({ response }))
        .catch((xhr) => ({ xhr }));
}
export function restoreBetRestrictionsHistory(id) {
    let url = `/rest/betrestrictions/restore?brHistoryId=${id}`;
    return performHttpCall(restoreBetRestrictionsHistoryXhr, httpMethods.HTTP_POST, url, null)
        .then((response) => ({ response }))
        .catch((xhr) => ({ xhr }));
}

export function addNewBetRestrictions(betType, restrictions) {
    let { betTypeGroupId, transSubTypeId, betRestrictionTypeId, eventPathId } = betType;
    let url = `/rest/betrestrictions/addCriteria?betTypeGroupId=${betTypeGroupId}&transSubTypeId=${transSubTypeId}&betRestrictionTypeId=${betRestrictionTypeId}&persist=false`;
    if (eventPathId) {
        url = `${url}&eventPathId=${eventPathId}`;
    }
    return performHttpCall(updateBetRestrictionsXhr, httpMethods.HTTP_POST, url, restrictions)
        .then((response) => ({ response }))
        .catch((xhr) => ({ xhr }));
}

export function deleteBetRestrictions(betType, restrictions) {
    let { betTypeGroupId, transSubTypeId, betRestrictionTypeId } = betType;
    let url = `/rest/betrestrictions/removeCriteria?betTypeGroupId=${betTypeGroupId}&transSubTypeId=${transSubTypeId}&betRestrictionTypeId=${betRestrictionTypeId}&persist=true`;
    return performHttpCall(updateBetRestrictionsXhr, httpMethods.HTTP_POST, url, restrictions)
        .then((response) => ({ response }))
        .catch((xhr) => ({ xhr }));
}

export function deleteBetRestrictionsHistory(id) {
    let url = `/rest/betrestrictions/history?brHistoryId=${id}`;
    return performHttpCall(deleteBetRestrictionsHistoryXhr, httpMethods.HTTP_DELETE, url, null)
        .then((response) => ({ response }))
        .catch((xhr) => ({ xhr }));
}

export function fetchMatrixData({betTypeGroupId, transSubTypeId, betRestrictionTypeId, eventPathId}) {
    let url = `/rest/betrestrictions?betTypeGroupId=${betTypeGroupId}&transSubTypeId=${transSubTypeId}&betRestrictionTypeId=${betRestrictionTypeId}`;
    if (eventPathId !== undefined) {
        url = `${url}&eventPathId=${eventPathId}`;
    }
    return performHttpCall(fetchMatrixDataXhr, httpMethods.HTTP_GET, url, null, headers)
        .then((response) => ({ response }))
        .catch((xhr) => ({ xhr }));
}