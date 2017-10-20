import actionTypes from '../constants';

export function fetchRiskTransactionDetails(transactionId) {
    return {
        type: actionTypes.FETCH_RISK_TRANSACTION_DETAILS,
        transactionId
    }
}

export function manualSettleRiskTransaction(transactionId, isVoid, credit, voidReasonId) {
    return {
        type: actionTypes.MANUAL_SETTLE_RISK_TRANSACTION,
        transactionId,
        isVoid,
        credit,
        voidReasonId
    }
}