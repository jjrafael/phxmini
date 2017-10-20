import React, { PropTypes } from "react";
import moment from "moment";
import { formatDateTimeString, getDaysDiffFromNow, prettifyTime } from '../../utils';
import riskDataConfig from '../../configs/riskDataConfig';
import channelConfig from '../../configs/channelConfig';

export default class Outcome extends React.Component {
    constructor(props) {
        super(props);
    }

    _getOutcomePriceSourceIcon(priceSource) {
        let className = "phxico phx-rss icon-small";
        return (
            <i className={className}></i>
        );
    }

    _renderOutcomeRiskCells(outcomeData) {
        return riskDataConfig.columns.map((column, index) => {
            if(index < 2 || !column.visible) {
                return null
            }
            const { outcomeRisk } = outcomeData;
            const dataKeys = column.dataKeys;
            const { marketTypeGroup } = outcomeData.parentPath;
            const showSpread = riskDataConfig.visibleSpreadMarketTypeGroups.indexOf(marketTypeGroup) > -1;
            let columnData = '';
            if(column.desc === 'First Price') {
                const price = typeof outcomeData[dataKeys[0]] === 'undefined' || outcomeData[dataKeys[0]] === null  ? '' : outcomeData[dataKeys[0]];
                let spread1 = '';
                let spread2 = '';
                if(showSpread) {
                    spread1 = typeof outcomeData[dataKeys[1]] === 'undefined' ? '' : outcomeData[dataKeys[1]];
                    spread2 = typeof outcomeData[dataKeys[2]] === 'undefined' ? '' : `, ${outcomeData[dataKeys[2]]}`;
                }
                columnData = price.length ? `${spread1}${spread2} ${price}` : '';
            } else if(column.desc === 'Last Price') {
                const price = typeof outcomeData[dataKeys[0]] === 'undefined' || outcomeData[dataKeys[0]] === null ? '' : outcomeData[dataKeys[0]];
                let spread1 = '';
                let spread2 = '';
                if(showSpread) {
                    spread1 = typeof outcomeData[dataKeys[1]] === 'undefined' ? '' : outcomeData[dataKeys[1]];
                    spread2 = typeof outcomeData[dataKeys[2]] === 'undefined' ? '' : `, ${outcomeData[dataKeys[2]]}`;
                }
                columnData = price.length ? `${spread1}${spread2} ${price}` : '';
            } else if(column.displayNullData && (!outcomeRisk || typeof outcomeRisk[dataKeys[0]] === 'undefined')){
                columnData = '0';
            } else if(!!outcomeRisk && typeof outcomeRisk[dataKeys[0]] !== 'undefined') {
                if(typeof column.displayData === 'function') {
                    columnData = column.displayData(outcomeRisk[dataKeys[0]]);
                } else {
                    columnData = outcomeRisk[dataKeys[0]];
                }
            }
            return [
                <td>
                    {columnData}
                </td>
            ]
        })
    }

    _renderHiddenFlag(hiddenFlag) {
        const { reason, hideTime } = hiddenFlag;
        const daysDiff = getDaysDiffFromNow(hideTime);
        const formattedTime = prettifyTime(hideTime);
        const { hours, minutes, seconds } = formattedTime;
        let daysAgo = '';
        if(daysDiff === 0) {
            daysAgo = 'Today';
        } else if(daysDiff === 1) {
            daysAgo = 'Yesterday';
        } else {
            daysAgo = `${daysDiff} days ago`;
        }
        return (
            <a  title={`Hidden ${daysAgo} - ${formattedTime}: ${reason}`}>
                <i className="phxico phx-eye-off icon-small"></i>
            </a>
        )
    }

    render() {
        const { data } = this.props;
        const { desc, flags, period, outcomeRisk, hiddenFlag } = data;
        return (
            <tr className="outcome-row">
                <td>
                    {hiddenFlag && !!Object.keys(hiddenFlag).length && this._renderHiddenFlag(hiddenFlag)}
                </td>
                <td>
                    {desc}
                </td>
                {this._renderOutcomeRiskCells(data)}
            </tr>
        )
    }
}