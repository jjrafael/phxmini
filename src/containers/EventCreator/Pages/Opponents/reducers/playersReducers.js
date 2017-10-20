'use strict';
import playersConst from 'eventCreatorOpponentsConstants/playersConst';

const initialState = {
    // general opponent action info
    errorMessage: null,
    lastActionMade: null,
    isPerformingAction: false,
    actionFailed: false,

    // jem bug fix
    isFetchSinglePlayerOfTeamDetailsPerforming: false,
    isFetchMultiplePlayersOfTeamDetailsPerforming: false,
    isAddPlayerToTeamPerforming: false,
    isDeletePlayerOfTeamPerforming: false,
    isDeleteAllPlayerOfTeamPerforming: false,

    isDelAllPlayerOfEPPerforming: false,
    delAllPlayerOfEPFailed: false,
    delAllPlayerOfEPErrorMessage: null,


    playerIdsRemoved: [],

    // action specific results
    playerDetails: null,
    playerDetailsList: [],

};

export default function (state = initialState, action) {
    switch(action.type) {

        case playersConst.FETCH_SINGLE_PLAYER_OF_TEAM_DETAILS:
            return { ...state, isFetchSinglePlayerOfTeamDetailsPerforming: true, actionFailed: false, errorMessage: null, lastActionMade: action.type };
        case playersConst.FETCH_SINGLE_PLAYER_OF_TEAM_DETAILS_SUCCEEDED:
            return { ...state, isFetchSinglePlayerOfTeamDetailsPerforming: false, playerDetails: action.playerDetails };
        case playersConst.FETCH_SINGLE_PLAYER_OF_TEAM_DETAILS_FAILED:
            return { ...state, isFetchSinglePlayerOfTeamDetailsPerforming: false, actionFailed: true, errorMessage: action.errorMessage };

        case playersConst.CLEAR_PLAYERS_OF_TEAM_DETAILS:
            return { ...state, playerDetailsList: [] };

        case playersConst.FETCH_MULTIPLE_PLAYERS_OF_TEAM_DETAILS:
            return { ...state, isFetchMultiplePlayersOfTeamDetailsPerforming: true, actionFailed: false, errorMessage: null, lastActionMade: action.type, playerIdsRemoved: [] };
        case playersConst.FETCH_MULTIPLE_PLAYERS_OF_TEAM_DETAILS_SUCCEEDED:
            return { ...state, isFetchMultiplePlayersOfTeamDetailsPerforming: false, playerDetailsList: action.playerDetailsList };
        case playersConst.FETCH_MULTIPLE_PLAYERS_OF_TEAM_DETAILS_FAILED:
            return { ...state, isFetchMultiplePlayersOfTeamDetailsPerforming: false, actionFailed: true, errorMessage: action.errorMessage };

        case playersConst.ADD_PLAYER_TO_TEAM:
            return { ...state, isAddPlayerToTeamPerforming: true, actionFailed: false, errorMessage: null, lastActionMade: action.type };
        case playersConst.ADD_PLAYER_TO_TEAM_SUCCEEDED:
            return { ...state, isAddPlayerToTeamPerforming: false };
        case playersConst.ADD_PLAYER_TO_TEAM_FAILED:
            return { ...state, isAddPlayerToTeamPerforming: false, actionFailed: true, errorMessage: action.errorMessage };

        case playersConst.DELETE_PLAYER_OF_TEAM:
            return { ...state, isDeletePlayerOfTeamPerforming: true, actionFailed: false, errorMessage: null, lastActionMade: action.type };
        case playersConst.DELETE_PLAYER_OF_TEAM_SUCCEEDED:
            return { ...state, isDeletePlayerOfTeamPerforming: false, playerIdsRemoved: [ ...state.playerIdsRemoved, action.playerIdRemoved ] };
        case playersConst.DELETE_PLAYER_OF_TEAM_FAILED:
            return { ...state, isDeletePlayerOfTeamPerforming: false, actionFailed: true, errorMessage: action.errorMessage };

        case playersConst.DELETE_ALL_PLAYER_OF_TEAM:
            return { ...state, isDeleteAllPlayerOfTeamPerforming: true, actionFailed: false, errorMessage: null, lastActionMade: action.type };
        case playersConst.DELETE_ALL_PLAYER_OF_TEAM_SUCCEEDED:
            return { ...state, isDeleteAllPlayerOfTeamPerforming: false };
        case playersConst.DELETE_ALL_PLAYER_OF_TEAM_FAILED:
            return { ...state, isDeleteAllPlayerOfTeamPerforming: false, actionFailed: true, errorMessage: action.errorMessage };

        case playersConst.DELETE_ALL_PLAYER_OF_EVENTPATH:
            return { ...state, isDelAllPlayerOfEPPerforming: true, delAllPlayerOfEPFailed: false, delAllPlayerOfEPErrorMessage: null };
        case playersConst.DELETE_ALL_PLAYER_OF_EVENTPATH_SUCCEEDED:
            return { ...state, isDelAllPlayerOfEPPerforming: false };
        case playersConst.DELETE_ALL_PLAYER_OF_EVENTPATH_FAILED:
            return { ...state, isDelAllPlayerOfEPPerforming: false, delAllPlayerOfEPFailed: true, delAllPlayerOfEPErrorMessage: action.errorMessage };

        default:
            return { ...state };
    }
}
