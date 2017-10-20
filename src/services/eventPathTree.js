import api from './api';
import { addParametersToUrl } from '../utils';

let tree = [];
let markets = {};

let eventPathTreeXhr = null;
let eventMarketXhr = {};

export function resetEventPathTree() {
    tree = [];
    let markets = {};
    eventPathTreeXhr = null;
}

export function fetchEventMarketsCancel(eventId) {
    if(eventMarketXhr[eventId]){
        eventMarketXhr[eventId].abort();
    }
}

export function fetchEventMarkets(eventId, parameters) {
    return new Promise(
        (resolve, reject) => {
            if(eventMarketXhr[eventId]){
                eventMarketXhr[eventId].abort();
            }
            tree = [];
            let url = `/rest/service/eventpaths/event/${eventId}/markets`;
            if(parameters) {
                url = addParametersToUrl(url, parameters);
            }
            eventMarketXhr[eventId] = api.get(url, {
                successCallback: (response) => {
                    resolve(response);
                    markets[eventId] = response;
                },
                errorCallback: (xhr, status, error) => {
                    reject(xhr);
                }
            })
        })
        .then((response) => ({ response }))
        .catch((xhr) => ({ xhr }));
}

export function fetchEventPathTree(eventPathId, parameters, allowedSports) {
    return new Promise(
        (resolve, reject) => {
            if(eventPathTreeXhr){
                eventPathTreeXhr.abort();
            }
            tree = [];
            let url = `/rest/service/eventpaths`;
            if(eventPathId) {
                url += `/${eventPathId}/tree`;
            }
            if(parameters) {
                url = addParametersToUrl(url, parameters);
            }
            eventPathTreeXhr = api.get(url, {
                successCallback: (response) => {
                    if(response.eventPaths) {
                        response.eventPaths = response.eventPaths.filter((eventPath)=> {
                            return true
                            if(typeof allowedSports === 'undefined') {
                                return true
                            } else if(allowedSports.indexOf(eventPath.sportCode) > -1) {
                                return true
                            } else {
                                return false
                            }
                        });
                    }
                    tree = response.eventPaths;
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

export function getChunk(id) {
    return new Promise(
        (resolve, reject) => {
            const chunk = tree.find((element)=> {
                if(typeof id === 'string') {
                    id = Number(id);
                }
                return element.id === id;
            });
            if(chunk) {
                resolve(chunk)
            } else {
                const error = null;
                reject(error);
            }
            
        })
        .then((chunk) => ({ chunk }))
        .catch((error) => ({ error}));
}

export function mapEventPathsToFilter(eventPaths, eventPathSearchString) {
    return eventPaths.map((eventPath)=> {
        let matchedSearchString = eventPath.description.toLowerCase().indexOf(eventPathSearchString) > -1;
        let hasChildThatMatchedSearchString = false;
        let eventPaths = [];
        let events = [];
        if(eventPath.eventPaths && eventPath.eventPaths.length) {
            eventPaths = mapEventPathsToFilter(eventPath.eventPaths, eventPathSearchString);
            const filteredEventPaths = filterEventPaths(eventPath.eventPaths, eventPathSearchString);
            hasChildThatMatchedSearchString = !!filteredEventPaths.length;
            let i = 0;
            for(i = 0; i < eventPath.eventPaths.length; i++) {
                if(eventPath.eventPaths[i].eventPaths && filterEventPaths(eventPath.eventPaths[i].eventPaths, eventPathSearchString).length) {
                    hasChildThatMatchedSearchString = true;
                    break;
                }
                if(eventPath.eventPaths[i].events && filterEventPaths(eventPath.eventPaths[i].events, eventPathSearchString).length) {
                    hasChildThatMatchedSearchString = true;
                    break;
                }
            }
        }
        if(eventPath.events && eventPath.events.length && !hasChildThatMatchedSearchString) {
            events = mapEventPathsToFilter(eventPath.events, eventPathSearchString);
            hasChildThatMatchedSearchString = !!filterEventPaths(eventPath.events, eventPathSearchString).length;
        }
        return { ...eventPath, eventPaths, events, matchedSearchString, hasChildThatMatchedSearchString };
    });
}

function filterEventPaths(eventPaths, eventPathSearchString) {
    return eventPaths.filter((eventPath)=> {
        return eventPath.description.toLowerCase().indexOf(eventPathSearchString) > -1;
    });
}