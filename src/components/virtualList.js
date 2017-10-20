import React, { PropTypes } from "react";
import ReactDom from "react-dom";
import { AutoSizer, List } from 'react-virtualized';
import Header from './virtualList/header';
import Event from './virtualList/event';
import EventSecondRow from './virtualList/eventSecondRow';
import Market from './virtualList/market';
import MarketSecondRow from './virtualList/marketSecondRow';
import Outcome from './virtualList/outcome';
import MarketSummary from './virtualList/marketSummary';
import riskDataConfig from '../configs/riskDataConfig';
import isEqual from 'lodash.isequal';

const rowMap = {
    'Compact': {className: 'row-height-compact', height: 20},
    'Default': {className: 'row-height-default', height: 25},
    'Large': {className: 'row-height-large', height: 30},
};

export default class VirtualList extends React.Component {
    constructor(props) {
        super(props);
        this._rowRenderer = this._rowRenderer.bind(this);
        this._getRowHeight = this._getRowHeight.bind(this);
        this._setMarketPriceMargin = this._setMarketPriceMargin.bind(this);
        this._unsetMarketPriceMargin = this._unsetMarketPriceMargin.bind(this);
        this._list = [];
        this._widthToBeDistributed = null;
        this._totalColumnWidth = this.props.totalColumnWidth;
        this._verticalScrollHandler = this._verticalScrollHandler.bind(this);
        this.state = {
            isResizingColumns: false,
            showBackToTop: false,
            leftOffset: 0,
            isScrolling: false,
            priceMarginsMap: {},
            selectedCell: {
                row: 0,
                column: 0
            }
        }
        this._scrollLeft = 0;
        this._scrollTop = 0;
        this._timer;
        this._isScrolling = false;
    }

    shouldComponentUpdate (nextProps, nextState) {
        // console.log('this.props: ', this.props);
        // console.log('nextProps: ', nextProps);
        if ((!this.props.hasUpdates && nextProps.hasUpdates && !this._isScrolling) || 
            (this.props.modals.openModalsCount !== nextProps.modals.openModalsCount) ||
            (this.props.hasPendingUpdates && !nextProps.hasPendingUpdates) ||
            (!isEqual(this.props.riskParameters, nextProps.riskParameters)) ||
            (!isEqual(this.props.collapsedEvents, nextProps.collapsedEvents)) ||
            (!isEqual(this.state.priceMarginsMap, nextState.priceMarginsMap)) ||
            (this.state.isResizingColumns !== nextState.isResizingColumns) ||
            (this.props.data.length !== nextProps.data.length)
        ) {
            return true;
        } else {
            return false;
        }
    }

    componentDidMount() {
        const listNode = ReactDom.findDOMNode(this._ListComponent);
        const headerNode = ReactDom.findDOMNode(this._ListHeader);
        const virtualListContainerNode = ReactDom.findDOMNode(this._VirtualListContainerNode);
        if(listNode && headerNode) {
            listNode.addEventListener('scroll', (e) => {
                clearTimeout(this._timer);
                this.props.setScrolling(true);
                this._isScrolling = true;
                this._timer = setTimeout(e => {
                    this.props.setScrolling(false);
                    this._isScrolling = false;
                }, 750)
                if (this._scrollTop !== e.target.scrollTop) {
                    this._scrollTop = e.target.scrollTop;
                }
                if (this._scrollLeft !== e.target.scrollLeft) {
                    this._scrollLeft = e.target.scrollLeft;
                    headerNode.style.marginLeft = `-${listNode.scrollLeft}px`;
                    this.setState({leftOffset: `${listNode.scrollLeft}`});
                }
            });
            listNode.addEventListener('keydown', (e) => {
                this._handleKeyPress(e);
            });
        }
        if(virtualListContainerNode) {
            window.addEventListener('resize', (e) => {
                const width = virtualListContainerNode.offsetWidth;
                this._distributeRemainingSpaceToVisibleColumns(width - this.props.totalColumnWidth);
            });
            const width = virtualListContainerNode.offsetWidth;
            this._distributeRemainingSpaceToVisibleColumns(width - this.props.totalColumnWidth);
        }
    }

    componentWillUnmount() {
        const node = ReactDom.findDOMNode(this._ListComponent);
        const virtualListContainerNode = ReactDom.findDOMNode(this._VirtualListContainerNode);
        if(node) {
            node.removeEventListener('scroll', (e) => {})
            node.removeEventListener('keydown', (e) => {})
            window.removeEventListener('resize', (e) => {})
        }
    }

    componentDidUpdate() {
        if(this.props.data.length) {
            this._ListComponent.recomputeRowHeights();
        }
    }

    _verticalScrollHandler(clientHeight, scrollHeight, scrollTop) {
        const showBackToTop = scrollTop >= 100; // scroll 100px before showing back to top
        if (showBackToTop !== this.state.showBackToTop) {
            this.forceUpdate();
            this.setState({showBackToTop});
        }
    }

    _handleKeyPress(e) {
        // console.log(e);
    }

    _setMarketPriceMargin(marketId, priceMargin) {
        this.props.addEditMarketPriceMargin(Number(marketId.substr(1)))
        this.setState({
            priceMarginsMap: {
                ...this.state.priceMarginsMap,
                [marketId]: priceMargin
            }
        });
    }
    _unsetMarketPriceMargin(marketId) {
        this.props.removeEditMarketPriceMargin(Number(marketId.substr(1)))
        let newPriceMarginsMap = {...this.state.priceMarginsMap};
        delete newPriceMarginsMap[marketId];
        this.setState({
            priceMarginsMap: newPriceMarginsMap
        });
    }

    _collapseEvent(eventId) {
        this.props.onCollapseEvent(eventId);
    }

    _expandEvent(eventId) {
        this.props.onExpandEvent(eventId);
    }

    _toggleEventCollapseStatus(eventId, isCollapsed) {
        if(isCollapsed) {
            this._expandEvent(eventId)
        } else {
            this._collapseEvent(eventId);
        }
    }

    _getRowHeight({index}) {
        return typeof this.props.data[index].height === 'number' ? this.props.data[index].height : 30;
    }

    _rowRenderer ({ index, key, style }) {
        const row = this.props.data[index];
        const { eventFilter, columns, collapsedEvents, onOutcomeVisibilityIconClick, unsavedChanges, onAddUnsavedPriceChange, onRemoveUnsavedPriceChange, isSavingChanges, onMarketPeriodClick, onAnalysisButtonClick } = this.props;
        const { editingCell, leftOffset } = this.state;
        const hasUpdate = false; //this.props.updatedIds.indexOf(row.key) > -1;
        let totalColumnWidth = this._totalColumnWidth; //his.props.totalColumnWidth;
        switch (row.type) {
            case 'event':
                if (row.isSecondRow) {
                    return <EventSecondRow totalColumnWidth={totalColumnWidth} data={row} style={style} key={`${row.key}-secondrow`} />
                } else {
                    return (
                        <Event
                            totalColumnWidth={totalColumnWidth}
                            marketPeriodClick={onMarketPeriodClick}
                            rowIndex={index}
                            style={style}
                            data={row}
                            eventFilter={eventFilter}
                            key={row.key}
                            isCollapsed={collapsedEvents.indexOf(row.key) > -1}
                            analysisButtonClick={onAnalysisButtonClick}
                            treeLength={this.props.data.length}
                            onCollapseToggle={(eventId, isCollapsed)=> this._toggleEventCollapseStatus(eventId, isCollapsed)}/>
                    )
                }
                
            case 'market':
                if (row.isSecondRow) {
                    return <MarketSecondRow
                        totalColumnWidth={totalColumnWidth}
                        style={style}
                        data={row}
                        key={`${row.key}-secondrow`}
                        hasVariableSpread={true}
                        treeLength={this.props.data.length}
                    />
                }
                return (
                    <Market
                        totalColumnWidth={totalColumnWidth}
                        hasUpdate={hasUpdate}
                        rowIndex={index}
                        style={style}
                        data={row}
                        key={row.key}
                        leftOffset={leftOffset}
                        analysisButtonClick={onAnalysisButtonClick}
                        onMarketDescClick={this.props.onMarketDescClick}
                        onMarketStatusIconClick={this.props.onMarketStatusIconClick}
                        hasVariableSpread={row.hasVariableSpread}
                        treeLength={this.props.data.length}
                    />
                )
            case 'outcome':                
                return (
                    <Outcome
                        onPriceMouseOver={(outcomeId, lineId)=> {
                            if(this.props.onPriceMouseOver) {
                                this.props.onPriceMouseOver(outcomeId);
                            }
                        }}
                        onPriceMouseLeave={()=> {
                            if(this.props.onPriceMouseLeave) {
                                this.props.onPriceMouseLeave();
                            }
                        }}
                        setMarketPriceMargin={this._setMarketPriceMargin}
                        unsetMarketPriceMargin={this._unsetMarketPriceMargin}
                        widthToBeDistributed={this._widthToBeDistributed}
                        hasUpdate={hasUpdate}
                        isSavingChanges={isSavingChanges}
                        addUnsavedPriceChange={onAddUnsavedPriceChange}
                        removeUnsavedPriceChange={onRemoveUnsavedPriceChange}
                        rowIndex={index}
                        style={style}
                        data={row}
                        key={row.key}
                        analysisButtonClick={onAnalysisButtonClick}
                        isResizingColumns={this.state.isResizingColumns}
                        onVisibilityIconClick={this.props.onOutcomeVisibilityIconClick}
                        treeLength={this.props.data.length}
                    />
                )
            case 'marketSummary':
                return <MarketSummary
                            widthToBeDistributed={this._widthToBeDistributed}
                            hasUpdate={hasUpdate}
                            rowIndex={index}
                            style={style}
                            data={row}
                            priceMarginsMap={this.state.priceMarginsMap}
                            isResizingColumns={this.state.isResizingColumns}
                            key={row.key}
                            treeLength={this.props.data.length}
                        />
            default:
                return (
                  <div
                    className={row.type}
                    key={key}
                    style={style}
                  >
                  </div>
                )

        }
    }

    _distributeRemainingSpaceToVisibleColumns(remainingSpace) {
        this._widthToBeDistributed = remainingSpace / (this.props.columns.length - 1);
        if (this._widthToBeDistributed > 0) {
            this._totalColumnWidth = this._totalColumnWidth + ( this._widthToBeDistributed * (this.props.columns.length - 1));
        }
    }

    _renderResizingIndicator() {
        return (
            <div className="resizing-indicator tcenter">
                <p>Resizing...</p>
            </div>
        )
    }


    render() {
        const { data, columns, afterList } = this.props;
        if(!data || data.length === 0) {
            return (
                <div className="message-container">
                    <p className="tcenter">
                        Risk Data is empty.
                    </p>
                </div>
            )
        } else {
            // console.log('ROWS: ', data.length);
            let { className: rowClassName, height: rowHeight } = rowMap[this.props.riskParameters.rowHeight];
            let gridClassName = `risk-data-grid-container ${rowClassName}`;
            return (
                <div
                    className="virtual-list-container text-medium"
                    ref={node => {
                        if (node !== null) {
                          this._VirtualListContainerNode = node;
                        }
                      }}>
                    <a
                        
                        title="Back to top"
                        className={`back-to-top ${this.state.showBackToTop ? '' : 'hide'}`}
                        onClick={(e)=> {
                            const listNode = ReactDom.findDOMNode(this._ListComponent);
                            listNode.scrollTop = 0;
                        }}>
                        <i className="phxico phx-arrow-up"></i>
                    </a>
                    {this.state.isResizingColumns && this._renderResizingIndicator()}
                    <div
                        ref={ref => this._ListHeader = ref}
                        className="virtual-list-header">
                        <Header
                            onColumnResize={()=> {
                                const virtualListContainerNode = ReactDom.findDOMNode(this._VirtualListContainerNode);
                                const width = virtualListContainerNode.offsetWidth;
                                this._distributeRemainingSpaceToVisibleColumns(width - riskDataConfig.getTotalWidth());
                                this.setState({
                                    isResizingColumns: true
                                });
                                setTimeout(()=> {
                                    this.setState({
                                        isResizingColumns: false
                                    });
                                }, 300);
                            }}
                            widthToBeDistributed={this._widthToBeDistributed}
                            columns={columns}
                            leftOffset={this.state.leftOffset}
                            className={this.state.isScrolling ? 'scrolling' : ''}/>
                    </div>
                    <AutoSizer disableWidth>
                        {({ width, height }) => {
                            return (
                              <List
                                className={gridClassName}
                                ref={ref => this._ListComponent = ref}
                                height={height}
                                rowCount={data.length}
                                rowHeight={rowHeight}
                                rowRenderer={this._rowRenderer}
                                overscanRowCount={20}
                                width={width}
                                onScroll={(args) => {
                                    this._verticalScrollHandler(args.clientHeight, args.scrollHeight, args.scrollTop);
                                }}/>
                            )
                        }}
                    </AutoSizer>
                    {afterList}
                </div>
            )
        }
    }
}