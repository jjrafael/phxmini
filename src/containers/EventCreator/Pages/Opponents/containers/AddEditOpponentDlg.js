'use strict';
import React, {PropTypes} from "react";
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import { mapPermissionsToProps } from 'componentsV2/checkPermission/index';
import { permissionsCode } from 'containersV2/EventCreator/App/constants';
import ModalWindow from 'phxComponents/modal';
import OpponentsForm from 'eventCreatorOpponentsComponents/OpponentsForm';
import KitsTable from 'eventCreatorOpponentsComponents/KitsTable';
import AddEditKitDlg from 'eventCreatorOpponentsContainers/AddEditKitDlg';
import MODE from 'eventCreatorOpponentsConstants/modeConst';
import TAG from 'eventCreatorOpponentsConstants/tagConst';
import LoadingIndicator from 'phxComponents/loadingIndicator';
import { toastr } from 'phxComponents/toastr/index';

import {
  fetchSingleOpponentDetails,
  fetchSingleOpponentDetailsWithGrade,
  fetchOpponentKits,
  clearOpponentKits,
  editOpponent,
  editOpponentWithGrade,
  createAndAssignOpponent,
  createAndAssignOpponentWithGrade,
  createAndAssignOpponentToEventPath
} from 'eventCreatorOpponentsActions/opponentsAction';
import {createSelector} from 'reselect';
import {submit, isValid, isDirty} from 'redux-form';
import _ from 'underscore';
import update from 'immutability-helper';
import opponentsConst from 'eventCreatorOpponentsConstants/opponentsConst';


const isOpponentPerformingAction = createSelector(
  [
    state => state.opponentsReducers.isFetchSingleOpponentDetailsPerforming,
    state => state.opponentsReducers.isFetchSingleOpponentWithGradeDetailsPerforming,
    state => state.opponentsReducers.isFetchOpponentKitsPerforming,
    state => state.opponentsReducers.isEditOpponentPerforming,
    state => state.opponentsReducers.isEditOpponentWithGradePerforming,
    state => state.opponentsReducers.isCreateAndAssignOpponentPerforming,
    state => state.opponentsReducers.isCreateAndAssignOpponentWithGradePerforming,
    state => state.opponentsReducers.isCreateAndAssignOpponentToEventPathPerforming,
  ],
  (s1, s2, s3, s4, s5, s6, s7, s8) => {
    return s1 || s2 || s3 || s4 || s5 || s6 || s7;
  }
);

function mapStateToProps(state, props) {
  return {
    isPerformingAction: isOpponentPerformingAction(state),
    opponentLastActionMade: state.opponentsReducers.lastActionMade,
    actionFailed: state.opponentsReducers.actionFailed,
    errorMessage: state.opponentsReducers.errorMessage,
    teamDetails: state.opponentsReducers.opponentDetailsSingleWithGrade,
    playerDetails: state.opponentsReducers.opponentDetailsSingle,
    kitList: state.opponentsReducers.opponentKitList.kits,
  }
}


function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    fetchSingleOpponentDetails,
    fetchSingleOpponentDetailsWithGrade,
    fetchOpponentKits,
    clearOpponentKits,
    submit,
    editOpponent,
    editOpponentWithGrade,
    createAndAssignOpponent,
    createAndAssignOpponentWithGrade,
    createAndAssignOpponentToEventPath,
  }, dispatch);
}


class AddEditOpponentDlg extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
          selectedKitId: null,
          showAddEditKitDlg: false,
          addEditKitDlgMode: MODE.ADD,
          kitListForDisplay: [],
          removedKitIds: [],
          locallyCreatedKits: [],
          editedKits: [],
          showAddEditKitDlg: false,
          addEditKitDlgMode: MODE.ADD,
          addEditKitDlgInitValues: null,
          newlyAddedOpponent: null,
        }

        this._onSaveButtonClickedHandler = this._onSaveButtonClickedHandler.bind(this);
        this._onCancelButtonClickedHandler = this._onCancelButtonClickedHandler.bind(this);
        this._onModalCloseHandler = this._onModalCloseHandler.bind(this);

        this._onKitTableRowClicked = this._onKitTableRowClicked.bind(this);
        this._onAddKitClicked = this._onAddKitClicked.bind(this);
        this._onEditKitClicked = this._onEditKitClicked.bind(this);
        this._onDeleteKitClicked = this._onDeleteKitClicked.bind(this);

        this._onAddEditKitDlgOk = this._onAddEditKitDlgOk.bind(this);
        this._onAddEditKitDlgCancel = this._onAddEditKitDlgCancel.bind(this);
        this._onOpponentsFormSubmitHandler = this._onOpponentsFormSubmitHandler.bind(this);
    }

    componentWillMount() {
      const {mode, opponentType, eventPathId, opponentId} = this.props;

      if (mode === MODE.ADD) {
        if (opponentType.description.toUpperCase() === 'TEAM') {
          this.props.clearOpponentKits();
        }
      }

      if (mode === MODE.EDIT) {
        if (opponentType.description.toUpperCase() === 'TEAM') {
          this.props.fetchSingleOpponentDetailsWithGrade(eventPathId, opponentId);
          this.props.fetchOpponentKits(opponentId);
        } else {
          this.props.fetchSingleOpponentDetails(opponentId);
        }
      }

    }

    componentDidUpdate(prevProps, prevState) {
      const { actionFailed, errorMessage, isPerformingAction, onOkButtonClickedHandler, opponentLastActionMade, playerLastActionMade, tag } = this.props;
      const { isPerformingAction: isPrevPerformingAction } = prevProps;

      if (isPrevPerformingAction === isPerformingAction) return;

      if (!isPerformingAction) {
        if (!actionFailed) {
          // successful transactions
          switch(opponentLastActionMade) {
            case opponentsConst.CREATE_AND_ASSIGN_OPPONENT_TO_EVENT_PATH:
            case opponentsConst.CREATE_AND_ASSIGN_OPPONENT_WITH_GRADE:
            case opponentsConst.CREATE_AND_ASSIGN_OPPONENT:
            case opponentsConst.EDIT_OPPONENT_WITH_GRADE:
            case opponentsConst.EDIT_OPPONENT:
              if (onOkButtonClickedHandler) {
                onOkButtonClickedHandler(this.state.newlyAddedOpponent, true);
              }
            break;

          }

        } else {
          // failed transactions
          switch(opponentLastActionMade) {
            case opponentsConst.CREATE_AND_ASSIGN_OPPONENT_TO_EVENT_PATH:
            case opponentsConst.CREATE_AND_ASSIGN_OPPONENT_WITH_GRADE:
            case opponentsConst.CREATE_AND_ASSIGN_OPPONENT:
            case opponentsConst.EDIT_OPPONENT_WITH_GRADE:
            case opponentsConst.EDIT_OPPONENT:
              toastr.add({message: errorMessage, type: 'ERROR'})
            break;
          }

        }
      }
    }

    _onSaveButtonClickedHandler() {
      const { submit } = this.props;
      // trigger opponentsFormSubmitHandler
      submit('OpponentsForm');
    }

    _onCancelButtonClickedHandler() {
        const { onCancelButtonClickedHandler } = this.props;
        if (onCancelButtonClickedHandler) {
            onCancelButtonClickedHandler();
        };
    }

    _onModalCloseHandler() {
        const { onCancelButtonClickedHandler } = this.props;
        if (onCancelButtonClickedHandler) {
            onCancelButtonClickedHandler();
        };
    }

    _onKitTableRowClicked(rowClicked) {
      this.setState({
        selectedKitId: rowClicked.id,
      })
    }

    _generateKitId() {
      // negative ids to distinguish locally added kit/s
      const { locallyCreatedKits } = this.state;

      return (_.size(locallyCreatedKits) + 1) * -1;
    }

    _onAddKitClicked() {
        this.setState({
          showAddEditKitDlg: true,
          addEditKitDlgMode: MODE.ADD,
          addEditKitDlgInitValues: {
            id: this._generateKitId(),
            description: null,
            defaultKit: false,
            feedCode: null,
            backgroundColor: 'FFFFFF',
            shortColor: 'FFFFFF',
            patternColor: 'FFFFFF',
            kitPatternId: -1,
          }
        });
    }

    _onEditKitClicked() {
      const { selectedKitId, locallyCreatedKits, editedKits } = this.state;
      const { kitList } = this.props;

      let isLocallyCreatedKit = (selectedKitId< 0);

      let listToSearch = [];
      if (isLocallyCreatedKit) {
        listToSearch = locallyCreatedKits;
      } else {
        listToSearch = kitList;
      }

      let selectedKitObj = _.findWhere(listToSearch, { id: selectedKitId });
      let kitObjForInitVal;

      if (isLocallyCreatedKit) {
        kitObjForInitVal = selectedKitObj;
      } else {
        // get object if it is edited earlier
        let editedKitIndex = _.findIndex(editedKits, {id: selectedKitId});

        if (editedKitIndex > -1) {
          kitObjForInitVal = editedKits[editedKitIndex];
        } else {
          kitObjForInitVal = _.pick(selectedKitObj, 'id', 'description', 'defaultKit', 'feedCode');

          kitObjForInitVal.backgroundColor = selectedKitObj.colour1;
          kitObjForInitVal.shortColor = selectedKitObj.colour2;
          kitObjForInitVal.patternColor = selectedKitObj.colour3;

          let patternObj = selectedKitObj.pattern;
          kitObjForInitVal.kitPatternId = parseInt(patternObj.id);
        }
      }

      this.setState({
        showAddEditKitDlg: true,
        addEditKitDlgMode: MODE.EDIT,
        addEditKitDlgInitValues: kitObjForInitVal,
      });
    }


    _onDeleteKitClicked() {
      const { selectedKitId, removedKitIds } = this.state;

      this.setState({
        removedKitIds: update(removedKitIds, {$push: [selectedKitId]}),
        selectedKitId: null,
      });
    }

    _onAddEditKitDlgOk(mode, kitObject) {
      const {locallyCreatedKits, editedKits} = this.state;

      // drop # prefix on colors
      function dropHex(color) {
        return color.substr(0, 1) === '#'
          ? color.substr(1)
          : color;
      }

      kitObject.backgroundColor = dropHex(kitObject.backgroundColor);
      kitObject.shortColor = dropHex(kitObject.shortColor);
      kitObject.patternColor = dropHex(kitObject.patternColor);

      const kitObjectId = parseInt(kitObject.id);
      const kitDefaulted = kitObject.defaultKit;

      const isLocallyCreatedKit = (kitObjectId < 0);
      let localList = locallyCreatedKits;
      let editedList = editedKits;

      if (kitDefaulted) {
        // get the previously defaultKit Kit Item
        const displayableKitList = this._getDisplayableKitList();
        const dispKitItemDefault = _.findWhere(displayableKitList, {defaultKit: true});

        if (dispKitItemDefault) {
          const inLocalCreatedKit = (dispKitItemDefault.id < 0);

          if (inLocalCreatedKit) {
            const idxOfLocalCreatedKit = _.findIndex(localList, {id: dispKitItemDefault.id});
            localList = update(localList, {
              [idxOfLocalCreatedKit]: {
                defaultKit: {
                  $set: false
                }
              }
            });

          } else {
            const idxOfEditedKit = _.findIndex(editedList, {id: dispKitItemDefault.id});
            if (idxOfEditedKit > -1) {
              // found, already edited
              editedList = update(editedList, {
                [idxOfEditedKit]: {
                  defaultKit: {
                    $set: false
                  }
                }
              });
            } else {
              // not found, add entry to editedlist with defaultKit = false
              const kitObj = Object.assign({}, dispKitItemDefault, {defaultKit: false});
              editedList = update(editedList, {$push: [kitObj]});
            }
          }

        }
      };

      switch (mode) {
        case MODE.ADD:
          localList = update(localList, {$push: [kitObject]});
          break;

        case MODE.EDIT:
          // check first if it's an edited locally created kit or edited exisiting kit
          if (isLocallyCreatedKit) {
            const idxOfEditedKit = _.findIndex(localList, {id: kitObjectId});
            localList = update(localList, {
              $splice: [
                [idxOfEditedKit, 1, kitObject]
              ]
            });

          } else {
            let idxOfEditedKit = _.findIndex(editedList, {id: kitObjectId});
            if (idxOfEditedKit > -1) {
              // found
              editedList = update(editedList, {
                [idxOfEditedKit]: {
                  $set: kitObject
                }
              });

            } else {
              // not found / empty
              editedList = update(editedList, {$push: [kitObject]});
            };
          }
          break;
      };

      this.setState({showAddEditKitDlg: false, locallyCreatedKits: localList, editedKits: editedList});
    }

    _onAddEditKitDlgCancel() {
      this.setState({
        showAddEditKitDlg: false
      })
    }

    _displayDlgTitle() {
      const {mode, opponentType} = this.props;

      return (mode === MODE.ADD
        ? `New ${opponentType.description}`
        : `Edit ${opponentType.description}`);
    }

    _setModalSize() {
      const {opponentType} = this.props;

      if (opponentType.description.toUpperCase() === 'TEAM') {
        return 'add-edit-opponent';
      } else {
        return 'add-edit-player';
      }

    }

    _getOpponentFormInitVal() {
      const { mode, opponentType, teamDetails, playerDetails, eventPathSportCode} = this.props;

      if (mode === MODE.EDIT) {
        if (opponentType.description.toUpperCase() === 'TEAM') {
          return {
            ...teamDetails,
            grade: teamDetails && teamDetails.grade && teamDetails.grade > 0 ? teamDetails.grade : 1
          };
        } else {
          return playerDetails;
        }
      } else {
        let initVal = {
            id: -1,
            description: null,
            typeId: opponentType.id,
            abbreviation: null,
            nickname: null,
            sportCode: eventPathSportCode,
            feedCode: null,
        };

        if (opponentType.description.toUpperCase() === 'TEAM') {
          initVal.grade = 1;
        }

        return initVal;
      }
    }

    _getDisplayableKitList() {
      let {kitList} = this.props;
      const {kitListForDisplay, locallyCreatedKits, editedKits, removedKitIds} = this.state;

      if (!kitList)
        kitList = [];

      let displayableKits = update(kitList, {
        $splice: [
          [0, 0]
        ]
      });;

      // split existing ids and newly created ids in removedKitIds
      let removedKitIdsSplit = _.partition(removedKitIds, (kitId) => {
        return kitId > -1;
      });
      let origRemovedKitIds = removedKitIdsSplit[0];
      let newlyCreateRemovedKitIds = removedKitIdsSplit[1];

      // remove deleted kits for each
      displayableKits = _.filter(displayableKits, (kit) => {
        return !_.contains(origRemovedKitIds, kit.id);
      });
      let newlyCreatedKitList = _.filter(locallyCreatedKits, (kit) => {
        return !_.contains(newlyCreateRemovedKitIds, kit.id);
      });

      // replace editedKits to originalKits
      displayableKits = _.map(displayableKits, (origKit) => {
        let editedKitIndex = _.findIndex(editedKits, {id: origKit.id});
        if (editedKitIndex > -1) {
          return editedKits[editedKitIndex]
        } else {

          let kitObjForInitVal = _.pick(origKit, 'id', 'description', 'defaultKit', 'feedCode');
          kitObjForInitVal.backgroundColor = origKit.colour1;
          kitObjForInitVal.shortColor = origKit.colour2;
          kitObjForInitVal.patternColor = origKit.colour3;
          let patternObj = origKit.pattern;
          kitObjForInitVal.kitPatternId = patternObj.id;

          return kitObjForInitVal;
        }
      });

      displayableKits = update(displayableKits, {$push: newlyCreatedKitList});

      return displayableKits;
    }

    _renderLoadingIndicator() {
      const { opponentType } = this.props;
      let loadingCaption = (opponentType.description.toUpperCase() === 'TEAM') ? 'Retrieving Details and Kits...' : 'Retrieving Details...';

      return (
          <div className="loading tcenter">
              <i className="phxico phx-spinner phx-spin"></i>
              <h6>{loadingCaption}</h6>
          </div>
      )
    }

    _onOpponentsFormSubmitHandler(formData) {
      const { eventPathId, opponentType, opponentId, eventPathSportCode, mode, tag, permissions, parentId } = this.props;
      const { removedKitIds, locallyCreatedKits, editedKits } = this.state;

      // init defaults
      let oppDtl = { eventPathId }; // submit eventPathId as well
      oppDtl = _.extend(oppDtl, {type: opponentType.description});
      oppDtl = _.extend(oppDtl, _.pick(formData, 'description', 'sportCode', 'abbreviation', 'nickname', 'feedCode'));
      
      //remove trailing space
      oppDtl = {
        ...oppDtl,
        description: oppDtl.description.trim()
      }

      let hasGradePermission = false;

      if (permissions.includes(permissionsCode.VIEW_EVENT_PATH_AND_OPPONENT_RATINGS) || permissions.includes(permissionsCode.VIEW_EVENT_PATH_AND_OPPONENT_RATINGS)) {
        hasGradePermission = true;
      }

      switch(mode) {
        case MODE.ADD:
          if (opponentType.description.toUpperCase() === 'TEAM') {
            let grade = parseInt(_.pick(formData, 'grade').grade);
            if (!grade || Number(grade) < 0) {
              grade = 1;
            }

            if (!_.isEmpty(locallyCreatedKits)) {

              let newlyCreatedKitList = _.filter(locallyCreatedKits, (kit) => {
                return !_.contains(removedKitIds, kit.id);
              });

              oppDtl.kits = _.map(newlyCreatedKitList, (kit) => {
                let kitObj = _.pick(kit, 'description', 'backgroundColor', 'shortColor', 'patternColor', 'defaultKit');
                kitObj.kitPattern = { id: parseInt(kit.kitPatternId) };

                return kitObj;
              });
            }

            if (hasGradePermission) {
              this.props.createAndAssignOpponentWithGrade(eventPathId, oppDtl, grade);
            } else {
              this.props.createAndAssignOpponentWithGrade(eventPathId, oppDtl, "NO_GRADE");
            }

            
          } else {
            if (tag === TAG.OPPONENTS) {
                this.props.createAndAssignOpponentToEventPath(eventPathId, oppDtl);
            } else {
                this.props.createAndAssignOpponent(opponentId/*this is teamId in this context*/, {...oppDtl, teamId:opponentId});
            }
          }
        break;

        case MODE.EDIT:
          if (opponentType.description.toUpperCase() === 'TEAM') {
            let grade = parseInt(_.pick(formData, 'grade').grade);
            if (!grade || Number(grade) < 0) {
              grade = 1;
            }

            oppDtl.kits = [];

            // split existing ids and newly created ids in removedKitIds
            let removedKitIdsSplit = _.partition(removedKitIds, (kitId) => {
              return kitId > -1;
            });
            let origRemovedKitIds = removedKitIdsSplit[0];
            let newlyCreateRemovedKitIds = removedKitIdsSplit[1];

            // for newly created kits
            if (!_.isEmpty(locallyCreatedKits)) {
              let newlyCreatedKitList = _.filter(locallyCreatedKits, (kit) => {
                return !_.contains(newlyCreateRemovedKitIds, kit.id);
              });

              _.each(newlyCreatedKitList, (kit) => {
                let kitObj = _.pick(kit, 'description', 'backgroundColor', 'shortColor', 'patternColor', 'defaultKit');
                kitObj.kitPattern = { id: parseInt(kit.kitPatternId) };

                oppDtl.kits.push(kitObj);
              });
            };

            // for edited kits
            if (!_.isEmpty(editedKits)) {
              let editedKitList = _.filter(editedKits, (kit) => {
                return !_.contains(origRemovedKitIds, kit.id);
              });

              _.each(editedKitList, (kit) => {
                let kitObj = _.pick(kit, 'id', 'description', 'backgroundColor', 'shortColor', 'patternColor', 'defaultKit');
                kitObj.kitPattern = { id: parseInt(kit.kitPatternId) };

                oppDtl.kits.push(kitObj);
              });
            };

            // for deleted kits
            if (!_.isEmpty(removedKitIds)) {
              oppDtl.removedKitIds = _.filter(removedKitIds, (kitId) => {
                return kitId > -1;
              });
            };

            if (hasGradePermission) {
              this.props.editOpponentWithGrade(eventPathId, formData.id, oppDtl, grade);
            } else {
              this.props.editOpponentWithGrade(eventPathId, formData.id, oppDtl, 'NO_GRADE');
            }
          } else {
            this.props.editOpponent(formData.id, {...oppDtl, teamId:parentId});
          }
        break;
      }

      this.setState({
        newlyAddedOpponent: oppDtl
      });
    }

    _displayDetailRetrievalLoading() {
      const { isPerformingAction, opponentLastActionMade } = this.props;

      function isActionForRetrieval() {
        switch (opponentLastActionMade) {
          case opponentsConst.FETCH_SINGLE_OPPONENT_DETAILS:
          case opponentsConst.FETCH_SINGLE_OPPONENT_WITH_GRADE_DETAILS:
          case opponentsConst.FETCH_OPPONENT_KITS:
            return true;
          break;

          default:
          return false;
        }

      }

      return isPerformingAction && isActionForRetrieval();
    }

    _displayProcessingIndicator() {
      const { isPerformingAction, opponentLastActionMade } = this.props;

      function isActionForProccessing() {
        switch (opponentLastActionMade) {
          case opponentsConst.CREATE_AND_ASSIGN_OPPONENT_TO_EVENT_PATH:
          case opponentsConst.CREATE_AND_ASSIGN_OPPONENT_WITH_GRADE:
          case opponentsConst.CREATE_AND_ASSIGN_OPPONENT:
          case opponentsConst.EDIT_OPPONENT_WITH_GRADE:
          case opponentsConst.EDIT_OPPONENT:
              return true;
            break;

          default:
            return false;
        }
      }

      return isPerformingAction && isActionForProccessing();
    }

    _renderProccessingIndicator() {
      return (
          <ModalWindow
              key="loading-modal"
              className="small-box"
              title="Loading"
              name="error"
              isVisibleOn={true}
              shouldCloseOnOverlayClick={false}
              closeButton={false}>
              <div>
                <LoadingIndicator />
              </div>
          </ModalWindow>
      );
    }


    render() {
        const { isPerformingAction, mode, opponentType, kitList, errorMessage, opponentLastActionMade} = this.props;
        const { selectedKitId, showAddEditKitDlg, addEditKitDlgMode, addEditKitDlgInitValues } = this.state;

        let displayFetchLoading = this._displayDetailRetrievalLoading();

        return (
            <ModalWindow
                key="modal"
                className={this._setModalSize()}
                title={this._displayDlgTitle()}
                name="addEditTeam"
                isVisibleOn={true}
                shouldCloseOnOverlayClick={false}
                closeButton={true}
                onClose={this._onModalCloseHandler}>

                <div>
                    <h4>{this._displayDlgTitle()}</h4>
                    {displayFetchLoading && this._renderLoadingIndicator()}

                    {!displayFetchLoading &&
                    <div className="form-inner" style={{padding: '5px'}}>
                        <OpponentsForm
                            mode={mode}
                            opponentId={-1}
                            opponentType={opponentType}
                            initialValues={this._getOpponentFormInitVal()}
                            opponentsFormSubmitHandler={this._onOpponentsFormSubmitHandler}
                          />

                        {
                            (opponentType.description.toUpperCase() === 'TEAM') &&
                            <div className="form-wrapper opponents-kit">
                                <div className="header panel-header">
                                    <div className="panel-header-title">Kits</div>
                                    <div className="panel-header-actions">
                                      <button className= "button btn-box" onClick={this._onAddKitClicked} title="New">
                                        <i className="phxico phx-plus">
                                        </i>
                                      </button>
                                      <button
                                        className={`button btn-box ${selectedKitId ? '' : 'disabled'}`}
                                        disabled={selectedKitId ? false: true}
                                        onClick={this._onEditKitClicked} title="Edit">
                                          <i className="phxico phx-pencil">
                                          </i>
                                      </button>
                                      <button
                                        className={`button btn-box ${selectedKitId ? '' : 'disabled'}`}
                                        disabled={selectedKitId ? false: true}
                                        onClick={this._onDeleteKitClicked} title="Delete">
                                        <i className="phxico phx-delete">
                                        </i>
                                      </button>
                                    </div>
                                </div>
                                <KitsTable
                                    rowDataList={this._getDisplayableKitList()}
                                    selectedRowId={selectedKitId}
                                    onRowClickHandler={this._onKitTableRowClicked}
                                    // onAddButtonClickedHandler={this._onAddKitClicked}
                                    // onEditButtonClickedHandler={this._onEditKitClicked}
                                    // onDeleteButtonClickedHandler={this._onDeleteKitClicked}
                                  />
                            </div>
                        }
                    </div>
                  }
                </div>

                <div className="button-group tcenter">
                  <button
                      type="button"
                      onClick={this._onCancelButtonClickedHandler}
                      disabled={false}>
                      Cancel
                  </button>
                  <button
                      type="button"
                      onClick={this._onSaveButtonClickedHandler}
                      disabled={false}>
                      Save
                  </button>
                </div>

                {
                  showAddEditKitDlg &&
                  <AddEditKitDlg
                    mode={addEditKitDlgMode}
                    selectedKitId={selectedKitId}
                    initialValues={addEditKitDlgInitValues}
                    onOkButtonClickedHandler={this._onAddEditKitDlgOk}
                    onCancelButtonClickedHandler={this._onAddEditKitDlgCancel} />
                }

                {/*
                  isErrorModalOpen &&
                  <ModalWindow
                      key="error-modal"
                      className="xsmall"
                      title="Error"
                      name="error"
                      isVisibleOn={isErrorModalOpen}
                      shouldCloseOnOverlayClick={true}
                      closeButton={true}
                      onClose={this._onErrorModalCloseHandler}>
                      <div>
                          <h4>Error</h4>
                          <div style={{'padding': '5px'}}>
                              <p className="tcenter info-msg">
                                  <i className="phxico phx-warning"></i>
                                  {errorMessage}
                              </p>
                          </div>
                      </div>
                  </ModalWindow>
                */}

                {
                  this._displayProcessingIndicator() && this._renderProccessingIndicator()
                }

            </ModalWindow>
        );
    }

};


AddEditOpponentDlg.propTypes = {
    tag: PropTypes.string.isRequired,
    mode: PropTypes.oneOf( [ MODE.ADD, MODE.EDIT ] ).isRequired,
    opponentType: PropTypes.shape( {
        id: PropTypes.number,
        description: PropTypes.string
    } ).isRequired,
    eventPathId: PropTypes.number,
    eventPathSportCode: PropTypes.string,
    opponentId: PropTypes.number,
    onOkButtonClickedHandler: PropTypes.func,
    onCancelButtonClickedHandler: PropTypes.func
};


AddEditOpponentDlg.defaultProps = {
    tag: TAG.OPPONENTS,
    mode: MODE.ADD,
    opponentType: {
        id: 1,
        description: 'Team'
    },
    eventPathId: -1,
    eventPathSportCode: null,
    opponentId: -1,
    onOkButtonClickedHandler: null,
    onCancelButtonClickedHandler: null
};


export default connect(mapStateToProps, mapDispatchToProps)(mapPermissionsToProps(AddEditOpponentDlg));
