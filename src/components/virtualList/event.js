import React, { PropTypes } from "react";
import { formatDateTimeString } from '../../utils'
import { connect } from 'react-redux';
import couponModel from '../../models/couponModel';

class Event extends React.Component {
    constructor(props) {
        super(props);
        this._handleMarketPeriodClick = this._handleMarketPeriodClick.bind(this);
    }

    shouldComponentUpdate(nextProps, nextState) {
        let { key } = this.props.data;
        if (this.props.rowHeight !== nextProps.rowHeight ||
            this.props.eventFilter !== nextProps.eventFilter ||
            this.props.collapsedEvents.includes(key) !== nextProps.collapsedEvents.includes(key) ||
            this.props.openModalsCount !== nextProps.openModalsCount || // update everytime a modal is closed
            this.props.hasUpdate !== nextProps.hasUpdate ||
            this.props.filterPeriod !== nextProps.filterPeriod ||
            this.props.filterMarket !== nextProps.filterMarket ||
            this.props.treeLength !== nextProps.treeLength
        ) {
            return true;
        } else {
            return false;
        }
    }

    _renderHighlightedDesc(desc, filter) {
        var indices = [];
        var match;
        filter = filter.toLowerCase();
        var filterRegExp = new RegExp(filter,"g");
        while (match = filterRegExp.exec(desc.toLowerCase())) {
            indices.push(match.index);
        }
        return indices.map((element, i) => {
            var pre = '';
            var match = desc.substr(element, filter.length);
            var post = '';
            if(i === 0 && element !== 0) { //not first letter
                pre = desc.substring(0, element);
            }
            if(typeof indices[i + 1] === 'undefined' && (element + filter.length) < desc.length) { // last item in indices and there are words after
                post = desc.substring(element+filter.length, desc.length);
            } else if(typeof indices[i + 1] !== 'undefined') {
                post = desc.substring(element+filter.length, indices[i + 1]);
            }
            return [
                <span>{pre}</span>,
                <span className="search-matching">{match}</span>,
                <span>{post}</span>
            ];
        });
    }

    _getPeriodAbbreviation(period) {
        return period.split(' ').map((item) => {
            switch(item.toLowerCase()) {
                case 'first':
                    return '1';
                case 'second':
                    return '2';
                case 'third':
                    return '3';
                case 'fourth':
                    return '4';
                case 'fifth':
                    return '5';
                default:
                    return item.charAt(0).toUpperCase();
            }
        }).join('');
    }

    _handleMarketPeriodClick() {
        this.props.marketPeriodClick(this.props.data.key);
    }

    _renderAnalysisButton() {
        return (
            <a
                 title="Analysis"
                className="push-right"
                key={'analysis'}
                onClick={(e)=> {
                    this.props.analysisButtonClick(this.props.data.key);
                }}>
                <span className="phxico phx-chart-bar"></span>
            </a>
        )
    }

    _renderEventMarketPeriods() {
        const { data } = this.props;
        const periods = data.marketPeriods.map((period, index) => {
            return (
                <a className="push-right"
                key={index}
                onClick={this._handleMarketPeriodClick}
                >
                    {period}
                </a>
            )
        });
        return (
            <div className="event-market-periods">
                {[this._renderAnalysisButton(), ...periods]}
            </div>
        )
    }

    render() {
        const { data, columns, isCollapsed, onCollapseToggle, eventFilter, style, rowIndex, totalColumnWidth } = this.props;
        return (
            <div className="row event-row first-row" style={{...style, width: totalColumnWidth+'px'}}>
                <div className="column event">
                    <div className="event-desc">
                        <h4 className="text-bold text-large" title={data.desc}>
                        <a
                            onClick={(eventId)=> onCollapseToggle(data.key, isCollapsed)}
                            
                            className="collapse-icon push-right">
                            {isCollapsed && <i className="phxico phx-chevron-right icon-small"></i>}
                            {!isCollapsed && <i className="phxico phx-chevron-down phx-icon-small"></i>}
                        </a>
                        {data.restricted && <span title="Restricted Event" className="push-right phxico phx-alert"></span>}
                        {eventFilter.length < 2 && data.desc}
                        {eventFilter.length >= 2 && this._renderHighlightedDesc(data.desc, eventFilter)}
                        </h4>
                    </div>
                    <div className="market-periods">
                        {this._renderEventMarketPeriods()}
                    </div>
                </div>
            </div>
        )
    }
}

const mapStateToProps = (state, ownProps) => {
    let { key } = ownProps.data;
    return {
        rowHeight: state.riskParameters.rowHeight,
        collapsedEvents: state.riskData.collapsedEvents,
        openModalsCount: state.modals.openModalsCount,
        hasUpdate: couponModel.tree.updatedIds.includes(key),
        filterPeriod: state.riskParameters.period,
        filterMarket: state.riskParameters.market,
    };
};

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        
    };
};

export default connect(mapStateToProps, null)(Event);