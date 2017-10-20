import filterTypes from '../constants/filterTypes';

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
            passedMarketFilter = market.desc.indexOf(marketFilter) > -1;
        }
        if(!allPeriods) {
            passedPeriodFilter = market.period.indexOf(periodFilter) > -1;
        }
        return passedMarketFilter && passedPeriodFilter;
    });
}

export function filterEvents(events, marketFilter, periodFilter) {
    const allMarkets = marketFilter === filterTypes.MARKETS.ALL_MARKETS;
    const allPeriods = periodFilter === filterTypes.PERIODS.ALL_PERIODS;
    if(allMarkets && allPeriods) {
        return [ ...events ];
    }
    return events.filter((event)=> {
        const filteredMarkets = filterMarkets(event.children, marketFilter, periodFilter);
        return filteredMarkets.length
    });
}