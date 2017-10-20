'use strict';
import playersConst from 'eventCreatorOpponentsConstants/playersConst';

export function fetchSinglePlayerOfTeamDetails(playerId) {
    return {
        type: playersConst.FETCH_SINGLE_PLAYER_OF_TEAM_DETAILS,
        playerId,
    }
}

export function clearPlayersOfTeamDetails() {
    return {
        type: playersConst.CLEAR_PLAYERS_OF_TEAM_DETAILS
    }
}

export function fetchMultiplePlayersOfTeamDetails(teamId) {
    return {
        type: playersConst.FETCH_MULTIPLE_PLAYERS_OF_TEAM_DETAILS,
        teamId,
    }
}

export function addPlayerToTeam(teamId, playerId) {
    return {
        type: playersConst.ADD_PLAYER_TO_TEAM,
        teamId,
        playerId,
    }
}

export function deletePlayerOfTeam(teamId, playerId) {
    return {
        type: playersConst.DELETE_PLAYER_OF_TEAM,
        teamId,
        playerId,
    }
}

export function deleteAllPlayerOfTeam(teamId) {
    return {
        type: playersConst.DELETE_ALL_PLAYER_OF_TEAM,
        teamId,
    }
}

export function deleteAllPlayerOfEventPath(eventPathId) {
    return {
        type: playersConst.DELETE_ALL_PLAYER_OF_EVENTPATH,
        eventPathId,
    }
}
