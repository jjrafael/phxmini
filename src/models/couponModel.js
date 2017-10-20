import api from '../services/api';
import Model from 'sports-model';
import riskDataConfig from '../configs/riskDataConfig';
import { getMarketStatusFromFlags, formatDateTimeString } from '../utils';

const couponModel = new Model({
    api,
    eventPage: true,
    openMarketsOnly: false,
});

let filteredEvents = [];
let data = [];

function _isUnpriced(flags) {
    return !!flags && flags.indexOf('unpriced') > -1;
}

function _isHidden(hiddenFlag) {
    if(hiddenFlag && !!Object.keys(hiddenFlag).length) {
        return true
    }
    return false
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

function extractMarketData(market) { // this was done to minimize data stored to processed data
    const { key, desc, flags, marketTypeGroup } = market;
    const marketSummary = market.children.find((child) => child.key.charAt(0) === 's');
    const parentEvent = { ...market.parentPath };
    const hasVariableSpreadData = marketSummary && marketSummary.variableSpreadDataItem && Object.keys(marketSummary.variableSpreadDataItem).length;
    return {
        key,
        desc,
        flags,
        id: Number(key.substr(1,key.length)),
        height: hasVariableSpreadData ? 64 : 25,
        variableSpreadDataItem: hasVariableSpreadData ? marketSummary.variableSpreadDataItem : null
    }
}

function formatColumnData(value, column, outcomeData) {
    if((value === null || typeof value === 'undefined') && !!column.displayNullDataAs && !_isUnpriced(outcomeData.flags)) {
        value = column.displayNullDataAs;
    } else if(value === null && typeof value === 'undefined') {
        return null
    }
    if(typeof value !== 'undefined' && typeof column.formatData === 'function') {
        value = column.formatData(value);
    }
    return value;
}

function extractOutcomeColumnData(dataSource, column, rowData, dataKeys) {
    if(!dataSource || !column.dataKeys) {
        return null
    }
    dataKeys = dataKeys || column.dataKeys;
    if(dataKeys.length === 1 ) {
        const dataKey = dataKeys[0];
        let value = typeof dataSource !== 'undefined' ? dataSource[dataKey] : null;
        value = formatColumnData(value, column, rowData);
        return value;
    } else {
        const columnData = {};
        for(var i = 0; i < dataKeys.length; i++) {
            const dataKey = dataKeys[i];
            let value = typeof dataSource !== 'undefined' ? dataSource[dataKey] : null;
            value = formatColumnData(value, column, rowData);
            columnData[dataKey] = value;
        }
        return JSON.stringify(columnData); // return an object if it has multiple values
    }
}

function extractOutcomeData(outcome) {
    const outcomeData = {};
    for(var c = 0; c < riskDataConfig.columns.length; c++) {
        const column = riskDataConfig.columns[c];
        const { dataKeys } = column;
        const dataSource = column.dataSource === 'outcome' ? outcome : outcome['outcomeRisk'];
        outcomeData[column.desc] = extractOutcomeColumnData(dataSource, column, outcome);
    }
    return outcomeData;
}

function extractMarketSummaryData(marketSummary) {
    const marketSummaryData = {};
    for(var c = 0; c < riskDataConfig.columns.length; c++) {
        if(c < 2) continue
        const column = riskDataConfig.columns[c];
        const keys = column.summaryDataKeys || column.dataKeys;
        const dataSource = column.dataSource === 'outcome' ? marketSummary : marketSummary['outcomeRisk'];
        marketSummaryData[column.desc] = extractOutcomeColumnData(dataSource, column, marketSummary, keys);
    }
    return marketSummaryData;
}


couponModel.setFilteredEvents = function(filtered) {
    filteredEvents = filtered;
}

couponModel.getFilteredEvents = function() {
    return filteredEvents;
}

couponModel.processData = function() {
    const { events } = couponModel.tree;
    const data = []
    if(!events || !events.length) {
        return [];
    }
    for(var e = 0; e < events.length; e++) { // events
        const event = events[e];
        const { desc, start } = event;
        data.push({
            type: 'event',
            desc,
            start,
            marketPeiods: getMarketPeriodsFromEvent(event),
            rowHeight: 35
        });
        for(var m = 0; m < event.children.length; m++) { // markets
            const market = event.children[m];
            const marketStatus = getMarketStatusFromFlags(market.flags);
            const marketToPush = {
                ...extractMarketData(market),
                type: 'market',
                status: marketStatus,
                parentEventMarkets: event.children.map((child)=> extractMarketData(child)),
            }
            data.push(marketToPush);
            for(var r = 0; r < market.children.length; r++) { // outcomes and market summary
                const child = market.children[r];
                const { key } = child;
                const id = key.substr(1,key.length);
                if(child.key.charAt(0) === 'o') {
                    data.push({
                        ...extractOutcomeData(child),
                        type: 'outcome',
                        marketStatus,
                        key,
                        id,
                        isHidden: _isHidden(child.hiddenFlag),
                        isOpen: !market.flags || market.flags.indexOf('resulted') === -1 && market.flags.indexOf('settled') === -1,
                    });
                } else if(child.key.charAt(0) === 's') {
                    data.push({
                        ...extractMarketSummaryData(child),
                        type: 'marketSummary',
                        key,
                        id,
                        [riskDataConfig.columns[1].desc]: formatDateTimeString(event.start),
                        marketStatus,
                    });
                }
            }
        }
    }

    couponModel.processedData = data;
}



export default couponModel;