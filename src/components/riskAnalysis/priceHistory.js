import React, { PropTypes } from "react";
import ReactTable from 'react-table';
import 'react-table/react-table.css';
import { formatISODateString, formatCurrency, formatDecimalPrice, formatNumber } from '../../utils';

export default class PriceHistory extends React.Component {
    constructor(props) {
        super(props);
    }

    _getMarketStatusClass(statusId) {
        if(typeof statusId === 'undefined' || statusId === null) {
            return 'default';
        }
        const marketStatus = this.props.marketStatuses.find((marketStatus)=> {
            return Number(marketStatus.value) === statusId
        });
        return marketStatus ? marketStatus.desc.toLowerCase() : 'default';
    }

    _parseData() {
        const { data } = this.props;
        let parsedData = [];
        if(!data || !data.length || (data && data[0] && !data[0].lineHistorySnapshotList)) {
            return parsedData;
        }
        data.forEach((item) => {
            const { lineHistorySnapshotList, lineHistoryTotal } = item;
            lineHistorySnapshotList.forEach((lineHistorySnapshot) => {
                const marketStatus = this._getMarketStatusClass(lineHistorySnapshot.marketStatusId);
                parsedData.push({
                    desc: lineHistorySnapshot.marketTypeDescription,
                    changedBy: lineHistorySnapshot.periodDescription,
                    date: lineHistorySnapshot.formattedDateTime,
                    type: 'lineHistorySnapshot'

                });
                for(var key in lineHistorySnapshot.lineHistoryMap) {
                    const lineHistory = lineHistorySnapshot.lineHistoryMap[key];
                    parsedData.push({
                        desc: lineHistory.outcomeDescription,
                        changedBy: lineHistory.accountNumber,
                        spread: lineHistory.formattedSpread,
                        line: lineHistory.lineDescription,
                        date: lineHistorySnapshot.formattedDateTime,
                        price: formatDecimalPrice(lineHistory.price),
                        stake: `${formatNumber(lineHistory.roundedStake, true)}[${lineHistory.count}]`,
                        percentStakes: lineHistory.percentStakes,
                        potentialPayout: `${formatNumber(lineHistory.roundedPotentialPayout, true)}`,
                        type: 'lineHistoryMap',
                        className: marketStatus,
                    });
                }
            });
            parsedData.push({
                desc: 'Total',
                price: 'ATP*',
                className: 'totals-header'
            });
            for(var key in lineHistoryTotal.outcomeLineHistoryTotalMap) {
                const outcomeLineHistory = lineHistoryTotal.outcomeLineHistoryTotalMap[key];
                parsedData.push({
                    desc: outcomeLineHistory.outcomeDescription,
                    price: formatDecimalPrice(outcomeLineHistory.averageTradedPrice),
                    stake: `${formatNumber(outcomeLineHistory.roundedTotalStakes, true)}`,
                    percentStakes: outcomeLineHistory.percentStakes,
                    potentialPayout: `${formatNumber(outcomeLineHistory.roundedTotalPotentialPayout, true)}`,
                    type: 'total',
                    className: 'totals',
                });
            }
        });
        return parsedData;
    }

    _getColumns() {
        const defaultWidth = 80;
        return [
            {
                header: '',
                accessor: 'desc',
                sortable: false,
                minWidth: 160,
                maxWidth: 160,
                render: props => <span title={props.value}>{props.value}</span>
            },
            {
                header: 'Changed by',
                accessor: 'changedBy',
                sortable: false,
                minWidth: 160,
                maxWidth: 160,
                render: props => <span title={props.value}>{props.value}</span>
            },
            {
                header: 'Line',
                accessor: 'line',
                sortable: true,
                minWidth: 160,
                maxWidth: 160,
            },
            {
                header: 'Changed Date',
                accessor: 'date',
                sortable: false,
                minWidth: 210,
                maxWidth: 210,
            },
            {
                header: 'Spread/Ttl',
                accessor: 'spread',
                sortable: false,
                minWidth: defaultWidth,
                maxWidth: defaultWidth,
                className: 'tright'
            },
            {
                header: 'Price',
                accessor: 'price',
                sortable: false,
                minWidth: defaultWidth,
                maxWidth: defaultWidth,
                className: 'tright'
            },
            {
                header: 'Stakes',
                accessor: 'stake',
                sortable: false,
                minWidth: defaultWidth,
                maxWidth: defaultWidth,
                className: 'tright',
            },
            {
                header: '% of Stakes',
                accessor: 'percentStakes',
                sortable: false,
                minWidth: defaultWidth,
                maxWidth: defaultWidth,
                className: 'tright',
            },
            {
                header: 'Potential Payout',
                accessor: 'potentialPayout',
                sortable: false
            }
        ]
    }
    _renderHeader() {
        const headerCells = this._getColumns().map((column, index) => {
            return (
                <div key={index} className="column" style={{
                    width: index === this._getColumns().length - 1 ? null : column.minWidth + 'px'
                }}>
                    {column.header}
                </div>
            )
        });
        return (
            <div className="header-container">
                <div className="row">
                    {headerCells}
                </div>
            </div>
        )
    }

    render() {
        const data = this._parseData();
        const columns = this._getColumns();
        return (
            <div className="price-history-container padding-large">
                <div className="padding-medium tleft">
                    <button onClick={()=> this.props.refresh()}>
                        Refresh
                    </button>
                </div>
                <div className="ReactTable-fixed-header">
                    {this._renderHeader()}
                    <div className="table-container">
                        <ReactTable
                            className=" tcenter hide-header"
                            showPagination={false}
                            defaultPageSize={data.length}
                            showPageSizeOptions={false}
                            data={data} 
                            columns={columns}
                            getTrProps={(state, rowInfo, column) => {
                                let className = '';
                                if(rowInfo && rowInfo.row.className) {
                                    className += ' ' + rowInfo.row.className + '-row';
                                }
                                return {
                                    className
                                }
                            }}/>
                    </div>
                </div>
            </div>
        )
    }
}