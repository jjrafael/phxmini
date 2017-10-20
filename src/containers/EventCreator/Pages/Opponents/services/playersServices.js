'use strict'
'use strict';
import { performHttpCall } from 'phxServices/apiUtils';
import httpMethods from 'phxConstants/httpMethods';

let fetchSinglePlayerOfTeamDetailsXhr = null;
let fetchMultiplePlayersOfTeamDetailsXhr = null;
let deletePlayerOfTeamXhr = null;
let deleteAllPlayerOfTeamXhr = null;
let deleteAllPlayerOfEventPathXhr = null;


export function fetchSinglePlayerOfTeamDetails(playerId) {
    let url = `/rest/opponents/${playerId}`;
    return performHttpCall( fetchSinglePlayerOfTeamDetailsXhr, httpMethods.HTTP_GET, url, null )
        .then((response) => ({ response }))
        .catch((xhr) => ({ xhr }));
}

export function fetchMultiplePlayersOfTeamDetails(teamId) {
    let url = `/rest/opponents/${teamId}/players`;
    return performHttpCall( fetchMultiplePlayersOfTeamDetailsXhr, httpMethods.HTTP_GET, url, null )
        .then((response) => ({ response }))
        .catch((xhr) => ({ xhr }));
}

export function addPlayerToTeam(teamId, playerId) {
    let url = `/rest/opponents/${teamId}/${playerId}`;
    return performHttpCall( fetchMultiplePlayersOfTeamDetailsXhr, httpMethods.HTTP_PUT, url, null )
        .then((response) => ({ response }))
        .catch((xhr) => ({ xhr }));
}

export function deletePlayerOfTeam(teamId, playerId) {
    let url = `/rest/opponents/${teamId}/${playerId}`;
    let headers = {
        'X-LVS-Datasource': 'database'
    }
    return performHttpCall( deletePlayerOfTeamXhr, httpMethods.HTTP_DELETE, url, null, headers )
        .then((response) => ({ response }))
        .catch((xhr) => ({ xhr }));
}

export function deleteAllPlayerOfTeam(teamId) {
    let url = `/rest/opponents/${teamId}/players`;
    let headers = {
        'X-LVS-Datasource': 'database'
    }
    return performHttpCall( deleteAllPlayerOfTeamXhr, httpMethods.HTTP_DELETE, url, null, headers )
        .then((response) => ({ response }))
        .catch((xhr) => ({ xhr }));
}

export function deleteAllPlayerOfEventPath(eventPathId) {
    let url =`/rest/eventpaths/${eventPathId}/opponents/players`;
    let headers = {
        'X-LVS-Datasource': 'database'
    }
    return performHttpCall( deleteAllPlayerOfEventPathXhr, httpMethods.HTTP_DELETE, url, null, headers )
        .then((response) => ({ response }))
        .catch((xhr) => ({ xhr }));
}
