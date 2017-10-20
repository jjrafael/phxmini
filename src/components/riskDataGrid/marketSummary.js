import React, { PropTypes } from "react";
import { formatDateTimeString } from '../../utils';
import riskDataConfig from '../../configs/riskDataConfig';

export default class MarketSummary extends React.Component {
    constructor(props) {
        super(props);
    }

    _renderMarketSummaryCells(data) {
        return riskDataConfig.columns.map((column, index) => {
            if(index < 2 || !column.visible) {
                return null
            }
            const dataKeys = column.dataKeys;
            const summaryKeys = column.summaryDataKeys;
            let columnData = '';
            if(column.desc === 'First Price') {
                columnData = data[summaryKeys[0]];
            } else if(column.desc === 'Last Price') {
                columnData = data[summaryKeys[0]];
            } else if(column.displayNullData && typeof data[dataKeys[0]] === 'undefined'){
                columnData = '0';
            } else {
                if(typeof column.formatData === 'function' && typeof data[dataKeys[0]] !== 'undefined') {
                    columnData = column.formatData(data[dataKeys[0]]);
                } else {
                    columnData = data[dataKeys[0]];
                }
            }
            return [
                <td>
                    {columnData}
                </td>
            ]
        })
    }

    render() {
        const { data, columns, widthToBeDistributed } = this.props;
        return (
            <tr className="market-summary-row">
                <td>
                </td>
                <td>
                    {formatDateTimeString(data.parentPath.parentPath.start)}
                </td>
                {this._renderMarketSummaryCells(data)}
            </tr>
        )
    }
}