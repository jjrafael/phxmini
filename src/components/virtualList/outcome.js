import React, { PropTypes } from "react";
import Tooltip from 'rc-tooltip';
import { bindActionCreators } from 'redux';
import 'rc-tooltip/assets/bootstrap.css';
import { formatDateTimeString, getDaysDiffFromNow, prettifyTime, formatNumber, getMarketStatusFromFlags, deepDiffMapper } from '../../utils';
import riskDataConfig from '../../configs/riskDataConfig';
import channelConfig from '../../configs/channelConfig';
import { connect } from 'react-redux';
import couponModel from '../../models/couponModel';
import isEqual from 'lodash.isequal';
import { addBelowMinimumPriceMargin, removeBelowMinimumPriceMargin } from '../../actions/riskDataChanges';

class Outcome extends React.Component {
    constructor(props) {
        super(props);
        this.DATA = this.props.data;
        this._oldValue = null;
        this._handlePriceInputBlur = this._handlePriceInputBlur.bind(this);
        this._setOutcomesMap = this._setOutcomesMap.bind(this);

        this.outcomesMap = {};
        let price = this.props.unsavedPriceChange === null ? this.DATA.price : this.props.unsavedPriceChange
        this.state = {
            newPrice: price,
            invalidPrice: null,
            editingCell: {
                row: null,
                column: null
            }
        }
        this._setOutcomesMap(price);
    }

    shouldComponentUpdate(nextProps, nextState) {
        // console.log('nextProps: ', nextProps);
        // console.log('this.props: ', this.props);
        let { key } = this.props.data;
        if (this.props.outcomeKeysTogglingVisibility.includes(key) !== nextProps.outcomeKeysTogglingVisibility.includes(key) ||
            (key === this.props.outcomeKey && this.props.isFetchingOutcomePriceByLine !== nextProps.isFetchingOutcomePriceByLine) ||
            this.props.riskDataChanges.isSavingChanges !== nextProps.riskDataChanges.isSavingChanges ||
            this.state.editingCell.row !== nextState.editingCell.row ||
            this.state.newPrice !== nextState.newPrice ||
            this.props.rowHeight !== nextProps.rowHeight ||
            this.props.isResizingColumns !== nextProps.isResizingColumns ||
            this.props.openModalsCount !== nextProps.openModalsCount || // update everytime a modal is closed
            this.props.hasUpdate !== nextProps.hasUpdate ||
            !isEqual(this.props.parentFlags, nextProps.parentFlags) ||
            this.props.filterPeriod !== nextProps.filterPeriod ||
            this.props.filterMarket !== nextProps.filterMarket ||
            this.state.invalidPrice !== nextProps.invalidPrice ||
            this.props.treeLength !== nextProps.treeLength
        ) {
            this.DATA = { ...this.DATA, ...nextProps.dataFromModel };
            this._setOutcomesMap(nextState.newPrice);
            return true;
        } else {
            return false;
        }
    }

    componentDidUpdate(prevProps, prevState) {
        if(this._clearColumnsWithUpdate.length) {
            this._clearColumnsWithUpdate();
        }
        if(prevProps.hasUpdate !== this.props.hasUpdate) {
            this._oldValue = prevProps.data
        }
        if(this.props.data.key !== prevProps.data.key) {
            this.setState({
                newPrice: this.props.unsavedPriceChange === null ? this.props.data.price : this.props.unsavedPriceChange
            })
        }
        if(this.props.data.price !== prevProps.data.price) {
            this.setState({
                newPrice: this.props.unsavedPriceChange === null ? this.props.data.price : this.props.unsavedPriceChange
            })
        }
    }

    componentWillUnmount () {
        clearTimeout(this.invalidPriceTimer);
    }

    _setEditingCell(row, column) {
        this.setState({
            editingCell: { row, column }
        });
    }

    _getParentMarketStatus() {
        let flags = this.DATA.parentPath ? this.DATA.parentPath.flags : this.DATA.parentMarket.flags
        return getMarketStatusFromFlags(flags);
    }

    _clearColumnsWithUpdate() {
        this._columnsWithUpdate = [];
    }

    _showSpread() {
        return riskDataConfig.visibleSpreadMarketTypeGroups.indexOf(this.DATA.parentMarket.marketTypeGroup) > -1;
    }

    _isUnpriced() {
        return !!this.DATA.flags && this.DATA.flags.indexOf('unpriced') > -1;
    }

    _calculatePriceMargin(outcomesMap) {
        let keys = Object.keys(outcomesMap);
        let priceMargin = 0;
        keys.map(key => {
            let price = Number(outcomesMap[key].price);
            if (typeof price === 'number' && price !== 0) {
                priceMargin += 100 / price;
            }
        });
        return Math.floor(priceMargin);
    }

    _setOutcomesMap (price) {
        this.DATA.parentPath.children.map(outcome => {
            if (outcome.key.indexOf('o') === 0) {
                if (outcome.key === this.DATA.key) {
                    this.outcomesMap[outcome.key] = {...outcome, price}
                } else {
                    this.outcomesMap[outcome.key] = {...outcome}
                }
            }
        })
    }

    _handlePriceInputBlur() {
        const currentPrice = this.DATA.price;
        const { newPrice } = this.state;
        this._setEditingCell(null, null);
        let priceMargin = this._calculatePriceMargin(this.outcomesMap);
        if (newPrice || newPrice === '') {
            const numCurrentPrice = Number(currentPrice);
            const numPrice = Number(newPrice);
            let formattedPrice = numPrice.toFixed(3);
            const lastCharPos = formattedPrice.length - 1;
            if (formattedPrice.charAt(lastCharPos) === '0') {
                formattedPrice = formattedPrice.substr(0, lastCharPos);
            }
            if (numCurrentPrice !== numPrice){
                if (numPrice === 0) {
                    this.setState({newPrice: ''});
                    this.props.setMarketPriceMargin(this.DATA.parentPath.key, priceMargin);
                    this.props.addUnsavedPriceChange(this.DATA.key, formattedPrice, this.DATA.parentPath.key);
                } else if (numPrice < 1.001) {
                    this.setState({
                        newPrice: currentPrice,
                        invalidPrice: formattedPrice
                    });
                    this.props.unsetMarketPriceMargin(this.DATA.parentPath.key);
                    this.props.removeUnsavedPriceChange(this.DATA.key, this.DATA.parentPath.key);
                    this.invalidPriceTimer = setTimeout(e => {
                        this.setState({invalidPrice: null});
                    }, 3000)
                } else {
                    this.setState({newPrice: formattedPrice});
                    this.props.setMarketPriceMargin(this.DATA.parentPath.key, priceMargin);
                    this.props.addUnsavedPriceChange(this.DATA.key, formattedPrice, this.DATA.parentPath.key);
                }
            } else if(numPrice === numCurrentPrice) {
                this.setState({newPrice: formattedPrice});
                this.props.unsetMarketPriceMargin(this.DATA.parentPath.key);
                this.props.removeUnsavedPriceChange(this.DATA.key, this.DATA.parentPath.key);
            }
            if (priceMargin < 103) {
                this.props.addBelowMinimumPriceMargin(this.DATA.parentPath.key, {
                    ...this.DATA.parentPath,
                    parentPath: {...this.DATA.parentPath.parentPath}}
                );
            } else {
                this.props.removeBelowMinimumPriceMargin(this.DATA.parentPath.key)
            }
        } else {
            this.setState({newPrice: currentPrice});
            this.props.unsetMarketPriceMargin(this.DATA.parentPath.key);
            this.props.removeBelowMinimumPriceMargin(this.DATA.parentPath.key)
        }
    }

    _handlePriceInputChange(price) {
        let data = this.props.data;
        let validDecimalNumber = /^(0*|[1-9]\d*)?(\.\d{0,3})?$/g;
        if (validDecimalNumber.test(price) && price !== '.') {
            if (price !== this.state.newPrice) {
                this.setState({newPrice: price});
                this._setOutcomesMap(price);
                let priceMargin = this._calculatePriceMargin(this.outcomesMap);
                this.props.setMarketPriceMargin(this.DATA.parentPath.key, priceMargin);
            } else {
                this.props.unsetMarketPriceMargin(this.DATA.parentPath.key);
            }
        }
    }

    _handlePriceInputKeyPress(e) {
        if (e.key === 'Enter') {
            this._handlePriceInputBlur();
            this._setEditingCell(null, null);
        }
    }

    _renderPriceSourceIcon(priceSource) {
        if(!priceSource) {
            return null
        }
        switch (priceSource) {
            case 'feed':
                return (
                    <span className="priceSourceIcon" key="priceSourceIcon">
                        <i className="phxico icon-xsmall phx-rss push-right"></i>
                    </span>
                )
                break
            case 'derived':
                return (
                    <span className="priceSourceIcon" key="priceSourceIcon">
                        <i className="icon-xsmall fx-icon push-right">fx</i>
                    </span>
                )
                break;
            default:
                return null
        }
    }

    _getColumnData(dataSource, dataKeys) {
        const columnData = {};
        if(!dataSource) {
            return columnData
        }
        for(var i = 0; i < dataKeys.length; i++) {
            const dataKey = dataKeys[i];
            switch(dataKey) {
                case 'price':
                    if(this.props.unsavedPriceChange) {
                        columnData[dataKey] = this.props.unsavedPriceChange;
                        break;
                    }
                default:
                    columnData[dataKey] = typeof dataSource !== 'undefined' ? dataSource[dataKey] : null;
            }
        }
        return columnData;
    }

    _renderColumnData(columnDataObject, columnConfig) {
        return Object.keys(columnDataObject).map((dataKey, index) => {
            let className = dataKey;
            let value = columnDataObject[dataKey];
            if((value === null || typeof value === 'undefined') && !!columnConfig.displayNullDataAs && !this._isUnpriced()) {
                value = columnConfig.displayNullDataAs;
            } else if(value === null && typeof value === 'undefined') {
                return null
            }
            if(value === 0) {
                className += ' zero';
            } else if(!isNaN(value) && value > 0) {
                className += ' positive';
            } else if(!isNaN(value) && value < 0) {
                className += ' negative';
            }
            if(typeof value !== 'undefined' && columnConfig.formatData && typeof columnConfig.formatData === 'function') {
                value = columnConfig.formatData(value);
            }
            return this._renderColumnDatum(dataKey, value, columnDataObject, className);
        });
    }

    _renderColumnDatum(key, value, columnDataObject, className) {
        if(typeof value === 'undefined' || value === null) {
            return null
        }
        if (key === 'price') {
            if (value === '0.00') {
                value = '';
            }
        }
        switch(key) {
            case 'priceSource':
                return this._renderPriceSourceIcon(value);
            default:
                return (
                    <span className={className} key={key}>
                        {value}
                    </span>
                )
        }
    }

    _renderOutcomeRiskCells(outcomeData) {
        const { setEditingCell, rowIndex, widthToBeDistributed } = this.props;
        const { editingCell } = this.state;
        const { parentMarket } = outcomeData;
        const outcomeRisk = outcomeData.outcomeRisk || {};
        const oldOutcomeRisk = this._oldValue !== null ? this._oldValue.outcomeRisk : null;
        return riskDataConfig.columns.map((column, index) => {
            if(index < 2 || (!column.visible && !column.alwaysVisible)) {
                return null
            }
            let className = 'column tright';
            let width = column.width || riskDataConfig.defaultColumnWidth;
            if(widthToBeDistributed > 0) {
                width = parseInt(width) + widthToBeDistributed + 'px';
            }
            const { defaultColumnDataSource } = riskDataConfig;
            const dataSource = column.dataSource === 'outcome' ? outcomeData : outcomeRisk;
            const oldDataSource = column.dataSource === 'outcome' ? this._oldValue : oldOutcomeRisk;
            const { dataKeys } = column;
            const columnData = this._getColumnData(dataSource, dataKeys);
            const oldData = this._getColumnData(oldDataSource, dataKeys);
            const hasUpdated = oldDataSource !== null && JSON.stringify(oldData) !== JSON.stringify(columnData);
            const isEditable = column.allowEdit && ['open', 'suspended', 'closed'].indexOf(this._getParentMarketStatus().toLowerCase()) > -1;
            const isEditingCell = editingCell.row === rowIndex && editingCell.column === index;
            const hasUnsavedPriceChange = this.props.unsavedPriceChange;
            if(hasUpdated) {
                className += ' updated';
            }
            if(isEditable) {
                className += ' editable';
            }
            if(hasUnsavedPriceChange && column.desc === 'Last Price') {
                className += ' unsaved';
            }
            if(isEditingCell) {
                return (
                    <div
                        style={{minWidth: width, maxWidth: width}}
                        key={index}
                        className={className}
                        // onMouseLeave={this._handlePriceInputBlur}
                    >
                        <input
                            autoFocus
                            className="block-input tright"
                            type="text"
                            value={this.state.newPrice || ''}
                            onKeyPress={(e)=>this._handlePriceInputKeyPress(e)}
                            onChange={(e)=>{this._handlePriceInputChange(e.target.value)}}
                            onBlur={this._handlePriceInputBlur}
                            onFocus={(e)=> e.target.select()}/>
                    </div>
                )
            } else if(column.desc === 'Last Price') {
                return (
                        <div
                            className={`column-last-price ${className}`}
                            key={index}
                            style={{minWidth: width, maxWidth: width}}
                            onMouseEnter={()=> {
                                if(this.props.onPriceMouseOver) {
                                    this.props.onPriceMouseOver(outcomeData.key.substr(1, outcomeData.key.length));
                                }
                                if (this.state.invalidPrice) {
                                    this.setState({invalidPrice: null});
                                    clearInterval(this.invalidPriceTimer);
                                }
                            }}
                            onClick={() => {
                                if(isEditable) {
                                    this._setEditingCell(rowIndex, index);
                                }
                            }}>
                            {this.props.otherLinePrice &&
                            <Tooltip
                                placement={'right'}
                                mouseEnterDelay={1}
                                mouseLeaveDelay={0}
                                destroyTooltipOnHide={true}
                                onVisibleChange={(value)=> {
                                    if(!value && this.props.onPriceMouseLeave) {
                                        this.props.onPriceMouseLeave();
                                    }
                                }}
                                overlay={<div style={{ height: 30 }}>{this.props.otherLinePrice}</div>}>
                                <div>
                                    <span className="column-data clearfix block">
                                        {this._renderColumnData(columnData, column)}
                                    </span>
                                </div>
                            </Tooltip>
                            }
                            {this.state.invalidPrice &&
                                <div className="rc-tooltip  rc-tooltip-placement-right rc-tooltip-warning">
                                    <div className="rc-tooltip-content">
                                        <div className="rc-tooltip-arrow"></div>
                                        <div className="rc-tooltip-inner">
                                            <div className="text-error">{this.state.invalidPrice} is an invalid price.</div>
                                        </div>
                                    </div>
                                </div>
                            }
                            
                            {!this.props.otherLinePrice &&
                            <span className={`column-data clearfix block}`}>
                                {this._renderColumnData(columnData, column)}
                            </span>
                            }
                        </div>
                    )
            } else {
                return (
                    <div
                        className={className}
                        key={index}
                        style={{minWidth: width, maxWidth: width}}>
                        <span className="column-data clearfix block">
                            {this._renderColumnData(columnData, column)}
                        </span>
                    </div>
                )
            }
        });
    }

    _isHidden(data) {
        const { hiddenFlag } = data;
        if(hiddenFlag && !!Object.keys(hiddenFlag).length) {
            return true
        }
        return false
    }

    _isVoided() {
        const { data } = this.props;
        if(data.flags && data.flags.indexOf('void') > -1) {
            return true
        }
        return false
    }

    _renderVisibleIcon() {
        const id = this.DATA.key.substr(1,this.DATA.key.length);
        return (
            <a  onClick={()=>{this.props.onVisibilityIconClick({ ...this.DATA, id }, true)}}>
                <i className="phxico phx-eye icon-small"></i>
            </a>
        )
    }

    _renderHiddenFlag(hiddenFlag) {
        const { reason, hideTime } = hiddenFlag;
        const daysDiff = getDaysDiffFromNow(hideTime);
        const formattedTime = prettifyTime(hideTime);
        const { hours, minutes, seconds } = formattedTime;
        const id = this.DATA.key.substr(1,this.DATA.key.length);
        let daysAgo = '';
        if(daysDiff === 0) {
            daysAgo = 'Today';
        } else if(daysDiff === 1) {
            daysAgo = 'Yesterday';
        } else {
            daysAgo = `${daysDiff} days ago`;
        }
        return (
            <a  title={`Hidden ${daysAgo} - ${formattedTime}: ${reason}`} onClick={()=>{this.props.onVisibilityIconClick({ ...this.DATA, id }, false)}}>
                <i className="phxico phx-eye-off icon-small"></i>
            </a>
        )
    }

    _renderVisibility(data) {
        const { hiddenFlag } = data;
        if(this._isHidden(data)) {
            return this._renderHiddenFlag(hiddenFlag);
        } else {
            return this._renderVisibleIcon();
        }
    }

    _renderVisibilityLoader() {
        return (
            <span>
                <i className="phxico phx-spinner phx-spin"></i>
            </span>
        )
    }

    _renderResultIcon() {
        const { result, flags } = this.DATA;
        if(this._isVoided()) {
            return <i className="phxico phx-flag" title="Void"></i>
        }
        if(!result) {
            return null
        }
        switch (result.toUpperCase()) {
            case 'WIN':
                return <i className="phxico phx-trophy" title="Winner"></i>
            case 'LOSE':
                return <i className="phxico phx-sad" title="Placer"></i>
            case 'PLACE_2':
                return <i className="phxico phx-custom icon-numeric" title="2nd placer">2</i>
            case 'VOID':
                return <i className="phxico phx-flag" title="Void"></i>
            default:
                return (
                  <i></i>
                )

        }
    }

    _renderAnalysisIcon() {
        return (
            <a  title="Analysis" className="push-left"
                onClick={(e)=> {
                    this.props.analysisButtonClick(this.DATA.key);
                }}>
                <span className="phxico phx-chart-bar"></span>
            </a>
        )
    }

    render() {
        const { style, rowIndex, widthToBeDistributed } = this.props;
        const data = { ...this.DATA };
        const { desc, flags, period, outcomeRisk, hiddenFlag} = data;
        const parentMarket = data.parentPath || data.parentMarket;
        const isTogglingVisibility = this.props.isTogglingVisibility || data.isTogglingVisibility;
        const actionsWidth = riskDataConfig.columns[0].width || riskDataConfig.defaultColumnWidth;
        let opponentsWidth = riskDataConfig.columns[1].width || riskDataConfig.defaultColumnWidth;
        if(widthToBeDistributed > 0) {
            opponentsWidth = parseInt(opponentsWidth) + widthToBeDistributed + 'px';
        }
        const showSpreadOnDesc = riskDataConfig.visibleSpreadMarketTypeGroups.indexOf(parentMarket.marketTypeGroup) === -1 && parentMarket.marketTypeGroup !== 'PROPOSITION';
        const isOpen = !parentMarket.flags || parentMarket.flags.indexOf('resulted') === -1 && parentMarket.flags.indexOf('settled') === -1;
        const parentMarketStatus = getMarketStatusFromFlags(parentMarket.flags);
        let spreadText = data.formattedSpread;
        const rowClassName = `row outcome-row text-xmedium ${parentMarketStatus.toLowerCase()} ${this._isHidden(data) ? 'hidden-outcome' : ''}`;
        return (
            <div className={rowClassName} style={style}>
                <div className="column column-actions" style={{minWidth: actionsWidth, maxWidth: actionsWidth}}>
                    {isOpen && !isTogglingVisibility && this._renderVisibility(data)}
                    {isOpen && isTogglingVisibility && this._renderVisibilityLoader()}
                    {!isOpen && this._renderResultIcon()}
                    {this._renderAnalysisIcon()}
                </div>
                <div className="column column-desc" style={{minWidth: opponentsWidth, maxWidth: opponentsWidth}} title={desc}>
                    {desc} {showSpreadOnDesc && !!spreadText && spreadText}
                </div>
                {this._renderOutcomeRiskCells(data)}
            </div>
        )
    }
}

const mapStateToProps = (state, ownProps) => {
    let { key } = ownProps.data;
    let dataFromModel = couponModel.getChunk(key);
    let parentFlags = dataFromModel ? dataFromModel.parentPath.flags : [];
    let outcomeState = state.outcome;
    let riskDataChanges = state.riskDataChanges;
    let line = state.riskParameters.line;
    let otherLinePrice = outcomeState.isFetchingOutcomePriceByLine ? 'loading' : null;
    let unsavedPriceChange = typeof riskDataChanges.unsavedOutcomePriceChanges[key] === 'undefined' ? null :  riskDataChanges.unsavedOutcomePriceChanges[key];
    if (outcomeState.isFetchingOutcomePriceByLine === false && !outcomeState.fetchingOutcomePriceByLineFailed) {
        const otherPriceFormatted = outcomeState.outcomePriceByLine ? outcomeState.outcomePriceByLine : 'unpriced';
        otherLinePrice = `Kenya price: ${otherPriceFormatted}`;
    } else if (outcomeState.fetchingOutcomePriceByLineFailed) {
        otherLinePrice = 'Failed to load Kenya Price';
    }
    if(line === '12') {
        otherLinePrice = null;
    }
    return {
        outcomeState,
        otherLinePrice,
        unsavedPriceChange,
        riskDataChanges,
        parentFlags,
        isTogglingVisibility: outcomeState.outcomeKeysTogglingVisibility.includes(key),
        isFetchingOutcomePriceByLine: outcomeState.isFetchingOutcomePriceByLine,
        outcomeKeysTogglingVisibility: outcomeState.outcomeKeysTogglingVisibility,
        outcomeKey: 'o' + outcomeState.outcomeId,
        dataFromModel: dataFromModel ? {...dataFromModel, hiddenFlag: dataFromModel.hiddenFlag || {}} : {},
        rowHeight: state.riskParameters.rowHeight,
        openModalsCount: state.modals.openModalsCount,
        hasUpdate: couponModel.tree.updatedIds.includes(key),
        filterPeriod: state.riskParameters.period,
        filterMarket: state.riskParameters.market,
    };
};

const mapDispatchToProps = (dispatch, ownProps) => {
    return bindActionCreators({
        addBelowMinimumPriceMargin,
        removeBelowMinimumPriceMargin
    }, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(Outcome);