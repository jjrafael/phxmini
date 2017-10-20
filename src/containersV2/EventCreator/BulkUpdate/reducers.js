'use strict';
import constants from './constants';

const initialState = {
    templates: [],
    eventPathIds: [],
    isUpdatingApplicableTemplates: false,
    isUpdatingApplicableTemplatesFailed: false,

    isFetchingApplicableTemplates: false,
    isFetchingApplicableTemplatesFailed: false
};

const applicableTemplates = (state = initialState, action) => {
    switch (action.type) {
        case constants.UPDATE_APPLICABLE_TEMPLATES:
            return {
                ...state,
                isUpdatingApplicableTemplates: true
            };
        case constants.UPDATE_APPLICABLE_TEMPLATES_SUCCEEDED:
            return {
                ...state,
                isUpdatingApplicableTemplates: false
            };
        case constants.UPDATE_APPLICABLE_TEMPLATES_FAILED:
            return {
                ...state,
                isUpdatingApplicableTemplates: false,
                isUpdatingApplicableTemplatesFailed: true
            };
        case constants.FETCH_APPLICABLE_TEMPLATES:
            return {
                ...state,
                isFetchingApplicableTemplates: true
            };
        case constants.FETCH_APPLICABLE_TEMPLATES_SUCCEEDED:
            return {
                ...state,
                isFetchingApplicableTemplates: false,
                eventPathIds: action.eventPathIds,
                templates: action.templates
            };
        case constants.FETCH_APPLICABLE_TEMPLATES_FAILED:
            return {
                ...state,
                isFetchingApplicableTemplates: false,
                isFetchingApplicableTemplatesFailed: true
            };
        default:
            return {
                ...state
            };
    }
};

export default applicableTemplates;
