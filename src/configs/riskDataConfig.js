import { formatNumber } from '../utils';

const riskDataConfig = {
    autoRefreshInterval: 3000,
    defaultColumnWidth: '100px',
    minColumnWidth: '100px',
    minColumnWidth: '320px',
    defaultColumnDataSource: 'outcomeRisk',
    visibleSpreadMarketTypeGroups: [ 'SPREAD', 'THREE_WAYS_SPREAD', 'TOTALS', 'THREE_WAYS_TOTALS' ],
    defaultResizableSetting: true,
    columns: [
        {
            desc: 'Actions',
            visible: true,
            width: '50px',
            alwaysVisible: true,
            resizable: false
        },
        {
            desc: 'Opponents',
            visible: true,
            dataKeys: ['desc'],
            dataSource: 'outcome',
            width: '200px',
            alwaysVisible: true,
        },
        {
            desc: 'First Price',
            visible: true,
            width: '110px',
            dataKeys: ['fpFormattedSpread', 'firstPrice'],
            dataSource: 'outcome',
            summaryDataKeys: ['firstPriceMargin'],
        },
        {
            desc: 'Last Price',
            visible: true,
            width: '110px',
            allowEdit: true,
            dataKeys: ['priceSource', 'formattedSpread', 'price'],
            dataSource: 'outcome',
            summaryDataKeys: ['currentPriceMargin']
        },
        {
            desc: 'Turnover',
            visible: false,
            width: '80px',
            dataKeys: ['turnover'],
            formatData: (data) => `${formatNumber(data)}`
        },
        {
            desc: 'Turnover By Outcome %',
            visible: true,
            width: '70px',
            dataKeys: ['turnoverByOutcomePercentage'],
            formatData: (data) => `${data}%`
        },
        {
            desc: 'Singles Turnover %',
            visible: true,
            width: '70px',
            dataKeys: ['singlesTurnoverPercentage'],
            formatData: (data) => `${data}%`
        },
        {
            desc: 'Stakes All Bets',
            visible: true,
            width: '80px',
            dataKeys: ['allStake'],
            formatData: (data) => `${formatNumber(data)}`
        },
        {
            desc: 'Stakes Singles',
            visible: true,
            width: '80px',
            dataKeys: ['singlesStake'],
            formatData: (data) => `${formatNumber(data)}`
        },
        {
            desc: 'Stakes in % All Bets',
            visible: true,
            width: '70px',
            dataKeys: ['stakesPercentageAllBets'],
            formatData: (data) => `${data}%`
        },
        {
            desc: 'Stakes in % Singles',
            visible: true,
            width: '70px',
            dataKeys: ['stakesPercentageSingles']
        },
        {
            desc: 'No Bets',
            visible: true,
            dataKeys: ['numberOfBets'],
            width: '50px',
            formatData: (data) => `${formatNumber(data, true)}`
        },
        {
            desc: 'Liability (Variable)',
            visible: true,
            dataKeys: ['liabilityVariable'],
            formatData: (data) => `${formatNumber(data, true)}`
        },
        {
            desc: 'Liability',
            visible: true,
            dataKeys: ['liability'],
            resizable: false,
            formatData: (data) => `${formatNumber(data)}`
        },
        {
            desc: 'Liability Run Up',
            visible: true,
            dataKeys: ['liabilityRU'],
            formatData: (data) => `${formatNumber(data)}`
        },
        {
            desc: 'Exposure',
            visible: true,
            dataKeys: ['exposure'],
            formatData: (data) => `${formatNumber(data)}`
        },
        {
            desc: 'Exposure Run Up',
            visible: true,
            dataKeys: ['exposureRU'],
            formatData: (data) => `${formatNumber(data)}`
        },
        {
            desc: 'Payout',
            visible: true,
            dataKeys: ['payout'],
            formatData: (data) => `${formatNumber(data)}`
        },
        {
            desc: 'Liability Indicator',
            visible: true,
            dataKeys: ['liabilityIndicator'],
            width: '22px',
        },
        {
            desc: 'Liability Singles',
            visible: true,
            dataKeys: ['liabilitySingles'],
            formatData: (data) => `${formatNumber(data)}`
        },
        {
            desc: 'SP Stakes Singlesf',
            visible: true,
            dataKeys: ['spStakesSingles'],
            formatData: (data) => `${formatNumber(data)}`
        },
        {
            desc: 'SP Stakes R/O Last Leg',
            visible: true,
            dataKeys: ['spStakesRoLastLeg'],
            formatData: (data) => `${formatNumber(data)}`
        },
        {
            desc: 'Fixed Odds Stakes Singles',
            visible: true,
            dataKeys: ['fixedStakesSingles'],
            formatData: (data) => `${formatNumber(data, true)}`
        },
        {
            desc: 'Fixed Odds Stakes R/O Last Leg',
            visible: true,
            dataKeys: ['fixedRoLastLeg'],
            formatData: (data) => `${formatNumber(data, true)}`
        },
        {
            desc: 'RU Stakes SP',
            visible: true,
            dataKeys: ['ruStakesSp'],
            formatData: (data) => `${formatNumber(data)}`
        },
        {
            desc: 'RU Stakes Price',
            visible: true,
            dataKeys: ['ruStakesPrice'],
            formatData: (data) => `${formatNumber(data, true)}`
        },
        {
            desc: 'Action',
            visible: true,
            dataKeys: ['action'],
            formatData: (data) => `${formatNumber(data)}`
        },
        {
            desc: 'Decision',
            visible: true,
            dataKeys: ['decision']
        },
        {
            desc: 'Stakes Multiples',
            visible: true,
            dataKeys: ['stakeParlays'],
            formatData: (data) => `${formatNumber(data)}`
        },
        {
            desc: 'Stakes Teasers',
            visible: true,
            dataKeys: ['stakeTeasers']
        },
        {
            desc: 'Stakes If Bets',
            visible: true,
            dataKeys: ['stakeIfbets']
        },
        {
            desc: 'Expected Stake Distribution %',
            visible: true,
            width: '100px',
            dataKeys: ['expectedStakeDistributionPercentage'],
            formatData: (data) => `${data}%`
        },
        {
            desc: 'Stake Deviation %',
            visible: true,
            width: '70px',
            dataKeys: ['stakeDeviationPercentage'],
            formatData: (data) => `${data}%`
        },
        {
            desc: 'Stake Cash Out',
            visible: true,
            dataKeys: ['cashoutStake'],
            displayNullDataAs: '0',
            formatData: (data) => `${formatNumber(data)}`
        },
        {
            desc: 'Profit Cash Out',
            visible: true,
            dataKeys: ['cashoutProfit'],
            formatData: (data) => typeof data === 'undefined' ? '0' : data,
            displayNullDataAs: '0',
            formatData: (data) => `${formatNumber(data)}`
        }
    ],
    getTotalWidth: function() {
        let totalWidth = 0;
        const defaultColumnWidth = this.defaultColumnWidth;
        this.columns.forEach((column) => {
            if(column.visible || column.alwaysVisible) {
                const width = typeof column.width === 'undefined' ? defaultColumnWidth : column.width;
                totalWidth += parseInt(width)
            }
        });
        return totalWidth
    },
    setColumnsVisibility: function(allColumns, visibleColumnIds) {
        for(var i = 0; i < this.columns.length; i++) {
            const column = this.columns[i];
            if(column.alwaysVisible) {
                continue
            }
            const columnMatch = allColumns.find((item)=> item.description.toLowerCase() === column.desc.toLowerCase());
            column.visible = visibleColumnIds.indexOf(columnMatch.id) > -1;
        }
    },
    setColumnWidth: function(columnDesc, width) {
        const column = this.columns.find((column) => {
            return column.desc === columnDesc;
        });
        if(column) {
            column.width = width;
        }
    }
};

export default riskDataConfig;