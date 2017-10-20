import api from './api';
import couponModel from '../models/couponModel';
import filterTypes from '../constants/filterTypes';

let toBasket = null;
let chunkRiskDataXhr = {};
let riskDataXhr = null;
let riskDataUpdateXhr = null;

export function fetchRiskData(params) {
    return new Promise(
        (resolve, reject) => {
            if(riskDataXhr) {
                riskDataXhr.abort();
            }
            if(riskDataUpdateXhr) {
                riskDataUpdateXhr.abort();
            }
            for(var key in chunkRiskDataXhr) {
                chunkRiskDataXhr[key].abort();
                delete chunkRiskDataXhr[key];
            }
            const { code, fromDate, toDate, marketStatusIds, line, bookType, liabilityType, priceType, winPlace } = params;
            let url = `/rest/risks/grid/${code}?virtual=1&marketStatusIds=${marketStatusIds}&lineId=${line}&bookType=${bookType}&liabilityType=${liabilityType}&priceType=${priceType}&winPlace=${winPlace}`;
            toBasket = null;
            if(fromDate) {
                url = `${url}&fromDate=${fromDate}`;
            }
            if(toDate) {
                url = `${url}&toDate=${toDate}`;
            }
            riskDataXhr = api.get(url, {
                successCallback: (response) => {
                    if(response.toBasket) {
                        toBasket = response.toBasket;
                    }
                    couponModel.load(response);
                    // couponModel.processData();
                    resolve({success:true, hasUpdates: true});
                },
                errorCallback: (xhr, status, error) => {
                    reject(xhr);
                }
            })
        })
        .then((response) => ({ response }))
        .catch((xhr) => ({ xhr }));
}

export function fetchChunkRiskData(params) {
    return new Promise(
        (resolve, reject) => {
            const { code, fromDate, toDate, marketStatusIds, line, bookType, liabilityType, priceType, winPlace } = params;
            if(chunkRiskDataXhr[code]) {
                chunkRiskDataXhr[code].abort();
            }
            let url = `/rest/risks/grid/${code}?virtual=1&marketStatusIds=${marketStatusIds}&lineId=${line}&bookType=${bookType}&liabilityType=${liabilityType}&priceType=${priceType}&winPlace=${winPlace}`;
            if(fromDate) {
                url = `${url}&fromDate=${fromDate}`;
            }
            if(toDate) {
                url = `${url}&toDate=${toDate}`;
            }
            if(toBasket) {
                url = `${url}&from=${toBasket}`;
            }
            chunkRiskDataXhr[code] = api.get(url, {
                successCallback: (response) => {
                    try {
                        // if(response.items) {
                            couponModel.update(response, {
                                includeAllUpdates: true
                            });
                            // couponModel.processData();
                        // }
                    } catch(e) {
                    }
                    resolve({success:true});
                },
                errorCallback: (xhr, status, error) => {
                    reject(xhr);
                }
            })
        })
        .then((chunk) => ({ chunk }))
        .catch((xhr) => ({ xhr }));
}

export function updateRiskData(params) {
    return new Promise(
        (resolve, reject) => {
            if(riskDataXhr) {
                riskDataXhr.abort();
            }
            if(riskDataUpdateXhr) {
                riskDataUpdateXhr.abort();
            }
            const { code, fromDate, toDate, marketStatusIds, line, bookType, liabilityType, priceType, winPlace } = params;
            let url = `/rest/risks/grid/${code}?virtual=1&marketStatusIds=${marketStatusIds}&lineId=${line}&bookType=${bookType}&liabilityType=${liabilityType}&priceType=${priceType}&winPlace=${winPlace}`;
            if(fromDate) {
                url = `${url}&fromDate=${fromDate}`;
            }
            if(toDate) {
                url = `${url}&toDate=${toDate}`;
            }
            if(toBasket) {
                url = `${url}&from=${toBasket}`;
            }
            let hasUpdates = false;
            riskDataUpdateXhr = api.get(url, {
                successCallback: (response) => {
                    if(response.toBasket) {
                        toBasket = response.toBasket;
                    }
                    try {
                        couponModel.update(response, {
                            includeAllUpdates: true
                        });
                        if(response.items) {
                            hasUpdates = true;
                            // couponModel.processData();
                        }
                    } catch(e) {
                    }
                    resolve({success:true, hasUpdates});
                },
                errorCallback: (xhr, status, error) => {
                    reject(xhr);
                }
            })
        })
        .then((response) => ({ response }))
        .catch((xhr) => ({ xhr }));
}

function filterMarkets(markets, marketFilter, periodFilter) {
    const allMarkets = marketFilter === filterTypes.MARKETS.ALL_MARKETS;
    const allPeriods = periodFilter === filterTypes.PERIODS.ALL_PERIODS;
    if(allMarkets && allPeriods) {
        return [ ...markets ];
    }
    return markets.filter((market)=> {
        let passedMarketFilter = allMarkets;
        let passedPeriodFilter = allPeriods;
        if(!allMarkets) {
            passedMarketFilter = market.desc.toLowerCase().indexOf(marketFilter.toLowerCase()) > -1;
        }
        if(!allPeriods) {
            passedPeriodFilter = market.period.toLowerCase().replace(/^\s+|\s+$/g, '') === periodFilter.replace(/^\s+|\s+$/g, '').toLowerCase();
        }
        return passedMarketFilter && passedPeriodFilter;
    });
}

function getMarketPeriodsFromEvent(event) {
    let marketPeriods = [];
    event.children.forEach((market) => {
        if(marketPeriods.indexOf(market.periodAbrv) > -1) {
            return
        }
        marketPeriods.push(market.periodAbrv);
    });
    return marketPeriods;
}

export function filterEvents(marketFilter, periodFilter, eventSearchString) {
    const allMarkets = marketFilter === filterTypes.MARKETS.ALL_MARKETS;
    const allPeriods = periodFilter === filterTypes.PERIODS.ALL_PERIODS;
    let events = couponModel.tree.events.map((event) => {
        const marketPeriods = getMarketPeriodsFromEvent(event);
        return { ...event,  children: event.children, marketPeriods }
    });
    if(allMarkets && allPeriods && !eventSearchString.length) {
        couponModel.setFilteredEvents(events);
        return
    }
    if(!allMarkets || !allPeriods || !!eventSearchString.length) {
        events = events.map((event, index)=> {
            let children = [...event.children];
            let matchedSearchString = true;
            if(!allMarkets || !allPeriods) {
                children = filterMarkets(event.children, marketFilter, periodFilter);
            }
            if(eventSearchString && eventSearchString.length) {
                matchedSearchString = event.desc.toLowerCase().indexOf(eventSearchString.toLowerCase()) > -1;
            }
            return { ...event,  children, matchedSearchString };
        });
    }   
    const filteredData = events.filter((event) => {
        return !!event.children.length
    });

    couponModel.setFilteredEvents(filteredData);

}