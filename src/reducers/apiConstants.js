import actionTypes from '../constants';

const initialState = {
    isFetchingApiConstants: null,
    fetchingApiConstantsFailed: null,
    values: {},
};

export default function (state = initialState, action) {
    switch (action.type) {
        case actionTypes.FETCH_API_CONSTANTS:
            return { ...state,  isFetchingApiConstants: true, fetchingApiConstantsFailed: false };
        case actionTypes.FETCH_API_CONSTANTS_SUCCEEDED:
            return { ...state,  isFetchingApiConstants: false, values: {...state.values, ...action.values} };
        case actionTypes.FETCH_API_CONSTANTS_FAILED:
            return { ...state,  isFetchingApiConstants: false, fetchingApiConstantsFailed: true };
        default:
            return { ...state };
    }
}