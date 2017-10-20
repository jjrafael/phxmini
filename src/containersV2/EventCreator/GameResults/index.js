import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { fetchEventDetails, changeMarketStatus, abandonMarkets } from 'actions/marketStateDetails';
import { formatDateTimeString, formatISODateString,  getMarketStatusFromFlags, getActiveEventInSportsTree } from 'utils';
import TabComponent from 'components/Tabs';

import GameResultsContainer from './containers/GameResultsContainer';

import {
    fetchMarketTypes,
    createNewMarkets,
    fetchMarketPeriods,
    resetNewMarketPayload,
    setHideOutcomesOnCreateOption,
    updateNewMarketFilters,
    resetNewMarketFilters
} from '../EventMarkets/actions';
import { objectToArray, formatFilterDates } from 'utils';

class GameResults extends React.Component {
    constructor(props) {
        super(props);
    }

    // componentWillMount() {
    //     let { fetchMarketTypes, fetchMarketPeriods, eventDetails, sportsTree } = this.props;
    //     this.setState({
    //         activeEventSportsTree : this.props.getActiveEventInSportsTree(sportsTree)
    //     })
    //     fetchMarketTypes(eventDetails.id);
    //     fetchMarketPeriods(eventDetails.id);
    // }

    componentDidMount() {
        // this._fetchEventMarkets();
    }

    // componentWillUpdate(nextProps){
    //     // if (prevProps.prevProps && this.props.isFetchingMarketTypes === "false" && prevProps.isFetchingMarketPeriods && this.props.isFetchingMarketPeriods == "false") {
    //     //     this._generateFilters(this.props);
    //     // }
    //     if (this.props.marketPeriods.length === 0 && nextProps.marketPeriods.length) {
    //         this._generateFilters(nextProps);
    //     }
    //     if (this.props.marketTypes.length === 0 && nextProps.marketTypes.length && nextProps.marketPeriods.length) {
    //         this._generateFilters(nextProps);
    //     }
    // }
    // _generateFilters (props) {
    //     let { marketPeriods, marketTypes, newMarketFilters, updateNewMarketFilters } = props;
    //     let filteredMarketTypes = newMarketFilters.filteredMarketTypes;
    //     let periodTypeIds = [];
    //     let periodIds = [];
    //     let defaultFilters = marketPeriods.filter(period => period.defaultView).sort((a, b) => {
    //         return Number(a.lookupCode) - Number(b.lookupCode);
    //     });
    //     let defaultFilter = defaultFilters[0];
    //     if (defaultFilter) {
    //         filteredMarketTypes = marketTypes.filter(marketType => {
    //             return marketType.periodTypeId === defaultFilter.periodType.id
    //         })
    //         periodTypeIds = [defaultFilter.periodType.id];
    //         periodIds = [defaultFilter.id];
    //     }
    //     updateNewMarketFilters({filteredMarketTypes, defaultFilters, defaultFilter, periodTypeIds, periodIds});
    // }

    render() {
       return <GameResultsContainer />
    }
}

function mapStateToProps(state) {
    return {
        eventDetails: state.eventCreatorEvent.event,
        user: state.user,
        riskParameters: state.riskParameters,
        riskData: state.riskData,
        modals: state.modals,
        apiConstants: state.apiConstants,
        eventPathTree: state.eventPathTree,
        sportsTree: state.sportsTree,
        event: state.eventCreatorEvent,
        marketStateDetails: state.marketStateDetails,
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
        newMarketFilters: state.eventCreatorEventMarkets.newMarketFilters,
        marketStatusFilter: state.sportsTree.marketStatusFilter,
    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({ 
        fetchEventDetails,
        fetchMarketTypes,
        createNewMarkets,
        fetchMarketPeriods,
        resetNewMarketPayload,
        setHideOutcomesOnCreateOption,
        updateNewMarketFilters,
        resetNewMarketFilters,
        formatISODateString,
        getActiveEventInSportsTree
    }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(GameResults);
