export const CLEAR_GROUP_FORM = 'CLEAR_GROUP_FORM'
export const SET_GROUP_FORM = 'SET_GROUP_FORM'
export const CLEAR_NEW_OPERATOR_FORM = 'CLEAR_NEW_OPERATOR_FORM'
export const SET_NEW_OPERATOR_FORM = 'SET_NEW_OPERATOR_FORM'
export const HIDE_DUPLICATE_OPERATOR_MODAL = 'HIDE_DUPLICATE_OPERATOR_MODAL'
export const SHOW_DUPLICATE_OPERATOR_MODAL = 'SHOW_DUPLICATE_OPERATOR_MODAL'
export const SET_DUPLICATE_OPERATOR_FORM = 'SET_DUPLICATE_OPERATOR_FORM'

export const setGroupValue = groupDetails => {
  return {
    type: SET_GROUP_FORM,
    groupDetails
  }
}

export const clearGroupValue = () => {
  return {
    type: CLEAR_GROUP_FORM
  }
}

export const setOperatorValue = operatorDetails => {
  return {
    type: SET_NEW_OPERATOR_FORM,
    operatorDetails
  }
}

export const clearOperatorValue = () => {
  return {
    type: CLEAR_NEW_OPERATOR_FORM
  }
}

export const hideDuplicateOperatorModal = () => {
  return {
    type: HIDE_DUPLICATE_OPERATOR_MODAL
  }
}

export const showDuplicateOperatorModal = () => {
  return {
    type: SHOW_DUPLICATE_OPERATOR_MODAL
  }
}

export const setDuplicateOperatorValue = duplicateOperatorDetails => {
  return {
    type: SET_DUPLICATE_OPERATOR_FORM,
    duplicateOperatorDetails
  }
}