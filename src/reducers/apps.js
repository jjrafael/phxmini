import actionTypes from '../constants';

const initialState = {
    isFetchingApps: null,
    fetchAppsFailed: null,
    isFetchingRecentApps: null,
    fetchRecentAppsFailed: null,
    isCallingUseApp: null,
    callUseAppFailed: null,
    errMsg: 'Something went wrong. Please try again',
    appList: [],
    appRecentList: [],
    allowedAppIds: [],
    isAppListLoaded: false,
    useAppResponse: null,
    isSideBarOpen: true,
    activeAppId: 0,
    isFetchingAppPermissions: false,
    isFetchingAppPermissionsFailed: false,
    permissionsMap: {},
};

export default function (state = initialState, action) {
    switch (action.type) {
        case actionTypes.FETCH_APPS:
            return { ...state, isFetchingApps: true, fetchAppsFailed: false };
        case actionTypes.FETCH_APPS_SUCCEEDED:
            return { ...state, isFetchingApps: false, appList: action.appList, allowedAppIds: action.allowedAppIds, isAppListLoaded: true };
        case actionTypes.FETCH_APPS_FAILED:
            return { ...state, isFetchingApps: false, fetchAppsFailed: true, errMsg: action.errMsg };
        case actionTypes.FETCH_APP_PERMISSIONS:
            return { ...state, isFetchingAppPermissions: true, isFetchingAppPermissionsFailed: false };
        case actionTypes.FETCH_APP_PERMISSIONS_SUCCEEDED:
            if (true) { // create a new block scope
                const permissionsMap = action.response.reduce((accu, val) => {
                    accu[val.actionId] = {...val};
                    return accu;
                }); // 
                return {
                    ...state, isFetchingAppPermissions: false,
                    permissions: action.response.map(permission => permission.actionId),
                    permissionsMap,
                };
            }
            
        case actionTypes.FETCH_APP_PERMISSIONS_FAILED:
            return { ...state, isFetchingAppPermissions: false, isFetchingAppPermissions: true };
        case actionTypes.FETCH_RECENT_APPS:
            return { ...state, isFetchingApps: true, fetchRecentAppsFailed: false };
        case actionTypes.FETCH_RECENT_APPS_SUCCEEDED:
            return { ...state, isFetchingRecentApps: false, appRecentList: action.appList };
        case actionTypes.FETCH_RECENT_APPS_FAILED:
            return { ...state, isFetchingApps: false, fetchRecentAppsFailed: true, errMsg: action.errMsg };
        case actionTypes.USE_APP:
            return { ...state, isCallingUseApp: true, callUseAppFailed: false, activeAppId: action.appId };
        case actionTypes.USE_APP_SUCCEEDED:
            return { ...state, isCallingUseApp: false, useAppResponse: action.response };
        case actionTypes.USE_APP_FAILED:
            return { ...state, isCallingUseApp: false, callUseAppFailed: true, errMsg: action.errMsg };
        case actionTypes.SIDEBAR_TOGGLE:
            return { ...state, isSideBarOpen: action.bool };
        default:
            return { ...state };
    }
}