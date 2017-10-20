import React from "react";
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { mapPermissionsToProps } from 'componentsV2/checkPermission/index';
import { permissionsCode } from 'containersV2/EventCreator/App/constants';
import filterTypes from '../../../constants/filterTypes';
import { setEditMarketMarkets, setEditMarketSelectedMarketId, fetchEditMarketDetails, saveEditMarketChanges } from '../../../actions/editMarket';
import { setSelectedOutcomeId } from '../../../actions/outcomeWagerLimits';
import { openModal, closeModal } from '../../../actions/modal';
import { setMarketFeedInfoMarkets } from '../../../actions/marketFeedInfo';
import TabComponent from '../../../components/Tabs';
import ModalWindow from '../../../components/modal';
import SelectBox from '../../../components/selectBox';
import BookInfo from '../../../components/editMarket/bookInfo';
import EventDetails from '../../../components/editMarket/eventDetails';
import EventInfo from '../../../components/editMarket/eventInfo';
import PriceAndWagerLimits from '../../../components/editMarket/priceAndWagerLimits';
import LiabilityIndicators from '../../../components/editMarket/liabilityIndicators';
import MarketDetails from '../../../components/editMarket/marketDetails';
import RankResultSet from '../../../components/editMarket/rankResultSet';
import Rule4Results from '../../../components/editMarket/rule4Results';
import StakeDistributionIndicators from '../../../components/editMarket/stakeDistributionIndicators';
import StandardResultSet from '../../../components/editMarket/standardResultSet';
import MarketLineConfigs from '../../../components/editMarket/marketLineConfigs';
import OutcomeWagerLimits from '../Modals/OutcomeWagerLimits';
import MarketFeedInfo from '../Modals/MarketFeedInfo';
import PriceMargin from '../Modals/PriceMargin';
import HandicapValidFormats from '../Modals/HandicapValidFormats';
import { objectToArray, formatDateTimeString, formatISODateString, formatOutcomeSpreads, mergeNestedObjects } from '../../../utils';

function mapStateToProps(state) {
    return {
        editMarket: state.editMarket,
        apiConstants: state.apiConstants,
        modals: state.modals
    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({ setEditMarketSelectedMarketId, setMarketFeedInfoMarkets, fetchEditMarketDetails, openModal, closeModal, setSelectedOutcomeId, saveEditMarketChanges }, dispatch);
}

class EditMarket extends React.Component {
    constructor(props) {
        super(props);
        this._handleSelectMarketChange = this._handleSelectMarketChange.bind(this);
        this._handleResetClick = this._handleResetClick.bind(this);
        this._handleSaveAndCloseClick = this._handleSaveAndCloseClick.bind(this);
        this._handleCancelClick = this._handleCancelClick.bind(this);
        this._handleSelectLineChange = this._handleSelectLineChange.bind(this);
        this._handleOutcomeClick = this._handleOutcomeClick.bind(this);
        this._outcomeWagerLimitsGroupChangeHandler = this._outcomeWagerLimitsGroupChangeHandler.bind(this);
        this._changeHandler = this._changeHandler.bind(this);
        this._outcomeDisconnectionHandler = this._outcomeDisconnectionHandler.bind(this);
        this._createEditMarketRequest = this._createEditMarketRequest.bind(this);
        this._handleSaveClick = this._handleSaveClick.bind(this);
        this._priceMarginChangeHandler = this._priceMarginChangeHandler.bind(this);
        this._save = this._save.bind(this);
        this._shouldCheckMarketFeedInfo = false;
        this._shouldCloseAfterSave = false;
        this._lineIdsToIgnoreInMarketFeed = [];
        this._marketIdsToIgnoreInMarketFeed = [];
        this.state = {
            lineId: 2,
            editedValues: {
            },
            marketDetails: {
            },
            outcomeKeysToBeDisconnected: [],
            shouldResetChildComponents: false,
            showSaveFailedError: null,
            isPriceMarginBelowMinimum: false,
            runnerGroupDesc: ''
        };
    }

    componentDidMount() {
        
    }

    componentDidUpdate(prevProps, prevState) {
        if(prevProps.editMarket.isFetchingEditMarketDetails && this.props.editMarket.isFetchingEditMarketDetails === false) {
            this.setState({ marketDetails: this.props.editMarket.marketDetails });
        }
        if(prevProps.editMarket.selectedMarketId !== this.props.editMarket.selectedMarketId) {
            this._resetForm();
        }
        if(prevProps.editMarket.isSavingChanges === false && this.props.editMarket.isSavingChanges === false && this.state.shouldResetChildComponents) {
            this.setState({
                shouldResetChildComponents: false
            });
        }
        if(prevProps.editMarket.isSavingChanges && this.props.editMarket.isSavingChanges === false && !this.props.editMarket.savingChangesFailed) {
            this._clearEditedValues();
            this.setState({
                marketDetails: this.props.editMarket.marketDetails,
                shouldResetChildComponents: true,
                showSaveFailedError: true
            });
            if(this._shouldCloseAfterSave) {
                this._shouldCloseAfterSave = false;
                this.props.closeModal('editMarket');
            }
        }
        if(prevProps.editMarket.isSavingChanges && this.props.editMarket.isSavingChanges === false && this.props.editMarket.savingChangesFailed) {
            this.setState({
                showSaveFailedError: true
            });
            this._shouldCloseAfterSave = false;
        }
    }

    _resetForm() {
        this._shouldCheckMarketFeedInfo = false;
        this.setState({
            editedValues: {},
            marketDetails: {}
        });
    }

    _clearEditedValues() {
        this._shouldCheckMarketFeedInfo = false;
        if(this.props.onFormEdit) {
            this.props.onFormEdit(true);
        }
        this.setState({
            editedValues: {}
        });
    }

    _getLines() {
        const lines = objectToArray(filterTypes.LINES);
        lines.shift(); //remove "ALL LINES"
        return lines;
    }

    _getSelectedMarketFromId(marketId) {
        return this.props.editMarket.markets.find((market)=> marketId === market.id);
    }

    _getTabItems() {
        const marketDesc = this._getSelectedMarketFromId(this.props.editMarket.selectedMarketId).rawDesc || this._getSelectedMarketFromId(this.props.editMarket.selectedMarketId).desc;
        let tabItems = [
            {
                title: 'Prices and Wager Limits',
                content: this._renderPriceAndWagerLimits(),
            },
            {
                title: 'Liability Indicators',
                content: this._renderLiabilityIndicators()
            },
            {
                title: 'Stake Distribution Indicators',
                content: this._renderStakeDistributionIndicators()
            },
            {
                title: 'Book Info',
                content: this._renderBookInfo()
            }
        ];
        if( this.state.marketDetails.rule4Results) {
            tabItems.push({
                title: 'Rule 4 Results',
                content: this._renderRule4Results()
            })
        }
        tabItems.push({
            title: marketDesc + ' Result',
            content: this._renderMarketResult()
        });
        return tabItems;
    }

    _getLineItemToShow(array) {
        let itemToShow = array.find((item)=> item.lineId === this.state.lineId);
        if(!itemToShow) {
            itemToShow = array[0];
        }
        return itemToShow;
    }

    _getMarketStatus() {
        const statuses = objectToArray(filterTypes.STANDARD_MARKET_STATUSES);
        const { marketDetails } = this.state.marketDetails;
        if(marketDetails) {
            return statuses.find((status) => Number(status.value) === marketDetails.marketStatusId).desc;
        } else {
            return null
        }
    }

    _outcomeDisconnectionHandler(outcomeKey) {
        const { outcomeKeysToBeDisconnected } = this.state;
        const index = outcomeKeysToBeDisconnected.indexOf(outcomeKey);
        if(index === -1) {
            this.setState({
                outcomeKeysToBeDisconnected: [ ...outcomeKeysToBeDisconnected, outcomeKey ]
            })
        }
    }

    _changeHandler(stateKey, value, uniqueKey, options) {
        const { editedValues } = this.state;
        let arr = stateKey.split('.'),
            obj,
            o = obj = {};

        arr.forEach((key, index) => {
            if(index !== arr.length - 1) {
                o = o[key] = {}
            } else {
                o = o[key] = value
            }
        });
        const mergedObj = mergeNestedObjects(this.state.editedValues, obj, uniqueKey);
        if((options && options.shouldCheckMarketFeedInfo) || this._shouldCheckMarketFeedInfo) {
            this._shouldCheckMarketFeedInfo = true;
        }
        if(this.props.onFormEdit) {
            this.props.onFormEdit(false);
        }
        this.setState({
            editedValues: mergedObj,
            marketDetails: mergeNestedObjects(mergedObj, this.state.marketDetails),
            showSaveFailedError: false
        });
    }

    _outcomeWagerLimitsGroupChangeHandler(outcomeId, wagerLimitsGroup) {
        const { outcomeWagerLimits } = this.state.editedValues;
        let newEditedOutcomeWagerLimitsState = outcomeWagerLimits ? { ...outcomeWagerLimits } : {};
        if(wagerLimitsGroup[1]) {
            this._changeOutcomeLimitData(outcomeId, wagerLimitsGroup[1]);
        }
        if(newEditedOutcomeWagerLimitsState[outcomeId]) {
            for(var key in wagerLimitsGroup) {
                newEditedOutcomeWagerLimitsState[outcomeId][key] = wagerLimitsGroup[key];
            }
        } else {
            newEditedOutcomeWagerLimitsState[outcomeId] = { ...wagerLimitsGroup };
        }
        this.setState({
            editedValues: {
                ...this.state.editedValues,
                outcomeWagerLimits: newEditedOutcomeWagerLimitsState
            }
        });
    }

    _changeOutcomeLimitData(outcomeId, wagerLimitsGroup) {
        const { pricesAndWagerLimits } = this.state.marketDetails;
        const { maxBetLiability, maxBetStake, actionId } = wagerLimitsGroup[0];
        let outcomeIndex = null;
        pricesAndWagerLimits.outcomePriceAndWagerLimitsList.forEach((outcome, index) => {
            if(outcome.outcomeId === outcomeId) {
                outcomeIndex = index;
            }
        });
        const newOutcomeState = { ...this.state.marketDetails.pricesAndWagerLimits.outcomePriceAndWagerLimitsList[outcomeIndex], maxBetLiability, maxBetStake, actionId };
        pricesAndWagerLimits.outcomePriceAndWagerLimitsList[outcomeIndex] = newOutcomeState;
        this.setState({
            marketDetails: {
                ...this.state.marketDetails,
                pricesAndWagerLimits
            }
        })
    }

    _createEditMarketRequest() {
        let requestBody = {};
        this._lineIdsToIgnoreInMarketFeed = [];
        this._marketIdsToIgnoreInMarketFeed = [];
        const { editedValues } = this.state;
        for(var key in editedValues) {
            switch (key) {
                case 'pricesAndWagerLimits':
                    let outcomePricesList = [];
                    editedValues[key].outcomePriceAndWagerLimitsList.forEach((outcome)=> {
                        const { outcomeId, hidden, restricted, tradingMessage, ordinalPosition } = outcome
                        const newOutcome = {
                            outcomeId,
                            hidden,
                            restricted,
                            tradingMessage,
                            prices: [],
                            ordinalPosition
                        }
                        if(outcome.priceList.length) {
                            outcome.priceList.forEach((price)=> {
                                const { decimal, lineId, formattedSpread } = price;
                                const { spread, spread2 } = this._getSpreadsFromFormattedSpread(formattedSpread);
                                const newPrice = {
                                    decimal,
                                    lineId
                                };
                                if(spread !== null){
                                    newPrice.spread = spread;
                                }
                                if(spread2 !== null && spread2 !== 0){
                                    newPrice.spread2 = spread2;
                                }
                                newOutcome.prices.push(newPrice);
                            });
                        }
                        outcomePricesList.push(newOutcome);
                    });
                    requestBody['pricesAndWagerLimits'] = {
                        outcomePricesList
                    }
                    break;
                case 'liabilityIndicators':
                    let liabilityIndicators = [];
                    editedValues[key].liabilityIndicators.forEach((liabilityIndicator)=> {
                        const { eventId, id, inRunning, marketTypeWagerLimitGroupId, primaryLimit, primaryActionId, secondaryLimit, secondaryActionId, liabilityIndicatorType } = liabilityIndicator;
                        const newLiabilityIndicator = {
                            eventId,
                            id,
                            inRunning,
                            marketTypeWagerLimitGroupId,
                            primaryLimit,
                            primaryActionId,
                            secondaryLimit,
                            secondaryActionId,
                            liabilityIndicatorType
                        }
                        liabilityIndicators.push(newLiabilityIndicator);
                    });
                    requestBody['liabilityIndicators'] = {
                        liabilityIndicators
                    }
                    break;
                case 'stakeDistributionIndicators':
                    let stakeDistributionIndicators = [];
                    editedValues[key].stakeDistributionIndicators.forEach((stakeDistributionIndicator)=> {
                        const { eventId, inRunning, marketTypeWagerLimitGroupId, stakeType, minMarketBetCount, minMarketTotalStake, primaryDeviationPercentage, primaryActionId, secondaryDeviationPercentage, secondaryActionId, id } = stakeDistributionIndicator;
                        const newStakeDistributionIndicator = {
                            eventId,
                            inRunning,
                            marketTypeWagerLimitGroupId,
                            stakeType,
                            minMarketBetCount,
                            minMarketTotalStake,
                            primaryDeviationPercentage,
                            primaryActionId,
                            secondaryDeviationPercentage,
                            secondaryActionId,
                            id
                        }
                        stakeDistributionIndicators.push(newStakeDistributionIndicator);
                    });
                    requestBody['stakeDistributionIndicators'] = {
                        stakeDistributionIndicators
                    }
                    break;
                case 'marketLineConfigs':
                    let marketLineConfigs = [];
                    editedValues[key].marketLineConfigs.forEach((marketLineConfig) => {
                        const { marketId, lineId, allowSingleBets, allowDoubleBets, allowCombinationBets, derivePrices, promotionLevel, showUnpriced, priceExpiry } = marketLineConfig;
                        const newMarketLineConfig = {
                            marketId,
                            lineId,
                            allowSingleBets,
                            allowDoubleBets,
                            allowCombinationBets,
                            derivePrices,
                            promotionLevel,
                            showUnpriced,
                            priceExpiry
                        }
                        if(!marketLineConfig.derivePrices) {
                            this._lineIdsToIgnoreInMarketFeed.push(lineId);
                        }
                        marketLineConfigs.push(newMarketLineConfig);
                    });
                    requestBody['marketLineConfigs'] = {
                        marketLineConfigs
                    }
                    break;
                case 'bookInfo':
                    let bookInfo = [];
                    editedValues[key].bookInfo.forEach((bookInfoItem) => {
                        const { appliedPlaceTerms } = bookInfoItem;
                        bookInfo.push({
                            appliedPlaceTerms
                        });
                    });
                    requestBody['bookInfo'] = {
                        bookInfo
                    }
                    break;
                case 'rule4Results':
                    let rule4Results = [];
                    editedValues[key].rule4Results.forEach((rule4Result)=> {
                        const bookId = rule4Result.id;
                        rule4Result.rule4Details.forEach((rule4Detail)=> {
                            const { rule4Id, outcomeId, appliedPrice, appliedR4Deduction } = rule4Detail;
                            rule4Results.push({
                                bookId,
                                rule4Id,
                                outcomeId,
                                appliedPrice,
                                appliedR4Deduction
                            });
                        });
                    });
                    requestBody['rule4Results'] = {
                        rule4Results
                    }
                    break;
                case 'marketResults':
                    let outcomeResults = [];
                    let racingDividends = [];
                    requestBody[key] = {};
                    const { resultSet } = this.state.marketDetails.marketResults;
                    if(resultSet === 'RANK_RESULT_SET') {
                        if(editedValues[key].outcomeResults && editedValues[key].outcomeResults.length) {
                            editedValues[key].outcomeResults.forEach((outcomeResult)=> {
                                const { outcomeId, spread, spread2, result, voidReasonId, voidReasonNotes, sp, firstShowPrice, ordinalposition, favPosition, favValue, firstPastPostPosition } = outcomeResult;
                                const newOutcomeResult = {
                                    outcomeId,
                                    spread,
                                    spread2,
                                    result,
                                    sp,
                                    firstShowPrice,
                                    ordinalposition,
                                    favPosition,
                                    favValue,
                                    firstPastPostPosition
                                };
                                if(result === 'VOID') {
                                    newOutcomeResult.voidReasonId = voidReasonId;
                                    if(voidReasonNotes) {
                                        newOutcomeResult.voidReasonNotes = voidReasonNotes;
                                    }
                                }
                                outcomeResults.push(newOutcomeResult);
                            });
                        }
                        if(editedValues[key].racingDividends && editedValues[key].racingDividends.length) {
                            editedValues[key].racingDividends.forEach((racingDividend)=> {
                                const { id, eventId, outcome1Id, outcome2Id, outcome3Id, typeId, dividend, stake, voidYN } = racingDividend;
                                const newRacingDividend = {
                                    id,
                                    eventId,
                                    outcome1Id,
                                    outcome2Id,
                                    outcome3Id,
                                    typeId,
                                    dividend,
                                    stake,
                                    voidYN
                                }
                                racingDividends.push(newRacingDividend);
                            });
                        }
                        if(typeof editedValues[key].abandoned !== 'undefined') {
                            requestBody[key].isAbandoned = editedValues[key].abandoned;
                        }
                        if(typeof editedValues[key].ignoreFeed !== 'undefined') {
                            requestBody[key].isIgnoreFeed = editedValues[key].ignoreFeed;
                        }
                    } else {
                        editedValues[key].outcomeResults.forEach((outcomeResult)=> {
                            const { outcomeId, spread, spread2, result, voidReasonId, voidReasonNotes } = outcomeResult;
                            const newOutcomeResult = {
                                outcomeId,
                                spread,
                                spread2,
                                result
                            };
                            if(result === 'VOID') {
                                newOutcomeResult.voidReasonId = voidReasonId;
                                if(voidReasonNotes) {
                                    newOutcomeResult.voidReasonNotes = voidReasonNotes;
                                }
                            }
                            outcomeResults.push(newOutcomeResult);
                        });
                    }
                    requestBody[key].resultSet = resultSet;
                    if(outcomeResults.length) {
                        requestBody[key].outcomeResults = outcomeResults;
                    }
                    if(racingDividends.length) {
                        requestBody[key].racingDividends = racingDividends;
                    }
                    break;
                case 'outcomeWagerLimits':
                    let outcomeWagerLimitList = [];
                    for(var outcomeId in editedValues[key]) {
                        const outcome = editedValues[key][outcomeId];
                        for(var wagerLimitGroupId in outcome) {
                            const wagerLimitGroup = outcome[wagerLimitGroupId];
                            for(var i = 0; i < wagerLimitGroup.length; i++) {
                                const { wagerLimitGroupId, marketTypeWagerLimitGroupId, wagerLimitTypeId, actionId, maxBetStake, maxBetLiability, restrictedActionId, maxRestrictedBetStake, maxRestrictedBetLiability, inRunning } = wagerLimitGroup[i];
                                outcomeWagerLimitList.push({
                                    outcomeId: Number(outcomeId),
                                    wagerLimitGroupId,
                                    marketTypeWagerLimitGroupId,
                                    wagerLimitTypeId,
                                    actionId,
                                    maxBetStake,
                                    maxBetLiability,
                                    restrictedActionId,
                                    maxRestrictedBetStake,
                                    maxRestrictedBetLiability,
                                    inRunning
                                });
                            }
                        }
                    }
                    if(requestBody['pricesAndWagerLimits']) {
                        requestBody['pricesAndWagerLimits'] = {
                            ...requestBody['pricesAndWagerLimits'],
                            outcomeWagerLimitList
                        }
                    } else {
                        requestBody['pricesAndWagerLimits'] = {
                            outcomeWagerLimitList
                        }
                    }
                    break;
                case 'marketDetails':
                    if(typeof editedValues[key].priceFromFeed !== 'undefined' && editedValues[key].priceFromFeed === false) {
                        this._marketIdsToIgnoreInMarketFeed.push(this.props.editMarket.selectedMarketId);
                    }
                case 'eventDetails':
                    requestBody[key] = { ...editedValues[key] };
                    break;
                default:
                    break
            }
        }
        return requestBody
    }

    _getSpreadsFromFormattedSpread(formattedSpread) {
        if(!formattedSpread || !formattedSpread.length) {
            return {
                spread: null,
                spread2: null
            }
        }
        return {
            spread: Number(formattedSpread.split(',')[0]),
            spread2: formattedSpread.split(',').length > 1 ? Number(formattedSpread.split(',')[1]) : null 
        }
    }

    _renderEventInfo() {
        const { eventDetails } = this.state.marketDetails;
        const { shouldResetChildComponents } = this.state;
        return (
            <EventInfo shouldResetState={shouldResetChildComponents} eventInfo={eventDetails} changeHandler={this._changeHandler}/>
        )
    }

    _renderEventDetails() {
        const { eventDetails } = this.state.marketDetails;
        const { shouldResetChildComponents } = this.state;
        return (
            <EventDetails shouldResetState={shouldResetChildComponents} eventDetails={eventDetails} changeHandler={this._changeHandler}/>
        )
    }
 
    _renderMarketDetails() {
        const { marketDetails } = this.state.marketDetails;
        const { shouldResetChildComponents } = this.state;
        const { OPEN, CLOSED, SUSPENDED, SETTLED, RESULTED } = filterTypes.STANDARD_MARKET_STATUSES;
        let statuses = [SUSPENDED, OPEN, CLOSED, RESULTED, SETTLED];
        if(marketDetails.marketStatusIdEnabled) {
            statuses = statuses.filter((status)=> {
                return status.value !== '3' && status.value !== '10';
            });
        }
        return (
            <MarketDetails
                shouldResetState={shouldResetChildComponents} 
                marketDetails={marketDetails}
                statuses={statuses}
                changeHandler={this._changeHandler}/>
        )
    }

    _renderMarketLineConfiguration() {
        const { marketLineConfigs } = this.state.marketDetails;
        const { shouldResetChildComponents } = this.state;
        return (
            <MarketLineConfigs shouldResetState={shouldResetChildComponents} changeHandler={this._changeHandler} marketLineConfigs={marketLineConfigs} lines={this._getLines()} promotionLevels={objectToArray(filterTypes.PROMOTION_LEVEL)}/>
        )
    }

    _renderStandardResultSet() {
        const { marketResults } = this.state.marketDetails;
        const { shouldResetChildComponents } = this.state;
        const permissions = this.props.permissions;
        let disableResultEdit = ['SETTLED','RESULTED','CLOSED'].indexOf(this._getMarketStatus().toUpperCase()) === -1;
        let hasPermission = true;
        if (![permissionsCode.MARKET_EDITOR_ENTER_RESULTS, permissionsCode.MARKET_EDITOR_UPDATE_RESULTS].every(id => permissions.includes(id))) {
            hasPermission = false;
            disableResultEdit = true;
        }
        const voidReasons = this.props.apiConstants.values.voidReasons || [];
        const { marketTypeGroup } = this.state.marketDetails.pricesAndWagerLimits.outcomePriceAndWagerLimitsList[0];
        const { disableHandicaps } = this.state.marketDetails.pricesAndWagerLimits;
        return (
            <StandardResultSet disableHandicaps={disableHandicaps} marketTypeGroup={marketTypeGroup} shouldResetState={shouldResetChildComponents} disableResultEdit={disableResultEdit} data={marketResults} changeHandler={this._changeHandler} voidReasons={voidReasons} hasPermission={hasPermission}/>
        )
    }

    _renderRankResultSet() {
        const { marketResults } = this.state.marketDetails;
        const { shouldResetChildComponents, editedValues } = this.state;
        const permissions = this.props.permissions;
        let disableResultEdit = ['SETTLED','RESULTED','CLOSED'].indexOf(this._getMarketStatus().toUpperCase()) === -1;
        let hasPermission = true;
        if (![permissionsCode.MARKET_EDITOR_ENTER_RESULTS, permissionsCode.MARKET_EDITOR_UPDATE_RESULTS].every(id => permissions.includes(id))) {
            hasPermission = false;
            disableResultEdit = true;
        }
        const hasEditedDividend = editedValues.marketResults && editedValues.marketResults.racingDividends && editedValues.marketResults.racingDividends.length;
        const disableRacingDividendEdit = editedValues.marketResults && editedValues.marketResults.outcomeResults && editedValues.marketResults.outcomeResults.length;
        const voidReasons = this.props.apiConstants.values.voidReasons || [];
        return (
            <RankResultSet
                hasEditedDividend={hasEditedDividend}
                disableRacingDividendEdit={disableRacingDividendEdit}
                shouldResetState={shouldResetChildComponents}
                disableResultEdit={disableResultEdit}
                data={marketResults}
                changeHandler={this._changeHandler}
                voidReasons={voidReasons}
                hasPermission={hasPermission}
            />
        )
    }

    _renderMarketResult() {
        const { marketResults } = this.state.marketDetails;
        return (
            <div className="result">
                <div>
                    {(marketResults.resultSet === 'STANDARD_RESULT_SET' || marketResults.resultSet === 'QUARTERBALL_RESULT_SET') && this._renderStandardResultSet()}
                    {(marketResults.resultSet === 'RANK_RESULT_SET') && this._renderRankResultSet()}
                </div>
            </div>
        )
    }

    _renderRule4Results() {
        const { rule4Results } = this.state.marketDetails;
        const { shouldResetChildComponents } = this.state;
        return (
            <Rule4Results shouldResetState={shouldResetChildComponents} changeHandler={this._changeHandler} data={rule4Results}/>
        )
    }

    _renderBookInfo() {
        const { bookInfo } = this.state.marketDetails;
        const { shouldResetChildComponents } = this.state;
        const placeTerms = this.props.apiConstants.values.placeTerms;
        return (
            <BookInfo shouldResetState={shouldResetChildComponents} changeHandler={this._changeHandler} data={bookInfo} placeTerms={placeTerms}/>
        )
    }

    _renderStakeDistributionIndicators() {
        const { stakeDistributionIndicators } = this.state.marketDetails;
        const { shouldResetChildComponents } = this.state;
        const liabilityIndicatorsActions = this.props.apiConstants.values.liabilityIndicatorsActions || [];
        const wagerLimitsGroup = this.props.apiConstants.values.wagerLimitsGroups || [];
        return (
            <StakeDistributionIndicators
                shouldResetState={shouldResetChildComponents}
                data={stakeDistributionIndicators}
                changeHandler={this._changeHandler}
                stakeTypes={objectToArray(filterTypes.STAKE_TYPES)} 
                wagerLimitsGroups={wagerLimitsGroup}
                liabilityIndicatorsActions={liabilityIndicatorsActions}/>
        )
    }

    _renderLiabilityIndicators() {
        const { liabilityIndicators } = this.state.marketDetails;
        const { shouldResetChildComponents } = this.state;
        const liabilityIndicatorsActions = this.props.apiConstants.values.liabilityIndicatorsActions || [];
        return (
            <LiabilityIndicators shouldResetState={shouldResetChildComponents} data={liabilityIndicators} liabilityIndicatorsActions={liabilityIndicatorsActions} changeHandler={this._changeHandler}/>
        )
    }

    _renderPriceAndWagerLimits() {
        const { pricesAndWagerLimits } = this.state.marketDetails;
        const { shouldResetChildComponents } = this.state;
        const outcomeWagerLimitsActions = this.props.apiConstants.values.outcomeWagerLimitsActions || [];
        const priceMargin = this._getLineItemToShow(pricesAndWagerLimits.priceMarginList) ? this._getLineItemToShow(pricesAndWagerLimits.priceMarginList).priceMargin : null;
        const editedOutcomeWagerLimits = this.state.editedValues.outcomeWagerLimits || {};
        return [
            <PriceAndWagerLimits
                key="wager-limits"
                shouldResetState={shouldResetChildComponents}
                lineId={this.state.lineId}
                data={pricesAndWagerLimits}
                lines={this._getLines()}
                book={priceMargin}
                onLineChange={this._handleSelectLineChange}
                onOutcomeClick={this._handleOutcomeClick}
                changeHandler={this._changeHandler}
                onPriceMarginChange={this._priceMarginChangeHandler}
                outcomeDisconnectionHandler={this._outcomeDisconnectionHandler}
                openModal={this.props.openModal}
                actions={outcomeWagerLimitsActions}/>,
            <ModalWindow
                key={'outcomeWagerLimits'}
                onClose={(e)=> this.props.closeModal('outcomeWagerLimits')}
                title="Outcome Wager Limits"
                closeButton={false}
                className="phxcom-modal wager-limits"
                name="outcomeWagerLimits"
                isVisibleOn={this.props.modals.outcomeWagerLimits}
                shouldCloseOnOverlayClick={false}>
                <h4>Update Wager Limits - {this.state.runnerGroupDesc} </h4>
                <OutcomeWagerLimits
                    editedValues={editedOutcomeWagerLimits}
                    changeHandler={this._outcomeWagerLimitsGroupChangeHandler}
                />
            </ModalWindow>
        ]
    }

    _handleSelectMarketChange(e) {
        this.props.setEditMarketSelectedMarketId(e.target.value);
        this.props.fetchEditMarketDetails(e.target.value);
    }

    _handleSelectLineChange(e) {
        this.setState({
            lineId: Number(e.target.value)
        });
    }

    _handleOutcomeClick(outcomeId, desc) {
        this.setState({runnerGroupDesc: desc});
        this.props.openModal('outcomeWagerLimits');
        this.props.setSelectedOutcomeId(outcomeId);
    }

    _save () {
        this.props.closeModal('editMarketPriceMarginBelowMinumum');
        const request = this._createEditMarketRequest();
        const marketId = this.props.editMarket.selectedMarketId;
        if(this._shouldCheckMarketFeedInfo) {
            this.props.openModal('editMarketMarketFeedInfo');
        } else {
            this.props.saveEditMarketChanges(marketId, request);
        }
        this.setState({
            showSaveFailedError: false
        });
    }

    _handleSaveClick() {
        if (this.state.isPriceMarginBelowMinimum) {
            this.props.openModal('editMarketPriceMarginBelowMinumum');
            return false;
        }
        const request = this._createEditMarketRequest();
        const marketId = this.props.editMarket.selectedMarketId;
        if(this._shouldCheckMarketFeedInfo) {
            this.props.openModal('editMarketMarketFeedInfo');
        } else {
            this.props.saveEditMarketChanges(marketId, request);
        }
        this.setState({
            showSaveFailedError: false
        });
    }

    _handleSaveAndCloseClick() {
        this._shouldCloseAfterSave = true;
        this._handleSaveClick();
    }

    _handleResetClick() {
        this._resetForm();
        this.props.fetchEditMarketDetails(this.props.editMarket.selectedMarketId);
        this.setState({
            showSaveFailedError: false
        });
    }

    _handleCancelClick() {
        if(this.props.editMarket.isSavingChanges) {
            return
        }
        this.props.closeModal('editMarket');
    }

    _renderMarketSelectDropdown() {
        const marketOptions = this.props.editMarket.markets.map((market)=> {
            return {
                desc: `${market.desc} - ${market.period}`,
                value: market.id,
                key: market.key
            }
        });
        return(
            <section className="select-market text-large">
                <label>
                    Select Market
                    <SelectBox className="status" onChange={this._handleSelectMarketChange} value={this.props.editMarket.selectedMarketId} name="market" options={marketOptions}/>
                </label>
            </section>
        )
    }

    _renderLoadingIndicator() {
        return(
            <div className="loading tcenter">
                <i className="phxico phx-spinner phx-spin"></i>
            </div>
        )
    }

    _renderSavingError() {
        return (
            <div className="error-container tcenter">
                <div className="error">
                    <span>
                        Failed to save changes.
                    </span>
                </div>
            </div>
        )
    }

    _priceMarginChangeHandler (priceMargin) {
        if (priceMargin !== '0.00' && priceMargin > 0 && priceMargin < 103) {
            if (!this.state.isPriceMarginBelowMinimum) {
                this.setState({isPriceMarginBelowMinimum: true});
            }
        } else {
            if (this.state.isPriceMarginBelowMinimum) {
                this.setState({isPriceMarginBelowMinimum: false});
            }
        }
    }

    render() {
        const { isFetchingEditMarketDetails, fetchingEditMarketDetailsFailed, savingChangesFailed, isSavingChanges } = this.props.editMarket;
        const marketFromId = this._getSelectedMarketFromId(this.props.editMarket.selectedMarketId)
        let marketDesc = marketFromId ? marketFromId.rawDesc || marketFromId.desc : ''
        marketDesc = <p className="market-desc">- {marketDesc}</p>;
        const disableSave = this.props.editMarket.isSavingChanges || !Object.keys(this.state.editedValues).length;
        const disableReset = !Object.keys(this.state.editedValues).length || isSavingChanges;
        const disableClose = isSavingChanges;
        let containerClass = "edit-market-container text-medium padding-medium";
        containerClass += ` line-${this.state.lineId}`;
        if(fetchingEditMarketDetailsFailed) {
            return (
                <div className={containerClass}>
                    {this._renderMarketSelectDropdown()}
                    <div className="errror-container tcenter">
                        <p>
                            Failed to load market details. <button onClick={this._handleResetClick}>Retry</button>
                        </p>
                    </div>
                </div>
            )
        } else if(isFetchingEditMarketDetails || !Object.keys(this.state.marketDetails).length) {
            return (
                <div className="padding-medium">    
                    {this._renderMarketSelectDropdown()}
                    {this._renderLoadingIndicator()}
                </div>
            )
        } else if(!isFetchingEditMarketDetails && !!Object.keys(this.state.marketDetails).length && !fetchingEditMarketDetailsFailed) {
            return (
                <div className={containerClass}>
                    {this._renderMarketSelectDropdown()}
                    {/*savingChangesFailed && this.state.showSaveFailedError && this._renderSavingError()*/}
                    {this.props.editMarket.isSavingChanges &&
                    <div className="loading-container tcenter">
                        {this._renderLoadingIndicator()}
                        <span className="text-bold text-large">Saving Changes</span>
                    </div>}
                    <div className="button-group fright ftop">
                        <button disabled={disableSave} onClick={this._handleSaveClick}>
                            {this.props.editMarket.isSavingChanges ? 'Saving' : 'Save'} 
                        </button>
                        <button disabled={disableSave} onClick={this._handleSaveAndCloseClick}>
                            {this.props.editMarket.isSavingChanges ? 'Saving' : 'Save and Close'} 
                        </button>
                        <button disabled={disableReset} onClick={this._handleResetClick}>
                            Reset Changes
                        </button>
                        <button disabled={disableClose} onClick={this._handleCancelClick}>
                            Close
                        </button>
                    </div>
                    <section className="market-info">
                        <TabComponent items={this._getTabItems()}/>
                    </section>
                    {this._renderMarketLineConfiguration()}
                    <div className="clearfix">
                        <div className="fleft half">
                            {this._renderMarketDetails()}
                            {this._renderEventDetails()}
                        </div>
                        <div className="fright half">
                            {this._renderEventInfo()}
                        </div>
                    </div>
                    <ModalWindow
                        key={'editMarketMarketFeedInfo'}
                        onClose={(e)=> this.props.closeModal('editMarketMarketFeedInfo')}
                        title="Market Feed Disconnection"
                        closeButton={true}
                        className="medium scrollable-body"
                        name="editMarketMarketFeedInfo"
                        isVisibleOn={this.props.modals.editMarketMarketFeedInfo}
                        shouldCloseOnOverlayClick={true}>
                        <MarketFeedInfo
                            marketIds={[this.props.editMarket.selectedMarketId]}
                            marketIdsToIgnore={this._marketIdsToIgnoreInMarketFeed}
                            lineIdsToIgnore={this._lineIdsToIgnoreInMarketFeed}
                            onClose={(e)=> {
                                this.props.closeModal('editMarketMarketFeedInfo')}
                            }
                            onDisconnect={()=>{
                                const request = this._createEditMarketRequest();
                                const marketId = this.props.editMarket.selectedMarketId;
                                this.props.saveEditMarketChanges(marketId, request);
                                this.props.closeModal('editMarketMarketFeedInfo');
                            }}/>
                    </ModalWindow>
                    <ModalWindow
                        key={'editMarketPriceMarginBelowMinumum'}
                        onClose={(e)=> this.props.closeModal('editMarketPriceMarginBelowMinumum')}
                        title="Price margin below minimum"
                        closeButton={true}
                        className="medium scrollable-body"
                        name="editMarketPriceMarginBelowMinumum"
                        isVisibleOn={this.props.modals.editMarketPriceMarginBelowMinumum}
                        shouldCloseOnOverlayClick={true}>
                        <PriceMargin
                            marketDesc={marketDesc}
                            closeModal={this.props.closeModal}
                            save={this._save}
                        />
                    </ModalWindow>
                    <ModalWindow
                        key={'handicapValidFormats'}
                        onClose={(e)=> this.props.closeModal('handicapValidFormats')}
                        title="Valid Handicap value formats"
                        closeButton={true}
                        className="medium scrollable-body"
                        name="handicapValidFormats"
                        isVisibleOn={this.props.modals.handicapValidFormats}
                        shouldCloseOnOverlayClick={true}>
                        <HandicapValidFormats closeModal={(e)=> this.props.closeModal('handicapValidFormats')}/>
                    </ModalWindow>
                </div>
            )
        }
    }
}


export default connect(mapStateToProps, mapDispatchToProps)(mapPermissionsToProps(EditMarket));
