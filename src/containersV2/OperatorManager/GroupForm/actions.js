export const UPDATE_GROUP_FROM = 'UPDATE_GROUP_FROM'
export const CLEAR_GROUP_FROM = 'CLEAR_GROUP_FROM'
export const RESET_GROUP_FROM_MODIFIED = 'RESET_GROUP_FROM_MODIFIED'

export function updateForm (formDetails) {
    return{
        type:UPDATE_GROUP_FROM,
        formDetails
    }
}

export function clearForm(){
    return{
        type:CLEAR_GROUP_FROM
    }
}

export function resetModified(){
    return{
        type:RESET_GROUP_FROM_MODIFIED
    }
}