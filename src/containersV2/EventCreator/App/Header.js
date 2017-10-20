import React from "react";
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { createSelector } from 'reselect';
import { permissionsCode } from 'containersV2/EventCreator/App/constants';
import Header, { ListItem } from 'componentsV2/Header';
import ConfirmModal from 'componentsV2/Modal/ConfirmModal';
import {isDirty, submit, isValid, getFormValues} from 'redux-form';
import { push } from 'react-router-redux';
import { makeIterable } from 'phxUtils';
import { betRestrictionHasChanges, getUpdatedCellsArrayAndMatrixMap } from '../BetRestrictions/helpers';
import { setEventPathMode, deleteEventPath } from '../Path/actions';
import { deleteEvent } from '../Event/actions';
import { deleteMarket, clearMarketTypes } from '../EventMarkets/actions';
import { openModal } from '../../../actions/modal';
import { modes } from '../Path/constants';
import { paths } from './constants';
import { updateSaveButtonState, toggleBulkUpdate } from './actions';
import { updateActivePathId, createPath } from '../../SportsTree/actions';
import { updateBetRestrictions, deleteBetRestrictions  } from '../BetRestrictions/actions';
import { DUMMY_ID } from '../../SportsTree/constants';
import { getCommonPathProps } from '../../SportsTree/helpers';
import isEqual from 'lodash.isequal';
import { logout } from '../../../actions/user'
import { setEditMarketSelectedMarketId } from 'phxActions/editMarket';

const activeBetTypeKeySelector = state => state.betRestrictions.activeBetTypeKey;
const matrixDataCacheSelector = state => state.betRestrictions.matrixDataCache;
const updatedCellsArrayAndMatrixMapSelector = createSelector(
    activeBetTypeKeySelector,
    matrixDataCacheSelector,
    getUpdatedCellsArrayAndMatrixMap
);
const mapStateToProps = (state) => {
    let { updatedCellsArray, matrixMap, deletedRestrictions } = updatedCellsArrayAndMatrixMapSelector(state);
    return {
        user: state.user.details,
        allSports: state.apiConstants.values.riskSports,
        activeSportsCode: state.sportsTree.activeSportId,
        enableHeaderButtons: state.eventCreatorApp.enableHeaderButtons,
        selectedId: state.eventCreatorApp.selectedPath ? state.eventCreatorApp.selectedPath.id : null,
        isBulkUpdateActive: state.eventCreatorApp.isBulkUpdateActive,
        isFormDirtyEventPath: isDirty('EventPathForm')(state),
        isFormValidEventPath: isValid('EventPathForm')(state),
        isGameFormDirtyEvent: isDirty('GameEventForm')(state),
        isGameFormValidEvent: isValid('GameEventForm')(state),
        isRankFormDirtyEvent: isDirty('RankEventForm')(state),
        isRankFormValidEvent: isValid('RankEventForm')(state),

        isGameResultsEventResultFormDirtyEvent: isDirty('EventResultForm')(state),
        isGameResultsEventResultFormValidEvent: isValid('EventResultForm')(state),
        isGameResultsEventScoreFormDirtyEvent: isDirty('EventScoreForm')(state),
        isGameResultsEventScoreFormValidEvent: isValid('EventScoreForm')(state),

        isMarketFormDirtyEvent: isDirty('MarketForm')(state),
        isMarketFormValidEvent: isValid('MarketForm')(state),

        activePage: state.eventCreatorApp.activePage,
        isSaveButtonDisabled: state.eventCreatorApp.isSaveButtonDisabled,

        eventPathMode: state.eventCreatorEventPath.eventPathMode,

        selectedOpponents: state.eventCreatorEvent.selectedOpponents,
        newSelectedOpponents: state.eventCreatorEvent.newSelectedOpponents,

        marketOriginalOutcomes: state.eventCreatorEventMarkets.market.outcomes || [],
        marketNewOutcomes: state.eventCreatorEventMarkets.outcomes,
        market: state.eventCreatorEventMarkets.market,
        updatedMarketBook: state.eventCreatorEventMarkets.updatedMarketBook,
        hasSPBook: state.eventCreatorEventMarkets.hasSPBook,

        activePathId: state.sportsTree.activePathId,
        activeSportId: state.sportsTree.activeSportId,
        pathsMap: state.sportsTree.pathsMap,
        baseUrl: state.sportsTree.baseUrl,
        isFetchingEPT: state.sportsTree.isFetchingEPT,
        isCreatingNewPath: !!state.sportsTree.pathsMap[DUMMY_ID],
        form : state.form,

        updatedCellsArray,
        matrixMap,
        deletedRestrictions,
        activeBetType: state.betRestrictions.activeBetType,
        matrixDataCache: state.betRestrictions.matrixDataCache,
    }
}

const mapDispatchToProps = (dispatch) => {
    return bindActionCreators({
        push,
        submit,
        setEventPathMode,
        deleteEventPath,
        deleteEvent,
        deleteMarket,
        openModal,
        clearMarketTypes,
        updateActivePathId,
        createPath,
        updateBetRestrictions,
        deleteBetRestrictions,
        updateSaveButtonState,
        toggleBulkUpdate,
        logout,
        setEditMarketSelectedMarketId
    }, dispatch);
}

class App extends React.Component {
    constructor (props) {
        super(props);
        this._isButtonDisabled = this._isButtonDisabled.bind(this);
        this._isButtonSaveDisabled = this._isButtonSaveDisabled.bind(this);
        this._isDeleteButtonDisabled = this._isDeleteButtonDisabled.bind(this);
        this._onClickMenu = this._onClickMenu.bind(this);
        this._onDelete = this._onDelete.bind(this);
        this.state = {
            showConfirmationModal: false,
            pendingAction: '',
        }
    }
    _isButtonDisabled(item) {
        const { allSports, activeSportsCode } = this.props;
        let enabledGameEvents = null;
        if (this.props.isBulkUpdateActive) {
            return true;
        }
        if(allSports){
            enabledGameEvents = allSports.find(sport => sport.defaultEventPathId === activeSportsCode).gameEventEnabled;
        }

        if(item === 'GAMEEVENT' && enabledGameEvents == false){
           return true
        }else{
            if (this.props.isFetchingEPT || this.props.isCreatingNewPath) {
                return true;
            }
        }

        const { enableHeaderButtons } = this.props;
        return !enableHeaderButtons.includes(item);
    }

    _isButtonSaveDisabled() {
        const {
            isGameFormDirtyEvent,
            isGameFormValidEvent,
            isFormDirtyEventPath,
            isFormValidEventPath,
            isRankFormDirtyEvent,
            isRankFormValidEvent,
            isMarketFormDirtyEvent,
            isMarketFormValidEvent,
            isGameResultsEventResultFormDirtyEvent,
            isGameResultsEventResultFormValidEvent,
            isGameResultsEventScoreFormDirtyEvent,
            isGameResultsEventScoreFormValidEvent,
            selectedOpponents,
            newSelectedOpponents,
            market,
            marketNewOutcomes,
            marketOriginalOutcomes,
            updatedMarketBook,
            updatedCellsArray,
            deletedRestrictions,
            hasSPBook
        } = this.props;
        if (this.props.isBulkUpdateActive) {
            return true;
        }
        if (paths.RANK_EVENT === this.props.activePage) {
            if (isRankFormDirtyEvent && isRankFormValidEvent) {
                return false;
            } else if (isRankFormValidEvent && newSelectedOpponents.length > 0 && !isEqual(selectedOpponents, newSelectedOpponents)) {
                return false;
            } else if (updatedCellsArray.length || deletedRestrictions.length) {
                return false;
            } else {
                return true;
            }
        } else if (paths.LEAGUE_NEWRANK === this.props.activePage) {
            if (isRankFormDirtyEvent && isRankFormValidEvent && newSelectedOpponents.length > 0) {
                return false
            } else {
                return true;
            }
        } else if (paths.MARKET === this.props.activePage) {
            if (isMarketFormValidEvent) {
                if (!isEqual(marketNewOutcomes, marketOriginalOutcomes)) {
                    return false;
                }
                if (updatedMarketBook && market.book) {
                    if (!isEqual(updatedMarketBook, market.book) || hasSPBook !== market.hasSPBook) {
                        return false;
                    }
                }
            }
            if (isMarketFormDirtyEvent && isMarketFormValidEvent) {
                return false
            } else {
                return true;
            }
        } else if (paths.GAME_EVENT === this.props.activePage) {
            if ((isGameFormDirtyEvent && isGameFormValidEvent) ||(isGameResultsEventScoreFormDirtyEvent && isGameResultsEventScoreFormValidEvent) || (isGameResultsEventResultFormDirtyEvent && isGameResultsEventResultFormValidEvent) ) {
                return false
            } else if (updatedCellsArray.length || deletedRestrictions.length) {
                return false;
            } else {
                return true;
            }
        } else if (updatedCellsArray.length || deletedRestrictions.length) {
            return false;
        } else {
            return !(isGameFormDirtyEvent && isGameFormValidEvent) && !(isFormDirtyEventPath && isFormValidEventPath);
        }
    }

    componentDidUpdate (prevProps) {
        let isSaveButtonDisabled = this._isButtonSaveDisabled();
        if (prevProps.isSaveButtonDisabled !== isSaveButtonDisabled) {
            this.props.updateSaveButtonState(isSaveButtonDisabled)
        }
    }
    _isDeleteButtonDisabled() {
        const {form} = this.props;
        if (this.props.isBulkUpdateActive) {
            return true;
        }
        if (this.props.isFetchingEPT || this.props.isCreatingNewPath) {
            return true;
        }
        if (!this._isButtonSaveDisabled() || this.props.eventPathMode === modes.CREATE) {
            return true;
        } else {
            if ([paths.COUNTRY, paths.LEAGUE, paths.GAME_EVENT, paths.RANK_EVENT, paths.MARKET].includes(this.props.activePage)) {
                if(paths.GAME_EVENT  === this.props.activePage)
                {
                    if(form.hasOwnProperty('EventScoreForm') || form.hasOwnProperty('EventResultForm')){
                        return true;
                    }
                    else return false;
                }
                else
                    return false;
            } else {
                return true;
            }
        }
    }
    _onSubmit() {
        const { submit, form, updatedCellsArray, updateBetRestrictions, matrixMap, deletedRestrictions, activeBetType, deleteBetRestrictions } = this.props;
        if (updatedCellsArray.length) {
            let restrictions = updatedCellsArray.map(key => {
                return matrixMap[key].cell
            })
            updateBetRestrictions(restrictions);
        }
        if (deletedRestrictions.length) {
            let restrictions = deletedRestrictions.map(res => res.criteria);
            deleteBetRestrictions(activeBetType, restrictions)
        }
        if ([paths.LEAGUE_NEWGAME, paths.GAME_EVENT].includes(this.props.activePage)) {
            if(form.hasOwnProperty('GameEventForm'))
                submit('GameEventForm');
            else if(form.hasOwnProperty('EventScoreForm'))
                submit('EventScoreForm');
            else if(form.hasOwnProperty('EventResultForm'))
                submit('EventResultForm');

        } else if ([paths.LEAGUE_NEWRANK, paths.RANK_EVENT].includes(this.props.activePage)) {
            submit('RankEventForm');
        } else if (paths.MARKET === this.props.activePage) {
            submit('MarketForm');
        }else if (paths.GAME_RESULT === this.props.activePage) {
            submit('GameResultsForm');
        }  else {
            submit('EventPathForm');
        }
    }

    _onDelete (bypassWarning) {
        const { activePathId, isSaveButtonDisabled, matrixDataCache } = this.props;
        if (!bypassWarning) {
            let brHasChanges = betRestrictionHasChanges(matrixDataCache);
            if (!isSaveButtonDisabled || brHasChanges) {
                this.setState({showConfirmationModal: true, button: 'DELETE'});
                return false;
            }
        }
        if ([paths.COUNTRY, paths.LEAGUE].includes(this.props.activePage)) {
            this.props.deleteEventPath(activePathId);
        } else if ([paths.GAME_EVENT, paths.RANK_EVENT].includes(this.props.activePage)) {
            this.props.deleteEvent(activePathId);
        } else if (paths.MARKET === this.props.activePage) {
            this.props.deleteMarket(this.props.market.id);
        }
    }

    //remove push on react-router v4
    _onClickMenu(action, bypassWarning) {
        const {
            push,
            selectedId,
            openModal,
            clearMarketTypes,
            activePathId,
            activeSportId,
            pathsMap,
            baseUrl,
            createPath,
            isSaveButtonDisabled,
            matrixDataCache,
            toggleBulkUpdate,
            isBulkUpdateActive,
        } = this.props;
        let url;

        if (action !== 'SAVE' && !bypassWarning) {
            let brHasChanges = betRestrictionHasChanges(matrixDataCache);
            if (!isSaveButtonDisabled || brHasChanges) {
                this.setState({showConfirmationModal: true, pendingAction: action, button: 'NEW'});
                return false;
            }
        }
        switch(action) {
            case 'IMPORTFEEDS':
                    document.getElementById('importXML').click();
                break
            case 'CREATEEVENT':
                // push(`event-creator/event-path/${selectedId}/path`);
                this.props.setEventPathMode(modes.CREATE);
                let eventPaths = pathsMap[activePathId].eventPaths;
                let lastChildPath = eventPaths.length ? pathsMap[eventPaths[eventPaths.length - 1]] : null;
                let lastPrintOrder = 99; // TODO: is this the default printOrder?
                if (lastChildPath && lastChildPath.printOrder) {
                    lastPrintOrder = lastChildPath.printOrder;
                }
                url = `${baseUrl}/${pathsMap[activeSportId].sportCode.toLowerCase()}/p${DUMMY_ID}?parentPathId=${activePathId}`;
                createPath(DUMMY_ID, {
                    ...getCommonPathProps({pathsMap, activePathId, sportCode: pathsMap[activeSportId].sportCode,}),
                    description: "New Event Path",
                    printOrder: lastPrintOrder + 1
                })
                push(url);
                break
            case 'CREATEGAME':
                url = `${baseUrl}/${pathsMap[activeSportId].sportCode.toLowerCase()}/e${DUMMY_ID}/game?parentPathId=${activePathId}`;
                createPath(DUMMY_ID, {
                    ...getCommonPathProps({pathsMap, activePathId, sportCode: pathsMap[activeSportId].sportCode,}),
                    description: "New Game Event",
                    eventType: 1,
                    type: "event",
                })
                push(url);
                break;
            case 'CREATERANK':
                url = `${baseUrl}/${pathsMap[activeSportId].sportCode.toLowerCase()}/e${DUMMY_ID}/rank?parentPathId=${activePathId}`;
                createPath(DUMMY_ID, {
                    ...getCommonPathProps({pathsMap, activePathId, sportCode: pathsMap[activeSportId].sportCode,}),
                    description: "New Rank Event",
                    eventType: 2,
                    type: "event",
                })
                push(url);
                break;
            case 'SAVE':
                this._onSubmit();
                break;
            case 'CREATEMARKET':
                clearMarketTypes();
                openModal('newMarket');
                break;
            case 'EDITMARKET':
                if(pathsMap[activePathId].type === 'market'){
                    this.props.setEditMarketSelectedMarketId(activePathId)
                }
                openModal('editMarket');
                break;
            case 'BULKUPDATE':
                toggleBulkUpdate(!isBulkUpdateActive);
                break;
            default:
            break;
        }
    }

    render() {
        //after startup
        const { user, isBulkUpdateActive } = this.props;
        const bulkUpateClassName = isBulkUpdateActive ? 'active' : '';
        const bulkUpateTitle = isBulkUpdateActive ? 'Cancel Bulk Update' : 'Bulk Update';
        return (
            <Header title="Event Creator" user={user} onClick={e => { this.props.logout() }}>
                <ListItem title="Manual Feed Import (Betradar)" onClick={()=>{this._onClickMenu('IMPORTFEEDS')}}>
                    <i className="phxico phx-import icon-medium"></i>
                </ListItem>
                <ListItem title={bulkUpateTitle} onClick={()=>{this._onClickMenu('BULKUPDATE')}} className={bulkUpateClassName}>
                    <i className="phxico phx-check-all icon-medium"></i>
                </ListItem>
                <ListItem actionIds={[permissionsCode.ADD_EVENT_PATH]} title="New Event Path" disabled={this._isButtonDisabled('EVENT')} onClick={()=>{this._onClickMenu('CREATEEVENT')}}>
                    <i className="phxico phx-event-path icon-large"></i>
                </ListItem>
                <ListItem actionIds={[permissionsCode.ADD_RANK_EVENT]} title="New Rank Event" disabled={this._isButtonDisabled('RANKEVENT')} onClick={()=>{this._onClickMenu('CREATERANK')}}>
                    <i className="phxico phx-rank-event icon-large"></i>
                </ListItem>
                <ListItem actionIds={[permissionsCode.ADD_GAME_EVENT]} title="New Game Event" disabled={this._isButtonDisabled('GAMEEVENT')} onClick={()=>{this._onClickMenu('CREATEGAME')}}>
                    <i className="phxico phx-game-event icon-large"></i>
                </ListItem>
                <ListItem actionIds={[permissionsCode.ENABLE_NEW_MARKETS_DIALOG]} title="New Market" disabled={this._isButtonDisabled('MARKET')} onClick={()=>{this._onClickMenu('CREATEMARKET')}}>
                    <i className="phxico phx-market-new icon-large"></i>
                </ListItem>
                <ListItem actionIds={[permissionsCode.ENABLE_EDIT_MARKETS_DIALOG]} title="Edit Market" disabled={this._isButtonDisabled('EDITMARKET')} onClick={()=>{this._onClickMenu('EDITMARKET')}}>
                    <i className="phxico phx-market-edit icon-large"></i>
                </ListItem>
                <ListItem actionIds={[permissionsCode.DELETE]} title="Delete" disabled={this._isDeleteButtonDisabled()} onClick={e => {this._onDelete()}}>
                    <i className="phxico phx-delete icon-medium"></i>
                </ListItem>
                <ListItem
                    actionIds={[
                        permissionsCode.MANAGE_EVENTS,
                        permissionsCode.ADD_EVENT_PATH,
                        permissionsCode.ADD_EVENT_PATH_TEAM,
                        permissionsCode.ADD_EVENT_PATH_PLAYER,
                        permissionsCode.ADD_RANK_EVENT,
                        permissionsCode.ADD_GAME_EVENT,
                        permissionsCode.AUTO_SETTLEMENT,
                    ]}
                    actionIdFilter="ANY"
                    title="Save"
                    disabled={this._isButtonSaveDisabled()}
                    onClick={()=>{this._onClickMenu('SAVE')}}
                ><i className="phxico phx-save icon-medium"></i>
                </ListItem>
                <ConfirmModal
                    isVisible={this.state.showConfirmationModal}
                    onConfirm={e => {
                        this.setState({showConfirmationModal: false});
                        if (this.state.button === 'NEW') {
                            this._onClickMenu(this.state.pendingAction, true);
                        } else if (this.state.button === 'DELETE') {
                            this._onDelete(true);
                        }
                    }}
                    onCancel={e => {
                        this.setState({showConfirmationModal: false})
                    }}
                />
            </Header>
        )
    }
}


export default connect(mapStateToProps, mapDispatchToProps)(App);
