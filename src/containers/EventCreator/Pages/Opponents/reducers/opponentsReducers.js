'use strict';
import opponentsConst from 'eventCreatorOpponentsConstants/opponentsConst';

const initialState = {
    // general opponent action info
    errorMessage: null,
    lastActionMade: null,
    isPerformingAction: false,
    actionFailed: false,

    delAllOppOfEPFailed: false,
    delAllOppOfEPErrorMessage: null,

    // jem bug fix
    isFetchOpponentTypesPerforming: false,
    isFetchSingleOpponentDetailsPerforming: false,
    isFetchMultipleOpponentDetailsPerfoming: false,
    isFetchSingleOpponentWithGradeDetailsPerforming: false,
    isFetchEventPathOpponentsDetailsPerforming: false,

    isFetchEventPathAncestralOpponentsPerforming: false,
    isFetchEventPathAncestralOpponentsFailed: false,
    isFetchEventPathAncestralOpponentsErrMsg: null,

    isFetchOpponentKitsPerforming: false,
    isFetchKitPatternsPerforming: false,
    isAddOpponentPerforming: false,
    isEditOpponentPerforming: false,
    isEditOpponentWithGradePerforming: false,
    isDeleteAllOpponentOfEventPathPerforming: false,
    isDeleteAllOppOfEventPathAndUnderPerforming: false,
    isAssignSignleOpponentToEventPathPerforming: false,
    isAssignSingleOpponentWithGradeToEventPathPerforming: false,
    isChangeOpponentGradePerforming: false,
    isAssignMultipleOpponentsToEventPathPerforming: false,
    isUnAssignOpponentFromEventPathPerforming: false,
    isCreateAndAssignOpponentPerforming: false,
    isCreateAndAssignOpponentWithGradePerforming: false,
    isCreateAndAssignOpponentToEventPathPerforming: false,

    opponentIdsRemoved: [],

    // action specific results
    opponentTypes: [],
    opponentDetailsSingle: null,
    opponentDetailsMultiple: null,
    opponentDetailsSingleWithGrade: null,
    eventPathOpponentDetailsList: [],
    eventPathAncestralOpponentsList: [],
    opponentKitList: [],
    kitPattenList: [],
    newOppenentDetails: null
};

export default function (state = initialState, action) {
    switch(action.type) {

        case opponentsConst.FETCH_OPPONENT_TYPES:
            return { ...state, isFetchOpponentTypesPerforming: true, actionFailed: false, errorMessage: null, lastActionMade: action.type, opponentIdsRemoved: [] };
        case opponentsConst.FETCH_OPPONENT_TYPES_SUCCEEDED:
            return { ...state, isFetchOpponentTypesPerforming: false, opponentTypes: action.opponentTypes };
        case opponentsConst.FETCH_OPPONENT_TYPES_FAILED:
            return { ...state, isFetchOpponentTypesPerforming: false, actionFailed: true, errorMessage: action.errorMessage };

        case opponentsConst.FETCH_SINGLE_OPPONENT_DETAILS:
            return { ...state, isFetchSingleOpponentDetailsPerforming: true, actionFailed: false, errorMessage: null, lastActionMade: action.type };
        case opponentsConst.FETCH_SINGLE_OPPONENT_DETAILS_SUCCEEDED:
            return { ...state, isFetchSingleOpponentDetailsPerforming: false, opponentDetailsSingle: action.opponentDetails };
        case opponentsConst.FETCH_SINGLE_OPPONENT_DETAILS_FAILED:
            return { ...state, isFetchSingleOpponentDetailsPerforming: false, actionFailed: true, errorMessage: action.errorMessage };

        case opponentsConst.FETCH_MULTIPLE_OPPONENTS_DETAILS:
            return { ...state, isFetchMultipleOpponentDetailsPerfoming: true, actionFailed: false, errorMessage: null, lastActionMade: action.type };
        case opponentsConst.FETCH_MULTIPLE_OPPONENTS_DETAILS_SUCCEEDED:
            return { ...state, isFetchMultipleOpponentDetailsPerfoming: false, opponentDetailsMultiple: action.opponentDetailsMultiple };
        case opponentsConst.FETCH_MULTIPLE_OPPONENTS_DETAILS_FAILED:
            return { ...state, isFetchMultipleOpponentDetailsPerfoming: false, actionFailed: true, errorMessage: action.errorMessage };

        case opponentsConst.FETCH_SINGLE_OPPONENT_WITH_GRADE_DETAILS:
            return { ...state, isFetchSingleOpponentWithGradeDetailsPerforming: true, actionFailed: false, errorMessage: null, lastActionMade: action.type };
        case opponentsConst.FETCH_SINGLE_OPPONENT_WITH_GRADE_DETAILS_SUCCEEDED:
            return { ...state, isFetchSingleOpponentWithGradeDetailsPerforming: false, opponentDetailsSingleWithGrade: action.opponentDetailsSingleWithGrade };
        case opponentsConst.FETCH_SINGLE_OPPONENT_WITH_GRADE_DETAILS_FAILED:
            return { ...state, isFetchSingleOpponentWithGradeDetailsPerforming: false, actionFailed: true, errorMessage: action.errorMessage };

        case opponentsConst.FETCH_EVENT_PATH_OPPONENTS_DETAILS:
            return { ...state, isFetchEventPathOpponentsDetailsPerforming: true, actionFailed: false, errorMessage: null, lastActionMade: action.type };
        case opponentsConst.FETCH_EVENT_PATH_OPPONENTS_DETAILS_SUCCEEDED:
            return { ...state, isFetchEventPathOpponentsDetailsPerforming: false, eventPathOpponentDetailsList: action.eventPathOpponentDetailsList };
        case opponentsConst.FETCH_EVENT_PATH_OPPONENTS_DETAILS_FAILED:
            return { ...state, isFetchEventPathOpponentsDetailsPerforming: false, actionFailed: true, errorMessage: action.errorMessage };

        case opponentsConst.FETCH_EVENT_PATH_ANCESTRAL_OPPONENTS:
            return { ...state, isFetchEventPathAncestralOpponentsPerforming: true, isFetchEventPathAncestralOpponentsFailed: false, isFetchEventPathAncestralOpponentsErrMsg: null };
        case opponentsConst.FETCH_EVENT_PATH_ANCESTRAL_OPPONENTS_SUCCEEDED:
            return { ...state, isFetchEventPathAncestralOpponentsPerforming: false, eventPathAncestralOpponentsList: action.eventPathAncestralOpponentsList };
        case opponentsConst.FETCH_EVENT_PATH_ANCESTRAL_OPPONENTS_FAILED:
            return { ...state, isFetchEventPathAncestralOpponentsPerforming: false, isFetchEventPathAncestralOpponentsFailed: true, isFetchEventPathAncestralOpponentsErrMsg: action.errorMessage };

        case opponentsConst.FETCH_OPPONENT_KITS:
            return { ...state, isFetchOpponentKitsPerforming: true, actionFailed: false, errorMessage: null, lastActionMade: action.type };
        case opponentsConst.FETCH_OPPONENT_KITS_SUCCEEDED:
            return { ...state, isFetchOpponentKitsPerforming: false, opponentKitList: action.opponentKitList };
        case opponentsConst.FETCH_OPPONENT_KITS_FAILED:
            return { ...state, isFetchOpponentKitsPerforming: false, actionFailed: true, errorMessage: action.errorMessage };

        case opponentsConst.CLEAR_OPPONENT_KITS:
            return { ...state, opponentKitList: [] };

        case opponentsConst.FETCH_KIT_PATTERNS:
            return { ...state, isFetchKitPatternsPerforming: true, actionFailed: false, errorMessage: null, lastActionMade: action.type };
        case opponentsConst.FETCH_KIT_PATTERNS_SUCCEEDED:
            return { ...state, isFetchKitPatternsPerforming: false, kitPattenList: action.kitPattenList };
        case opponentsConst.FETCH_KIT_PATTERNS_FAILED:
            return { ...state, isFetchKitPatternsPerforming: false, actionFailed: true, errorMessage: action.errorMessage };

        case opponentsConst.ADD_OPPONENT:
            return { ...state, isAddOpponentPerforming: true, actionFailed: false, errorMessage: null, lastActionMade: action.type };
        case opponentsConst.ADD_OPPONENT_SUCCEEDED:
            return { ...state, isAddOpponentPerforming: false, newOppenentDetails: action.newOppenentDetails };
        case opponentsConst.ADD_OPPONENT_FAILED:
            return { ...state, isAddOpponentPerforming: false, actionFailed: true, errorMessage: action.errorMessage };

        case opponentsConst.EDIT_OPPONENT:
            return { ...state, isEditOpponentPerforming: true, actionFailed: false, errorMessage: null, lastActionMade: action.type };
        case opponentsConst.EDIT_OPPONENT_SUCCEEDED:
            return { ...state, isEditOpponentPerforming: false, newOppenentDetails: action.newOppenentDetails };
        case opponentsConst.EDIT_OPPONENT_FAILED:
            return { ...state, isEditOpponentPerforming: false, actionFailed: true, errorMessage: action.errorMessage };

        case opponentsConst.EDIT_OPPONENT_WITH_GRADE:
          return { ...state, isEditOpponentWithGradePerforming: true, actionFailed: false, errorMessage: null, lastActionMade: action.type };
        case opponentsConst.EDIT_OPPONENT_WITH_GRADE_SUCCEEDED:
          return { ...state, isEditOpponentWithGradePerforming: false };
        case opponentsConst.EDIT_OPPONENT_WITH_GRADE_FAILED:
          return { ...state, isEditOpponentWithGradePerforming: false, actionFailed: true, errorMessage: action.errorMessage };

        case opponentsConst.DELETE_ALL_OPPONENT_OF_EVENT_PATH:
            return { ...state, isDeleteAllOpponentOfEventPathPerforming: true, delAllOppOfEPFailed: false, delAllOppOfEPErrorMessage: null};
        case opponentsConst.DELETE_ALL_OPPONENT_OF_EVENT_PATH_SUCCEEDED:
            return { ...state, isDeleteAllOpponentOfEventPathPerforming: false };
        case opponentsConst.DELETE_ALL_OPPONENT_OF_EVENT_PATH_FAILED:
            return { ...state, isDeleteAllOpponentOfEventPathPerforming: false, delAllOppOfEPFailed: true, delAllOppOfEPErrorMessage: action.errorMessage };

        case opponentsConst.DELETE_ALL_OPPONENT_OF_EVENT_PATH_AND_UNDER:
            return { ...state, isDeleteAllOppOfEventPathAndUnderPerforming: true, actionFailed: false, errorMessage: null, lastActionMade: action.type };
        case opponentsConst.DELETE_ALL_OPPONENT_OF_EVENT_PATH_AND_UNDER_SUCCEEDED:
            return { ...state, isDeleteAllOppOfEventPathAndUnderPerforming: false };
        case opponentsConst.DELETE_ALL_OPPONENT_OF_EVENT_PATH_AND_UNDER_FAILED:
            return { ...state, isDeleteAllOppOfEventPathAndUnderPerforming: false, actionFailed: true, errorMessage: action.errorMessage };

        case opponentsConst.ASSIGN_SINGLE_OPPONENT_TO_EVENT_PATH:
            return { ...state, isAssignSignleOpponentToEventPathPerforming: true, actionFailed: false, errorMessage: null, lastActionMade: action.type };
        case opponentsConst.ASSIGN_SINGLE_OPPONENT_TO_EVENT_PATH_SUCCEEDED:
            return { ...state, isAssignSignleOpponentToEventPathPerforming: false };
        case opponentsConst.ASSIGN_SINGLE_OPPONENT_TO_EVENT_PATH_FAILED:
            return { ...state, isAssignSignleOpponentToEventPathPerforming: false, actionFailed: true, errorMessage: action.errorMessage };

        case opponentsConst.ASSIGN_SINGLE_OPPONENT_WITH_GRADE_TO_EVENT_PATH:
            return { ...state, isAssignSingleOpponentWithGradeToEventPathPerforming: true, actionFailed: false, errorMessage: null, lastActionMade: action.type };
        case opponentsConst.ASSIGN_SINGLE_OPPONENT_WITH_GRADE_TO_EVENT_PATH_SUCCEEDED:
            return { ...state, isAssignSingleOpponentWithGradeToEventPathPerforming: false };
        case opponentsConst.ASSIGN_SINGLE_OPPONENT_WITH_GRADE_TO_EVENT_PATH_FAILED:
            return { ...state, isAssignSingleOpponentWithGradeToEventPathPerforming: false, actionFailed: true, errorMessage: action.errorMessage };

        case opponentsConst.CHANGE_OPPONENT_GRADE:
            return { ...state, isChangeOpponentGradePerforming: true, actionFailed: false, errorMessage: null, lastActionMade: action.type };
        case opponentsConst.CHANGE_OPPONENT_GRADE_SUCCEEDED:
            return { ...state, isChangeOpponentGradePerforming: false };
        case opponentsConst.CHANGE_OPPONENT_GRADE_FAILED:
            return { ...state, isChangeOpponentGradePerforming: false, actionFailed: true, errorMessage: action.errorMessage };

        case opponentsConst.ASSIGN_MULTIPLE_OPPONENTS_TO_EVENT_PATH:
            return { ...state, isAssignMultipleOpponentsToEventPathPerforming: true, actionFailed: false, errorMessage: null, lastActionMade: action.type };
        case opponentsConst.ASSIGN_MULTIPLE_OPPONENTS_TO_EVENT_PATH_SUCCEEDED:
            return { ...state, isAssignMultipleOpponentsToEventPathPerforming: false };
        case opponentsConst.ASSIGN_MULTIPLE_OPPONENTS_TO_EVENT_PATH_FAILED:
            return { ...state, isAssignMultipleOpponentsToEventPathPerforming: false, actionFailed: true, errorMessage: action.errorMessage };

        case opponentsConst.UNASSIGN_OPPONENT_FROM_EVENT_PATH:
            return { ...state, isUnAssignOpponentFromEventPathPerforming: true, actionFailed: false, errorMessage: null, lastActionMade: action.type };
        case opponentsConst.UNASSIGN_OPPONENT_FROM_EVENT_PATH_SUCCEEDED:
            return { ...state, isUnAssignOpponentFromEventPathPerforming: false, opponentIdsRemoved: [ ...state.opponentIdsRemoved, action.opponentIdUnassigned ] };
        case opponentsConst.UNASSIGN_OPPONENT_FROM_EVENT_PATH_FAILED:
            return { ...state, isUnAssignOpponentFromEventPathPerforming: false, actionFailed: true, errorMessage: action.errorMessage };

        case opponentsConst.CREATE_AND_ASSIGN_OPPONENT:
          return { ...state, isCreateAndAssignOpponentPerforming: true, actionFailed: false, errorMessage: null, lastActionMade: action.type };
        case opponentsConst.CREATE_AND_ASSIGN_OPPONENT_SUCCEEDED:
          return { ...state, isCreateAndAssignOpponentPerforming: false };
        case opponentsConst.CREATE_AND_ASSIGN_OPPONENT_FAILED:
          return { ...state, isCreateAndAssignOpponentPerforming: false, actionFailed: true, errorMessage: action.errorMessage };

        case opponentsConst.CREATE_AND_ASSIGN_OPPONENT_WITH_GRADE:
          return { ...state, isCreateAndAssignOpponentWithGradePerforming: true, actionFailed: false, errorMessage: null, lastActionMade: action.type };
        case opponentsConst.CREATE_AND_ASSIGN_OPPONENT_WITH_GRADE_SUCCEEDED:
          return { ...state, isCreateAndAssignOpponentWithGradePerforming: false };
        case opponentsConst.CREATE_AND_ASSIGN_OPPONENT_WITH_GRADE_FAILED:
          return { ...state,
            isCreateAndAssignOpponentWithGradePerforming: false,
            isEditOpponentPerforming: false,
            isEditOpponentWithGradePerforming: false,
            actionFailed: true,
            errorMessage: action.errorMessage
        };

        case opponentsConst.CREATE_AND_ASSIGN_OPPONENT_TO_EVENT_PATH:
          return { ...state, isCreateAndAssignOpponentToEventPathPerforming: true, actionFailed: false, errorMessage: null, lastActionMade: action.type };
        case opponentsConst.CREATE_AND_ASSIGN_OPPONENT_TO_EVENT_PATH_SUCCEEDED:
          return { ...state, isCreateAndAssignOpponentToEventPathPerforming: false };
        case opponentsConst.CREATE_AND_ASSIGN_OPPONENT_TO_EVENT_PATH_FAILED:
          return { ...state, isCreateAndAssignOpponentToEventPathPerforming: false, actionFailed: true, errorMessage: action.errorMessage };

        default:
            return { ...state };
    }
}
