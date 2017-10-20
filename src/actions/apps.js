import actionTypes from '../constants';

export function fetchApps(id) {
    return {
        type: actionTypes.FETCH_APPS,
        id
    }
};

export function fetchRecentApps(id) {
    return {
        type: actionTypes.FETCH_RECENT_APPS,
        id
    }
};

export function useApp(userid, appId) {
    return {
        type: actionTypes.USE_APP,
        userid,
        appId
    }
};

export function toggleSideBar(bool) {
    return {
        type: actionTypes.SIDEBAR_TOGGLE,
        bool
    }
};

export function fetchAppPermissions(userId, appId) {
    return {
        type: actionTypes.FETCH_APP_PERMISSIONS,
        userId,
        appId
    }
};
