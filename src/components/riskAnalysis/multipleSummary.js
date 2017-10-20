import React, { PropTypes } from "react";
import ReactTable from 'react-table';
import 'react-table/react-table.css';
import { formatISODateString, formatDateTimeString, formatDecimalPrice, formatCurrency } from '../../utils';

export default class MultipleSummary extends React.Component {
    constructor(props) {
        super(props);
        this._onRowClick = this._onRowClick.bind(this);
        this.state = {
            selectedRowIndex: null,
            minStake: this.props.minStake,
            minPayout: this.props.minPayout,
        }
    }

    componentDidUpdate(prevProps, prevState) {
        if(prevState.selectedRowIndex !== this.state.selectedRowIndex && typeof this.state.selectedRowIndex !== null && this.props.data.length) {
            this._loadBetData()
        }
    }

    _loadBetData() {
        const index = this.state.selectedRowIndex;
        const { id } = this.props.data[index];
        this.props.fetchBetData(id);
    }

    _onRowClick(index) {
        this.setState({
            selectedRowIndex: index
        });
    }


    _renderSummaryDetails() {
        const { selectedRowIndex } = this.state;
        return (
            <div className="padding-small">
                <table className="betData tcenter">
                    <thead>
                        <tr>
                           <th>
                                Outcome
                           </th>
                           <th>
                                Event
                           </th>
                           <th>
                                Date
                           </th>
                           <th>
                                Market
                           </th>
                           <th>
                                Average Price
                           </th>
                           <th>
                                Resulted
                           </th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.props.isFetchingBetData &&
                            <tr>
                                <td colSpan="6">Loading transaction data...</td>
                            </tr>
                        }
                        {!this.props.betData.length && !this.props.isFetchingBetData &&
                            <tr>
                                <td colSpan="6">Please select a transaction above.</td>
                            </tr>
                        }
                        {this.props.betData.map((bet, index)=> {
                            return (
                                <tr key={index}>
                                    <td>{bet.outcomeDescription}</td>
                                    <td>{bet.eventDescription}</td>
                                    <td>{formatISODateString(bet.eventDate)}</td>
                                    <td>{bet.marketDescription}</td>
                                    <td>{formatDecimalPrice(bet.averagePrice)}</td>
                                    <td>{bet.marketDescription}</td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            </div>
        )
    }

    render() {
        const { data } = this.props;
        const defaultWidth = 80;
        const columns = [
            {
                header: 'Selections',
                accessor: 'selections',
                sortable: false,
                className: 'tright',
                minWidth: defaultWidth
            },
            {
                header: 'Resulted Correct',
                accessor: 'resultedCorrect',
                sortable: false,
                className: 'tright',
                minWidth: defaultWidth
            },
            {
                header: 'Total Stake',
                accessor: 'totalStake',
                sortable: true,
                minWidth: defaultWidth,
                className: 'tright',
                render: props => {
                    const value = formatCurrency(props.value);
                    return (
                        <span title={value}>{value}
                        </span>
                    )
                }
            },
            {
                header: 'Potential Payout',
                accessor: 'potentialPayout',
                sortable: true,
                minWidth: defaultWidth,
                className: 'tright',
                render: props => {
                    const value = formatCurrency(props.value);
                    return (
                        <span title={value}>{value}
                        </span>
                    )
                }
            },
            {
                header: 'No. Bets',
                accessor: 'betCount',
                className: 'tright',
                minWidth: defaultWidth
            },
            {
                header: 'Average Price',
                accessor: 'averagePrice',
                sortable: false,
                minWidth: defaultWidth,
                className: 'tright',
                render: props => {
                    const value = formatDecimalPrice(props.value);
                    return (
                        <span title={value}>{value}
                        </span>
                    )
                }
            },
            {
                header: 'Outcomes',
                accessor: 'outcomeDescription',
                sortable: false,
                minWidth: 150,
                className: 'tleft',
                render: props => <span title={props.value}>{props.value}</span>
            }
        ]
        return (
            <div className="multiple-summary-container">
                <div className="clearfix">
                    <div className="search-criteria fleft">
                        <div className="field-group">
                            <h3 className="group-name">Display filter</h3>
                            <div className="field-container">
                                <label>
                                    Min total stake:
                                    <input type="number" className="push-left short-input" value={this.state.minStake}
                                        onChange={(e)=> {
                                            this.setState({
                                                minStake: Number(e.target.value)
                                            })
                                            this.props.changeHandler('minStake', Number(e.target.value));
                                        }}/>
                                </label>
                            </div>
                            <div className="field-container">
                                <label>
                                    Min potential payout:
                                    <input type="number" className="push-left short-input" value={this.state.minPayout}
                                        onChange={(e)=> {
                                            this.setState({
                                                minPayout: Number(e.target.value)
                                            })
                                            this.props.changeHandler('minPayout', Number(e.target.value));
                                        }}/>
                                </label>
                            </div>
                            <div className="field-container">
                                <button onClick={()=>this.props.refresh()}>Refresh</button>
                            </div>
                        </div>
                    </div>
                </div>
                <ReactTable
                    className="-highlight -striped"
                    showPagination={true}
                    defaultPageSize={10}
                    showPageSizeOptions={false}
                    data={data} 
                    columns={columns}
                    getTrProps={(state, rowInfo, column) => {
                        let className = '';
                        if(rowInfo) {
                            className += ' clickable-rows';
                        }
                        if(rowInfo && rowInfo.index === this.state.selectedRowIndex) {
                            className += ' selected';
                        }
                        return {
                            className,
                            onClick: rowInfo ? ()=> this._onRowClick(rowInfo.index) : null
                        }
                    }}/>
                {this._renderSummaryDetails()}
            </div>
        )
    }
}