const filterTypes = {
    DATES: {
        ALL_DATES: 'All Dates',
        NEXT_7_DAYS: 'Next 7 Days',
        TODAY: 'Today',
        TOMORROW: 'Tomorrow',
        FUTURE: 'Future(After Tomorrow)',
        YESTERDAY: 'Yesterday',
        CUSTOM: 'Custom',
    },
    RESULTS_VIEWER_DATES: {
        ALL_DATES: 'All Dates',
        EVENT_2HRS_AGO: 'Event started less that 2 hours ago',
        EVENT_4HRS_AGO: 'Event started less that 4 hours ago',
        TODAY: 'Today',
        YESTERDAY: 'Yesterday',
        CUSTOM: 'Custom',
    },
    PAST_DATES: {
        ALL_DATES: 'All',
        TODAY: 'Today',
        YESTERDAY: 'Yesterday',
        THIS_WEEK: 'This Week',
        THIS_MONTH: 'This Month',
        THIS_QUARTER: 'This Quarter',
        THIS_YEAR: 'This Year',
        CUSTOM: 'Custom'
    },
    OTHER_DATES: { // do not convert into array and use as a whole, only use the props separately
        LAST_7_DAYS: 'Last 7 Days',
        LAST_MONTH: 'Last Month',
        EVENT_2HRS_AGO: 'Event started less that 2 hours ago',
        EVENT_4HRS_AGO: 'Event started less that 4 hours ago',
    },
    MARKETS: {
        ALL_MARKETS: 'All Markets'
    },
    PERIODS: {
        ALL_PERIODS: 'All Periods'
    },
    STANDARD_MARKET_STATUSES: {
        OPEN: { desc: 'Open', value: '1' },
        CLOSED: { desc: 'Closed', value: '8' },
        SUSPENDED: { desc: 'Suspended', value: '2' },
        RESULTED: { desc: 'Resulted', value: '3' },
        SETTLED: { desc: 'Settled', value: '10' }
    },
    STATUS: {
        ANY_STATUS: { desc: 'Any Status', value: '1,2,3,8,10' },
        OPEN_AND_SUSPENDED: { desc: 'Open and Suspended', value: '1,2' },
        CLOSED: { desc: 'Closed', value: '8' },
        CLOSED_RESULTED_AND_SETTLED: { desc: 'Closed, Resulted and Settled', value: '3,8,10' },
        OPEN: { desc: 'Open', value: '1' },
        SUSPENDED: { desc: 'Suspended', value: '2' },
        RESULTED: { desc: 'Resulted', value: '3' },
        SETTLED: { desc: 'Settled', value: '10' },
    },
    BOOK_TYPE: {
        ALL: { desc: 'All Books', value: 'ALL' },
        PREMATCH: { desc: 'Prematch Book', value: 'PREMATCH' },
        LIVE: { desc: 'Live Book', value: 'LIVE' }
    },
    LIABILITY_TYPE: {
        LIABILITY: { desc: 'Liability', value: 'LIABILITY' },
        LIABITY_RUN_UP: { desc: 'Liability Run Up', value: 'LIABILITY_WITH_RUNUP' },
        EXPOSURE: { desc: 'Exposure', value: 'EXPOSURE_ALL' },
        EXPOSURE_RUN_UP: { desc: 'Exposure Run Up', value: 'EXPOSURE_RU' },
        PAYOUT: { desc: 'Payout', value: 'PAYOUT' },
    },
    PRICE_TYPE: {
        PRICED_AND_UNPRICED: { desc: 'Priced and Unpriced', value: 'ALL' },
        PRICED: { desc: 'Priced', value: 'PRICED' },
        UNPRICED: { desc: 'Unpriced', value: 'UNPRICED' },
    },
    LINES: {
        ALL: { desc: 'All lines', value: '0' },
        INTERNET: { desc: 'Internet', value: '2' },
        KENYA: { desc: 'Kenya', value: '12' },
    },
    WIN_PLACE: {
        WIN: { desc: 'Win', value: 'WIN' },
        PLACE: { desc: 'Place', value: 'PLACE' },
    },
    STAKE_TYPES: {
        SINGLES: { desc: 'Singles', value: 'SINGLES' },
        ALL_BETS: { desc: 'All Bets', value: 'ALL_BETS' }
    },
    PROMOTION_LEVEL: {
        NOT_PROMOTED: { desc: 'Not Promoted', value: 'NOT_PROMOTED' },
        PROMOTED: { desc: 'Promoted', value: 'PROMOTED' },
        PINNED:  { desc: 'Pinned', value: 'PINNED' },
    },
    OVERRIDES: {
        NONE: { desc: 'No Override', value: 'NONE' },
        ALPHABET: { desc: 'Alphabetical', value: 'ALPHABET' },
        ROTATION: { desc: 'Rotation/Number', value: 'ROTATION' },
        PRICE: { desc: 'Price Ascending', value: 'PRICE' },
    },
    SORTS: {
        ASC: { desc: 'Ascending', value: 'ASC' },
        DESC: { desc: 'Descending', value: 'DESC' },
        DEFAULT: { desc: 'Default', value: 'DEF' },
    },
    TRANSACTION_DATES:{
        LAST_HOUR: "Last Hour",
        LAST_24: "Last 24H",
        LAST_48: "Last 48H",
        THIS_WEEK: 'This Week',
        LAST_WEEK: 'Last Week',
        THIS_MONTH: 'This Month',
        CUSTOM: 'Custom',
    }
}

export default filterTypes;