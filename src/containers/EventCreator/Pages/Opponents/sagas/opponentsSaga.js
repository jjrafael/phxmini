'use strict';
import { put, call, fork, select } from 'redux-saga/effects';
import { takeLatest, takeEvery, delay } from 'redux-saga';
import opponentsConst from 'eventCreatorOpponentsConstants/opponentsConst';
import * as opponentsAPI from 'eventCreatorOpponentsServices/opponentsServices';
import * as playersAPI from 'eventCreatorOpponentsServices/playersServices';
import { parseErrorMessageInXhr } from 'phxServices/apiUtils';
import httpMethods from 'phxConstants/httpMethods';
import { toastr } from 'phxComponents/toastr/index';

// TODO check xhr.status = for status code

function* fetchOpponentTypes(action) {
    const { response, xhr } = yield call(opponentsAPI.fetchOpponentTypes);
    if (response) {
        yield put({ type: opponentsConst.FETCH_OPPONENT_TYPES_SUCCEEDED, opponentTypes: response });
    } else {
        const msg = parseErrorMessageInXhr(httpMethods.HTTP_GET, xhr);
        yield put({ type: opponentsConst.FETCH_OPPONENT_TYPES_FAILED, errorMessage: msg });
    }
}

function* fetchSingleOpponentDetails(action) {
    const { response, xhr } = yield call(opponentsAPI.fetchSingleOpponentDetails, action.opponentId);
    if (response) {
        yield put({ type: opponentsConst.FETCH_SINGLE_OPPONENT_DETAILS_SUCCEEDED, opponentDetails: response });
    } else {
        const msg = parseErrorMessageInXhr(httpMethods.HTTP_GET, xhr);
        yield put({ type: opponentsConst.FETCH_SINGLE_OPPONENT_DETAILS_FAILED, errorMessage: msg });
    }
}

function* fetchMultipleOpponentsDetails(action) {
    const { response, xhr } = yield call(opponentsAPI.fetchMultipleOpponentsDetails, action.opponentIdList);
    if (response) {
        yield put({ type: opponentsConst.FETCH_MULTIPLE_OPPONENTS_DETAILS_SUCCEEDED, opponentDetailsMultiple: response });
    } else {
        const msg = parseErrorMessageInXhr(httpMethods.HTTP_GET, xhr);
        yield put({ type: opponentsConst.FETCH_MULTIPLE_OPPONENTS_DETAILS_FAILED, errorMessage: msg });
    }
}

function* fetchSingleOpponentDetailsWithGrade(action) {
    const { response, xhr } = yield call(opponentsAPI.fetchSingleOpponentDetailsWithGrade, action.eventPathId, action.opponentId);
    if (response) {
        yield put({ type: opponentsConst.FETCH_SINGLE_OPPONENT_WITH_GRADE_DETAILS_SUCCEEDED, opponentDetailsSingleWithGrade: response });
    } else {
        const msg = parseErrorMessageInXhr(httpMethods.HTTP_GET, xhr);
        yield put({ type: opponentsConst.FETCH_SINGLE_OPPONENT_WITH_GRADE_DETAILS_FAILED, errorMessage: msg });
    }
}

function* fetchEventPathOpponentsDetails(action) {
    const { response, xhr } = yield call(opponentsAPI.fetchEventPathOpponentsDetails, action.eventPathId);
    if (response) {
        yield put({ type: opponentsConst.FETCH_EVENT_PATH_OPPONENTS_DETAILS_SUCCEEDED, eventPathOpponentDetailsList: response });
    } else {
        const msg = parseErrorMessageInXhr(httpMethods.HTTP_GET, xhr);
        yield put({ type: opponentsConst.FETCH_EVENT_PATH_OPPONENTS_DETAILS_FAILED, errorMessage: msg });
    }
}

function* fetchEventPathAncestralOpponents(action) {
    const { response, xhr } = yield call(opponentsAPI.fetchEventPathAncestralOpponents, action.eventPathId);
    if (response) {
        yield put({ type: opponentsConst.FETCH_EVENT_PATH_ANCESTRAL_OPPONENTS_SUCCEEDED, eventPathAncestralOpponentsList: response });
    } else {
        const msg = parseErrorMessageInXhr(httpMethods.HTTP_GET, xhr);
        yield put({ type: opponentsConst.FETCH_EVENT_PATH_ANCESTRAL_OPPONENTS_FAILED, errorMessage: msg });
    }
}

function* fetchOpponentKits(action) {
    const { response, xhr } = yield call(opponentsAPI.fetchOpponentKits, action.opponentId);
    if (response) {
        yield put({ type: opponentsConst.FETCH_OPPONENT_KITS_SUCCEEDED, opponentKitList: response });
    } else {
        const msg = parseErrorMessageInXhr(httpMethods.HTTP_GET, xhr);
        yield put({ type: opponentsConst.FETCH_OPPONENT_KITS_FAILED, errorMessage: msg });
    }
}

function* fetchKitPatterns(action) {
    const { response, xhr } = yield call(opponentsAPI.fetchKitPatterns);
    if (response) {
        yield put({ type: opponentsConst.FETCH_KIT_PATTERNS_SUCCEEDED, kitPattenList: response.kitPatterns });
    } else {
        const msg = parseErrorMessageInXhr(httpMethods.HTTP_GET, xhr);
        yield put({ type: opponentsConst.FETCH_KIT_PATTERNS_FAILED, errorMessage: msg });
    }
}

function* addOpponent(action) {
    const { response, xhr } = yield call(opponentsAPI.addOpponent, action.opponentObj);
    if (response) {
        yield put({ type: opponentsConst.ADD_OPPONENT_SUCCEEDED, newOppenentDetails: response });
    } else {
        const msg = parseErrorMessageInXhr(httpMethods.HTTP_POST, xhr);
        yield put({ type: opponentsConst.ADD_OPPONENT_FAILED, errorMessage: msg });
    }
}

function* editOpponent(action) {
    const { response, xhr } = yield call(opponentsAPI.editOpponent, action.opponentId, action.opponentObj);
    if (response) {
        yield put({ type: opponentsConst.EDIT_OPPONENT_SUCCEEDED, newOppenentDetails: response });
    } else {
        const msg = parseErrorMessageInXhr(httpMethods.HTTP_PUT, xhr);
        yield put({ type: opponentsConst.EDIT_OPPONENT_FAILED, errorMessage: msg });
    }
}

function* editOpponentWithGrade(action) {
  const { response, xhr } = yield call(opponentsAPI.editOpponent, action.opponentId, action.opponentObj);
  if (response) {
    if (action.grade === 'NO_GRADE') {
        yield put({ type: opponentsConst.EDIT_OPPONENT_WITH_GRADE_SUCCEEDED, newOppenentDetails: response });
    } else {
        const { response: response2, xhr: xhr2 } = yield call(opponentsAPI.assignSingleOpponentToEventPathWithGrade, action.eventPathId, action.opponentId, action.grade);

        if (response2) {
          yield put({ type: opponentsConst.EDIT_OPPONENT_WITH_GRADE_SUCCEEDED, newOppenentDetails: response });
        } else {
          const msg = parseErrorMessageInXhr(httpMethods.HTTP_PUT, xhr2);
          yield put({ type: opponentsConst.CREATE_AND_ASSIGN_OPPONENT_WITH_GRADE_FAILED, errorMessage: msg });
        }
    }
  } else {
      const msg = parseErrorMessageInXhr(httpMethods.HTTP_PUT, xhr);
      yield put({ type: opponentsConst.EDIT_OPPONENT_WITH_GRADE_FAILED, errorMessage: msg });
  }
}

function* deleteAllOpponentOfEventPath(action) {
    const { response, xhr } = yield call(opponentsAPI.deleteAllOpponentOfEventPath, action.eventPathId);
    if (response) {
        yield put({ type: opponentsConst.DELETE_ALL_OPPONENT_OF_EVENT_PATH_SUCCEEDED });
        toastr.add({message: 'Successfully deleted all teams.'});
    } else {
        const msg = parseErrorMessageInXhr(httpMethods.HTTP_DELETE, xhr);
        yield put({ type: opponentsConst.DELETE_ALL_OPPONENT_OF_EVENT_PATH_FAILED, errorMessage: msg });
        toastr.add({message: `Unable to delete all teams. ${msg}`, type: 'ERROR'});
    }
}

function* deleteAllOpponentOfEventPathAndUnder(action) {
    const { response, xhr } = yield call(opponentsAPI.deleteAllOpponentOfEventPathAndUnder, action.eventPathId);
    if (response) {
        yield put({ type: opponentsConst.DELETE_ALL_OPPONENT_OF_EVENT_PATH_AND_UNDER_SUCCEEDED });
        toastr.add({message: 'Successfully deleted all teams.'});
    } else {
        const msg = parseErrorMessageInXhr(httpMethods.HTTP_DELETE, xhr);
        yield put({ type: opponentsConst.DELETE_ALL_OPPONENT_OF_EVENT_PATH_AND_UNDER_FAILED, errorMessage: msg });
        toastr.add({message: `Unable to delete all teams. ${msg}`, type: 'ERROR'});
    }
}

function* assignSingleOpponentToEventPath(action) {
    const { response, xhr } = yield call(opponentsAPI.assignSingleOpponentToEventPath, action.eventPathId, action.opponentId);
    if (response) {
        yield put({ type: opponentsConst.ASSIGN_SINGLE_OPPONENT_TO_EVENT_PATH_SUCCEEDED});
    } else {
        const msg = parseErrorMessageInXhr(httpMethods.HTTP_PUT, xhr);
        yield put({ type: opponentsConst.ASSIGN_SINGLE_OPPONENT_TO_EVENT_PATH_FAILED, errorMessage: msg });
    }
}

function* assignSingleOpponentToEventPathWithGrade(action) {
    const { response, xhr } = yield call(opponentsAPI.assignSingleOpponentToEventPathWithGrade, action.eventPathId, action.opponentId, action.grade);
    if (response) {
        yield put({ type: opponentsConst.ASSIGN_SINGLE_OPPONENT_WITH_GRADE_TO_EVENT_PATH_SUCCEEDED});
    } else {
        const msg = parseErrorMessageInXhr(httpMethods.HTTP_PUT, xhr);
        yield put({ type: opponentsConst.ASSIGN_SINGLE_OPPONENT_WITH_GRADE_TO_EVENT_PATH_FAILED, errorMessage: msg });
    }
}

function* changeOpponentGrade(action) {
    const { response, xhr } = yield call(opponentsAPI.changeOpponentGrade, action.eventPathId, action.opponentId, action.grade);
    if (response) {
        yield put({ type: opponentsConst.CHANGE_OPPONENT_GRADE_SUCCEEDED});
    } else {
        const msg = parseErrorMessageInXhr(httpMethods.HTTP_PUT, xhr);
        yield put({ type: opponentsConst.CHANGE_OPPONENT_GRADE_FAILED, errorMessage: msg });
    }
}

function* assignMultipleOpponentsToEventPath(action) {
    const { response, xhr } = yield call(opponentsAPI.assignMultipleOpponentsToEventPath, action.eventPathId, action.opponentIdList);
    if (response) {
        yield put({ type: opponentsConst.ASSIGN_MULTIPLE_OPPONENTS_TO_EVENT_PATH_SUCCEEDED});
        yield call(fetchEventPathOpponentsDetails, {eventPathId: action.eventPathId});
    } else {
        const msg = parseErrorMessageInXhr(httpMethods.HTTP_PUT, xhr);
        yield put({ type: opponentsConst.ASSIGN_MULTIPLE_OPPONENTS_TO_EVENT_PATH_FAILED, errorMessage: msg });
    }
}

function* unAssignOpponentFromEventPath(action) {
    const { response, xhr } = yield call(opponentsAPI.unAssignOpponentFromEventPath, action.eventPathId, action.opponentId);
    if (response) {
        yield put({ type: opponentsConst.UNASSIGN_OPPONENT_FROM_EVENT_PATH_SUCCEEDED, opponentIdUnassigned: action.opponentId });
        toastr.add({message: 'Successfully deleted opponent.'});
    } else {
        const msg = parseErrorMessageInXhr(httpMethods.HTTP_DELETE, xhr);
        yield put({ type: opponentsConst.UNASSIGN_OPPONENT_FROM_EVENT_PATH_FAILED, errorMessage: msg });
        toastr.add({message: `Unable to delete opponent. ${msg}`, type: 'ERROR'});
    }
}

function* createAndAssignOpponent(action) {
  const { response, xhr } = yield call(opponentsAPI.addOpponent, action.opponentObj);
  if (response) {
    let newOpponent = response;
    let newOpponentId = newOpponent.id;

    const { response: response2, xhr: xhr2 } = yield call(playersAPI.addPlayerToTeam, action.teamId, newOpponentId);

    if (response2) {
      yield put({ type: opponentsConst.CREATE_AND_ASSIGN_OPPONENT_SUCCEEDED, newOppenentDetails: newOpponent });
    } else {
      const msg = parseErrorMessageInXhr(httpMethods.HTTP_PUT, xhr2);
      yield put({ type: opponentsConst.CREATE_AND_ASSIGN_OPPONENT_FAILED, errorMessage: msg });
    }

  } else {
    const msg = parseErrorMessageInXhr(httpMethods.HTTP_POST, xhr);
    yield put({ type: opponentsConst.CREATE_AND_ASSIGN_OPPONENT_FAILED, errorMessage: msg });
  }
}

function* createAndAssignOpponentWithGrade(action) {
  const { response, xhr } = yield call(opponentsAPI.addOpponent, action.opponentObj);
  if (response) {
    yield delay(2000);
    let newOpponent = response;
    let newOpponentId = newOpponent.id;

    if (action.grade === 'NO_GRADE') {
        yield put({ type: opponentsConst.CREATE_AND_ASSIGN_OPPONENT_WITH_GRADE_SUCCEEDED, newOppenentDetails: newOpponent });
    } else {
        const { response: response2, xhr: xhr2 } = yield call(opponentsAPI.assignSingleOpponentToEventPathWithGrade, action.eventPathId, newOpponentId, action.grade);

        if (response2) {
          yield put({ type: opponentsConst.CREATE_AND_ASSIGN_OPPONENT_WITH_GRADE_SUCCEEDED, newOppenentDetails: newOpponent });
        } else {
          const msg = parseErrorMessageInXhr(httpMethods.HTTP_PUT, xhr2);
          yield put({ type: opponentsConst.CREATE_AND_ASSIGN_OPPONENT_WITH_GRADE_FAILED, errorMessage: msg });
        }
    }
  } else {
    const msg = parseErrorMessageInXhr(httpMethods.HTTP_POST, xhr);
    yield put({ type: opponentsConst.CREATE_AND_ASSIGN_OPPONENT_WITH_GRADE_FAILED, errorMessage: msg });
  }
}

function* createAndAssignOpponentToEventPath(action) {
  const { response, xhr } = yield call(opponentsAPI.addOpponent, action.opponentObj);
  if (response) {
    let newOpponent = response;
    let newOpponentId = newOpponent.id;

    const { response: response2, xhr: xhr2 } = yield call(opponentsAPI.assignSingleOpponentToEventPath, action.eventPathId, newOpponentId);

    if (response2) {
      yield put({ type: opponentsConst.CREATE_AND_ASSIGN_OPPONENT_TO_EVENT_PATH_SUCCEEDED, newOppenentDetails: newOpponent });
    } else {
      const msg = parseErrorMessageInXhr(httpMethods.HTTP_PUT, xhr2);
      yield put({ type: opponentsConst.CREATE_AND_ASSIGN_OPPONENT_TO_EVENT_PATH_FAILED, errorMessage: msg });
    }

  } else {
    const msg = parseErrorMessageInXhr(httpMethods.HTTP_POST, xhr);
    yield put({ type: opponentsConst.CREATE_AND_ASSIGN_OPPONENT_TO_EVENT_PATH_FAILED, errorMessage: msg });
  }
}

export default function* opponentsSaga() {
    yield takeLatest(opponentsConst.FETCH_OPPONENT_TYPES, fetchOpponentTypes);
    yield takeLatest(opponentsConst.FETCH_SINGLE_OPPONENT_DETAILS, fetchSingleOpponentDetails);
    yield takeLatest(opponentsConst.FETCH_MULTIPLE_OPPONENTS_DETAILS, fetchMultipleOpponentsDetails);
    yield takeLatest(opponentsConst.FETCH_SINGLE_OPPONENT_WITH_GRADE_DETAILS, fetchSingleOpponentDetailsWithGrade);
    yield takeLatest(opponentsConst.FETCH_EVENT_PATH_OPPONENTS_DETAILS, fetchEventPathOpponentsDetails);
    yield takeLatest(opponentsConst.FETCH_EVENT_PATH_ANCESTRAL_OPPONENTS, fetchEventPathAncestralOpponents);
    yield takeLatest(opponentsConst.FETCH_OPPONENT_KITS, fetchOpponentKits);
    yield takeLatest(opponentsConst.FETCH_KIT_PATTERNS, fetchKitPatterns);
    yield takeLatest(opponentsConst.ADD_OPPONENT, addOpponent);
    yield takeLatest(opponentsConst.EDIT_OPPONENT, editOpponent);
    yield takeLatest(opponentsConst.EDIT_OPPONENT_WITH_GRADE, editOpponentWithGrade);
    yield takeLatest(opponentsConst.DELETE_ALL_OPPONENT_OF_EVENT_PATH, deleteAllOpponentOfEventPath);
    yield takeLatest(opponentsConst.DELETE_ALL_OPPONENT_OF_EVENT_PATH_AND_UNDER, deleteAllOpponentOfEventPathAndUnder);
    yield takeLatest(opponentsConst.ASSIGN_SINGLE_OPPONENT_TO_EVENT_PATH, assignSingleOpponentToEventPath);
    yield takeLatest(opponentsConst.ASSIGN_SINGLE_OPPONENT_WITH_GRADE_TO_EVENT_PATH, assignSingleOpponentToEventPathWithGrade);
    yield takeLatest(opponentsConst.CHANGE_OPPONENT_GRADE, changeOpponentGrade);
    yield takeLatest(opponentsConst.ASSIGN_MULTIPLE_OPPONENTS_TO_EVENT_PATH, assignMultipleOpponentsToEventPath);
    yield takeLatest(opponentsConst.UNASSIGN_OPPONENT_FROM_EVENT_PATH, unAssignOpponentFromEventPath);
    yield takeLatest(opponentsConst.CREATE_AND_ASSIGN_OPPONENT, createAndAssignOpponent);
    yield takeLatest(opponentsConst.CREATE_AND_ASSIGN_OPPONENT_WITH_GRADE, createAndAssignOpponentWithGrade);
    yield takeLatest(opponentsConst.CREATE_AND_ASSIGN_OPPONENT_TO_EVENT_PATH, createAndAssignOpponentToEventPath);
}
