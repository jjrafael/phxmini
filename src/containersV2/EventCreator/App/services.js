'use strict';
import { performHttpCall } from 'phxServices/apiUtils';
import httpMethods from 'phxConstants/httpMethods';

let fetchSportOtherOptionsXhr = null;
const headers = {
    'X-LVS-Datasource': 'database'
}

export function fetchSportOtherOptions(code) {
    const url = `/rest/sports/${code.toUpperCase()}`;
    return performHttpCall(fetchSportOtherOptionsXhr, httpMethods.HTTP_GET, url, null, headers)
        .then((response) => ({ response }))
        .catch((xhr) => ({ xhr }));
}