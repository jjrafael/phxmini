import api from './api';

const apiConstants = {};

const requests = {};

const keys = {
    wagerLimitsGroups: `/rest/accountwagerlimits/groups`,
    outcomeWagerLimitsActions: `/rest/outcomewagerlimits/actions`,
    liabilityIndicatorsActions: `/rest/liabilityindicators/actions`,
    voidReasons: `/rest/voidreasons/reasons`,
    placeTerms: `/rest/staticdata/placeterms/options`,
    bookTypes: {url: `/rest/books/types`, headers: {'X-LVS-Datasource': 'database'}},
    cancelReasons: `/rest/transactions/cancel/reasons`,
    closureReasons: `/rest/staticdata/closurereasons`,
    accountStatuses: `/rest/staticdata/accountstatuses`,
    riskColumns: `/rest/riskcolumns/all`,
    riskSports: `/rest/sports?setEventTypeEnabled=true`,
    performancePeriods: `/rest/accountperformance/periods`,
    playerProfiles: `/rest/playerprofiles`,
    languages: `/rest/languages`,
    countries: `/rest/countries`,
    referralMethods: `/rest/referralmethods`,
    currencies: `/rest/currencies`,
    securityQuestions: `/rest/securityquestions`,
    origins: `/rest/origins?onlyDisplayed=true`,
    lines: `/rest/lines?onlyActiveLines=true&agentId=-4`,
    packages: `/rest/staticdata/packages`,
    priceFormats: `/rest/prices/formats?&onlyEnabled=true`,
    priceFormatsShort: `/rest/prices/formats?&onlyEnabled=true&description=short`,
    priceFormatsLong: `/rest/staticdata/prices/formats?longDescription=true&onlyEnabled=true`,
    accountTypes: `/rest/staticdata/accounttypes`,
    templates: `/rest/templates`,
    tags: `/rest/eventpaths/tags`,
    channels: `/rest/channels`,
    allOrigins: `/rest/origins`,
    brands: `/m/cms/brands`,
    paymentStatus: '/rest/financials/payments/payrecstatus',
    paymentColumns:'/rest/appcolumns?appId=22',
    paymentRejectReasons : '/rest/staticdata/rejectionReasons',
    wagerLimitsGroupsDescription: ' /rest/wagerlimitgroups?activeOnly=true'
}

export function fetchConstants(keysArray) {
    var promises = [];
    for (var i = 0; i < keysArray.length; i++) {
        const key = keysArray[i];
        let target = keys[key];
        let url, headers;
        if (typeof target === 'object') {
            url = target.url;
            headers = target.headers;
        } else {
            url = target;
            headers = {};
        }
        var promise = new Promise (
            (resolve, reject) => {
                if (apiConstants[key]) {
                    resolve(apiConstants[key]);
                } else {
                    if (requests[key]) {
                        requests[key].abort();
                    }
                    requests[key] = api.get(url, {
                        successCallback: (response) => {
                            apiConstants[key] = response;
                            delete requests[key];
                            resolve(apiConstants[key]);
                        },
                        errorCallback: (xhr, status, error) => {
                            delete requests[key];
                            reject(xhr);
                        },
                        headers
                    })
                }
            });
        promises.push(promise);
    }

    return Promise.all(promises)
        .then((response) => {
            response = apiConstants;
            return { response }
        })
        .catch((xhr) => ({ xhr }))
}