'use strict';
import React from "react";
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import ReactTable from 'react-table';
import { createSelector } from 'reselect';
import _ from 'underscore';
import { permissionsCode } from 'containersV2/EventCreator/App/constants';
import * as TableColumns from 'eventCreatorOpponentsConstants/opponentsTableColumns';
import MODE from 'eventCreatorOpponentsConstants/modeConst';
import TAG from 'eventCreatorOpponentsConstants/tagConst';
import OpponentsTable from 'eventCreatorOpponentsComponents/OpponentsTable';
import OponentsTableActionBar from "eventCreatorOpponentsComponents/OpponentsTableActionBar";
import opponentsConst from 'eventCreatorOpponentsConstants/opponentsConst';
import playersConst from 'eventCreatorOpponentsConstants/playersConst';

import LoadingIndicator from 'phxComponents/loadingIndicator';
import { fetchOpponentTypes, fetchEventPathOpponentsDetails, deleteAllOpponentOfEventPathAndUnder, unAssignOpponentFromEventPath } from "eventCreatorOpponentsActions/opponentsAction";
import { fetchMultiplePlayersOfTeamDetails, deletePlayerOfTeam, deleteAllPlayerOfTeam, clearPlayersOfTeamDetails } from "eventCreatorOpponentsActions/playersActions";

import AddEditOpponentDlg from 'eventCreatorOpponentsContainers/AddEditOpponentDlg';
import ConfirmModal from 'componentsV2/Modal/ConfirmModal';
import ModalWindow from 'components/modal';
import ImportOpponentDlg from 'eventCreatorOpponentsContainers/ImportOpponentDlg2';
import { toastr } from 'phxComponents/toastr/index';
import { fetchEventPathDetails } from '../../../../../containersV2/EventCreator/Path/actions'

// import EventPathMain from '../../../../../containersV2/EventCreator/EventPathTree/index';


const sportsParentIdSelector = state => state.sportsTree.activeSportId;
const selectedEventPathSelector = state => state.eventCreatorApp.activePathId;
const currentSelectedPathIdSelector = createSelector(
    sportsParentIdSelector,
    selectedEventPathSelector,
    (sportsId, eventId) => {
        let pathId = -1;

        if (eventId !== null) {
            pathId = eventId;
        } else {
            pathId = sportsId;
        }

        return pathId;
    }
);

const sportsCodesSelector = state => state.apiConstants.values.riskSports;
const currentSelectedPathSportCodeSelector = createSelector(
  sportsParentIdSelector,
  sportsCodesSelector,
  (sportId, sportCodes) => {
    let searchId = {defaultEventPathId: sportId};
    let sportObject = _.findWhere(sportCodes, searchId);
    return sportObject ? sportObject.code : null;
  }
);

const isOpponentActingSelector = createSelector(
  [
      state => state.opponentsReducers.isFetchOpponentTypesPerforming,
      state => state.opponentsReducers.isFetchEventPathOpponentsDetailsPerforming,
      state => state.opponentsReducers.isUnAssignOpponentFromEventPathPerforming,
      state => state.opponentsReducers.isDeleteAllOppOfEventPathAndUnderPerforming,
  ],
  (isPerforming1, isPerforming2, isPerforming3, isPerforming4) => {
    return isPerforming1 || isPerforming2 || isPerforming3 || isPerforming4;
  }
);

const isPlayerActingSelector = createSelector(
  [
    state => state.playersReducers.isFetchMultiplePlayersOfTeamDetailsPerforming,
    state => state.playersReducers.isDeletePlayerOfTeamPerforming,
    state => state.playersReducers.isDeleteAllPlayerOfTeamPerforming,
  ],
  (isPerforming1, isPerforming2, isPerforming3) => {
    return isPerforming1 || isPerforming2 || isPerforming3;
  }
)


function mapStateToProps(state) {
    return {
        isOpponentActing: isOpponentActingSelector(state),
        isPlayerActing: isPlayerActingSelector(state),

        opponentActionFailed: state.opponentsReducers.actionFailed,
        playerActionFailed: state.playersReducers.actionFailed,

        lastPlayerActionMade: state.playersReducers.lastActionMade,
        lastOpponentActionMade: state.opponentsReducers.lastActionMade,

        opponentTypes: state.opponentsReducers.opponentTypes,
        selectedEventPathId: state.sportsTree.activePathId,

        opponentDetailsList: state.opponentsReducers.eventPathOpponentDetailsList,
        playerDetailsList: state.playersReducers.playerDetailsList,

        opponentIdsRemoved: state.opponentsReducers.opponentIdsRemoved,
        playerIdsRemoved: state.playersReducers.playerIdsRemoved,

        selectedEventPathSportCode: currentSelectedPathSportCodeSelector(state),

        ancestralOpponentsList: state.opponentsReducers.eventPathAncestralOpponentsList
    }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
      deleteAllOpponentOfEventPathAndUnder,
      fetchOpponentTypes,
      fetchEventPathOpponentsDetails,
      fetchMultiplePlayersOfTeamDetails,
      deletePlayerOfTeam,
      deleteAllPlayerOfTeam,
      unAssignOpponentFromEventPath,
      clearPlayersOfTeamDetails,
      unAssignOpponentFromEventPath,
      fetchEventPathDetails
  }, dispatch);
}

class Opponents extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedOpponent: null,
      selectedPlayer: null,
      showRemoveAllConfirmDialog: null,
      confirmModal: {
        isVisible: false
      },
      opponentType: null,
      playerType: null,
      showAddEditOpponentDlg: false,
      addEditOpponentDlgMode: MODE.ADD,
      addEditOpponentDlgTag: TAG.OPPONENTS,
      addEditOpponentDlgOpponentType: { id: 1, description: 'Team' },
      addEditOpponentDlgOpponentId: -1,
      playerTeamId: null,
      showModalImportOpponents: false,
    }

    this._onTableClickHandler = this._onTableClickHandler.bind(this);
    this._onTypesSelectChangeHandler = this._onTypesSelectChangeHandler.bind(this);
    this._onAddButtonClickedHandler = this._onAddButtonClickedHandler.bind(this);
    this._onEditButtonClickedHandler = this._onEditButtonClickedHandler.bind(this);
    this._onRemoveButtonClickedHandler = this._onRemoveButtonClickedHandler.bind(this);
    this._onRemoveAllButtonClickedHandler = this._onRemoveAllButtonClickedHandler.bind(this);
    this._onAddEditOpponentDlgOk = this._onAddEditOpponentDlgOk.bind(this);
    this._onAddEditOpponentDlgCancel = this._onAddEditOpponentDlgCancel.bind(this);
    this._onClickImportOponnets = this._onClickImportOponnets.bind(this);
  }
  componentWillMount () {
    let { pathId, fetchEventPathDetails } = this.props;
    fetchEventPathDetails(pathId);
}
  componentDidMount() {
      this.props.fetchOpponentTypes();
      this.props.clearPlayersOfTeamDetails();
      if (this.props.selectedEventPathId) {
          this.props.fetchEventPathOpponentsDetails(this.props.selectedEventPathId);
      }
  }

  componentWillUpdate(nextProps, nextState) {
      let { pathId, fetchEventPathDetails } = this.props;
      if (nextProps.pathId !== pathId && nextProps.pathId >= 0) {
          fetchEventPathDetails(nextProps.pathId);
      }

      const { selectedEventPathId } = nextProps;
      const previousSelectedEventPathId = this.props.selectedEventPathId;

      if (selectedEventPathId !== previousSelectedEventPathId) {
        this.props.clearPlayersOfTeamDetails();
        this.props.fetchEventPathOpponentsDetails(selectedEventPathId);
        this.setState({
          selectedOpponent: null,
          selectedPlayer: null,
          opponentType: null,
          playerType: null,
        })
      };


      const { selectedOpponent } = nextState;
      const previousSelectedOpponent = this.state.selectedOpponent;
      if(!previousSelectedOpponent && selectedOpponent || (previousSelectedOpponent && selectedOpponent && selectedOpponent.id !== previousSelectedOpponent.id)){
        this.props.fetchMultiplePlayersOfTeamDetails(selectedOpponent.id);
        this.setState({
          selectedPlayer: null,
          playerType: null,
        })
      }
  }

  componentDidUpdate(prevProps, prevState) {
    if(prevProps.isOpponentActing && this.props.isOpponentActing === false && !this.props.opponentActionFailed) {
      this._opponentActionSuccessHandler(this.props.lastOpponentActionMade);
    }
    if(prevProps.isPlayerActing && this.props.isPlayerActing === false && !this.props.playerActionFailed) {
      this._playerActionSuccessHandler(this.props.lastPlayerActionMade);
    }
  }

  _opponentActionSuccessHandler(actionMade) {
    const { selectedEventPathId } = this.props;
    const { selectedOpponent } = this.state;
    switch(actionMade) {
      case opponentsConst.DELETE_ALL_OPPONENT_OF_EVENT_PATH_AND_UNDER:
      case opponentsConst.ADD_OPPONENT:
      case opponentsConst.EDIT_OPPONENT:
        this.props.fetchEventPathOpponentsDetails(selectedEventPathId);
        if (selectedOpponent) {
          this.props.fetchMultiplePlayersOfTeamDetails(selectedOpponent.id);
        }
        break;

      case opponentsConst.FETCH_EVENT_PATH_OPPONENTS_DETAILS:
        this.setState({ opponentType: this._getInitialOpponentsSelectedType()});
        break;
    }
  }

  _playerActionSuccessHandler(actionMade) {
    const { selectedEventPathId } = this.props;
    const { selectedOpponent } = this.state;
    switch(actionMade) {
      case playersConst.DELETE_ALL_PLAYER_OF_TEAM:
      case playersConst.ADD_PLAYER_TO_TEAM:
        this.props.fetchMultiplePlayersOfTeamDetails(selectedOpponent.id);
        break;

      case playersConst.FETCH_MULTIPLE_PLAYERS_OF_TEAM_DETAILS:
        this.setState({ playerType: this._getInitialPlayerSelectedType() });
        break;
    }
  }

  _onTableClickHandler(tag, rowClicked) {
    switch (tag) {
      case TAG.OPPONENTS:
        if(!this.state.selectedOpponent || this.state.selectedOpponent.id !== rowClicked.id) {
          this.setState({
            selectedOpponent: rowClicked,
            selectedPlayer: null
          })
        }
        break;

      case TAG.PLAYERS:
        if(!this.state.selectedPlayer || this.state.selectedPlayer.id !== rowClicked.id) {
          this.setState({
            selectedPlayer: rowClicked
          })
        }
        break;
    }
  }

  _onTypesSelectChangeHandler(tag, selectedType) {
      switch(tag) {
          case TAG.OPPONENTS:
            this.setState({
                opponentType: selectedType
            });
          break;

          case TAG.PLAYERS:
            this.setState({
                playerType: selectedType
            });
          break;
      }
  }

  _onAddButtonClickedHandler(tag) {
      const { opponentType, selectedOpponent, selectedPlayer } = this.state;
      let type = null;
      let teamId = null;

      switch(tag) {
          case TAG.OPPONENTS:
            type = opponentType ? opponentType : this._getInitialOpponentsSelectedType();
            teamId = -1;
          break;

          case TAG.PLAYERS:
            type = this._getInitialPlayerSelectedType();
            teamId = selectedOpponent.id;
          break;

      }

      this.setState({
          showAddEditOpponentDlg: true,
          addEditOpponentDlgMode: MODE.ADD,
          addEditOpponentDlgTag: tag,
          addEditOpponentDlgOpponentType: type,
          addEditOpponentDlgOpponentId: teamId,
      });
  }

  _onEditButtonClickedHandler(tag) {
      const { opponentType, playerType, selectedOpponent, selectedPlayer } = this.state;
      let type = null;
      let opponentId = -1;
      let teamId = null

      switch(tag) {
          case TAG.OPPONENTS:
            type = opponentType ? opponentType : this._getInitialOpponentsSelectedType();
            opponentId = selectedOpponent ? selectedOpponent.id : -1;
          break;

          case TAG.PLAYERS:
            type = playerType ? playerType : this._getInitialPlayerSelectedType();
            opponentId = selectedPlayer ? selectedPlayer.id : -1;
            teamId = selectedOpponent ? selectedOpponent.id : null
          break;
      }

      this.setState({
          showAddEditOpponentDlg: true,
          addEditOpponentDlgMode: MODE.EDIT,
          addEditOpponentDlgTag: tag,
          addEditOpponentDlgOpponentType: type,
          addEditOpponentDlgOpponentId: opponentId,
          ...teamId && { playerTeamId: teamId}
      });
  }

  _onRemoveButtonClickedHandler(tag) {
    const { selectedEventPathId } = this.props;
    const { selectedOpponent, selectedPlayer } = this.state;
    switch (tag) {
      case TAG.OPPONENTS:
        this.props.unAssignOpponentFromEventPath(selectedEventPathId, selectedOpponent.id);
        break;
      case TAG.PLAYERS:
        this.props.deletePlayerOfTeam(selectedOpponent.id, selectedPlayer.id);
        break;
    }
  }

  _onRemoveAllButtonClickedHandler(tag) {
    let message, title, confirmCallback;
    const { selectedOpponent } = this.state;
    switch (tag) {
      case TAG.OPPONENTS:
        message = <div><p>All teams/players and players within teams for this event path and all children beneath will be removed.</p><p>Do you wish to continue?</p></div>
        title = "Warning";
        confirmCallback = () => {
          this.props.deleteAllOpponentOfEventPathAndUnder(this.props.selectedEventPathId);
          this.setState({
            confirmModal: {
              isVisible: false
            }
          });
        }
        break;

      case TAG.PLAYERS:
        message = <div><p>All players within the selected team will be removed.</p><p>Do you wish to continue?</p></div>
        title = "Warning";
        confirmCallback = () => {
          this.props.deleteAllPlayerOfTeam(selectedOpponent.id);
          this.setState({
            confirmModal: {
              isVisible: false
            }
          });
        }
        break;
    }
    this._setConfirmModalState(title, message, confirmCallback);
  }

  _isOpponentTypeSelectDisabled() {
    return !!this._getOpponentDetailsList().length;
  }

  _isPlayerTypeSelectDisabled() {
    return !this.state.selectedOpponent || (this.state.selectedOpponent && this._getPlayerDetailsList().length);
  }

  _getOpponentDetailsList() {
    const { opponentDetailsList, opponentIdsRemoved } = this.props;
    return _.filter(opponentDetailsList, (opponent) => this.state.opponentType ? opponent.typeId === this.state.opponentType.id ? !_.contains(opponentIdsRemoved, opponent.id) : false : false
    );
  }

  _getPlayerDetailsList() {
    const { playerDetailsList, playerIdsRemoved } = this.props;

    return _.filter(playerDetailsList, (player) => {
      return !_.contains(playerIdsRemoved, player.id);
    })
  }

  _getInitialOpponentsSelectedType() {
    const { opponentTypes } = this.props;
    const filteredOpponents = this._getOpponentDetailsList();

    if (_.isEmpty(filteredOpponents)) {
      return { id: 1, description: 'Team' };
    } else {
      const firstRow = _.first(filteredOpponents);
      return _.findWhere(opponentTypes, { id: firstRow.typeId });
    }
  }

  _getInitialOpponentSelectedTypeId() {
    const { opponentType } = this.state;
    const filteredOpponents = this._getOpponentDetailsList();
    if (_.isEmpty(filteredOpponents)) {
      return opponentType ? opponentType.id : 1;
    } else {
      const firstRow = _.first(filteredOpponents);
      return firstRow.typeId;
    };
  }

  _getInitialPlayerSelectedType() {
    const { opponentTypes } = this.props;
    const filteredPlayers = this._getPlayerDetailsList();

    if (_.isEmpty(filteredPlayers)) {
      let playerOpponentTypeFirst = _.first(this._getPlayerOpponentTypes());
      return (playerOpponentTypeFirst)
        ? playerOpponentTypeFirst
        : { id: 1, description: 'Team'};
    } else {
      const firstRow = _.first(filteredPlayers);
      return _.findWhere(opponentTypes, { id: firstRow.typeId });
    };
  }

  _getInitialPlayerSelectedTypeId() {
    const filteredPlayers = this._getPlayerDetailsList();

    if (_.isEmpty(filteredPlayers)) {
      let playerOpponentTypeFirst = _.first(this._getPlayerOpponentTypes());
      return (playerOpponentTypeFirst)
        ? playerOpponentTypeFirst.id
        : 1;
    } else {
      const firstRow = _.first(filteredPlayers);
      return firstRow.typeId;
    };
  }

  _getPlayerOpponentTypes() {
    const { opponentTypes } = this.props;
    const { selectedOpponent } = this.state;
    if (selectedOpponent) {
      return opponentTypes.filter((opponentType) => opponentType.id !== 1);
    } else {
      return opponentTypes;
    }
  }

  _modalConfirmCancelClickedHandler() {
    this.setState({
      confirmModal: {
        isVisible: false
      }
    })
  }

  _setConfirmModalState(title, message, confirmCallback) {
    this.setState({
      confirmModal: {
        isVisible: true,
        message,
        confirmCallback: confirmCallback.bind(this),
        title,
      }
    });
  }

  _onAddEditOpponentDlgOk(opponentObject, successful) {
    // when control goes here, it means success
    if (!successful) return;

    const { addEditOpponentDlgTag, selectedOpponent, addEditOpponentDlgMode } = this.state;
    const { selectedEventPathId } = this.props;

    let message = '';
    if (addEditOpponentDlgMode === MODE.ADD) {
      message = `Successfully added ${opponentObject.description}!`;
    } else {
      message = `Successfully updated ${opponentObject.description}!`;
    }

    toastr.add({message, type: 'SUCCESS'});

    this.setState({
      showAddEditOpponentDlg: false,
      addEditOpponentDlgOpponentId: -1,
    }, () => {
      if (addEditOpponentDlgTag === TAG.OPPONENTS) {
        this.props.clearPlayersOfTeamDetails();
        this.props.fetchEventPathOpponentsDetails(selectedEventPathId);
      } else {
        if (selectedOpponent){
          this.props.fetchMultiplePlayersOfTeamDetails(selectedOpponent.id);
        }
      }
    });
  }

  _onAddEditOpponentDlgCancel() {
      this.setState({
          showAddEditOpponentDlg: false,
          addEditOpponentDlgMode: MODE.ADD,
          addEditOpponentDlgOpponentType: { id: 1, description: 'Team' },
      });
  }

  _onClickImportOponnets() {
      this.setState({showModalImportOpponents: true});
  };

  _renderLoadingIndicator() {
    return (
      <div className="loading-container">
        <LoadingIndicator/>
      </div>
    )
  }

  _isOpponentImportButtonDisabled() {
    const { opponentTypes } = this.props;
    const filteredOpponents = this._getOpponentDetailsList();

    if (_.isEmpty(filteredOpponents)) {
      return false;
    } else {
      const firstRow = _.first(filteredOpponents);
      let opponentType =  _.findWhere(opponentTypes, { id: firstRow.typeId });
      return opponentType.description.toUpperCase() !== 'TEAM';
    }
  }

  render() {
    const {isPlayerActing, isOpponentActing, opponentDetailsList, playerDetailsList, opponentTypes, selectedEventPathId, opponentIdsRemoved, selectedEventPathSportCode, ancestralOpponentsList} = this.props;
    const isPlayerOrOpponentActing = isPlayerActing || isOpponentActing;
    const {
      selectedOpponent,
      selectedPlayer,
      showAddEditOpponentDlg,
      addEditOpponentDlgMode,
      addEditOpponentDlgOpponentType,
      addEditOpponentDlgOpponentId,
      addEditOpponentDlgTag,
      opponentType,
      playerTeamId
    } = this.state;
    const filteredOpponents = this._getOpponentDetailsList();
    const filteredPlayers = this._getPlayerDetailsList();
    return (
        <div className="fleft opponents-page">
            <div className="form-inner full-height">
                <div className="form-wrapper full-height">
                    <h4 className="title">Competitors</h4>
                    <div className="opponents-container">
                      {isOpponentActing && this._renderLoadingIndicator()}
                      <OponentsTableActionBar
                          tag={TAG.OPPONENTS}
                          actionIdMap={{
                            ADD: permissionsCode.ADD_EVENT_PATH_TEAM,
                            EDIT: permissionsCode.EDIT_EVENT_PATH_TEAM,
                            REMOVE: permissionsCode.REMOVE_EVENT_PATH_TEAM,
                            REMOVE_ALL: permissionsCode.BULK_TEAM_PLAYER_REMOVAL
                          }}
                          opponentTypes={opponentTypes}
                          initialTypeSelectedId={/*this._getInitialOpponentSelectedTypeId()*/opponentType ? opponentType.id : 1}
                          addButtonDisabled={isOpponentActing || false}
                          editButtonDisabled={isOpponentActing || !selectedOpponent}
                          removeButtonDisabled={isOpponentActing || !selectedOpponent}
                          removeAllButtonDisabled={isOpponentActing || _.isEmpty(filteredOpponents)}
                          typesSelectorDisabled={isOpponentActing || this._isOpponentTypeSelectDisabled()}
                          onTypesSelectChangeHandler={this._onTypesSelectChangeHandler}
                          onAddButtonClickedHandler={this._onAddButtonClickedHandler}
                          onEditButtonClickedHandler={this._onEditButtonClickedHandler}
                          onRemoveButtonClickedHandler={this._onRemoveButtonClickedHandler}
                          onRemoveAllButtonClickedHandler={this._onRemoveAllButtonClickedHandler}
                          onClickImportOponnets={this._onClickImportOponnets}
                          hideImportButton={false}
                          importButtonDisabled={isOpponentActing /*|| this._isOpponentImportButtonDisabled()*/} />
                      <OpponentsTable
                          actionIds={[permissionsCode.VIEW_EVENT_PATH_AND_OPPONENT_RATINGS]}
                          tag={TAG.OPPONENTS}
                          selectedRowId={selectedOpponent ? selectedOpponent.id : null}
                          rowDataList={filteredOpponents}
                          noDataText='No opponents found'
                          onRowClickHandler={this._onTableClickHandler}/>
                    </div>
                    <div className="divider"/>
                    <div className="players-container">
                      {isPlayerActing && this._renderLoadingIndicator()}
                      <OponentsTableActionBar
                          tag={TAG.PLAYERS}
                          actionIdMap={{
                            ADD: permissionsCode.ADD_EVENT_PATH_PLAYER,
                            EDIT: permissionsCode.EDIT_EVENT_PATH_PLAYER,
                            REMOVE: permissionsCode.REMOVE_EVENT_PATH_PLAYER,
                            REMOVE_ALL: permissionsCode.BULK_TEAM_PLAYER_REMOVAL
                          }}
                          opponentTypes={this._getPlayerOpponentTypes()}
                          initialTypeSelectedId={this._getInitialPlayerSelectedTypeId()}
                          addButtonDisabled={isPlayerOrOpponentActing || !selectedOpponent || selectedOpponent.typeId !== 1}
                          editButtonDisabled={isPlayerOrOpponentActing || !selectedOpponent || !selectedPlayer}
                          removeButtonDisabled={isPlayerOrOpponentActing || !selectedOpponent || !selectedPlayer}
                          removeAllButtonDisabled={isPlayerOrOpponentActing || !selectedOpponent || _.isEmpty(filteredPlayers) || selectedOpponent.typeId !== 1}
                          typesSelectorDisabled={isPlayerOrOpponentActing || !selectedOpponent || selectedOpponent.typeId !== 1 || this._isPlayerTypeSelectDisabled()}
                          onTypesSelectChangeHandler={this._onTypesSelectChangeHandler}
                          onAddButtonClickedHandler={this._onAddButtonClickedHandler}
                          onEditButtonClickedHandler={this._onEditButtonClickedHandler}
                          onRemoveButtonClickedHandler={this._onRemoveButtonClickedHandler}
                          onRemoveAllButtonClickedHandler={this._onRemoveAllButtonClickedHandler}
                          onClickImportOponnets={this._onClickImportOponnets}
                          hideImportButton={true}
                          isChildTable={true}
                          hasSelectedParent={selectedOpponent ? selectedOpponent.id : false}
                          importButtonDisabled={true} />
                      <OpponentsTable
                          actionIds={[permissionsCode.VIEW_EVENT_PATH_AND_OPPONENT_RATINGS]}
                          tag={TAG.PLAYERS}
                          selectedRowId={selectedPlayer ? selectedPlayer.id : null}
                          rowDataList={filteredPlayers}
                          noDataText='No players found'
                          onRowClickHandler={this._onTableClickHandler}/>
                    </div>

                    {this.state.confirmModal.isVisible &&
                    <ConfirmModal
                      isVisible={this.state.confirmModal.isVisible}
                      title={this.state.confirmModal.title}
                      message={this.state.confirmModal.message}
                      onCancel={this._modalConfirmCancelClickedHandler.bind(this)}
                      onConfirm={this.state.confirmModal.confirmCallback.bind(this)}/>
                    }

                    {this.state.showModalImportOpponents && (
                      <ModalWindow
                        isVisibleOn={this.state.showModalImportOpponents}
                        title="Import Opponents"
                        onClose={()=>{this.setState({showModalImportOpponents: false})}}
                        className="import-opponents"
                        closeButton={true}>
                        <h4>{"Import Opponents"}</h4>
                        <ImportOpponentDlg
                          pathId={selectedEventPathId}
                          selectedOpponentType={opponentType}
                          opponentTypes={opponentTypes}
                          selectableTypes={!this._isOpponentTypeSelectDisabled()}
                          onImportSuccess={()=>{this.setState({showModalImportOpponents: false})}} />
                      </ModalWindow>
                    )}
                </div>
            </div>

            {
                showAddEditOpponentDlg &&
                <AddEditOpponentDlg
                    tag={addEditOpponentDlgTag}
                    mode={addEditOpponentDlgMode}
                    opponentType={addEditOpponentDlgOpponentType}
                    eventPathId={selectedEventPathId}
                    eventPathSportCode={selectedEventPathSportCode}
                    opponentId={addEditOpponentDlgOpponentId}
                    parentId={playerTeamId}
                    onOkButtonClickedHandler={this._onAddEditOpponentDlgOk}
                    onCancelButtonClickedHandler={this._onAddEditOpponentDlgCancel} />
            }

        </div>
    );
  }
};

export default connect(mapStateToProps, mapDispatchToProps)(Opponents);
