export const UPDATE_OPERATOR = 'UPDATE_OPERATOR'
export const UPDATE_OPERATOR_SUCCEEDED = 'OF:UPDATE_OPERATOR_SUCCEEDED'
export const UPDATE_OPERATOR_FAILED = 'UPDATE_GROUP_FAILED'
export const SET_OPERATOR_FORM = 'SET_OPERATOR_FORM'
export const SET_ORIGINAL_FORM = 'SET_ORIGINAL_FORM'
export const SET_RENDERED_VALUES = 'SET_RENDERED_VALUES'
export const CLEAR_OPERATOR_FORM = 'CLEAR_OPERATOR_FORM'
export const RESET_OPERATOR_FORM_MODIFIED = 'RESET_OPERATOR_FORM_MODIFIED'
export const RESET_MODIFIED = 'RESET_MODIFIED'
export const UPDATE_PASSWORD = 'OM::CHANGE_PASSWORD'
export const UPDATE_PASSWORD_SUCCEEDED = 'OM::UPDATE_PASSWORD_SUCCEEDED'
export const UPDATE_PASSWORD_FAILED = 'OM::UPDATE_PASSWORD_FAILED'

export function setOperator (formDetails) {
    return{
        type:SET_OPERATOR_FORM,
        formDetails
    }
}

export function setOriginalOperator (operatorDetails) {
    return{
        type:SET_ORIGINAL_FORM,
        operatorDetails
    }
}

export function setRenderedValues (operatorDetails) {
    return{
        type:SET_RENDERED_VALUES,
        operatorDetails
    }
}

export function updateOperator (id, formDetails) {
    return{
        type:UPDATE_OPERATOR,
        id,
        formDetails
    }
}

export function clearOperatorForm(){
    return{
        type:CLEAR_OPERATOR_FORM
    }
}

export function resetOperatorForm(){
    return{
        type:RESET_OPERATOR_FORM_MODIFIED
    }
}

export function updateOperatorPassword(operatorid, formData){
    return{
        type:UPDATE_PASSWORD,
        formData
    }
}

export function resetOperatorFormModified () {
    return{
        type:RESET_MODIFIED
    }
}
