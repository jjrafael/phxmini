import api from './api';

export function getParameterByName(paramKey) {
    var url = window.location.href;
    paramKey = paramKey.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + paramKey + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}
