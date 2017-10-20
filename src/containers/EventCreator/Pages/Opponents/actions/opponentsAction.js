'use strict';
import opponentsConst from 'eventCreatorOpponentsConstants/opponentsConst';

export function fetchOpponentTypes() {
    return {
        type: opponentsConst.FETCH_OPPONENT_TYPES,
    }
}

export function fetchSingleOpponentDetails(opponentId) {
    return {
        type: opponentsConst.FETCH_SINGLE_OPPONENT_DETAILS,
        opponentId,
    }
}

export function fetchMultipleOpponentsDetails(opponentIdList) {
    return {
        type: opponentsConst.FETCH_MULTIPLE_OPPONENTS_DETAILS,
        opponentIdList,
    }
}

export function fetchSingleOpponentDetailsWithGrade(eventPathId, opponentId) {
    return {
        type: opponentsConst.FETCH_SINGLE_OPPONENT_WITH_GRADE_DETAILS,
        eventPathId,
        opponentId,
    }
}

export function fetchEventPathOpponentsDetails(eventPathId) {
    return {
        type: opponentsConst.FETCH_EVENT_PATH_OPPONENTS_DETAILS,
        eventPathId,
    }
}

export function fetchEventPathAncestralOpponents(eventPathId) {
    return {
        type: opponentsConst.FETCH_EVENT_PATH_ANCESTRAL_OPPONENTS,
        eventPathId,
    }
}

export function fetchOpponentKits(opponentId) {
    return {
        type: opponentsConst.FETCH_OPPONENT_KITS,
        opponentId,
    }
}

export function clearOpponentKits() {
  return {
    type: opponentsConst.CLEAR_OPPONENT_KITS,
  }
}

export function fetchKitPatterns() {
    return {
        type: opponentsConst.FETCH_KIT_PATTERNS,
    }
}

export function addOpponent(opponentObj) {
    return {
        type: opponentsConst.ADD_OPPONENT,
        opponentObj,
    }
}

export function editOpponent(opponentId, opponentObj) {
    return {
        type: opponentsConst.EDIT_OPPONENT,
        opponentId,
        opponentObj,
    }
}

export function editOpponentWithGrade(eventPathId, opponentId, opponentObj, grade) {
  return {
    type: opponentsConst.EDIT_OPPONENT_WITH_GRADE,
    eventPathId,
    opponentId,
    opponentObj,
    grade,
  }
}

export function deleteOpponentOfEventPath() {
    return {
        type: opponentsConst.DELETE_OPPONENT_OF_EVENT_PATH,

    }
}

export function deleteAllOpponentOfEventPath(eventPathId) {
    return {
        type: opponentsConst.DELETE_ALL_OPPONENT_OF_EVENT_PATH,
        eventPathId,
    }
}

export function deleteAllOpponentOfEventPathAndUnder(eventPathId) {
    return {
        type: opponentsConst.DELETE_ALL_OPPONENT_OF_EVENT_PATH_AND_UNDER,
        eventPathId,
    }
}

export function assignSingleOpponentToEventPath(eventPathId, opponentId) {
    return {
        type: opponentsConst.ASSIGN_SINGLE_OPPONENT_TO_EVENT_PATH,
        eventPathId,
        opponentId,
    }
}

export function assignSingleOpponentToEventPathWithGrade(eventPathId, opponentId, grade) {
    return {
        type: opponentsConst.ASSIGN_SINGLE_OPPONENT_WITH_GRADE_TO_EVENT_PATH,
        eventPathId,
        opponentId,
        grade,
    }
}

export function changeOpponentGrade(eventPathId, opponentId, grade) {
    return {
        type: opponentsConst.CHANGE_OPPONENT_GRADE,
        eventPathId,
        opponentId,
        grade,
    }
}

export function assignMultipleOpponentsToEventPath(eventPathId, opponentIdList) {
    return {
        type: opponentsConst.ASSIGN_MULTIPLE_OPPONENTS_TO_EVENT_PATH,
        eventPathId,
        opponentIdList,
    }
}

export function unAssignOpponentFromEventPath(eventPathId, opponentId) {
    return {
        type: opponentsConst.UNASSIGN_OPPONENT_FROM_EVENT_PATH,
        eventPathId,
        opponentId,
    }
}

export function createAndAssignOpponent(teamId, opponentObj) {
  return {
    type: opponentsConst.CREATE_AND_ASSIGN_OPPONENT,
    teamId,
    opponentObj,
  }
}

export function createAndAssignOpponentWithGrade(eventPathId, opponentObj, grade) {
  return {
    type: opponentsConst.CREATE_AND_ASSIGN_OPPONENT_WITH_GRADE,
    eventPathId,
    opponentObj,
    grade,
  }
}

export function createAndAssignOpponentToEventPath(eventPathId, opponentObj) {
  return {
    type: opponentsConst.CREATE_AND_ASSIGN_OPPONENT_TO_EVENT_PATH,
    eventPathId,
    opponentObj,
  }
}
