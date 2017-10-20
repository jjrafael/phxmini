import React from "react";
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { closeModal, openModal } from '../actions/modal';
import { fetchEventDetails, changeMarketStatus, abandonMarkets } from '../actions/marketStateDetails';
import { formatDateTimeString, getMarketStatusFromFlags } from '../utils';
import ModalWindow from '../components/modal';
import SelectBox from '../components/selectBox';

function mapStateToProps(state) {
    return {
        user: state.user,
        riskParameters: state.riskParameters,
        riskData: state.riskData,
        modals: state.modals,
        marketStateDetails: state.marketStateDetails
    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({ closeModal, openModal, fetchEventDetails, changeMarketStatus, abandonMarkets }, dispatch);
}

class MarketStateDetails extends React.Component {
    constructor(props) {
        super(props);
        this._processMarketsData = this._processMarketsData.bind(this);
        this._handleModalAbandonMarketClick = this._handleModalAbandonMarketClick.bind(this);
        this._handleVoidReasonIdChange = this._handleVoidReasonIdChange.bind(this);
        this._handleVoidReasonNotesChange = this._handleVoidReasonNotesChange.bind(this);
        this._handleAbandonSubmitClick = this._handleAbandonSubmitClick.bind(this);
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
            abandonMarketReasonId: 1
        }
    }

    componentDidMount() {
        const { selectedEventId } = this.props.marketStateDetails;
        if(selectedEventId) {
            this.props.fetchEventDetails();
        }
    }

    componentDidUpdate(prevProps, prevState) {
        if(prevProps.marketStateDetails.isFetchingEventDetails && this.props.marketStateDetails.isFetchingEventDetails === false) {
            this._processMarketsData();
        }
        if(prevProps.marketStateDetails.isAbandoningMarkets && this.props.marketStateDetails.isAbandoningMarkets === false) {
            this.props.closeModal('abandonMarket');
        }
    }

    render() {
        const { marketStateDetails } = this.props;
        const { eventDetails, isFetchingEventDetails, fetchingEventDetailsFailed } = marketStateDetails;
        if(isFetchingEventDetails === false && eventDetails) {
            const { pdesc, desc, start } = eventDetails;
            return (
                <div className="tcenter">
                    <h4 className="tcenter">
                        {pdesc} {desc}<br/>
                        {formatDateTimeString(start)}
                    </h4>
                    {this._renderMarketStateActions()}
                    {this._renderMarketStateTable()}
                    {this._renderAbandonMarketModal()}
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

    _toggleMarkets(marketKeys, value) {
        const { marketKeysChecked } = this.state;
        if(value) {
            const marketKeysFiltered = marketKeys.filter((marketKey) => marketKeysChecked.indexOf(marketKey) === -1);
            this.setState({ marketKeysChecked: [ ...marketKeysChecked, ...marketKeysFiltered ] })
        } else {
            this.setState({ marketKeysChecked: marketKeysChecked.filter((marketKey) => marketKeys.indexOf(marketKey) === -1) })
        }
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
                    </  td>
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
        const { marketKeysChecked } = this.state;
        const disableActions = marketKeysChecked.length === 0;
        return (
            <div className="market-state-actions">
                <div className="button-group">
                    <button onClick={(e)=>this.props.fetchEventDetails()}>
                        Refresh
                    </button>
                    <button disabled={disableActions} onClick={(e)=>this._handleChangeStatusButtonClick('OPEN')}>
                        Open
                    </button>
                    <button disabled={disableActions} onClick={(e)=>this._handleChangeStatusButtonClick('SUSPENDED')}>
                        Suspend
                    </button>
                    <button disabled={disableActions} onClick={this._handleModalAbandonMarketClick}>
                        Abandon
                    </button>
                    <button disabled={disableActions} onClick={(e)=>this._handleChangeStatusButtonClick('CLOSED')}>
                        Close
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
                <div>
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
                        <label>
                            Notes
                            <input type="text" value={abandonMarketReasonNote} onChange={this._handleVoidReasonNotesChange}/>
                        </label>
                    </div>
                    <div className="tcenter">
                        <button disabled={disableAbandonSubmit} onClick={this._handleAbandonSubmitClick}>
                            Save
                        </button>
                        <button onClick={(e)=> {
                            this.props.closeModal('abandonMarket');
                            this.setState({abandonMarketReasonId: 1, abandonMarketReasonNote: ''})
                        }}>Cancel</button>
                    </div>
                </div>
            </ModalWindow>
        )
    }

    _handleChangeStatusButtonClick(status) {
        this.props.changeMarketStatus(this.state.marketKeysChecked, status);
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


export default connect(mapStateToProps, mapDispatchToProps)(MarketStateDetails);
