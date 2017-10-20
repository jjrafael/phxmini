import actionTypes from '../constants';

export function startup() {
    return {
        type: actionTypes.STARTUP
    }
}

export function startupApp(appName) {
    return {
        type: actionTypes.STARTUP_APP,
        appName
    }
}