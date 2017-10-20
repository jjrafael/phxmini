import api from '../api';
import appNames from '../../constants/appNames';
import { objectToArray } from '../../utils';

let deleteEventPathXhr = null;
let deleteEventXhr = null;
let saveReorderXhr = null;

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