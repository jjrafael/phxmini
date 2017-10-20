import api from './api';

let marketFeedInfoXhr = null;
let disconnectMarketFromPriceFeedXhr = null;


export function fetchMarketFeedInfo(marketIds) {
    return new Promise(
        (resolve, reject) => {
            if(marketFeedInfoXhr) {
                marketFeedInfoXhr.abort();
            }
            const url = `/rest/pricefeeds/${marketIds}`;
            marketFeedInfoXhr = api.get(url, {
                successCallback: (markets) => {
                    let marketsConnected = [];
                    let linesConnected = [];
                    markets.forEach((market)=> {
                        if(market.priceFromFeed && marketsConnected.indexOf(`m${market.marketId}`) === -1) {
                            marketsConnected.push(`m${market.marketId}`);
                        }
                        const marketLinesConnected = findLinesConnected(market.linePriceFeeds);
                        marketLinesConnected.forEach((marketLine)=> {
                            if(linesConnected.indexOf(marketLine) === -1) {
                                linesConnected.push(marketLine);
                            }
                        });
                    });
                    resolve({marketsConnected, linesConnected});
                },
                errorCallback: (xhr, status, error) => {
                    reject(xhr);
                }
            })
        })
        .then((response) => ({ response }))
        .catch((xhr) => ({ xhr }));
}

export function disconnectMarketFromPriceFeed(marketIds, marketIdsToDisconnect, lineIdsToDisconnect) {
    return new Promise(
        (resolve, reject) => {
            if(disconnectMarketFromPriceFeedXhr) {
                disconnectMarketFromPriceFeedXhr.abort();
            }
            const url = `/rest/pricefeeds`;
            const requestBody = [];
            marketIds.forEach((marketId)=> {
                const priceFromFeed = marketIdsToDisconnect.indexOf(marketId) > -1;
                requestBody.push({
                    marketId: Number(marketId),
                    priceFromFeed: !priceFromFeed,
                    linePriceFeeds: lineIdsToDisconnect.map((lineId)=> {
                        return {
                            marketId: Number(marketId),
                            lineId: Number(lineId),
                            derivePrices: false 
                        }
                    })
                })
            });
            disconnectMarketFromPriceFeedXhr = api.put(url, {
                body: JSON.stringify(requestBody),
                successCallback: (response) => {
                    resolve({success: true});
                },
                errorCallback: (xhr, status, error) => {
                    reject(xhr);
                }
            })
        })
        .then((response) => ({ response }))
        .catch((xhr) => ({ xhr }));
}

function findLinesConnected(linePriceFeeds) {
    let linesConnected = [];
    linePriceFeeds.forEach((linePriceFeed)=> {
        if(linePriceFeed.derivePrices && linesConnected.indexOf(linePriceFeed.lineId) === -1) {
            linesConnected.push(linePriceFeed.lineId);
        }
    });
    return linesConnected;
}