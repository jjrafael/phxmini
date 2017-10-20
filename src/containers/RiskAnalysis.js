import React from "react";
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { fetchAnalysisSummary, fetchBetsAnalysis, fetchMultipleSummary, fetchBetData, clearBetData } from '../actions/riskAnalysis';
import { fetchRiskTransactionDetails } from '../actions/riskTransaction';
import { openModal, closeModal } from '../actions/modal';
import filterTypes from '../constants/filterTypes';
import RiskTransactionDetails from './RiskTransactionDetails';
import TabComponent from '../components/Tabs';
import Singles from '../components/riskAnalysis/singles';
import Multiples from '../components/riskAnalysis/multiples';
import Casts from '../components/riskAnalysis/casts';
import MultipleSummary from '../components/riskAnalysis/multipleSummary';
import LateBets from '../components/riskAnalysis/lateBets';
import PriceHistory from '../components/riskAnalysis/priceHistory';
import CashOut from '../components/riskAnalysis/cashout';
import Summary from '../components/riskAnalysis/summary';
import SearchCriteria from '../components/riskAnalysis/searchCriteria';
import ModalWindow from '../components/modal';
import { objectToArray } from '../utils';
import moment from 'moment';


function mapStateToProps(state) {
    return {
        riskAnalysis: state.riskAnalysis,
        riskTransaction: state.riskTransaction,
        apiConstants: state.apiConstants,
        modals: state.modals
    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        fetchAnalysisSummary,
        fetchBetsAnalysis,
        fetchMultipleSummary,
        fetchBetData,
        clearBetData,
        fetchRiskTransactionDetails,
        openModal,
        closeModal
    }, dispatch)
}

class RiskAnalysis extends React.Component {
    constructor(props) {
        super(props);
        this._changeHandler = this._changeHandler.bind(this);
        this._bookTypeChangeHandler = this._bookTypeChangeHandler.bind(this);
        this._onTabSelect = this._onTabSelect.bind(this);
        this._fetchMultipleSummary = this._fetchMultipleSummary.bind(this);
        this.state = {
            filterDate: filterTypes.PAST_DATES.ALL_DATES,
            selectedTabIndex: 0,
            transactionIdSelected: null,
            filterFromDate: moment().subtract(10,'years').format('L'),
            filterToDate: moment().format('L'),
            filterFromTime: '00:00',
            filterFromTimeValid: true,
            filterToTime: '00:00',
            filterToTimeValid: true,
            isValidDateRange: true,
            minStake: 10,
            minPayout: 10,
            bookTypes: {
                'Ante-Post[AP]': {
                    value: '[AP]',
                    checked: true
                },
                'Early Price[EP]': {
                    value: '[EP]',
                    checked: true
                },
                'Board Price[BP]': {
                    value: '[BP]',
                    checked: true
                },
                'Fixed Price[FP]': {
                    value: '[FP]',
                    checked: true
                },
                'Starting Price[SP]': {
                    value: '[SP]',
                    checked: true
                }
            }
        }
    }

    componentDidUpdate(prevProps, prevState) {
        if(this.props.riskAnalysis.activeKey !== prevProps.riskAnalysis.activeKey && this.props.riskAnalysis.activeKey) {
        }
        if(this.state.selectedTabIndex >= 0 && prevState.selectedTabIndex !== this.state.selectedTabIndex) {
            this._loadTabData();
        }
        if(this.state.transactionIdSelected !== prevState.transactionIdSelected && typeof this.state.transactionIdSelected === 'number') {
            this._fetchTransactionDetails();
        }
        if(!this.props.riskTransaction.isSettlingRiskTransaction & prevProps.riskTransaction.isSettlingRiskTransaction && !this.props.settlingRiskTransactionFailed) {
            this._transactionDetailsClose();
            this._loadTabData();
        }
    }

    componentDidMount() {
        if(this.props.riskAnalysis.activeKey) {
            this.props.fetchAnalysisSummary(this.props.riskAnalysis.activeKey);
        }
        if(this.state.selectedTabIndex >= 0) {
            this._loadTabData();
        }
    }

    _filterData(data, filterBookType, filterMinStake, filterMinPayout) {
        const { bookTypes, minStake, minPayout } = this.state;
        return data.filter((item) => {
            let include = true;
            if(include && filterBookType) {
                let bookType;
                for(var i = 0; i < Object.keys(bookTypes).length; i++) {
                    if(Object.keys(bookTypes)[i].indexOf(`[${item.booktype}]`) > -1) {
                        bookType = bookTypes[Object.keys(bookTypes)[i]];
                        break
                    }
                }
                if(bookType && bookType.checked === false) {
                    include = false
                }
            }
            if(include && filterMinStake) {
                const stake = typeof item.risk === 'undefined' ? item.totalStake : item.risk;
                include = stake >= minStake;
            }
            if(include && filterMinPayout) {
                include = item.potentialPayout >= minPayout;
            }
            return include
        });
    }

    _loadTabData() {
        const activeTab = this._getTabItems()[this.state.selectedTabIndex];
        const key = this.props.riskAnalysis.activeKey;
        const { betType } = activeTab;
        if(betType === 'multiplesummary') {
            this._fetchMultipleSummary();
        } else {
            this._fetchBetsAnalysis();
        }
    }

    _fetchTransactionDetails() {
        const { transactionIdSelected } = this.state;
        this.props.openModal('riskTransactionDetails');
        this.props.fetchRiskTransactionDetails(transactionIdSelected);
    }

    _fetchMultipleSummary() {
        const key = this.props.riskAnalysis.activeKey;
        const { minStake, minPayout } = this.state;
        this.props.clearBetData();
        this.props.fetchMultipleSummary(key, minStake, minPayout);
    }

    _fetchBetsAnalysis() {
        const activeTab = this._getTabItems()[this.state.selectedTabIndex];
        const key = this.props.riskAnalysis.activeKey;
        const { betType } = activeTab;
        let { filterDate: date } = this.state;
        let fromDate, toDate;
        if(!activeTab.includeDate || this.state.filterDate.toLowerCase() === 'custom') {
            date = null
        }
        this.props.clearBetData();
        if(activeTab.includeDate && this.state.filterDate.toLowerCase() === 'custom') {
            const { filterFromTime, filterToTime, filterFromDate, filterToDate } = this.state;
            fromDate = filterFromDate;
            toDate = filterToDate;
            const fromHrAndMin = this._getHrAndMin(filterFromTime);
            const toHrAndMin = this._getHrAndMin(filterToTime);
            if(fromHrAndMin.hr) {
                fromDate = moment(fromDate, 'L').add(fromHrAndMin.hr, 'hours').format();
            }
            if(fromHrAndMin.min) {
                fromDate = moment(fromDate).add(fromHrAndMin.min, 'minutes').format();
            }
            if(toHrAndMin.hr) {
                toDate = moment(toDate, 'L').add(toHrAndMin.hr, 'hours').format();
            }
            if(toHrAndMin.min) {
                toDate = moment(toDate).add(toHrAndMin.min, 'minutes').format();
            }
        }
        this.props.fetchBetsAnalysis(key, betType, date, fromDate, toDate);
    }

    _renderDataError() {
        return (
            <div className="tcenter padding-large">
                <p>
                    Failed to load data. <button onClick={(e)=> this._loadTabData()}>Retry</button>
                </p>
            </div>
        )
    }

    _renderTabContent(key) {
        const { riskAnalysis, apiConstants } = this.props;
        if(riskAnalysis.isFetchingBetsAnalysis || riskAnalysis.isFetchingRiskMultipleSummary) {
            return this._renderLoadingIndicator(); 
        }
        if(riskAnalysis.fetchingBetsAnalysisFailed && key !== 'multipleSummary') {
            return this._renderDataError(); 
        } else if(riskAnalysis.fetchingRiskMultipleSummaryFailed && key === 'multipleSummary') {
            return this._renderDataError(); 
        }
        switch (key) {
            case 'singles':
                var data = this._filterData(riskAnalysis.betsAnalysis, true, true, false);
                return <Singles
                            bookTypes={this.state.bookTypes}
                            bookTypeChangeHandler={this._bookTypeChangeHandler}
                            data={data}
                            minStake={this.state.minStake}
                            refresh={()=>this._fetchBetsAnalysis()}
                            changeHandler={this._changeHandler}
                            transactionIdSelected={this.state.transactionIdSelected}/>
                break;
            case 'multiples':
                var data = this._filterData(riskAnalysis.betsAnalysis, true, true, false);
                return <Multiples
                            bookTypes={this.state.bookTypes}
                            bookTypeChangeHandler={this._bookTypeChangeHandler}
                            changeHandler={this._changeHandler}
                            minStake={this.state.minStake}
                            refresh={()=>this._fetchBetsAnalysis()}
                            isFetchingBetData={riskAnalysis.isFetchingBetData}
                            data={data}
                            betData={riskAnalysis.betData}
                            fetchBetData={(transactionId)=> {
                                this.props.fetchBetData(transactionId);
                            }}
                            transactionIdSelected={this.state.transactionIdSelected}/>
                break;
            case 'casts':
                var data = this._filterData(riskAnalysis.betsAnalysis, true, true, false);
                return <Casts
                            changeHandler={this._changeHandler}
                            bookTypes={this.state.bookTypes}
                            bookTypeChangeHandler={this._bookTypeChangeHandler}
                            minStake={this.state.minStake}
                            isFetchingBetData={riskAnalysis.isFetchingBetData}
                            refresh={()=>this._fetchBetsAnalysis()}
                            data={data}
                            betData={riskAnalysis.betData}
                            fetchBetData={(transactionId)=> {
                                this.props.fetchBetData(transactionId);
                            }}
                            transactionIdSelected={this.state.transactionIdSelected}/>
                break;
            case 'multipleSummary':
                var data = this._filterData(riskAnalysis.multipleSummary, false, true, true);
                return <MultipleSummary
                            changeHandler={this._changeHandler}
                            data={data}
                            isFetchingBetData={riskAnalysis.isFetchingBetData}
                            betData={riskAnalysis.betData}
                            minStake={this.state.minStake}
                            minPayout={this.state.minPayout}
                            refresh={()=>this._fetchMultipleSummary()}
                            fetchBetData={(transactionId)=> {
                                this.props.fetchBetData(transactionId, 'accumulatorrisks');
                            }}
                            transactionIdSelected={this.state.transactionIdSelected}/>
                break;
            case 'lateBets':
                return <LateBets
                            changeHandler={this._changeHandler}
                            refresh={()=>this._fetchBetsAnalysis()}
                            data={riskAnalysis.betsAnalysis}
                            transactionIdSelected={this.state.transactionIdSelected}/>
                break;
            case 'priceHistory':
                return <PriceHistory
                            marketStatuses={objectToArray(filterTypes.STANDARD_MARKET_STATUSES)}
                            refresh={()=>this._fetchBetsAnalysis()}
                            data={riskAnalysis.betsAnalysis}/>
                break;
            case 'cashOut':
                return <CashOut
                            refresh={()=>this._fetchBetsAnalysis()}
                            data={riskAnalysis.betsAnalysis}/>
                break;
        }
    }

    _changeHandler(stateKey, value) {
        this.setState({
            [stateKey]: value
        })
        this.setState({
            isValidDateRange: this._isDateRangeValid()
        })
    }

    _bookTypeChangeHandler(bookDesc, value) {
        const { bookTypes } = this.state;
        this.setState({
            bookTypes: {
                ...bookTypes,
                [bookDesc]: {
                    ...bookTypes[bookDesc],
                    checked: value
                }
            }
        })
    }

    _getTabItems() {
        let tabItems = [
            {
                title: 'Singles',
                content: this._renderTabContent('singles'),
                betType: 'singles',
                includeDate: true,
                enableSearchCriteria: true
            },
            {
                title: 'Multiples',
                content: this._renderTabContent('multiples'),
                betType: 'multiples',
                includeDate: true,
                enableSearchCriteria: true
            },
            {
                title: 'Forecast/Tricast',
                content: this._renderTabContent('casts'),
                betType: 'casts',
                includeDate: true,
                enableSearchCriteria: true
            },
            {
                title: 'Multiple Summary',
                content: this._renderTabContent('multipleSummary'),
                betType: 'multiplesummary',
                enableSearchCriteria: false
            },
            {
                title: 'Late Bets',
                content: this._renderTabContent('lateBets'),
                betType: 'latebets',
                enableSearchCriteria: false
            },
            {
                title: 'Price History',
                content: this._renderTabContent('priceHistory'),
                betType: 'pricehistory',
                enableSearchCriteria: false
            },
            {
                title: 'Cash Out',
                content: this._renderTabContent('cashOut'),
                betType: 'cashout',
                enableSearchCriteria: false
            }
        ];
        return tabItems;
    }

    _onTabSelect(tabIndex) {
        this.setState({
            selectedTabIndex: tabIndex,
            transactionIdSelected: null,
        });
    }

    _renderLoadingIndicator() {
        return(
            <div className="loading tcenter">
                <i className="phxico phx-spinner phx-spin"></i>
            </div>
        )
    }

    _isDateRangeValid() {
        const { filterFromDate, filterToDate, filterFromTime, filterToTime } = this.state;
        let from = moment(filterFromDate, 'L');
        let to = moment(filterToDate, 'L');
        const fromHrAndMin = this._getHrAndMin(filterFromTime);
        const toHrAndMin = this._getHrAndMin(filterToTime);
        if(fromHrAndMin.hr) {
            from = moment(from, 'L').add(fromHrAndMin.hr, 'hours');
        }
        if(fromHrAndMin.min) {
            from = moment(from, 'L').add(fromHrAndMin.min, 'minutes');
        }
        if(toHrAndMin.hr) {
            to = moment(to, 'L').add(toHrAndMin.hr, 'hours');
        }
        if(toHrAndMin.min) {
            to = moment(to, 'L').add(toHrAndMin.min, 'minutes');
        }
        const diff = moment(to, 'L').diff(moment(from, 'L'), 'minutes');
        return diff > 0;
    }

    _getHrAndMin(value) {
        let hr, min, isInvalid;
        if(value.indexOf(':') > -1) {
            hr = value.split(':')[0];
            min = value.split(':')[1];
        }
        return {
            hr,
            min
        }
    }

    _transactionDetailsClose() {
        this.props.closeModal('riskTransactionDetails');
        this.setState({
            transactionIdSelected: null
        });
    }

    _renderTransactionDetails() {
        return (
            <ModalWindow
                key={'riskTransactionDetails'}
                onClose={(e)=> {
                    if(this.props.riskTransaction.isSettlingRiskTransaction) {
                        return
                    }
                    this._transactionDetailsClose()
                }}
                title="Transation Details"
                closeButton={false}
                className="large"
                name="riskTransactionDetails"
                isVisibleOn={this.props.modals.riskTransactionDetails}
                shouldCloseOnOverlayClick={false}>
                <RiskTransactionDetails changeHandler={this._changeHandler}/>
            </ModalWindow>
        )
    }

    render() {
        const { riskAnalysis } = this.props;
        const { filterFromDate, filterToDate, filterDate, filterFromTimeValid, filterToTimeValid, isValidDateRange } = this.state;
        const activeTab = this._getTabItems()[this.state.selectedTabIndex];
        const disableSearchButton = !filterFromTimeValid || !filterToTimeValid || !this._isDateRangeValid() || !activeTab.enableSearchCriteria;
        return (
            <section className="analysis-container">
                {!riskAnalysis.isFetchingRiskAnalysisSummary && !riskAnalysis.fetchingRiskAnalysisSummaryFailed &&
                <Summary data={riskAnalysis.riskAnalysisSummary}/>
                }
                {!riskAnalysis.isFetchingRiskAnalysisSummary && riskAnalysis.fetchingRiskAnalysisSummaryFailed &&
                <p className="tcenter">Failed to load Analysis Summary</p>
                }
                <SearchCriteria
                    changeHandler={(stateKey, value) => {
                        this._changeHandler(stateKey, value);
                    }}
                    disableAllInputs={!activeTab.enableSearchCriteria}
                    disableDateRange={this.state.filterDate.toLowerCase() !== 'custom'}
                    disableSearchButton={disableSearchButton}
                    isValidDateRange={this._isDateRangeValid()}
                    filterFromDate={filterFromDate}
                    filterToDate={filterToDate}
                    filterDate={filterDate}
                    onSubmitClick={()=> {
                        this._loadTabData();
                    }}/>
                <TabComponent
                    className="main-inner"
                    onSelect={this._onTabSelect}
                    items={this._getTabItems()}/>
                {this._renderTransactionDetails()}
            </section>
        );
    }
}


export default connect(mapStateToProps, mapDispatchToProps)(RiskAnalysis);
