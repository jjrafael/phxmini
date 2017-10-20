import actionTypes from '../constants';

const initialState = {
    searchString: ''
};

export default function (state = initialState, action) {
    switch (action.type) {
        case actionTypes.SET_EVENT_PATH_TREE_SEARCH_VALUE:
            return { ...state, searchString: action.searchString };
        case actionTypes.CLEAR_EVENT_PATH_TREE_SEARCH_VALUE:
            return { ...state, searchString: '' };
        default:
            return { ...state };
    }
}