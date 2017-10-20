import React, { PropTypes } from "react";
import { formatDateTimeString, getMarketStatusFromFlags } from '../../utils';
import riskDataConfig from '../../configs/riskDataConfig';
import { connect } from 'react-redux';
import couponModel from '../../models/couponModel';
import isEqual from 'lodash.isequal';

class MarketSummary extends React.Component {
    constructor(props) {
        super(props);
        this.DATA = this.props.data;
        this._oldValue = null;
    }

    componentDidUpdate(prevProps, prevState) {
        if(prevProps.hasUpdate !== this.props.hasUpdate) {
            this._oldValue = prevProps.data
        }
    }

    shouldComponentUpdate(nextProps, nextState) {
        this.DATA = { ...this.DATA, ...nextProps.dataFromModel };
        let { key } = this.props.data;
        if (this.props.rowHeight !== nextProps.rowHeight ||
            this.props.isResizingColumns !== nextProps.isResizingColumns ||
            this.props.openModalsCount !== nextProps.openModalsCount || // update everytime a modal is closed
            this.props.hasUpdate !== nextProps.hasUpdate ||
            !isEqual(this.props.parentFlags, nextProps.parentFlags) ||
            this.props.priceMarginsMap[this.DATA.parentPath.key] !== nextProps.priceMarginsMap[this.DATA.parentPath.key] ||
            this.props.filterPeriod !== nextProps.filterPeriod ||
            this.props.filterMarket !== nextProps.filterMarket ||
            this.props.editedPriceMargins !== nextProps.editedPriceMargins ||
            this.props.gridEditedPriceMargins !== nextProps.gridEditedPriceMargins ||
            this.props.treeLength !== nextProps.treeLength
        ) {
            if (this.props.hasUpdate !== nextProps.hasUpdate) {
                ['currentPriceMargin', 'firstPriceMargin'].map(prop => {
                    if (nextProps.dataFromModel[prop] === undefined && this.DATA[prop]) {
                        delete this.DATA[prop];
                    }
                });
            }
            return true;
        } else {
            return false;
        }
    }

    _calculatePriceMargin(prices) {
        let priceMargin = 0;
        prices.map(price => {
            if (typeof price === 'number' && price !== 0) {
                priceMargin += 100 / price;
            }
        });
        // priceMargin = Number(priceMargin.toFixed(2)); 
        priceMargin = Math.floor(Number(priceMargin)); // currently, it only shows the whole number of the price margin when in grid
        // if (this.state.priceMargin !== priceMargin) {
        //     this.setState({priceMargin});
        //     this.props.onPriceMarginChange(priceMargin)
        // }
        return priceMargin;
    }

    _renderMarketSummaryCells(data) {
        return riskDataConfig.columns.map((column, index) => {
            if(index < 2 || !column.visible) {
                return null
            }
            const dataKeys = column.dataKeys;
            const summaryKeys = column.summaryDataKeys;
            let columnHasUpdated = false;
            let updatedClass = '';
            let columnData = '';
            if(column.desc === 'First Price') {
                columnHasUpdated = this._oldValue && 
                    (this._oldValue[summaryKeys[0]] !== data[summaryKeys[0]]);
                columnData = data[summaryKeys[0]];
            } else if(column.desc === 'Last Price') {
                columnHasUpdated = this._oldValue && 
                    (this._oldValue[summaryKeys[0]] !== data[summaryKeys[0]]);
                columnData = data[summaryKeys[0]];
                let newPriceMargin = this.props.priceMarginsMap[this.DATA.parentPath.key];
                let percentagePriceMargin = newPriceMargin ? newPriceMargin + '%' : '';
                if (newPriceMargin && percentagePriceMargin !== columnData) {
                    if (this.props.editedPriceMargins.includes(Number(this.DATA.parentPath.key.substr(1)))) {
                        columnData = percentagePriceMargin;
                    }
                }
            } else if(column.displayNullData && typeof data[dataKeys[0]] === 'undefined'){
                columnData = '0';
            } else {
                if(typeof column.formatData === 'function' && typeof data[dataKeys[0]] !== 'undefined') {
                    columnHasUpdated = this._oldValue && 
                        (this._oldValue[dataKeys[0]] !== data[dataKeys[0]]);
                    columnData = column.formatData(data[dataKeys[0]]);
                } else {
                    columnHasUpdated = this._oldValue && 
                        (this._oldValue[dataKeys[0]] !== data[dataKeys[0]]);
                    columnData = data[dataKeys[0]];
                }
            }
            let width = column.width || riskDataConfig.defaultColumnWidth;
            if(this.props.widthToBeDistributed > 0) {
                width = parseInt(width) + this.props.widthToBeDistributed + 'px';
            }
            updatedClass = columnHasUpdated ? 'updated' : '';
            let className = `column tright column-${column.desc.toLowerCase().split(' ').join('-').replace(/[^0-9a-z]/gi, '')}`;
            return [
                <div
                style={{minWidth: width, maxWidth: width}}
                className={`${className} ${updatedClass}`}>
                    <span className="column-data clearfix block">
                        {columnData}
                    </span>
                </div>
            ]
        })
    }

    render() {
        const { style, rowIndex, widthToBeDistributed } = this.props;
        const data = { ...this.DATA };
        const parentMarket = data.parentPath || data.parentMarket;
        const actionsWidth = riskDataConfig.columns[0].width || riskDataConfig.defaultColumnWidth;
        let opponentsWidth = riskDataConfig.columns[1].width || riskDataConfig.defaultColumnWidth;
        if(widthToBeDistributed > 0) {
            opponentsWidth = parseInt(opponentsWidth) + widthToBeDistributed + 'px';
        }
        const parentMarketStatus = getMarketStatusFromFlags(parentMarket.flags);
        return (
            <div className={`row market-summary-row text-small ${parentMarketStatus.toLowerCase()}`} style={style}>
                <div className="column column-actions" style={{minWidth: actionsWidth, maxWidth: actionsWidth}}>
                </div>
                <div className="column column-desc" style={{minWidth: opponentsWidth, maxWidth: opponentsWidth}}>
                    {formatDateTimeString(data.parentEvent.start)}
                </div>
                {this._renderMarketSummaryCells(data)}
            </div>
        )
    }
}

const mapStateToProps = (state, ownProps) => {
    let { key } = ownProps.data;
    let dataFromModel = couponModel.getChunk(key);
    let parentFlags = dataFromModel ? dataFromModel.parentPath.flags : [];
    return {
        parentFlags,
        rowHeight: state.riskParameters.rowHeight,
        openModalsCount: state.modals.openModalsCount,
        dataFromModel: dataFromModel ? dataFromModel : {},
        hasUpdate: couponModel.tree.updatedIds.includes(key),
        filterPeriod: state.riskParameters.period,
        filterMarket: state.riskParameters.market,
        editedPriceMargins: state.editMarket.editedPriceMargins,
        gridEditedPriceMargins: state.riskDataChanges.editedPriceMargins
    };
};

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        
    };
};

export default connect(mapStateToProps, null)(MarketSummary);