import {
  ADD_OPERATOR,
  ADD_OPERATOR_SUCCEEDED,
  ADD_OPERATOR_FAILED,
  UPDATE_OPERATOR,
  UPDATE_OPERATOR_SUCCEEDED,
  UPDATE_OPERATOR_FAILED,
  DUPLICATE_OPERATOR,
  DUPLICATE_OPERATOR_SUCCEEDED,
  DELETE_OPERATOR,
  ADD_GROUP,
  UPDATE_GROUP,
  EDIT_GROUP,
  ADD_UPDATE_GROUP_SUCCEEDED,
  DELETE_GROUP,
  DELETE_GROUP_SUCCEEDED,
  FETCH_OPERATOR_GROUPS,
  FETCH_OPERATOR_GROUPS_SUCCEEDED,
  FETCH_OPERATOR_GROUPS_FAILED,
  SELECT_OPERATOR,
  SELECT_GROUP,
  FILTER_GROUP,
  SEARCH_OPERATOR,
  TOGGLE_WARNING_MODAL,
  GROUP_ERROR
} from './constants'

const initialState = {
  group: {},
  groupIndex: [],
  groupStatus: null,
  groupFilter: 0,
  operatorid: null,
  groupid: null,
  search: '',

  newOperator: {},
  newOperatorStatus: '',
  updateOperatorStatus: '',
  selectedOperator: {},
  showWarningModal: false,
  action: '',
  isgroupUpdating: false
}

const operatorList = (state = initialState, action) => {
  const {
    group,
    groupIndex,
    groupid,
    operatorid,
    groupFilter,
    operatorDetails,
    groupDetails,
    search,
    selectedOperator
  } = action
  switch (action.type) {
    case TOGGLE_WARNING_MODAL:
      return {
        ...state,
        showWarningModal: !state.showWarningModal,
        action: action.action
      }
    case FETCH_OPERATOR_GROUPS:
      return {
        ...state,
        groupStatus: 'LOADING'
      }
    case FETCH_OPERATOR_GROUPS_SUCCEEDED:
      return {
        ...state,
        group,
        groupIndex,
        groupStatus: 'LOADED'
      }
    case FETCH_OPERATOR_GROUPS_FAILED:
      return {
        ...state,
        groupStatus: 'ERROR'
      }
    case SELECT_OPERATOR:
      let _selectedOperator
      state.groupIndex.map(grp => {
        if (grp.id === groupid) {
          if (grp.operators) {
            grp.operators.map(operator => {
              if (operator.id === operatorid) {
                _selectedOperator = operator
              }
            })
          }
        }
      })
      return {
        ...state,
        operatorid,
        groupid,
        selectedOperator: _selectedOperator && _selectedOperator,
        operatorDetails: {
          id: _selectedOperator && _selectedOperator.id,
          username: _selectedOperator && _selectedOperator.userName,
          password: _selectedOperator && _selectedOperator.password,
          groupId:
            _selectedOperator &&
            (_selectedOperator.operatorGroupId || _selectedOperator.groupId),
          statusId: _selectedOperator && _selectedOperator.statusId,
          currencyId: _selectedOperator && _selectedOperator.currencyId,
          originId: _selectedOperator && _selectedOperator.originId,
          priceFormatId: _selectedOperator && _selectedOperator.priceFormat,
          securityLevel: _selectedOperator && _selectedOperator.securityLevel,
          languageId: _selectedOperator && _selectedOperator.languageId,
          firstName: _selectedOperator && _selectedOperator.firstName,
          lastName: _selectedOperator && _selectedOperator.lastName,
          email: _selectedOperator && _selectedOperator.email,
          mobile: _selectedOperator && _selectedOperator.mobile
        }
      }
    case SELECT_GROUP:
      return {
        ...state,
        groupid
      }
    case FILTER_GROUP:
      return {
        ...state,
        groupFilter
      }
    case UPDATE_GROUP:
      return {
        ...state,
        isgroupUpdating: true
      }
    case ADD_UPDATE_GROUP_SUCCEEDED:
      return {
        ...state,
        groupIndex: state.groupIndex.find(group => group.id === groupDetails.id)
          ? state.groupIndex.map(item => {
              if (item.id === groupDetails.id) {
                return {
                  ...item,
                  description: groupDetails.description,
                  email: groupDetails.email
                }
              }
              return item
            })
          : [
              ...state.groupIndex,
              {
                description: groupDetails.description,
                email: groupDetails.email,
                id: groupDetails.id
              }
            ],
        isgroupUpdating: false
      }
    case DELETE_GROUP_SUCCEEDED:
      return {
        ...state,
        groupid: null,
        groupIndex: state.groupIndex.filter(group => group.id !== groupDetails),
        isgroupUpdating: false
      }
    case GROUP_ERROR:
      return {
        ...state,
        isgroupUpdating: false
      }
    case DELETE_GROUP:
      return {
        ...state,
        groupDetails
      }

    case ADD_OPERATOR:
      return {
        ...state,
        operatorDetails: operatorDetails,
        newOperatorStatus: 'LOADING'
      }
    case ADD_OPERATOR_SUCCEEDED:
      return {
        ...state,
        newOperatorStatus: 'SUCCESS',
        groupIndex: state.groupIndex.map(grp => {
          if (grp.id === operatorDetails.groupId) {
            if (!grp.operators) {
              grp.operators = []
            }
            grp.operators = [
              ...grp.operators,
              {
                ...operatorDetails,
                id: operatorDetails.id,
                userName: operatorDetails.username,
                password: operatorDetails.password,
                operatorGroupId: operatorDetails.groupId,
                statusId: operatorDetails.statusId,
                currencyId: operatorDetails.currencyId,
                originId: operatorDetails.originId,
                priceFormat: operatorDetails.priceFormat,
                securityLevel: operatorDetails.securityLevel,
                languageId: operatorDetails.languageId,
                firstName: operatorDetails.firstName,
                lastName: operatorDetails.lastName,
                email: operatorDetails.email,
                mobile: operatorDetails.mobile
              }
            ]
          }
          return grp
        }),
        groupid: operatorDetails.groupId,
        operatorid: operatorDetails.id,
        selectedOperator: {
          ...operatorDetails,
          id: operatorDetails.id,
          userName: operatorDetails.username,
          password: operatorDetails.password,
          groupId: operatorDetails.groupId,
          statusId: operatorDetails.statusId,
          currencyId: operatorDetails.currencyId,
          originId: operatorDetails.originId,
          priceFormatId: operatorDetails.priceFormat,
          securityLevel: operatorDetails.securityLevel,
          languageId: operatorDetails.languageId,
          firstName: operatorDetails.firstName,
          lastName: operatorDetails.lastName,
          email: operatorDetails.email,
          mobile: operatorDetails.mobile
        }
      }
    case DUPLICATE_OPERATOR:
      return {
        ...state,
        newOperatorStatus: 'LOADING'
      }
    case DUPLICATE_OPERATOR_SUCCEEDED:
      return {
        ...state,
        newOperatorStatus: 'SUCCESS',
        groupIndex: state.groupIndex.map(grp => {
          if (grp.id === selectedOperator.operatorGroupId) {
            grp.operators = [
              ...grp.operators,
              {
                id: operatorDetails.id,
                userName: operatorDetails.username,
                operatorGroupId: selectedOperator.operatorGroupId,
                statusId: selectedOperator.statusId,
                currencyId: selectedOperator.currencyId,
                originId: selectedOperator.originId,
                priceFormat: selectedOperator.priceFormat,
                securityLevel: selectedOperator.securityLevel,
                languageId: selectedOperator.languageId,
                firstName: selectedOperator.firstName,
                lastName: selectedOperator.lastName,
                email: selectedOperator.email,
                mobile: selectedOperator.mobile
              }
            ]
          }
          return grp
        }),
        groupid: selectedOperator.operatorGroupId,
        operatorid: operatorDetails.id,
        selectedOperator: {
          id: operatorDetails.id,
          userName: operatorDetails.username,
          operatorGroupId: selectedOperator.operatorGroupId,
          statusId: selectedOperator.statusId,
          currencyId: selectedOperator.currencyId,
          originId: selectedOperator.originId,
          priceFormatId: selectedOperator.priceFormat,
          securityLevel: selectedOperator.securityLevel,
          languageId: selectedOperator.languageId,
          firstName: selectedOperator.firstName,
          lastName: selectedOperator.lastName,
          email: selectedOperator.email,
          mobile: selectedOperator.mobile
        }
      }
    case ADD_OPERATOR_FAILED:
      return {
        ...state,
        newOperatorStatus: 'ERROR'
      }

    case DELETE_OPERATOR:
      return {
        ...state,
        group: {
          ...state.group,
          [groupid]: {
            ...state.group[groupid],
            operators: [
              ...state.group[groupid].operators.filter(
                item => item.id != operatorid
              )
            ]
          }
        }
      }
    case UPDATE_OPERATOR:
      return {
        ...state,
        id: state.operatorid,
        operatorDetails: {
          ...state.operatorDetails,
          ...action.formDetails
        },
        updateOperatorStatus: 'LOADING'
      }
    case UPDATE_OPERATOR_SUCCEEDED:
      return {
        ...state,
        updateOperatorStatus: 'SUCCESS',
        selectedOperator: {
          ...state.selectedOperator,
          ...operatorDetails
        },
        groupIndex: state.groupIndex.map(grp => {
          if (
            operatorDetails.groupId !== state.selectedOperator.operatorGroupId
          ) {
            if (grp.id === operatorDetails.groupId) {
              return {
                ...grp,
                operators: grp.operators
                  ? [
                      ...grp.operators,
                      { ...operatorDetails, userName: operatorDetails.username }
                    ]
                  : [{ ...operatorDetails, userName: operatorDetails.username }]
              }
            }
            if (grp.id === state.groupid) {
              return{
                ...grp,
                operators: grp.operators.filter(
                  operator => operator.id != operatorDetails.id
                )
              }
            }
          } else {
            if (grp.id === operatorDetails.groupId) {
              return {
                ...grp,
                operators: grp.operators.map(operator => {
                  if (operator.id === operatorDetails.id) {
                    return {
                      ...operator,
                      ...operatorDetails,
                      userName: operatorDetails.username
                    }
                  }
                  return operator
                })
              }
            }
          }
          return grp
        }),
        operatorid: operatorDetails.id,
        groupid: operatorDetails.groupId
      }
    case UPDATE_OPERATOR_FAILED:
      return {
        ...state,
        updateOperatorStatus: 'ERROR'
      }
    case SEARCH_OPERATOR:
      return {
        ...state,
        search: search ? search : ''
      }
    default:
      return state
  }
}

export default operatorList
