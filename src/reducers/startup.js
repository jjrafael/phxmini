import actionTypes from '../constants';

const initialState = {
    isStartingUp: null, //for global dependencies and initial app load
    startupFailed: null,
    apps: {},
};

export default function (state = initialState, action) {
    switch (action.type) {
        case actionTypes.STARTUP:
            return { ...state,  isStartingUp: true, startupFailed: false };
        case actionTypes.STARTUP_SUCCEEDED:
            return { ...state,  isStartingUp: false };
        case actionTypes.STARTUP_FAILED:
            return { ...state, isStartingUp: false, startupFailed: true };

        case actionTypes.STARTUP_APP:
            return {
                ...state,
                apps: {
                    ...state.apps,
                    [action.appName]: {
                        isStartingUp: true,
                        startupFailed: false
                    }
                }
            }
        case actionTypes.STARTUP_APP_SUCCEEDED:
            return {
                ...state,
                apps: {
                    ...state.apps,
                    [action.appName]: {
                        isStartingUp: false
                    }
                }
            }
        case actionTypes.STARTUP_APP_FAILED:
            return {
                ...state,
                apps: {
                    ...state.apps,
                    [action.appName]: {
                        isStartingUp: false,
                        startupFailed: true
                    }
                }
            }

        default:
            return { ...state };
    }
}