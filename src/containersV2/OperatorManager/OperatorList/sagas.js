import {
  FETCH_OPERATOR_GROUPS,
  FETCH_OPERATOR_GROUPS_SUCCEEDED,
  FETCH_OPERATOR_GROUPS_FAILED,
  ADD_GROUP,
  UPDATE_GROUP,
  EDIT_GROUP,
  ADD_UPDATE_GROUP_SUCCEEDED,
  GROUP_ERROR,
  DELETE_GROUP_SUCCEEDED,
  DELETE_GROUP,
  FETCH_OPERATOR_GROUPS_BY_STATUS,
  SELECT_OPERATOR,
  ADD_OPERATOR,
  ADD_OPERATOR_SUCCEEDED,
  ADD_OPERATOR_FAILED,
  DUPLICATE_GROUP,
  UPDATE_OPERATOR,
  UPDATE_OPERATOR_SUCCEEDED,
  UPDATE_OPERATOR_FAILED,
  DUPLICATE_OPERATOR,
  DUPLICATE_OPERATOR_SUCCEEDED
} from './constants'
import * as API from './services'
import { put, call } from 'redux-saga/effects'
import { takeLatest, takeEvery, delay } from 'redux-saga'
import { toastr } from 'phxComponents/toastr/index'
import { updateResetModifiedPermission } from '../PermissionPanel/actions'
import { parseErrorMessageInXhr } from 'phxServices/apiUtils'
import httpMethods from '../../../constants/httpMethods'

function* getOperatorGroups(action) {
  const { response, xhr } = yield call(API.fetchOperatorGroups)
  if (response) {
    let group = {}
    let groupIndex = []
    for (var i = 0; i < response.length; i++) {
      groupIndex[i] = response[i] //{ id: response[i].id, description: response[i].description }
    }
    yield put({ type: FETCH_OPERATOR_GROUPS_SUCCEEDED, group, groupIndex })
  } else {
    yield put({ type: FETCH_OPERATOR_GROUPS_FAILED })
    const msg = parseErrorMessageInXhr(httpMethods.HTTP_GET, xhr)
    toastr.add({ message: msg, type: 'ERROR' })
  }
}

function* getOperatorGroupsByStatus(action) {
  const { response, xhr } = yield call(
    API.fetchOperatorGroupsByStatus,
    action.id
  )
  if (response) {
    let group = {}
    let groupIndex = []
    for (var i = 0; i < response.length; i++) {
      groupIndex[i] = response[i] //{ id: response[i].id, description: response[i].description }
    }
    yield put({ type: FETCH_OPERATOR_GROUPS_SUCCEEDED, group, groupIndex })
  } else {
    yield put({ type: FETCH_OPERATOR_GROUPS_FAILED })
    const msg = parseErrorMessageInXhr(httpMethods.HTTP_GET, xhr)
    toastr.add({ message: msg, type: 'ERROR' })
  }
}

function* addGroup(action) {
  yield put({ type: UPDATE_GROUP })
  const { response, xhr } = yield call(API.addGroup, action.groupDetails)
  if (response) {
    yield put({ type: ADD_UPDATE_GROUP_SUCCEEDED, groupDetails: response })
    yield put({ type: 'HIDE_OPERATOR_GROUP_MODAL' })
    yield put({ type: 'CLEAR_GROUP_FORM' })
    yield put({ type: SELECT_OPERATOR, groupid: response.id, operatorid: null })
    toastr.add({ message: 'Successfully added group' })
  } else {
    yield put({ type: GROUP_ERROR })
    const msg = parseErrorMessageInXhr(httpMethods.HTTP_POST, xhr)
    toastr.add({ message: msg, type: 'ERROR' })
  }
}

function* duplicateGroup(action) {
  yield put({ type: UPDATE_GROUP })
  const { response, xhr } = yield call(
    API.duplicateGroup,
    action.id,
    action.groupName
  )
  if (response) {
    yield put({
      type: ADD_UPDATE_GROUP_SUCCEEDED,
      groupDetails: {
        id: response.id,
        email: response.email,
        description: response.description
      }
    })
    yield put({ type: SELECT_OPERATOR, groupid: response.id, operatorid: null })
    toastr.add({ message: 'Successfully duplicated group' })
  } else {
    yield put({ type: GROUP_ERROR })
    const msg = parseErrorMessageInXhr(httpMethods.HTTP_POST, xhr)
    toastr.add({ message: msg, type: 'ERROR' })
  }
}

function* editGroup(action) {
  yield put({ type: UPDATE_GROUP })
  const { id, ...group } = action.groupDetails
  const { response, xhr } = yield call(API.editGroup, id, group)
  if (response) {
    yield put({ type: ADD_UPDATE_GROUP_SUCCEEDED, groupDetails: response })
    yield put({ type: 'OM::UPDATE_RESET_MODIFIED_PERMISSIONS'})
    yield put({ type: 'RESET_GROUP_FROM_MODIFIED'})
    toastr.add({ message: 'Successfully updated group' })
  } else {
    yield put({ type: GROUP_ERROR })
    const msg = parseErrorMessageInXhr(httpMethods.HTTP_PUT, xhr)
    toastr.add({ message: msg, type: 'ERROR' })
  }
}

function* deleteGroup(action) {
  yield put({ type: UPDATE_GROUP })
  const { response, xhr, success } = yield call(
    API.deleteGroup,
    action.groupDetails
  )
  if (success) {
    //needs to be changed since if user deletes unknown id still returns blank
    yield put({
      type: DELETE_GROUP_SUCCEEDED,
      groupDetails: action.groupDetails
    })
    toastr.add({ message: 'Successfully deleted group' })
  } else {
    yield put({ type: GROUP_ERROR })
    const msg = parseErrorMessageInXhr(httpMethods.HTTP_DELETE, xhr)
    toastr.add({ message: msg, type: 'ERROR' })
  }
}

function* addOperator(action) {
  const { response, xhr } = yield call(API.addOperator, action.operatorDetails)
  //yield put({ type: ADD_OPERATOR })
  if (response) {
    yield put({ type: ADD_OPERATOR_SUCCEEDED, operatorDetails: response })
    yield put({ type: 'HIDE_OPERATOR_MODAL' })
    yield put({ type: 'CLEAR_NEW_OPERATOR_FORM' })
    yield put({ type: 'SET_ORIGINAL_FORM', operatorDetails: response })
    toastr.add({
      message: 'New operator successfully created!',
      type: 'SUCCESS'
    })
  } else {
    yield put({ type: ADD_OPERATOR_FAILED })
    const msg = parseErrorMessageInXhr(httpMethods.HTTP_POST, xhr)
    toastr.add({ message: msg, type: 'ERROR' })
  }
}

function* updateOperator(action) {
  const { response, xhr } = yield call(
    API.updateOperator,
    action.id,
    {
      ...action.operatorDetails
    }
  )
  if (response) {
    yield put({ type: UPDATE_OPERATOR_SUCCEEDED, operatorDetails: response })
    yield put(updateResetModifiedPermission())
    yield put({ type: 'OF:UPDATE_OPERATOR_SUCCEEDED', operatorDetails: response })
    yield put({ type: 'OM::UPDATE_RESET_MODIFIED_PERMISSIONS'})
    yield put({ type: 'RESET_GROUP_FROM_MODIFIED' })
    toastr.add({
      message: 'Operator successfully updated!',
      type: 'SUCCESS'
    })
  } else {
    yield put({ type: UPDATE_OPERATOR_FAILED })
    const msg = parseErrorMessageInXhr(httpMethods.HTTP_PUT, xhr)
    toastr.add({ message: msg, type: 'ERROR' })
  }
}

function* duplicateOperator(action) {
  const { response, xhr } = yield call(
    API.duplicateOperator,
    action.id,
    action.formDetails,
    action.selectedOperator
  )
  if (response) {
    yield put({
      type: DUPLICATE_OPERATOR_SUCCEEDED,
      id: action.id,
      operatorDetails: response,
      selectedOperator: action.selectedOperator
    })
    yield put({ type: 'HIDE_DUPLICATE_OPERATOR_MODAL' })
    toastr.add({
      message: 'New operator successfully duplicated!',
      type: 'SUCCESS'
    })
  } else {
    yield put({ type: ADD_OPERATOR_FAILED })
    const msg = parseErrorMessageInXhr(httpMethods.HTTP_POST, xhr)
    toastr.add({ message: msg, type: 'ERROR' })
  }
}

export default function* operatorListSaga() {
  yield takeLatest(FETCH_OPERATOR_GROUPS, getOperatorGroups)
  yield takeLatest(FETCH_OPERATOR_GROUPS_BY_STATUS, getOperatorGroupsByStatus)
  yield takeLatest(DUPLICATE_GROUP, duplicateGroup)
  yield takeLatest(ADD_GROUP, addGroup)
  yield takeLatest(EDIT_GROUP, editGroup)
  yield takeLatest(DELETE_GROUP, deleteGroup)
  yield takeLatest(ADD_OPERATOR, addOperator)
  yield takeLatest(DUPLICATE_OPERATOR, duplicateOperator)
  yield takeLatest(UPDATE_OPERATOR, updateOperator)
}
