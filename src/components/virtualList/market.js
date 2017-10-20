import React, { PropTypes } from "react";
import filterTypes from '../../constants/filterTypes';
import riskDataConfig from '../../configs/riskDataConfig';
import { formatDateTimeString, objectToArray, getMarketStatusFromFlags, formatNumber } from '../../utils'
import { connect } from 'react-redux';
import couponModel from '../../models/couponModel';

class Market extends React.Component {
    constructor(props) {
        super(props);
        this.DATA = this.props.data;
        this.columnHasUpdated = false;
    }

    shouldComponentUpdate(nextProps, nextState) {
        // console.log('this.props: ', this.props);
        // console.log('nextProps: ', nextProps);
        let { key } = this.props.data;
        if (this.props.marketState.marketKeysChangingStatus.includes(key) !== nextProps.marketState.marketKeysChangingStatus.includes(key) ||
            this.props.rowHeight !== nextProps.rowHeight ||
            this.props.openModalsCount !== nextProps.openModalsCount || // update everytime a modal is closed
            this.props.hasUpdate !== nextProps.hasUpdate ||
            this.props.filterPeriod !== nextProps.filterPeriod ||
            this.props.filterMarket !== nextProps.filterMarket ||
            this.props.treeLength !== nextProps.treeLength ||
            this.props.isChangingStatus && !nextProps.isChangingStatus
        ) {
            this.DATA = { ...this.DATA, ...nextProps.dataFromModel };
            if (this._getStatus(this.props.data.flags) !== this._getStatus(this.DATA.flags)) {
                this.columnHasUpdated = true;
            } else {
                this.columnHasUpdated = false;
            }
            return true;
        } else {
            this.columnHasUpdated = false;
            return false;
        }
    }

    _getStatus(flags) {
        return getMarketStatusFromFlags(flags)
    }

    _renderVariableSpreadData() {
        const { variableSpreadDataItem } = this.props.data;
        const rowHeaders = variableSpreadDataItem.spreadLiabilities.map((spreadLiability, index) => {
            return (
                <th className="tcenter" key={index}>
                    {spreadLiability.spread}
                </th>
            )
        });
        const rowData = variableSpreadDataItem.spreadLiabilities.map((spreadLiability, index) => {
            let className = 'variable-spread-column';
            if(spreadLiability.liability === 0) {
                className += ' zero';
            } else if(!isNaN(spreadLiability.liability) && spreadLiability.liability > 0) {
                className += ' positive';
            } else if(!isNaN(spreadLiability.liability) && spreadLiability.liability < 0) {
                className += ' negative';
            }
            return (
                <td className="tcenter" key={index}>
                    <span className={className}>
                        {formatNumber(spreadLiability.liability)}
                    </span>
                </td>
            )
        });
        return (
            <div className="variable-spread-data">
                <table cellPadding="0" cellSpacing="0">
                    <thead>
                        <tr>
                            <th>{variableSpreadDataItem.description}</th>
                            {rowHeaders}
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>Liability</td>
                            {rowData}
                        </tr>
                    </tbody>
                </table>
            </div>
        )
    }

    _renderSpacerColumns() {
        return riskDataConfig.columns.map((column, index) => {
            const width = column.width || riskDataConfig.defaultColumnWidth;
            if(index < 2 || !column.visible) {
                return null
            }
            return (
                <div key={index} style={{minWidth: width, maxWidth: width}} className="column"></div>
            )
        });
    }

    _renderLoadingIndicator() {
        return (
            <span>
                <i className="phxico phx-spinner phx-spin"></i>
            </span>
        )
    }

    _renderDescription (market, status) {
        let desc;
        if (market.marketTypeGroup.indexOf('FIXED') >= 0) {
            desc = market.desc;
        } else {
            if (market.rawDesc) {
                desc = market.rawDesc;
            } else {
                desc = market.desc;
            }
        }
        // return `[${market.pos}] ${desc} - ${status} - ${market.period}`
        return `${desc} - ${status} - ${market.period}`
    }

    render() {
        const { style, rowIndex, totalColumnWidth, hasVariableSpread } = this.props;
        const data = { ...this.DATA };
        const { desc, flags, period, variableSpreadDataItem, parentEvent } = data;
        const isChangingStatus = this.props.isChangingStatus || data.isChangingStatus;
        const status = this._getStatus(flags);
        const disableActions = ['settled','resulted'].indexOf(status.toLowerCase()) > -1 || isChangingStatus;
        const marketId = data.key.substr(1,data.key.length);
        const parentEventMarkets = parentEvent.children.map((market)=> {
            return {
                desc: market.desc,
                key: market.key,
                period: market.period,
                id: market.key.substr(1, market.key.length),
                rawDesc: market.rawDesc
            }
        })
        let classNames = ['row', 'market-row', status.toLowerCase()];

        if (this.columnHasUpdated) {
            classNames.push('updated');
        }
        if (hasVariableSpread) {
            classNames.push('variable-spread-row', 'first-row');
        }
        
        let className = classNames.join(' ');
        return (
            <div className={className} style={{...style, width: totalColumnWidth+'px'}}>
                <div className="column market">
                    <div className={disableActions ? "market-desc" : "market-desc enable-actions"}>
                        <ul className="market-actions list-reset button-group">
                            <li className="button">
                                <a className={disableActions ? 'disabled open' : 'open'}  onClick={!disableActions ? ()=>{this.props.onMarketStatusIconClick(data.key, 'OPEN')} : ()=>{}}>
                                    <i className="phxico phx-play"></i>
                                </a>
                            </li>
                            <li className="button">
                                <a className={disableActions ? 'disabled suspended' : 'suspended'}  onClick={!disableActions ? ()=>{this.props.onMarketStatusIconClick(data.key, 'SUSPENDED')} : ()=>{}}>
                                    <i className="phxico phx-pause"></i>
                                </a>
                            </li>
                            <li className="button">
                                <a className={disableActions ? 'disabled closed' : 'closed'}  onClick={!disableActions ? ()=>{this.props.onMarketStatusIconClick(data.key, 'CLOSED')} : ()=>{}}>
                                    <i className="phxico phx-stop"></i>
                                </a>
                            </li>
                            <li className="button">
                                <a  title="Analysis"
                                    onClick={(e)=> {
                                        this.props.analysisButtonClick(this.props.data.key);
                                    }}>
                                    <i className="phxico phx-chart-bar"></i>
                                </a>
                            </li>
                        </ul>
                        <a
                            onClick={(e)=> {
                                e.preventDefault();
                                this.props.onMarketDescClick(marketId, parentEventMarkets);
                            }}
                            className="text-bold color-foreground">
                            {this._renderDescription(data, status)}
                            {isChangingStatus && this._renderLoadingIndicator()}
                        </a>
                    </div>
                    {!!variableSpreadDataItem && this._renderVariableSpreadData()}
                </div>
            </div>
        )
    }
}

const mapStateToProps = (state, ownProps) => {
    let { key } = ownProps.data;
    let dataFromModel = couponModel.getChunk(key);
    return {
        marketState: state.market,
        isChangingStatus: state.market.marketKeysChangingStatus.includes(key),
        dataFromModel: dataFromModel ? dataFromModel : {},
        rowHeight: state.riskParameters.rowHeight,
        openModalsCount: state.modals.openModalsCount,
        hasUpdate: couponModel.tree.updatedIds.includes(key),
        filterPeriod: state.riskParameters.period,
        filterMarket: state.riskParameters.market,
        isChangingStatus: state.marketStateDetails.isChangingStatus
    };
};

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        
    };
};

export default connect(mapStateToProps, null)(Market);