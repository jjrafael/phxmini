import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { fetchEventDetails, changeMarketStatus, abandonMarkets } from 'actions/marketStateDetails';
import { formatDateTimeString, formatISODateString,  getMarketStatusFromFlags, getActiveEventInSportsTree } from 'utils';
import TabComponent from 'components/Tabs';
import _ from 'lodash';
import {
    fetchMarketTypes,
    createNewMarkets,
    fetchMarketPeriods,
    resetNewMarketPayload,
    setHideOutcomesOnCreateOption,
    updateNewMarketFilters,
    resetNewMarketFilters,
    fetchGameResultMarketTypes,
    fetchGameResultPeriods
} from '../../EventMarkets/actions';
import { fetchGameResultsPeriodPoints, updateGameResultsPeriodPoints } from '../actions';
import { objectToArray, formatFilterDates } from 'utils';
import EventScoreContainer from './EventScoreContainer';
import EventResultContainer from './EventResultContainer';

class GameResultsContainer extends React.Component {
    constructor(props) {
        super(props);
    }

    componentWillMount() {
        let {  eventDetails, getActiveEventInSportsTree, sportsTree, fetchGameResultsPeriodPoints, fetchGameResultMarketTypes, fetchGameResultPeriods } = this.props;
        this.setState({
            activeEventSportsTree : getActiveEventInSportsTree(sportsTree)
        })
        fetchGameResultsPeriodPoints(eventDetails.id);

      if(_.isEmpty(this.props.gameResults.periodPoints)) {
        fetchGameResultMarketTypes(eventDetails.id);
        fetchGameResultPeriods(eventDetails.id);
      }
    }

    componentDidMount() {
        // this._fetchEventMarkets();
    }
    render() {
        const { marketStateDetails, newMarketFilters, eventDetails, sportsTree } = this.props;
        const { isFetchingEventDetails, fetchingEventDetailsFailed } = marketStateDetails;
        const { activeEventSportsTree } = this.state;

        if(eventDetails) {
            const { startDateTime } = eventDetails;
            // newMarketFilters.defaultFilters.push({
            //     fullDescription : "Others"
            // })

            return (
                <div className="tcenter">   
                {
                    Object.keys(eventDetails).length ? <div className="">
                        <h4 className="tcenter">
                            {activeEventSportsTree.description} {eventDetails.description}<br/>
                            {formatISODateString(startDateTime)}
                        </h4>
                        <div className="main-inner">
                            <TabComponent
                            className="inner-tab"
                            onSelect={this._onTabSelect}
                            items={[{
                                    title: 'Event Results',
                                    content: <div><EventResultContainer /></div>
                                },{
                                    title: 'Event Scores',
                                    content: <div><EventScoreContainer /></div>
                                }]}/>
                        </div>
                    </div> : <h4 className="tcenter"> - No Game Results Found - </h4>
                }
                </div>
            )
        } else if(isFetchingEventDetails === false && fetchingEventDetailsFailed) {
            return <p className="tcenter">No events with such ID exist</p>
        } else {
            return (
                <div className="loading tcenter">
                    <i className="phxico phx-spinner phx-spin"></i>
                </div>
            )
        }
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
        gameResults: state.gameResults,
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
        getActiveEventInSportsTree,
        fetchGameResultsPeriodPoints,
        fetchGameResultMarketTypes,
        fetchGameResultPeriods,

    }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(GameResultsContainer);
