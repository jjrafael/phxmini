import React, { PropTypes } from "react";
import ReactTable from 'react-table';
import 'react-table/react-table.css';
import { formatISODateString, formatCurrency, formatDecimalPrice } from '../../utils';

export default class Cashout extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        const { data } = this.props;
        const defaultWidth = 80;
        const columns = [
            {
                header: 'Time',
                accessor: 'formattedTime',
                sortable: false,
                minWidth: defaultWidth,
            },
            {
                header: 'Username',
                accessor: 'userName',
                sortable: false,
                minWidth: 120,
            },
            {
                header: 'Stake',
                accessor: 'stake',
                sortable: false,
                className: 'tright',
                minWidth: defaultWidth,
                render: props => {
                    const value = formatCurrency(props.value);
                    return (
                        <span title={value}>{value}
                        </span>
                    )
                }
            },
            {
                header: 'Price',
                accessor: 'price',
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
                header: 'Market',
                accessor: 'marketDescription',
                sortable: false,
                minWidth: defaultWidth,
                render: props => <span title={props.value}>{props.value}</span>
            },
            {
                header: 'Outcome',
                accessor: 'outcomeDescription',
                sortable: false,
                minWidth: 140,
                render: props => <span title={props.value}>{props.value}</span>
            },
            {
                header: 'Period',
                accessor: 'periodDescription',
                sortable: false,
                minWidth: 110
            },
            {
                header: 'Credit',
                accessor: 'credit',
                sortable: false,
                minWidth: 110,
                className: 'tright',
                render: props => {
                    const value = formatCurrency(props.value);
                    return (
                        <span title={value}>{value}
                        </span>
                    )
                }
            }
        ]
        return (
            <div className="cashout-container padding-large tcenter">
                <div className="padding-medium tleft">
                    <button onClick={()=> this.props.refresh()}>
                        Refresh
                    </button>
                </div>
                <ReactTable
                    className="-highlight"
                    showPagination={true}
                    defaultPageSize={10}
                    showPageSizeOptions={false}
                    data={data} 
                    columns={columns}/>
            </div>
        )
    }
}