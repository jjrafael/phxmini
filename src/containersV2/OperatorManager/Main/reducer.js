import { 
  CLEAR_GROUP_FORM,
  SET_GROUP_FORM,
  SET_NEW_OPERATOR_FORM,
  CLEAR_NEW_OPERATOR_FORM,
  HIDE_DUPLICATE_OPERATOR_MODAL,
  SHOW_DUPLICATE_OPERATOR_MODAL,
  SET_DUPLICATE_OPERATOR_FORM } from './actions'

const initialState = {
  group: {
    description: '',
    email: ''
  },
  newOperator: {
    username: '',
    password: '',
    groupId: '',
    statusId: '',
    currencyId: '',
    originId: ''
  },

  duplicateOperatorDetails: {
    username: '',
    password: ''
  },
  isShowDuplicateOperatorModal: false
}

const operatorManagerModal = (state = initialState, action) => {
  switch (action.type) {
    case SET_GROUP_FORM:
      return {
        ...state,
        group: action.groupDetails
      }
    case CLEAR_GROUP_FORM:
      return {
        ...state,
        group: {
          description: '',
          email: ''
        }
      }
    case SET_NEW_OPERATOR_FORM:
      return {
        ...state,
        newOperator: action.operatorDetails
      }
    case CLEAR_NEW_OPERATOR_FORM:
      return {
        ...state,
        newOperator: {
          username: '',
          password: '',
          groupId: '',
          statusId: '',
          currencyId: '',
          originId: ''
        }
      }
    case HIDE_DUPLICATE_OPERATOR_MODAL:
      return {
        ...state,
        isShowDuplicateOperatorModal: false,
        duplicateOperatorDetails: {
          username: '',
          password: ''
        }
      }
    case SHOW_DUPLICATE_OPERATOR_MODAL:
      return {
        ...state,
        isShowDuplicateOperatorModal: true
      }
    case SET_DUPLICATE_OPERATOR_FORM:
      return {
        ...state,
        duplicateOperatorDetails: {
          username: action.duplicateOperatorDetails.username,
          password: action.duplicateOperatorDetails.password
        }
      }
    default:
      return state
  }
}

export default operatorManagerModal
