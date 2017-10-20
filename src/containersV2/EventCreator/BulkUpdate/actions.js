import constants from './constants';

export function updateApplicableTemplates(payload, pathObj=null) {
    return {
        type: constants.UPDATE_APPLICABLE_TEMPLATES,
        payload,
        pathObj
    };
};

export function fetchApplicableTemplates(eventPathIds) {
    return {
        type: constants.FETCH_APPLICABLE_TEMPLATES,
        eventPathIds
    }
}
