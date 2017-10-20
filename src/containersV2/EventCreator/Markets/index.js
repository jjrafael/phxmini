import React from "react";
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import checkPermission, { mapPermissionsToProps } from 'componentsV2/checkPermission/index';
import { permissionsCode } from 'containersV2/EventCreator/App/constants';
import { closeModal, openModal } from '../../../actions/modal';
import { fetchEventDetails, changeMarketStatus, abandonMarkets } from '../../../actions/marketStateDetails';
import { selectEventPathTreeSport, fetchEventPathTree, resetEventPathTree, fetchEventMarkets } from 'actions/eventPathTree';
import { formatDateTimeString, getMarketStatusFromFlags, makeIterable } from '../../../utils';
import { Field, reduxForm, Form, Fields } from 'redux-form';
import ModalWindow from '../../../components/modal';
import SelectBox from '../../../components/selectBox';
import filterTypes from 'constants/filterTypes';
import { objectToArray, formatFilterDates, formatISODateString, getActiveEventInSportsTree} from 'utils';
import { viewMarketStateDetails } from 'actions/marketStateDetails';
import { fetchRiskData } from 'actions/riskData';
import CutOffAndAutoOpenModal from './container/CutOffAndAutoOpenModal';
import ModalLoader from 'phxV2Components/ModalLoader/';

const Button = ({onClick, children, disabled}) => (
    <button disabled={disabled} onClick={onClick}>{children}</button>
);
const PermittedButton = checkPermission(Button);


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
        datesFilter: state.sportsTree.datesFilter,
        marketStatusFilter: state.sportsTree.marketStatusFilter,
    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({ 
        closeModal, 
        openModal, 
        fetchEventDetails, 
        changeMarketStatus, 
        abandonMarkets, 
        fetchEventMarkets, 
        viewMarketStateDetails, 
        fetchRiskData,
        getActiveEventInSportsTree
    }, dispatch);
}

class MarketStateDetails extends React.Component {
    constructor(props) {
        super(props);
        this._processMarketsData = this._processMarketsData.bind(this);
        this._handleModalAbandonMarketClick = this._handleModalAbandonMarketClick.bind(this);
        this._handleVoidReasonIdChange = this._handleVoidReasonIdChange.bind(this);
        this._handleVoidReasonNotesChange = this._handleVoidReasonNotesChange.bind(this);
        this._handleAbandonSubmitClick = this._handleAbandonSubmitClick.bind(this);
        this._handleModalCutOffAndAutoOpenMarketClick = this._handleModalCutOffAndAutoOpenMarketClick.bind(this);
        this._fetchEventMarkets = this._fetchEventMarkets.bind(this);
        this._getSportsTreeParams = this._getSportsTreeParams.bind(this);
        this._loadMarketStateDetails = this._loadMarketStateDetails.bind(this);
        this._clearMarketchecks =  this._clearMarketchecks.bind(this);
        this._abandonMarketReasons = [
            {
                desc: 'Outlet - Cashier Error',
                value: 1
            },
            {
                desc: 'Telebet Agent Error',
                value: 2
            },
            {
                desc: 'System Error',
                value: 3
            },
            {
                desc: 'Trading Error',
                value: 4
            },
            {
                desc: 'Non-runner',
                value: 5
            },
            {
                desc: 'Vovalue due to events in the game or fixture cancellation',
                value: 6
            },
            {
                desc: 'Outlet - System Error',
                value: 7
            },
        ]
        this.state = {
            marketGroups: {},
            periods: {},
            marketKeysChecked: [],
            abandonMarketReasonNote: '',
            abandonMarketReasonId: 1,
            selectedSport: props.apiConstants.values.riskSports[0],
            marketStatusIds: filterTypes.STATUS.ANY_STATUS.value,
            filterDate: filterTypes.DATES.NEXT_7_DAYS,
            pageSize: null,
            activeEventSportsTree : {},
            marketModal : null,
            hasCheckedAndClosed: true
        }
    }

    _fetchEventMarkets() {
        const { selectedEventId } = this.props.marketStateDetails;
        if(selectedEventId) {
            this.props.fetchEventDetails();
        }
    }

    _getSportsTreeParams () {
        const { datesFilter, marketStatusFilter } = this.props;
        const { fromDate, toDate } = formatFilterDates(datesFilter);
        return { fromDate, toDate, marketStatusIds: marketStatusFilter }
    }

    _loadMarketStateDetails() {
        const {event} = this.props.event;
        this.props.fetchRiskData({code: `e${event.id}`, ...this._getSportsTreeParams()});
        this.props.viewMarketStateDetails(`e${event.id}`);
    }

    _clearMarketchecks() {
        var marketKeys = [];

        for(var key in this.state.marketGroups) {
            var marketGroup = this.state.marketGroups[key];
            marketGroup.markets.forEach((market)=> {
                const status = getMarketStatusFromFlags(market.flags);
                if(['open', 'suspended', 'closed'].indexOf(status.toLowerCase()) > -1) {
                    marketKeys.push(market.key);
                }
            });
        }
        this._toggleMarkets(marketKeys, false);
    }
    componentWillMount() {
        let { sportsTree } = this.props;
        this.setState({
            activeEventSportsTree : this.props.getActiveEventInSportsTree(sportsTree)
        });
        this._loadMarketStateDetails();
    }

    componentDidMount() {
        this._fetchEventMarkets();
    }

    componentDidUpdate(prevProps, prevState) {
        if(prevProps.marketStateDetails.isFetchingEventDetails && this.props.marketStateDetails.isFetchingEventDetails === false) {
            this._processMarketsData();
        }

        if(prevProps.riskData.isLoadingTree && this.props.riskData.isLoadingTree === false) {
            this._fetchEventMarkets();
        }

        if(prevProps.marketStateDetails.isChangingStatus && this.props.marketStateDetails.isChangingStatus === false) {
            this._clearMarketchecks();
            this._loadMarketStateDetails();
             
        }

        if(prevProps.marketStateDetails.isAbandoningMarkets && this.props.marketStateDetails.isAbandoningMarkets === false) {
            this._clearMarketchecks();
            this.props.closeModal('abandonMarket');
            this._fetchEventMarkets();
            this._loadMarketStateDetails();

        }
    }

    render() {
        const { marketStateDetails, riskData, eventDetails } = this.props;
        const { isFetchingEventDetails, isChangingStatus,  fetchingEventDetailsFailed, isUpdatingCutOffAndAutoOpenDateTime } = marketStateDetails;
        const {isUpdatingTree } = riskData;
        const { activeEventSportsTree } = this.state;

        if(isFetchingEventDetails === false && eventDetails) {
            const { startDateTime } = eventDetails;
            return (
                <div className="tcenter">   
                {
                    Object.keys(eventDetails).length ? <div className="tcenter padding-medium">
                        <h4 className="tcenter">
                            {activeEventSportsTree.description} {eventDetails.description}<br/>
                            {formatISODateString(startDateTime)}
                        </h4>
                        {this._renderMarketStateActions()}
                        {this._renderMarketStateTable()}
                        {this._renderAbandonMarketModal()}

                        <CutOffAndAutoOpenModal {...this.props} periods={this.state.periods} marketModal={this.state.marketModal}/>
                    </div> : <h4 className="tcenter"> - No Markets Found - </h4>
                }
                {
                    (isChangingStatus || isUpdatingTree || isUpdatingCutOffAndAutoOpenDateTime) ? <ModalLoader/> : null
                }
                </div>
            )
        } else if(isFetchingEventDetails === false && fetchingEventDetailsFailed) {
            return <p className="tcenter">No events with such ID exist</p>

        } 
        else 
            return (
                <div className="loading tcenter">
                    <i className="phxico phx-spinner phx-spin"></i>
                </div>
            );
    }

    _toggleMarkets(marketKeys, value) {
        const { marketKeysChecked } = this.state;
        let newMarketKeysChecked;
        if(value) {
            const marketKeysFiltered = marketKeys.filter((marketKey) => marketKeysChecked.indexOf(marketKey) === -1);
            newMarketKeysChecked = [ ...marketKeysChecked, ...marketKeysFiltered ];
            this.setState({ marketKeysChecked:  newMarketKeysChecked})
        } else {
            newMarketKeysChecked = marketKeysChecked.filter((marketKey) => marketKeys.indexOf(marketKey) === -1);
            this.setState({ marketKeysChecked:  newMarketKeysChecked})
        }

        let hasCheckedAndClosed = false;
        for (let group of makeIterable(this.state.marketGroups)) {
            for (let market of group.markets) {
                if (newMarketKeysChecked.includes(market.key)) { // checked first if checked
                    if (market.flags && market.flags.map(flag => flag.toUpperCase()).includes('CLOSED')) { // check if closed
                        hasCheckedAndClosed = true;
                        break;
                    }
                }
            }
            if (hasCheckedAndClosed) { break; }
        }
        this.setState({ hasCheckedAndClosed:  hasCheckedAndClosed})
    }

    _getMarketFromKey(marketKey) {
        let marketFound = null;
        for(var key in this.state.marketGroups) {
            const marketGroup = this.state.marketGroups[key];
            marketGroup.markets.forEach((market)=> {
                if(market.key === marketKey) {
                    marketFound = market;
                }
            });
        }
        return marketFound;
    }


    _processMarketsData() {
        let periods = {};
        let marketGroups = {};
        if(this.props.marketStateDetails.eventDetails.children) {
            this.props.marketStateDetails.eventDetails.children.forEach((market)=> {
                const isSpreadMarket = ['MONEY_LINE', 'PROPOSITION'].indexOf(market.marketTypeGroup) === -1;
                const spread = market.children[0].spread;
                if(!isSpreadMarket && !marketGroups[market.desc]) {
                    marketGroups[market.desc] = {
                        desc: market.desc,
                        markets: [ market ]
                    }
                } else if(!isSpreadMarket && marketGroups[market.desc]) {
                    marketGroups[market.desc].markets.push(market);
                } else if(isSpreadMarket && !marketGroups[market.desc + '[' +market.key+ ']']) {
                    marketGroups[market.desc + '[' +market.key+ ']'] = {
                        desc: market.desc,
                        markets: [ market ]
                    }
                } else if(isSpreadMarket && marketGroups[market.desc + '[' +market.key+ ']']) {
                    marketGroups[market.desc + '[' +market.key+ ']'].markets.push(market);
                }
                if(!periods[market.period]) {
                    periods[market.period] = {
                        desc: market.period,
                        marketKeys: [ market.key ]
                    }
                } else {
                    periods[market.period].marketKeys.push(market.key);
                }
            });
            this.setState({marketGroups,periods});
        }
    }

    _renderPeriodHeaders() {
        let periodComponents = [];
        for(var key in this.state.periods) {
            const period = this.state.periods[key];
            const filteredPeriodMarketKeys = period.marketKeys.filter((marketKey)=> {
                const market = this._getMarketFromKey(marketKey);
                const status = getMarketStatusFromFlags(market.flags);
                return ['open', 'suspended', 'closed'].indexOf(status.toLowerCase()) > -1;
            });
            periodComponents.push(
                <th key={key}>
                    <label>
                        {!!filteredPeriodMarketKeys.length && this._renderMarketStateCheckbox(filteredPeriodMarketKeys)}
                        {period.desc}
                    </label>
                </th>
            )
        }
        return periodComponents
    }

    _renderPeriodCells(marketGroup) {
        let marketPeriodCellComponents = [];
        for(var key in this.state.periods) {
            const period = this.state.periods[key];
            let isInPeriod = false;
            let marketInPeriod = null;
            marketGroup.markets.forEach((market) => {
                if(period.marketKeys.indexOf(market.key) > -1) {
                    isInPeriod = true;
                    marketInPeriod = market;

                }
            });
            if(isInPeriod) {
                const status = getMarketStatusFromFlags(marketInPeriod.flags);
                const showCheckBox = ['open','suspended','closed'].indexOf(status.toLowerCase() ) > -1;
                marketPeriodCellComponents.push(
                    <td key={key} className={getMarketStatusFromFlags(marketInPeriod.flags).toLowerCase()}>
                        <label>
                            {showCheckBox && this._renderMarketStateCheckbox([marketInPeriod.key])}
                            {getMarketStatusFromFlags(marketInPeriod.flags)}
                        </label>
                    </td>
                )
            } else {
                marketPeriodCellComponents.push(
                    <td key={key}>
                    </td>
                )
            }
        }
        return marketPeriodCellComponents;
    }

    _renderMarketStateCheckbox(markets) {
        const { marketKeysChecked } = this.state;
        let isChecked = [];
        markets.forEach((market) => {
            isChecked.push(marketKeysChecked.indexOf(market) > -1);
        });
        isChecked = isChecked.indexOf(false) === -1;
        return(
            <input type="checkbox" checked={isChecked} onChange={(e)=> this._toggleMarkets(markets, e.target.checked)}/>
        )
    }

    _renderMarketRows() {
        let marketRowComponents = [];
        for(var key in this.state.marketGroups) {
            var marketGroup = this.state.marketGroups[key];
            var marketKeys = [];
            marketGroup.markets.forEach((market)=> {
                const status = getMarketStatusFromFlags(market.flags);
                if(['open', 'suspended', 'closed'].indexOf(status.toLowerCase()) > -1) {
                    marketKeys.push(market.key);
                }
            });
            marketRowComponents.push(
                <tr key={key}>
                    <td>
                        <label>
                            {!!marketKeys.length && this._renderMarketStateCheckbox(marketKeys)}
                            {marketGroup.desc}
                        </label>
                    </td>
                    {this._renderPeriodCells(marketGroup)}
                </tr>
            )
        }
        return marketRowComponents;
    }

    _renderMarketStateTable() {
        const { marketGroups, periods } = this.state;
        let allMarketKeys = [];
        for(var key in marketGroups) {
            const marketGroup = marketGroups[key];
            const filteredMarketKeys = [];
            marketGroup.markets.forEach((market)=> {
                const status = getMarketStatusFromFlags(market.flags);
                if(['open', 'suspended', 'closed'].indexOf(status.toLowerCase()) > -1) {
                    filteredMarketKeys.push(market.key);
                }
            });
            allMarketKeys = [ ...allMarketKeys, ...filteredMarketKeys ];
        };
        return(
            <div className="market-state-table-container">
                <table className="market-state-table">
                    <thead>
                        <tr>
                            <th>
                                <label>
                                    {!!allMarketKeys.length && this._renderMarketStateCheckbox(allMarketKeys)}
                                    Market Type and Instance #
                                </label>
                            </th>
                            {this._renderPeriodHeaders()}
                        </tr>
                    </thead>
                    <tbody>
                        {this._renderMarketRows()}
                    </tbody>
                </table>
            </div>
        )
    }

    _renderMarketStateActions() {
        const { marketKeysChecked, hasCheckedAndClosed } = this.state;
        const { permissions } = this.props;
        const disableActions = marketKeysChecked.length === 0;
        let disableOpenButton = false;
        if (!permissions.includes(permissionsCode.ALLOW_CLOSED_MARKET_REOPENING) && hasCheckedAndClosed) {
            disableOpenButton = true;
        }
        return (
            <div className="market-state-actions">
                <div className="button-group">
                    <PermittedButton actionIds={[permissionsCode.CHANGE_GAME_EVENT_DATE_TIME]} onClick={(e)=>this._handleModalCutOffAndAutoOpenMarketClick("CUTOFF")}>
                        <span className="icon phx-cut-off" /> Cut-Off
                    </PermittedButton>
                    <button onClick={(e)=>this._handleModalCutOffAndAutoOpenMarketClick("AUTOOPEN")}>
                        <span className="icon phx-auto-open" /> Auto Open
                    </button>
                    <button onClick={(e)=>this._fetchEventMarkets()}>
                        <span className="icon phx-refresh text-yellow" /> Refresh
                    </button>
                    <button
                        disabled={disableOpenButton || disableActions}
                        onClick={disableOpenButton ? () => {} : (e)=>this._handleChangeStatusButtonClick('OPEN')}>
                        <span className="icon phx-open text-success" /> Open
                    </button>
                    <button disabled={disableActions} onClick={(e)=>this._handleChangeStatusButtonClick('SUSPENDED')}>
                        <span className="icon phx-suspended text-yellow" /> Suspend
                    </button>
                    <button disabled={disableActions} onClick={this._handleModalAbandonMarketClick}>
                        <span className="icon phx-abandon text-error" /> Abandon
                    </button>
                    <button disabled={disableActions} onClick={(e)=>this._handleChangeStatusButtonClick('CLOSED')}>
                        <span className="icon phx-closed text-error" /> Close
                    </button>
                </div>
            </div>
        )
    }

    _renderAbandonMarketModal() {
        const { abandonMarketReasonId, abandonMarketReasonNote } = this.state;
        const { isAbandoningMarkets } = this.props.marketStateDetails;
        const disableAbandonSubmit = abandonMarketReasonNote.length === 0 || isAbandoningMarkets;
        return (
            <ModalWindow
                className="small"
                title="Abandon a market"
                name="abandonMarket"
                isVisibleOn={this.props.modals.abandonMarket}
                shouldCloseOnOverlayClick={true}>
                <div className="abandon-market-modal-container content">
                    <div className="tcenter top"><h4>Abandon Market</h4></div>
                    <div className="content-details padding-small body">
                        <p>
                            Please select a reason for voiding outcome(s).
                        </p>
                        <SelectBox
                            disabled={false}
                            className="abandon"
                            onChange={this._handleVoidReasonIdChange}
                            value={abandonMarketReasonId}
                            name="abandon"
                            options={this._abandonMarketReasons}/>
                        <div>
                            <label>Notes* <input type="text" value={abandonMarketReasonNote} onChange={this._handleVoidReasonNotesChange} /></label>
                        </div>
                    </div>
                    <div className="bottom button-group">
                        <button onClick={(e)=> {
                            this.props.closeModal('abandonMarket');
                            this.setState({abandonMarketReasonId: 1, abandonMarketReasonNote: ''})
                        }}>Cancel</button>
                        <button disabled={disableAbandonSubmit} onClick={this._handleAbandonSubmitClick}>
                            Save
                        </button>
                    </div>
                </div>
            </ModalWindow>
        )
    }

    _handleChangeStatusButtonClick(status) {
        this.props.changeMarketStatus(this.state.marketKeysChecked, status);
    }


    _handleModalCutOffAndAutoOpenMarketClick(modal) {
        this.setState({marketModal : modal})
        this.props.openModal('cutOffAndAutoOpenMarket');
    }
    _handleModalAbandonMarketClick() {
        this.props.openModal('abandonMarket');
    }

    _handleVoidReasonIdChange(e) {
        this.setState({ abandonMarketReasonId: Number(e.target.value) });
    }

    _handleVoidReasonNotesChange(e) {
        this.setState({ abandonMarketReasonNote: e.target.value });
    }

    _handleAbandonSubmitClick(e) {
        const { marketKeysChecked, abandonMarketReasonId, abandonMarketReasonNote } = this.state;
        this.props.abandonMarkets(marketKeysChecked, abandonMarketReasonId, abandonMarketReasonNote);
    }
}


export default connect(mapStateToProps, mapDispatchToProps)(mapPermissionsToProps(MarketStateDetails));