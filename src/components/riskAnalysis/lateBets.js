import React, { PropTypes } from "react";
import ReactTable from 'react-table';
import 'react-table/react-table.css';
import { formatISODateString, formatCurrency } from '../../utils';

export default class LateBets extends React.Component {
    constructor(props) {
        super(props);
        this._onRowClick = this._onRowClick.bind(this);
        this._handleViewDetailsClick = this._handleViewDetailsClick.bind(this);
        this._getFlagColumnColor = this._getFlagColumnColor.bind(this);
        this._getWagerLimitGroupColor = this._getWagerLimitGroupColor.bind(this);
        this.state = {
            selectedRowIndex: null,
            minStake: this.props.minStake,
            bookTypes: this.props.bookTypes
        }
    }

    _getFlagColor(flags) {
        return `#${flags[0].colour}`;
    }

    _getFlagColumnColor(state, rowInfo, column) {
        const style = {};
        if(rowInfo && rowInfo.row && !!rowInfo.row.ppflags && !!rowInfo.row.ppflags.length) {
            style.backgroundColor = this._getFlagColor(rowInfo.row.ppflags);
        }
        return {
            style
        }
    }

    _getWagerLimitGroupColor(state, rowInfo, column) {
        const style = {};
        if(rowInfo && rowInfo.row && !!rowInfo.row.wagerLimitGroup) {
            style.backgroundColor = `#${rowInfo.row.wagerLimitGroup.colour}`;
        }
        return {
            style
        }
    }

    _onRowClick(index) {
        this.setState({
            selectedRowIndex: index
        });
    }

    _handleViewDetailsClick(e) {
        const index = this.state.selectedRowIndex;
        const { transactionId } = this.props.data[index];
        this.props.changeHandler('transactionIdSelected', transactionId);
    }

    _renderFlagIcon(flag, index) {
        const { flagTypes } = this.props;
        switch (flag.description.toLowerCase()) {
            case 'normal':
                return <span title={flag.description} key={index} className="phxico phx-arrow-right push-right"></span>
                break
            case 'monitored':
                return <span title={flag.description} key={index} className="phxico phx-fire push-right"></span>
                break
            case 'elite':
                return <span title={flag.description} key={index} className="phxico phx-star push-right"></span>
                break
            case 'kb':
                return <span title={flag.description} key={index} className="phxico phx-money push-right"></span>
                break
            default:
                return null;
                break
        }
    }

    render() {
        const { data } = this.props;
        const { selectedRowIndex } = this.state;
        const defaultWidth = 80;
        const columns = [
            {
                header: 'Flags',
                accessor: 'ppflags',
                sortable: false,
                minWidth: defaultWidth,
                render: props => {
                    return (
                        <div>
                            {!!props.value && !!props.value.length && props.value.map((flag, index) => {
                                return this._renderFlagIcon(flag, index)
                            })}
                        </div>
                    )
                }
            },
            {
                header: 'A/C No.',
                accessor: 'accountNumber',
                sortable: false,
                minWidth: 110,
                getProps: this._getFlagColumnColor,
                render: props => {
                    return (
                        <div title={props.value}>{props.value}</div>
                    )
                }
            },
            {
                header: 'Account',
                accessor: 'accountDescription',
                sortable: true,
                minWidth: 160,
                getProps: this._getFlagColumnColor,
                render: props => {
                    return (
                        <div title={props.value}>{props.value}</div>
                    )
                }
            },
            {
                header: 'Date',
                accessor: 'transactionDate',
                sortable: false,
                minWidth: 210,
                render: props => <span className='number' title={formatISODateString(props.value)}>{formatISODateString(props.value)}</span>
            },
            {
                header: 'Stake(PHP)',
                accessor: 'risk',
                sortable: false,
                minWidth: defaultWidth,
                className: 'tright',
                render: props => {
                    const value = formatCurrency(props.value, 'PHP');
                    return (
                        <span title={value}>{value}
                        </span>
                    )
                }
            },
            {
                header: 'Credit(PHP)',
                accessor: 'credit',
                sortable: false,
                minWidth: defaultWidth,
                className: 'tright',
                render: props => {
                    const value = formatCurrency(props.value, 'PHP');
                    return (
                        <span title={value}>{value}
                        </span>
                    )
                }
            },
            {
                header: 'Void',
                accessor: 'transactionVoid',
                sortable: false,
                minWidth: defaultWidth,
                render: props => <span>{props.value ? 'YES' : ''}</span>
            },
            {
                header: 'Wager Limit Group',
                accessor: 'wagerLimitGroup',
                sortable: false,
                minWidth: 140,
                getProps: this._getWagerLimitGroupColor,
                render: props => {
                    return (
                        <div title={!!props.value && props.value.description}>{!!props.value && props.value.description}</div>
                    )
                }
            },
            {
                header: 'Description',
                accessor: 'transactionDescription',
                sortable: false,
                minWidth: 140,
            },
            {
                header: 'ID',
                accessor: 'transactionId',
                sortable: false,
                minWidth: defaultWidth
            },
            {
                header: 'Betslip',
                accessor: 'betslipReference',
                sortable: false,
                minWidth: defaultWidth,
            }
        ]
        return (
            <div className="late-bets-container padding-large tcenter">
                <div className="clearfix">
                    <div className="padding-medium tleft fleft">
                        <button onClick={()=> this.props.refresh()}>
                            Refresh
                        </button>
                    </div>
                    <div className="padding-medium tleft fright">
                        <button
                            className={typeof selectedRowIndex !== 'number' ? 'disabled' : 'btn-primary'}
                            onClick={this._handleViewDetailsClick}
                            disabled={typeof selectedRowIndex !== 'number'}>
                            View Details
                        </button>
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
            </div>
        )
    }
}