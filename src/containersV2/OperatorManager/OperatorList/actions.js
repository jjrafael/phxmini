import {
    ADD_OPERATOR,
    DUPLICATE_OPERATOR,
    UPDATE_OPERATOR,
    DELETE_OPERATOR,
    ADD_GROUP,
    DUPLICATE_GROUP,
    DELETE_GROUP,
    EDIT_GROUP,
    ADD_GROUP_SUCCEEDED,
    FETCH_OPERATOR_GROUPS,
    SELECT_OPERATOR,
    SELECT_GROUP,
    FILTER_GROUP,
    SEARCH_OPERATOR,
    FETCH_OPERATOR_GROUPS_BY_STATUS,
    TOGGLE_WARNING_MODAL
} from './constants'

export function fetchOperatorGroups() {
    return {
        type: FETCH_OPERATOR_GROUPS
    }
}

export function fetchOperatorGroupsByStatus(id) {
    return {
        type: FETCH_OPERATOR_GROUPS_BY_STATUS,
        id
    }
}

export function addOperator(operatorDetails) {
    return {
        type: ADD_OPERATOR,
        operatorDetails
    }
}

export function duplicateOperator(id,formDetails, selectedOperator) {
    return {
        type: DUPLICATE_OPERATOR,
        id,
        formDetails,
        selectedOperator
    }
}

export function deleteOperator({ operatorid, groupid }) {
    return {
        type: DELETE_OPERATOR,
        operatorid,
        groupid
    }
}

export function updateOperator(id, operatorDetails) {
    return {
        type: UPDATE_OPERATOR,
        id,
        operatorDetails
    }
}

export function addGroup(groupDetails) {
    return {
        type: ADD_GROUP,
        groupDetails
    }
}

export function duplicateGroup(id,groupName) {
    return {
        type: DUPLICATE_GROUP,
        groupName,
        id
    }
}

export function editGroup(groupDetails) {
    return {
        type: EDIT_GROUP,
        groupDetails
    }
}

export function deleteGroup(groupDetails) {
    return {
        type: DELETE_GROUP,
        groupDetails
    }
}

export function selectOperator({ operatorid, groupid, details }) {
    return {
        type: SELECT_OPERATOR,
        operatorid,
        groupid,
        details
    }
}

export function filterGroup(groupFilter){
    return{
        type: FILTER_GROUP,
        groupFilter
    }
}

export function searchOperator(search){
    return{
        type: SEARCH_OPERATOR,
        search
    }
}

export function toggleWarningModal(action){
    return{
        type:TOGGLE_WARNING_MODAL,
        action
    }
}