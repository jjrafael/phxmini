import actionTypes from '../constants';

const initialState = {
    isFetchingUserColumns: null,
    fetchingUserColumnsFailed: null,
    isFetchingUserSports: null,
    fetchingUserSportsFailed: null,

    isEditingUserColumnsAndSports: null,
    editUserColumnsAndSportsFailed: null,
    
    columns: [],
    sports: []
};

export default function (state = initialState, action) {
    switch (action.type) {
        case actionTypes.FETCH_USER_RISK_COLUMNS:
            return { ...state, isFetchingUserColumns: true, fetchingUserColumnsFailed: false };
        case actionTypes.FETCH_USER_RISK_COLUMNS_SUCCEEDED:
            return { ...state, isFetchingUserColumns: false, columns: action.columns };
        case actionTypes.FETCH_USER_RISK_COLUMNS_FAILED:
            return { ...state, isFetchingUserColumns: false, fetchingUserColumnsFailed: true };

        case actionTypes.FETCH_USER_RISK_SPORTS:
            return { ...state, isFetchingUserSports: true, fetchingUserSportsFailed: false };
        case actionTypes.FETCH_USER_RISK_SPORTS_SUCCEEDED:
            return { ...state, isFetchingUserSports: false, sports: action.sports };
        case actionTypes.FETCH_USER_RISK_SPORTS_FAILED:
            return { ...state, isFetchingUserSports: false, fetchingUserSportsFailed: true };

        case actionTypes.EDIT_USER_RISK_COLUMNS_AND_SPORTS:
            return { ...state, isEditingUserColumnsAndSports: true, editUserColumnsAndSportsFailed: false };
        case actionTypes.EDIT_USER_RISK_COLUMNS_AND_SPORTS_SUCCEEDED:
            return { ...state, isEditingUserColumnsAndSports: false, sports: action.sports, columns: action.columns };
        case actionTypes.EDIT_USER_RISK_COLUMNS_AND_SPORTS_FAILED:
            return { ...state, isEditingUserColumnsAndSports: false, editUserSportsFailed: true };
        default:
            return { ...state };
    }
}