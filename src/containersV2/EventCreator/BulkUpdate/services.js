'use strict';
import { performHttpCall } from 'phxServices/apiUtils';
import api from 'phxServices/api';
import httpMethods from 'phxConstants/httpMethods';

let applicableTemplatesXhr = null;
const headers = {
    'X-LVS-Datasource': 'database'
};

export function fetchApplicableTemplates(eventPathIds) {
    const ids = eventPathIds.join(',');
    const url = `rest/templates/applicableForMultiple?eventPathIds=${ids}`;
    return performHttpCall(applicableTemplatesXhr, httpMethods.HTTP_GET, url, null, headers)
        .then((response) => ({ response }))
        .catch((xhr) => ({ xhr }));
}

export function putApplicableTemplates(templateObj) {
    return new Promise(
        (resolve, reject) => {
            const url = `rest/events/bulkupdate`;
            if (applicableTemplatesXhr) {
                applicableTemplatesXhr.abort();
            }
            applicableTemplatesXhr = api.put(url, {
                successCallback: (response) => {
                    resolve(true);
                },
                body: JSON.stringify(templateObj),
                errorCallback: (xhr, status, error) => {
                    reject(xhr);
                }
            })
        }
    )
    .then((response) => ({response}))
    .catch((xhr) => ({xhr}));
}
