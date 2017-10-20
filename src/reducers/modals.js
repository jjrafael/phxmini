import actionTypes from '../constants';

const initialState = {
    openModalsCount: 0,
    customEptDate: false,
    marketStateDetails: false,
    abandonMarket: false,
    marketFeedInfo: false,
    editMarket: false,
    saveCancelConfirmation: false,
    outcomeWagerLimits: false,
    editMarketMarketFeedInfo: false,
    riskTransactionDetails: false
};

export default function (state = initialState, action) {
    switch (action.type) {
        case actionTypes.OPEN_MODAL:
            return { ...state,  [action.modalName]: true, openModalsCount: state.openModalsCount + 1};
        case actionTypes.CLOSE_MODAL:
            return { ...state,  [action.modalName]: false,  openModalsCount: state.openModalsCount - 1};
        case actionTypes.CLOSE_ALL_MODALS:
            let newState = {};
            for(var key in state) {
                newState[key] = false
            };
            return { ...newState,  openModalsCount: 0 };
        default:
            return { ...state };
    }
}