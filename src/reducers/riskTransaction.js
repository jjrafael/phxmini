import actionTypes from '../constants';

const initialState = {
    isFetchingRiskTransactionDetails: null,
    fetchingRiskTransactionDetailsFailed: null,
    transactionDetails: {},

    isSettlingRiskTransaction: null,
    settlingRiskTransactionFailed: null,
};

export default function (state = initialState, action) {
    switch (action.type) {
        case actionTypes.FETCH_RISK_TRANSACTION_DETAILS:
            return { ...state,  isFetchingRiskTransactionDetails: true, fetchingRiskTransactionDetailsFailed: false };
        case actionTypes.FETCH_RISK_TRANSACTION_DETAILS_SUCCEEDED:
            return { ...state,  isFetchingRiskTransactionDetails: false, transactionDetails: action.transactionDetails };
        case actionTypes.FETCH_RISK_TRANSACTION_DETAILS_FAILED:
            return { ...state,  isFetchingRiskTransactionDetails: false, fetchingRiskTransactionDetailsFailed: true };
        

        case actionTypes.MANUAL_SETTLE_RISK_TRANSACTION:
            return { ...state,  isSettlingRiskTransaction: true, settlingRiskTransactionFailedfetchingRiskTransactionDetailsFailed: false };
        case actionTypes.MANUAL_SETTLE_RISK_TRANSACTION_SUCCEEDED:
            return { ...state,  isSettlingRiskTransaction: false, transactionDetails: action.transactionDetails };
        case actionTypes.MANUAL_SETTLE_RISK_TRANSACTION_FAILED:
            return { ...state,  isSettlingRiskTransaction: false, settlingRiskTransactionFailed: true };

        default:
            return { ...state };
    }
}