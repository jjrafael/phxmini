import constants from './constants';
import { put, call, fork, select } from 'redux-saga/effects';
import { takeLatest, takeEvery, delay } from 'redux-saga';
import * as API from './services';
import actionTypes from '../../../constants';

function _sortByLabel(a,b) {
  if (a.label < b.label)
    return -1;
  if (a.label > b.label)
    return 1;
  return 0;
}

function* getOperatorGroups(action) {
    const {response, xhr} = yield call(API.fetchOperatorGroups, action.filterId);
    if(response) {

        let operatorGroups = {}
        let operatorGroupsIndex = []
        for (var i = 0; i < response.length; i++) {
          operatorGroups[response[i].id] = response[i]
          operatorGroupsIndex[i] = {id: response[i].id, description: response[i].description}
        }

        yield put({type: constants.FETCH_OPERATOR_GROUPS_SUCCEEDED, operatorGroups:operatorGroups, operatorGroupsIndex:operatorGroupsIndex});
    } else {
        yield put({type: constants.FETCH_OPERATOR_GROUPS_FAILED});
    }
};

function* getApplications(action) {
    const {response, xhr} = yield call(API.fetchApplications, action.operatorType,  action.operatorId);

    if(response) {

        let operatorApplications

        const assignedList = response.assignedApplications
        const unassignedList = response.unassignedApplications

        const _processItem = (listItem)=>{
          const description = listItem.description || listItem.applicationDescription
          return { value : '' + listItem.applicationId, label : description, test : 'test'}
        }

        let assignedIndex = []
        let completeList = []

        for (var i = 0; i < assignedList.length; i++) {
          assignedIndex.push('' + assignedList[i].applicationId)
          completeList.push(_processItem(assignedList[i]))
        }

        for (var i = 0; i < unassignedList.length; i++) {
          completeList.push(_processItem(unassignedList[i]))
        }

        completeList.sort(_sortByLabel)

        operatorApplications = {
          assigned: assignedIndex,
          list: completeList
        }

        yield put({type: constants.FETCH_APPLICATIONS_SUCCEEDED, operatorApplications: operatorApplications});
    } else {
        yield put({type: constants.FETCH_APPLICATIONS_FAILED});
    }
};

function* getActions(action) {
    const {response, xhr} = yield call(API.fetchActions, action.operatorType,  action.operatorId);
    if(response) {

        let operatorActions

        const assignedList = response.assignedActions
        const unassignedList = response.unassignedActions

        const _processItem = (listItem)=>{
          return { value : '' + listItem.id, label : listItem.description, applicationId : listItem.applicationId}
        }

        let assignedIndex = []
        let completeList = []

        for (var i = 0; i < assignedList.length; i++) {
          assignedIndex.push('' + assignedList[i].id)
          // completeList.push(_processItem(assignedList[i]))
        }

        for (var i = 0; i < unassignedList.length; i++) {
          completeList.push(_processItem(unassignedList[i]))
        }

        completeList.sort(_sortByLabel)

        operatorActions = {
          assigned: assignedIndex,
          list: completeList
        }

        // let operatorGroups = {}
        // let operatorGroupsIndex = []
        // for (var i = 0; i < response.length; i++) {
        //   operatorGroups[response[i].id] = response[i]
        //   operatorGroupsIndex[i] = response[i].id
        // }

        yield put({type: constants.FETCH_ACTIONS_SUCCEEDED, operatorActions: operatorActions});
    } else {
        yield put({type: constants.FETCH_ACTIONS_FAILED});
    }
};

function* getReports(action) {
    const {response, xhr} = yield call(API.fetchReports, action.operatorGroupId,  action.operatorId);
    if(response) {

        let operatorReports

        const assignedList = response.assignedReports
        const allList = response.unassignedReports

        const _processItem = (listItem)=>{
          return { value : '' + listItem.id, label : listItem.description, applicationId : listItem.applicationId}
        }

        let assignedIndex = []
        let completeList = []


        // loop through assignedList
        for (const key of Object.keys(assignedList)) {
            let listItems = assignedList[key]

            if (!allList[key]) {
              allList[key] = []
            }

            // loop through the list items
            for (var i = 0; i < listItems.length; i++) {
              // add to assignedIndex
              assignedIndex.push(listItems[i])
              allList[key].push(listItems[i])
            }

        }

        // loop through unassignedList
        for (const key of Object.keys(allList)) {
            let listItems = allList[key]
            
            let optionsArray = []

            for (var i = 0; i < listItems.length; i++) {
              optionsArray.push({
                label: listItems[i],
                value: listItems[i]
              })
            }

            optionsArray.sort(_sortByLabel)

            // form list object and push to completedList
            completeList.push({
              label: key,
              options: optionsArray
            })

            completeList.sort(_sortByLabel)            
        }

        operatorReports = {
          assigned: assignedIndex,
          list: completeList
        }

        yield put({type: constants.FETCH_REPORTS_SUCCEEDED, operatorReports: operatorReports});
    } else {
        yield put({type: constants.FETCH_REPORTS_FAILED});
    }
};

function* submitOperatorData(action) {
    const {response, xhr} = yield call(API.submitOperatorData, action.mode, action.contentType, action.data, action.id);
    if(response) {
      yield put({type: constants.SUBMIT_OPERATOR_DATA_SUCCEEDED, response:response});
    } else {
      yield put({type: actionTypes.ADD_TOAST_MESSAGE, message: 'Error!', className: 'error'});
      yield delay(2000);
      yield put({type: actionTypes.CLEAR_TOAST_MESSAGE});

      yield put({type: constants.SUBMIT_OPERATOR_DATA_FAILED});
    }
};

export default function* operatorManagerSagas() {
    // yield takeLatest(constants.FETCH_OPERATOR_GROUPS, getOperatorGroups);
    // yield takeLatest(constants.FETCH_APPLICATIONS, getApplications);
    // yield takeLatest(constants.FETCH_ACTIONS, getActions);
    // yield takeLatest(constants.FETCH_REPORTS, getReports);
    yield takeLatest(constants.SUBMIT_OPERATOR_DATA, submitOperatorData);
}
