import actionTypes from '../constants';

const initialState = {
    details: {
        id: '',
        username: ''
    },
    isLoggedIn: false,
    isLoggingIn: null,
    logInFailed: null,
    errMsg: 'Something went wrong while logging in. Please try again later.'
};

export default function (state = initialState, action) {
    switch (action.type) {
        case actionTypes.LOGIN:
            return { ...state, isLoggingIn: true, logInFailed: false };
        case actionTypes.LOGIN_SUCCEEDED:
            return { ...state, isLoggingIn: false, isLoggedIn: true, details: action.details };
        case actionTypes.LOGIN_FAILED:
            return { ...state, isLoggingIn: false, logInFailed: true, errMsg: action.errMsg, isLoggedIn: false };
        case actionTypes.SET_ISLOGGEDIN:
            return { ...state, isLoggedIn: action.isLoggedIn };
        case actionTypes.LOGOUT:
            return { ...state, isLoggedIn: false };
        case actionTypes.SET_USER_DETAILS:
            return { ...state, details: action.details };
        default:
            return { ...state };
    }
}