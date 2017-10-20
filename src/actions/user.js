import actionTypes from '../constants';

export function login(uname, pw) {
    return {
        type: actionTypes.LOGIN,
        uname,
        pw
    }
};

export function logout() {
    return {
        type: actionTypes.LOGOUT
    }
};

export function getUserDetails() {
    return {
        type: actionTypes.SET_USER_DETAILS
    }
};

export function isLoggedIn(isLoggedIn) {
    return {
        type: actionTypes.SET_ISLOGGEDIN,
        isLoggedIn
    }
};