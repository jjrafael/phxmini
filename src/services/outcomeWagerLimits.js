import api from './api';

let fetchOutcomeWagerLimitsByGroupXhr = null;

export function fetchOutcomeWagerLimitsByGroup(outcomeId, wagerLimitsGroupId) {
    return new Promise(
        (resolve, reject) => {
            if(fetchOutcomeWagerLimitsByGroupXhr) {
                fetchOutcomeWagerLimitsByGroupXhr.abort();
            }
            const url = `/rest/outcomewagerlimits?outcomeId=${outcomeId}&inRunning=0&wagerLimitGroupId=${wagerLimitsGroupId}&marketTypeWagerLimitGroupId=1`;
            fetchOutcomeWagerLimitsByGroupXhr = api.get(url, {
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