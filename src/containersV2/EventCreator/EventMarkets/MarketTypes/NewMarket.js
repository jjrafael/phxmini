import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { makeIterable, selectValidProps } from 'phxUtils';
import { toastr } from 'phxComponents/toastr/index';
import MarketType from './MarketType';
import { paths } from '../../App/constants';
import MarketFilters from './MarketFilters/index';
import { marketPropsThatIsArray, validNewMarketProps } from '../constants';
import {
    fetchMarketTypes,
    createNewMarkets,
    fetchMarketPeriods,
    resetNewMarketPayload,
    setHideOutcomesOnCreateOption,
    updateNewMarketFilters,
    resetNewMarketFilters
} from '../actions';
import LoadingIndicator from 'phxComponents/loadingIndicator';

const mapStateToProps = (state, ownProps) => {
    return {
        marketTypes: state.eventCreatorEventMarkets.marketTypes,
        marketPlayers: state.eventCreatorEventMarkets.marketPlayers,
        marketPeriods: state.eventCreatorEventMarkets.marketPeriods,
        isCreatingNewMarkets: state.eventCreatorEventMarkets.isCreatingNewMarkets,
        isCreatingNewMarketsFailed: state.eventCreatorEventMarkets.isCreatingNewMarketsFailed,
        isFetchingMarketPeriods: state.eventCreatorEventMarkets.isFetchingMarketPeriods,
        isFetchingMarketPeriodsFailed: state.eventCreatorEventMarkets.isFetchingMarketPeriodsFailed,
        isFetchingMarketTypes: state.eventCreatorEventMarkets.isFetchingMarketTypes,
        isFetchingMarketTypesFailed: state.eventCreatorEventMarkets.isFetchingMarketTypesFailed,
        isFetchingMarketPlayers: state.eventCreatorEventMarkets.isFetchingMarketPlayers,
        isFetchingMarketPlayersFailed: state.eventCreatorEventMarkets.isFetchingMarketPlayersFailed,
        newMarketPayload: state.eventCreatorEventMarkets.newMarketPayload,
        hideOutcomesOnCreate: state.eventCreatorEventMarkets.hideOutcomesOnCreate,
        newMarketFilters: state.eventCreatorEventMarkets.newMarketFilters
    };
};

const mapDispatchToProps = (dispatch, ownProps) => {
    return bindActionCreators({
        fetchMarketTypes,
        createNewMarkets,
        fetchMarketPeriods,
        resetNewMarketPayload,
        setHideOutcomesOnCreateOption,
        updateNewMarketFilters,
        resetNewMarketFilters
    }, dispatch);
};

class NewMarket extends Component {
    constructor (props) {
        super(props);
        this._onClose = this._onClose.bind(this);
        this._onApplyClick = this._onApplyClick.bind(this);
        this._onApplyAndCloseClick = this._onApplyAndCloseClick.bind(this);
        this._generateFilters = this._generateFilters.bind(this);
        this._onCreate = this._onCreate.bind(this);
        this.shouldCloseOnCreate = false;
    }
    componentDidMount () {
        let { fetchMarketTypes, fetchMarketPeriods, event } = this.props;
        fetchMarketTypes(event.id);
        fetchMarketPeriods(event.id);
        if (this.props.marketPeriods) {
            this._generateFilters(this.props);
        }
    }
    componentWillUpdate (nextProps) {
        if (this.props.isCreatingNewMarkets && !nextProps.isCreatingNewMarkets && !nextProps.isCreatingNewMarketsFailed) {
            if (this.shouldCloseOnCreate) {
                this._onClose();
            } else {
                this.props.resetNewMarketPayload();
            }
        }
        if (this.props.marketPeriods.length === 0 && nextProps.marketPeriods.length) {
            this._generateFilters(nextProps);
        }
        if (this.props.marketTypes.length === 0 && nextProps.marketTypes.length && nextProps.marketPeriods.length) {
            this._generateFilters(nextProps);
        }
    }
    componentWillUnmount () {
        this.props.resetNewMarketPayload();
        this.props.setHideOutcomesOnCreateOption(false);
        this.props.resetNewMarketFilters();
    }
    _onClose() {
        this.props.onClose();
    }
    _onApplyClick () {
        this.shouldCloseOnCreate = false;
        this._onCreate();
    }
    _onApplyAndCloseClick () {
        this.shouldCloseOnCreate = true;
        this._onCreate();
    }
    _onCreate () {
        let { createNewMarkets, event, newMarketPayload, hideOutcomesOnCreate } = this.props;
        let marketTypesArray = [...makeIterable(newMarketPayload)];
        let errors = marketTypesArray.filter(e => e.checked && e.error);
        if (errors.length) {
            toastr.add({message: errors[0].error, type: 'ERROR'});
        } else {
            let finalPayload = marketTypesArray.filter(e => e.checked).map(val => {
                let payload = selectValidProps([val], validNewMarketProps)[0]; // remove unwanted props
                marketPropsThatIsArray.forEach(prop => {
                    if (payload[prop]) {
                        payload[prop] = payload[prop].filter(e => e.checked).map(val => {
                            let cleaned = {...val};
                            // remove unwanted props
                            delete cleaned.checked;  
                            delete cleaned.targetId;
                            return cleaned;
                        })
                    }
                })
                return payload;
            });
            createNewMarkets(event.id, finalPayload, hideOutcomesOnCreate);
        }
    }
    _generateFilters (props) {
        let { marketPeriods, marketTypes, newMarketFilters, updateNewMarketFilters } = props;
        let filteredMarketTypes = newMarketFilters.filteredMarketTypes;
        let periodTypeIds = [];
        let periodIds = [];
        let defaultFilters = marketPeriods.filter(period => period.defaultView).sort((a, b) => {
            return Number(a.lookupCode) - Number(b.lookupCode);
        });
        let defaultFilter = defaultFilters[0];
        if (defaultFilter) {
            filteredMarketTypes = marketTypes.filter(marketType => {
                return marketType.periodTypeId === defaultFilter.periodType.id
            })
            periodTypeIds = [defaultFilter.periodType.id];
            periodIds = [defaultFilter.id];
        }
        updateNewMarketFilters({filteredMarketTypes, defaultFilters, defaultFilter, periodTypeIds, periodIds});
    }
    render () {
        let { filteredMarketTypes, defaultFilters, periodTypeIds, periodIds } = this.props.newMarketFilters;
        let { marketTypes, marketPeriods,
            isFetchingMarketPeriods,
            isFetchingMarketTypes,
            isFetchingMarketPlayers,
            isFetchingMarketPeriodsFailed,
            isFetchingMarketTypesFailed,
            isFetchingMarketPlayersFailed
         } = this.props;
        let filteredPayload = [...makeIterable(this.props.newMarketPayload)].filter(e => e.checked);
        let content;
        if (isFetchingMarketPeriods || isFetchingMarketTypes || isFetchingMarketPlayers) {
            content = 'LOADING';
        } else if (isFetchingMarketPeriodsFailed || isFetchingMarketTypesFailed || isFetchingMarketPlayersFailed) {
            content = 'ERROR';
        } else if (filteredMarketTypes.length === 0) {
            content = 'NO_RESULTS';
        } else {
            content = 'CONTENT';
        }
        return (
            <div className="market-types-container">
                <MarketFilters />
                <div className="market-types">
                    {content === 'LOADING' &&
                        <div className="loading-container"><LoadingIndicator /></div>
                    }
                    {content === 'NO_RESULTS' &&
                        <div className="loading-container">No results found.</div>
                    }
                    {content === 'ERROR' &&
                        <div className="loading-container">Error loading.</div>
                    }
                    {content === 'CONTENT' &&
                        <div className="inner">
                            {filteredMarketTypes.map(market => {
                                let typeIds = `${market.marketType.id}/${market.periodTypeId}/${market.periodId}`;
                                let key = `${typeIds}/${market.opponentId}`;
                                return <MarketType
                                    key={key}
                                    id={key}
                                    typeIds={typeIds}
                                    market={market}
                                    playersArray={this.props.players}
                                />
                            })}
                        </div>
                    }
                    
                </div>
                <div className="button-group modal-controls">
                    <button type="button" onClick={this._onClose}>Cancel</button>
                    <button type="button" disabled={filteredPayload.length === 0} onClick={this._onApplyClick}>Apply</button>
                    <button type="button" disabled={filteredPayload.length === 0} onClick={this._onApplyAndCloseClick}>Apply and Close</button>
                </div>
            </div>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(NewMarket);