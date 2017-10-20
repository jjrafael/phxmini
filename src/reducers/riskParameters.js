import actionTypes from '../constants';
import filterTypes from '../constants/filterTypes';
import channelConfig from '../configs/channelConfig';
import { loadFromStorage, saveInStorage } from '../utils';

const initialState = {
    code: null,
    desc: null,
    date: filterTypes.DATES.TODAY,
    eventSearchString: '',
    marketStatusIds: filterTypes.STATUS.ANY_STATUS.value,
    market: filterTypes.MARKETS.ALL_MARKETS,
    period: filterTypes.PERIODS.ALL_PERIODS,
    line: filterTypes.LINES.ALL.value,
    bookType: filterTypes.BOOK_TYPE.ALL.value,
    liabilityType: filterTypes.LIABILITY_TYPE.LIABILITY.value,
    priceType: filterTypes.PRICE_TYPE.PRICED_AND_UNPRICED.value,
    winPlace: filterTypes.WIN_PLACE.WIN.value,
    customDates: [],
    rowHeight: loadFromStorage('GRID_ROW_HEIGHT') || 'Default'
};

export default function (state = initialState, action) {
    switch (action.type) {
        case actionTypes.SET_RISK_FILTER_CODE:
            return { ...state, code: action.code };
        case actionTypes.SET_RISK_FILTER_DESC:
            return { ...state, desc: action.desc };
        case actionTypes.SET_RISK_FILTER_DATE:
            return { ...state, date: action.date };
        case actionTypes.ADD_CUSTOM_DATE_FILTER:
            return { ...state, customDates: [ ...state.customDates, action.customDate ] };
        case actionTypes.SET_RISK_FILTER_MARKET_STATUS_IDS:
            return { ...state, marketStatusIds: action.marketStatusIds };
        case actionTypes.SET_RISK_FILTER_LINE:
            return { ...state, line: action.line };
        case actionTypes.SET_RISK_FILTER_MARKET:
            return { ...state, market: action.market };
        case actionTypes.SET_RISK_FILTER_PERIOD:
            return { ...state, period: action.period };
        case actionTypes.SET_RISK_FILTER_BOOKTYPE:
            return { ...state, bookType: action.bookType };
        case actionTypes.SET_RISK_FILTER_LIABILITY_TYPE:
            return { ...state, liabilityType: action.liabilityType };
        case actionTypes.SET_RISK_FILTER_PRICE_TYPE:
            return { ...state, priceType: action.priceType };
        case actionTypes.SET_RISK_FILTER_WIN_PLACE:
            return { ...state, winPlace: action.winPlace };
        case actionTypes.SET_EVENT_SEARCH_VALUE:
            return { ...state, eventSearchString: action.eventSearchString };
        case actionTypes.RESET_RISK_FILTERS:
            return { ...initialState, code: state.code, date: state.date, eventSearchString: '', rowHeight: state.rowHeight };
        case actionTypes.SET_RISK_ROW_HEIGHT:
            saveInStorage('GRID_ROW_HEIGHT', action.rowHeight);
            return { ...state, rowHeight: action.rowHeight };
        default:
            return { ...state };
    }
}