'use strict';
import { performHttpCall } from 'phxServices/apiUtils';
import httpMethods from 'phxConstants/httpMethods';
import _ from 'underscore';

let fetchOpponentTypesXhr = null;
let fetchSingleOpponentDetailsXhr = null;
let fetchMultipleOpponentsDetailsXhr = null;
let fetchSingleOpponentDetailsWithGradeXhr = null;
let fetchEventPathOpponentsDetailsXhr = null;
let fetchEventPathAncestralOpponentsXhr = null;
let fetchOpponentKitsXhr = null;
let fetchKitPatternsXhr = null;
let addOpponentXhr = null;
let editOpponentXhr = null;
let deleteAllOpponentOfEventPathXhr = null;
let deleteAllOpponentOfEventPathAndUnderXhr = null;
let assignSingleOpponentToEventPathXhr = null;
let assignSingleOpponentToEventPathWithGradeXhr = null;
let changeOpponentGradeXhr = null;
let assignMultipleOpponentsToEventPathXhr = null;
let unAssignOpponentFromEventPathXhr = null;



export function fetchOpponentTypes() {
    let url = '/rest/opponents/types';
    return performHttpCall(fetchOpponentTypesXhr, httpMethods.HTTP_GET, url, null)
        .then((response) => ({ response }))
        .catch((xhr) => ({ xhr }));
}

export function fetchSingleOpponentDetails(opponentId) {
    let url = `/rest/opponents/${opponentId}`;
    return performHttpCall(fetchSingleOpponentDetailsXhr, httpMethods.HTTP_GET, url, null)
        .then((response) => ({ response }))
        .catch((xhr) => ({ xhr }));
}

export function fetchMultipleOpponentsDetails(opponentIdList) {
    let opponentIds = '';

    if (opponentIdList && _.isArray(opponentIdList) && _.size(opponentIdList) > 1) {
        opponentId = _.first(opponentIdList);

        let restOfOpponentIds = _.rest(opponentIdList);
        _.each(restOfOpponentIds, (opponentId) => {
            opponentId += `,${opponentId}`;
        });
    }

    let url = `/rest/opponents/${opponentIds}`;
    return performHttpCall(fetchMultipleOpponentsDetailsXhr, httpMethods.HTTP_GET, url, null)
        .then((response) => ({ response }))
        .catch((xhr) => ({ xhr }));
}

export function fetchSingleOpponentDetailsWithGrade(eventPathId, opponentId) {
    let url = `/rest/eventpaths/${eventPathId}/opponents/${opponentId}`;
    return performHttpCall(fetchSingleOpponentDetailsWithGradeXhr, httpMethods.HTTP_GET, url, null)
        .then((response) => ({ response }))
        .catch((xhr) => ({ xhr }));
}

export function fetchEventPathOpponentsDetails(eventPathId) {
    let url = `/rest/eventpaths/${eventPathId}/opponents`;
    return performHttpCall(fetchEventPathOpponentsDetailsXhr, httpMethods.HTTP_GET, url, null)
        .then((response) => ({ response }))
        .catch((xhr) => ({ xhr }));
}

export function fetchEventPathAncestralOpponents(eventPathId) {
    let url = `/rest/eventpaths/${eventPathId}/opponents/ancestors`;
    return performHttpCall(fetchEventPathAncestralOpponentsXhr, httpMethods.HTTP_GET, url, null)
        .then((response) => ({ response }))
        .catch((xhr) => ({ xhr }));
}

export function fetchOpponentKits(opponentId) {
    let url = `/rest/opponents/${opponentId}/kit`;
    return performHttpCall(fetchOpponentKitsXhr, httpMethods.HTTP_GET, url, null)
        .then((response) => ({ response }))
        .catch((xhr) => ({ xhr }));
}

export function fetchKitPatterns() {
    let url = `/rest/opponents/kit/patterns`;
    return performHttpCall(fetchKitPatternsXhr, httpMethods.HTTP_GET, url, null)
        .then((response) => ({ response }))
        .catch((xhr) => ({ xhr }));
}

export function addOpponent(opponentObj) {
    let url = `/rest/opponents`;
    return performHttpCall(addOpponentXhr, httpMethods.HTTP_POST, url, opponentObj)
        .then((response) => ({ response }))
        .catch((xhr) => ({ xhr }));
}

export function editOpponent(opponentId, opponentObj) {
    let url = `/rest/opponents/${opponentId}`;
    return performHttpCall(editOpponentXhr, httpMethods.HTTP_PUT, url, opponentObj)
        .then((response) => ({ response }))
        .catch((xhr) => ({ xhr }));
}

export function deleteAllOpponentOfEventPath(eventPathId) {
    let url = `/rest/eventpaths/${eventPathId}/opponents`;
    return performHttpCall(deleteAllOpponentOfEventPathXhr, httpMethods.HTTP_DELETE, url, null)
        .then((response) => ({ response }))
        .catch((xhr) => ({ xhr }));
}

export function deleteAllOpponentOfEventPathAndUnder(eventPathId) {
    let url = `/rest/eventpaths/${eventPathId}/opponents?deleteChildren=true`;
    let headers = {
        'X-LVS-Datasource': 'database'
    }
    return performHttpCall(deleteAllOpponentOfEventPathAndUnderXhr, httpMethods.HTTP_DELETE, url, null, headers )
        .then((response) => ({ response }))
        .catch((xhr) => ({ xhr }));
}

export function assignSingleOpponentToEventPath(eventPathId, opponentId) {
    let url = `/rest/eventpaths/${eventPathId}/opponents/${opponentId}`;
    return performHttpCall(assignSingleOpponentToEventPathXhr, httpMethods.HTTP_PUT, url, null)
        .then((response) => ({ response }))
        .catch((xhr) => ({ xhr }));
}

export function assignSingleOpponentToEventPathWithGrade(eventPathId, opponentId, grade) {
    let url = `/rest/eventpaths/${eventPathId}/opponents/${opponentId}?grade=${grade}`;
    return performHttpCall(assignSingleOpponentToEventPathWithGradeXhr, httpMethods.HTTP_PUT, url, null)
        .then((response) => ({ response }))
        .catch((xhr) => ({ xhr }));
}

export function changeOpponentGrade(eventPathId, opponentId, grade) {
    let url = `/rest/eventpaths/${eventPathId}/opponents/${opponentId}?grade=${grade}`;
    return performHttpCall(changeOpponentGradeXhr, httpMethods.HTTP_PUT, url, null)
        .then((response) => ({ response }))
        .catch((xhr) => ({ xhr }));
}

export function assignMultipleOpponentsToEventPath(eventPathId, opponentIdList) {
    let url = `/rest/eventpaths/${eventPathId}/opponents`;
    let body = { opponentIds: opponentIdList };
    return performHttpCall(assignMultipleOpponentsToEventPathXhr, httpMethods.HTTP_PUT, url, body)
        .then((response) => ({ response }))
        .catch((xhr) => ({ xhr }));
}

export function unAssignOpponentFromEventPath(eventPathId, opponentId) {
    let url = `/rest/eventpaths/${eventPathId}/opponents/${opponentId}`;
    let headers = {
        'X-LVS-Datasource': 'database'
    }
    return performHttpCall(unAssignOpponentFromEventPathXhr, httpMethods.HTTP_DELETE, url, null, headers)
        .then((response) => ({ response }))
        .catch((xhr) => ({ xhr }));
}
