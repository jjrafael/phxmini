import actionTypes, { modes } from './constants';

const initialState = {
    selectedPath: null,
    isLoading: null,
    isDeletingEventPath: null,
    deletingEventPathFailed: null,
    deleteEventPathError: null,
    editedPaths: {},
    addedPaths: {},
    isSavingChanges: null,
    savingChangesFailed: null,
    activeTabIndex: 0,
    eventPathMode: modes.VIEW,
    // EventPath Details
    errorMessage: null,
    isFetchingEventPathDetails: false,
    fetchingEventPathDetailsFailed: false,
    eventPathDetails: {
        parentId: -1,
        description: null,
        feedCode: null,
        tagId: -1,
        customAttributes: null,
        tag: null,
        suppressP2P: null,
        comments: null,
        publishSort: null,
        evetPathCode: null,
        grade: 1,
        publish: false,
        publicise: false,
    },

    isAddingEventPathDetails: false,
    addingEventPathDetailsFailed: false,

    isSavingEventPathChanges: false,
    savingEventPathChangesFailed: false,

    errorMessageTags: null,
    isFetchingEventPathTagList: false,
    fetchingEventPathTagListFailed: false,
    eventPathTagList: [
        {
            id: -1,
            description: null
        }
    ],
    selectedEventPathTag: {
        id: -1,
        description: null
    }
};

const eventCreatorEventPath = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.FETCH_EVENT_PATH_TREE:
            return { ...state, editedPaths: {}, addedPaths: {} };
        case actionTypes.SET_EVENT_CREATOR_LOADING_VISIBILITY:
            return { ...state, isLoading: action.isLoading };
        case actionTypes.SELECT_EVENT_CREATOR_PATH:
            return { ...state,  selectedPath: action.path };
        case actionTypes.DELETE_EVENT_PATH:
        case actionTypes.DELETE_EVENT_PATHS:
        case actionTypes.DELETE_EVENT:
            return { ...state,  isDeletingEventPath: true, deletingEventPathFailed: false, deleteEventPathError: null };
        case actionTypes.DELETE_EVENT_PATH_SUCCEEDED:
        case actionTypes.DELETE_EVENT_SUCCEEDED:
            return { ...state,  isDeletingEventPath: false };
        case actionTypes.DELETE_EVENT_PATH_FAILED:
        case actionTypes.DELETE_EVENT_FAILED:
            return { ...state,  isDeletingEventPath: false, deletingEventPathFailed: true, deleteEventPathError: action.errorMessage };
        case actionTypes.CLEAR_DELETE_EVENT_PATH_ERRORS:
            return { ...state, deleteEventPathError: null, deletingEventPathFailed: false };
        case actionTypes.SAVE_REORDER: 
            return { ...state, isSavingChanges: true, savingChangesFailed: false };
        case actionTypes.SAVE_REORDER_SUCCEEDED: 
            return { ...state, isSavingChanges: false };
        case actionTypes.SAVE_REORDER_FAILED: 
            return { ...state, isSavingChanges: false, savingChangesFailed: true };

        // Event Path Details
        case actionTypes.FETCH_EVENT_PATH_DETAILS:
            return { ...state, isFetchingEventPathDetails: true, fetchingEventPathDetailsFailed: false };
        case actionTypes.FETCH_EVENT_PATH_DETAILS_SUCCEEDED:
            return { ...state, isFetchingEventPathDetails: false, eventPathDetails: action.eventPathDetails, errorMessage: null };
        case actionTypes.FETCH_EVENT_PATH_DETAILS_FAILED:
            return { ...state, isFetchingEventPathDetails: false, fetchingEventPathDetailsFailed: true, errorMessage: action.errorMessage };

        case actionTypes.ADD_EVENT_PATH:
            return { ...state, isAddingEventPathDetails: true, addingEventPathDetailsFailed: false };
        case actionTypes.ADD_EVENT_PATH_SUCCEEDED:
            return { ...state, isAddingEventPathDetails: false, errorMessage: null, eventPathDetails: action.eventPathDetails };
        case actionTypes.ADD_EVENT_PATH_FAILED:
            return { ...state, isAddingEventPathDetails: false, addingEventPathDetailsFailed: true, errorMessage: action.errorMessage };

        case actionTypes.EDIT_EVENT_PATH:
            return { ...state, isSavingEventPathChanges: true, savingEventPathChangesFailed: false };
        case actionTypes.EDIT_EVENT_PATH_SUCCEEDED:
            return { ...state, isSavingEventPathChanges: false, errorMessage: null, eventPathDetails: action.eventPathDetails  };
        case actionTypes.EDIT_EVENT_PATH_FAILED:
            return { ...state, isSavingEventPathChanges: false, savingEventPathChangesFailed: true, errorMessage: action.errorMessage };

        case actionTypes.CLEAR_EVENT_PATH_DETAILS_ERROR:
            return { ...state, fetchingEventPathDetailsFailed: false, addingEventPathDetailsFailed: false, savingEventPathChangesFailed: false, errorMessage: null };

        // Event Path Tags
        case actionTypes.FETCH_EVENT_PATH_TAGS:
            return { ...state, isFetchingEventPathTagList: true, fetchingEventPathTagListFailed: false };
        case actionTypes.FETCH_EVENT_PATH_TAGS_SUCCEEDED:
            return { ...state, isFetchingEventPathTagList: false, eventPathTagList: action.eventPathTagList, errorMessageTags: null };
        case actionTypes.FETCH_EVENT_PATH_TAGS_FAILED:
            return { ...state, isFetchingEventPathTagList: false, fetchingEventPathTagListFailed: true, errorMessageTags: action.errorMessage };

        case actionTypes.CLEAR_EVENT_PATH_TAGS_ERROR:
            return { ...state, fetchingEventPathTagListFailed: false, errorMessageTags: null };
        case actionTypes.SET_EVENT_PATH_ACTIVE_TAB_INDEX:
            return { ...state, activeTabIndex: action.activeTabIndex };
        case actionTypes.SET_EVENT_PATH_MODE:
            let newIndex = state.activeTabIndex;
            if (action.mode === modes.CREATE) {
                newIndex = 0;
            }
            return { ...state, activeTabIndex: newIndex, eventPathMode: action.mode  };
        default:
            return { ...state };
    }
}

export default eventCreatorEventPath;