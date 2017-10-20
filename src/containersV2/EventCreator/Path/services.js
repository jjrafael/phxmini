'use strict';
import api from 'phxServices/api';
import { performHttpCall } from 'phxServices/apiUtils';
import httpMethods from 'phxConstants/httpMethods';

let fetchEventPathDetailsXhr = null;
let addEventPathXhr = null;
let editEventPathXhr = null;
let fetchEventPathTagsXhr = null;

let deleteEventPathXhr = null;
let deleteEventXhr = null;
let saveReorderXhr = null;

'use strict';

let deleteEventPathsXhr = null;
const headers = {
    'X-LVS-Datasource': 'database'
}

export function deleteEventPaths(eventpathIds) {
    const url = `/rest/eventpaths/${eventpathIds.join(',')}`;
    return performHttpCall(deleteEventPathsXhr, httpMethods.HTTP_DELETE, url, null)
        .then((response) => ({ response }))
        .catch((xhr) => ({ xhr }));
}

export function deleteEventPath(eventPathId) {
    return new Promise(
        (resolve, reject) => {
            const url = `/rest/eventpaths/${eventPathId}`;   
            if(deleteEventPathXhr) {
                deleteEventPathXhr.abort();
            }
            deleteEventPathXhr = api.delete(url, {
                successCallback: (response) => {
                    resolve(true);
                },
                errorCallback: (xhr, status, error) => {
                    reject(xhr);
                }
            })
            
        })
        .then((response) => ({ response }))
        .catch((xhr) => ({ xhr }));
}

export function deleteEvent(eventId) {
    return new Promise(
        (resolve, reject) => {
            const url = `/rest/events/${eventId}`;   
            if(deleteEventXhr) {
                deleteEventXhr.abort();
            }
            deleteEventXhr = api.delete(url, {
                successCallback: (response) => {
                    resolve(true);
                },
                errorCallback: (xhr, status, error) => {
                    reject(xhr);
                }
            })
            
        })
        .then((response) => ({ response }))
        .catch((xhr) => ({ xhr }));
}

export function saveReorder(printOrders) {
    return new Promise(
        (resolve, reject) => {
            const url = `/rest/eventpaths/updateprintorders`;
            if(saveReorderXhr) {
                saveReorderXhr.abort();
            }
            saveReorderXhr = api.put(url, {
                successCallback: (response) => {
                    resolve(true);
                },
                body: JSON.stringify(printOrders),
                errorCallback: (xhr, status, error) => {
                    reject(xhr);
                }
            })
        }
    )
    .then((response) => ({ response }))
    .catch((xhr) => ({ xhr }));
}

export function fetchEventPathDetails(eventPathId) {
    return new Promise(
        (resolve, reject) => {
            if(fetchEventPathDetailsXhr) {
                fetchEventPathDetailsXhr.abort();
            }
            let url = `/rest/eventpaths`;
            if(eventPathId) {
                url += `/${eventPathId}`;
            }
            fetchEventPathDetailsXhr = api.get(url, {
                successCallback: (response) => {
                    resolve(response);
                },
                errorCallback: (xhr, status, error) => {
                    reject(xhr);
                },
                headers: {
                    'X-LVS-Datasource': 'database',
                    'X-LVS-Cache': 'bypass'
                }
            })
        })
        .then((response) => ({ response }))
        .catch((xhr) => ({ xhr }));
}


export function addEventPath(newEventPathDetails) {
    return new Promise(
        (resolve, reject) => {
            if(addEventPathXhr) {
                addEventPathXhr.abort();
            }
            const url = `/rest/eventpaths/`;
            const requestBody = newEventPathDetails;
            addEventPathXhr = api.post(url, {
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


export function editEventPath(eventPathId, editedEventPathDetails) {
    return new Promise(
        (resolve, reject) => {
            if(editEventPathXhr) {
                editEventPathXhr.abort();
            }
            const url = `/rest/eventpaths/${eventPathId}`;
            const requestBody = editedEventPathDetails;
            editEventPathXhr = api.put(url, {
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


export function fetchEventPathTags() {
    return new Promise(
        (resolve, reject) => {
            if(fetchEventPathTagsXhr) {
                fetchEventPathTagsXhr.abort();
            }
            const url = `/rest/eventpaths/tags`;
            fetchEventPathTagsXhr = api.get(url, {
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