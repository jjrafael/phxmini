'use strict';
import { put, call, fork, select } from 'redux-saga/effects';
import { takeLatest, takeEvery, delay } from 'redux-saga';
import playersConst from 'eventCreatorOpponentsConstants/playersConst';
import * as playersAPI from 'eventCreatorOpponentsServices/playersServices';
import { parseErrorMessageInXhr } from 'phxServices/apiUtils';
import httpMethods from 'phxConstants/httpMethods';
import { toastr } from 'phxComponents/toastr/index';

function* fetchSinglePlayerOfTeamDetails(action) {
    const { response, xhr } = yield call(playersAPI.fetchSinglePlayerOfTeamDetails, action.playerId);
    if (response) {
        yield put({ type: playersConst.FETCH_SINGLE_PLAYER_OF_TEAM_DETAILS_SUCCEEDED, playerDetails: response });
    } else {
        const msg = parseErrorMessageInXhr(httpMethods.HTTP_GET, xhr);
        yield put({ type: playersConst.FETCH_SINGLE_PLAYER_OF_TEAM_DETAILS_FAILED, errorMessage: msg });
    }
}

function* fetchMultiplePlayersOfTeamDetails(action) {
    const { response, xhr } = yield call(playersAPI.fetchMultiplePlayersOfTeamDetails, action.teamId);
    if (response) {
        yield put({ type: playersConst.FETCH_MULTIPLE_PLAYERS_OF_TEAM_DETAILS_SUCCEEDED, playerDetailsList: response });
    } else {
        const msg = parseErrorMessageInXhr(httpMethods.HTTP_GET, xhr);
        yield put({ type: playersConst.FETCH_MULTIPLE_PLAYERS_OF_TEAM_DETAILS_FAILED, errorMessage: msg });
    }
}

function* addPlayerToTeam(action) {
    const { response, xhr } = yield call(playersAPI.addPlayerToTeam, action.teamId, action.playerId);
    if (response) {
        yield put({ type: playersConst.ADD_PLAYER_TO_TEAM_SUCCEEDED });
    } else {
        const msg = parseErrorMessageInXhr(httpMethods.HTTP_PUT, xhr);
        yield put({ type: playersConst.ADD_PLAYER_TO_TEAM_FAILED, errorMessage: msg });
    }
}

function* deletePlayerOfTeam(action) {
    const { response, xhr } = yield call(playersAPI.deletePlayerOfTeam, action.teamId, action.playerId);
    if (response) {
        yield put({ type: playersConst.DELETE_PLAYER_OF_TEAM_SUCCEEDED, playerIdRemoved: action.playerId });
    } else {
        const msg = parseErrorMessageInXhr(httpMethods.HTTP_DELETE, xhr);
        yield put({ type: playersConst.DELETE_PLAYER_OF_TEAM_FAILED, errorMessage: msg });
    }
}

function* deleteAllPlayerOfTeam(action) {
    const { response, xhr } = yield call(playersAPI.deleteAllPlayerOfTeam, action.teamId);
    if (response) {
        yield put({ type: playersConst.DELETE_ALL_PLAYER_OF_TEAM_SUCCEEDED });
        toastr.add({message: 'Successfully deleted all players.'});
    } else {
        const msg = parseErrorMessageInXhr(httpMethods.HTTP_DELETE, xhr);
        yield put({ type: playersConst.DELETE_ALL_PLAYER_OF_TEAM_FAILED, errorMessage: msg });
        toastr.add({message: `Unable to delete all players. ${msg}`, type: 'ERROR'});
    }
}

function* deleteAllPlayerOfEventPath(action) {
    const { response, xhr } = yield call(playersAPI.deleteAllPlayerOfEventPath, action.eventPathId);
    if (response) {
        yield put({ type: playersConst.DELETE_ALL_PLAYER_OF_EVENTPATH_SUCCEEDED });
        toastr.add({message: 'Successfully deleted all players.'});
    } else {
        const msg = parseErrorMessageInXhr(httpMethods.HTTP_DELETE, xhr);
        yield put({ type: playersConst.DELETE_ALL_PLAYER_OF_EVENTPATH_FAILED, errorMessage: msg });
        toastr.add({message: `Unable to delete all players. ${msg}`, type: 'ERROR'});
    }
}



export default function* playersSaga() {
    yield takeLatest(playersConst.FETCH_SINGLE_PLAYER_OF_TEAM_DETAILS, fetchSinglePlayerOfTeamDetails);
    yield takeLatest(playersConst.FETCH_MULTIPLE_PLAYERS_OF_TEAM_DETAILS, fetchMultiplePlayersOfTeamDetails);
    yield takeLatest(playersConst.ADD_PLAYER_TO_TEAM, addPlayerToTeam);
    yield takeLatest(playersConst.DELETE_PLAYER_OF_TEAM, deletePlayerOfTeam);
    yield takeLatest(playersConst.DELETE_ALL_PLAYER_OF_TEAM, deleteAllPlayerOfTeam);
    yield takeLatest(playersConst.DELETE_ALL_PLAYER_OF_EVENTPATH, deleteAllPlayerOfEventPath);
}
