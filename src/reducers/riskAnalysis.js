import actionTypes from '../constants';

const initialState = {
    activeKey: null,
    isFetchingRiskAnalysisSummary: null,
    fetchingRiskAnalysisSummaryFailed: null,
    riskAnalysisSummary: [],
    isFetchingBetsAnalysis: null,
    fetchingBetsAnalysisFailed: null,
    betsAnalysis: [],
    isFetchingRiskMultipleSummary: null,
    fetchingRiskMultipleSummaryFailed: null,
    multipleSummary: [],
    isFetchingBetData: null,
    fetchingBetDataFailed: null,
    betData: [],
};

export default function (state = initialState, action) {
    switch (action.type) {
        case actionTypes.SET_RISK_ANALYSIS_ACTIVE_KEY:
            return { ...state, activeKey: action.key };
        case actionTypes.RESET_RISK_ANALYSIS:
            return { ...initialState };
        case actionTypes.CLEAR_BET_DATA: 
            return { ...state, betData: [] };

        case actionTypes.FETCH_RISK_ANALYSIS_SUMMARY:
            return { ...state,  isFetchingRiskAnalysisSummary: true, fetchingRiskAnalysisSummaryFailed: false, riskAnalysisSummary: {} };
        case actionTypes.FETCH_RISK_ANALYSIS_SUMMARY_SUCCEEDED:
            return { ...state,  isFetchingRiskAnalysisSummary: false, riskAnalysisSummary: action.riskAnalysisSummary };
        case actionTypes.FETCH_RISK_ANALYSIS_SUMMARY_FAILED:
            return { ...state,  isFetchingRiskAnalysisSummary: false, fetchingRiskAnalysisSummaryFailed: true };

        case actionTypes.FETCH_BETS_ANALYSIS:
            return { ...state,  isFetchingBetsAnalysis: true, fetchingBetsAnalysisFailed: false, betsAnalysis: [] };
        case actionTypes.FETCH_BETS_ANALYSIS_SUCCEEDED:
            return { ...state,  isFetchingBetsAnalysis: false, betsAnalysis: action.betsAnalysis };
        case actionTypes.FETCH_BETS_ANALYSIS_FAILED:
            return { ...state,  isFetchingBetsAnalysis: false, fetchingBetsAnalysisFailed: true };

        case actionTypes.FETCH_RISK_MULTIPLE_SUMMARY:
            return { ...state,  isFetchingRiskMultipleSummary: true, fetchingRiskMultipleSummaryFailed: false, multipleSummary: {} };
        case actionTypes.FETCH_RISK_MULTIPLE_SUMMARY_SUCCEEDED:
            return { ...state,  isFetchingRiskMultipleSummary: false, multipleSummary: action.multipleSummary };
        case actionTypes.FETCH_RISK_MULTIPLE_SUMMARY_FAILED:
            return { ...state,  isFetchingRiskMultipleSummary: false, fetchingRiskMultipleSummaryFailed: true };

        case actionTypes.FETCH_BET_DATA:
            return { ...state,  isFetchingBetData: true, fetchingBetDataFailed: false, betData: [] };
        case actionTypes.FETCH_BET_DATA_SUCCEEDED:
            return { ...state,  isFetchingBetData: false,  betData: action.betData };
        case actionTypes.FETCH_BET_DATA_FAILED:
            return { ...state,  isFetchingBetData: false, fetchingBetDataFailed: true };

        default:
            return { ...state };
    }
}