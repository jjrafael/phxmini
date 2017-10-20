import React, { PropTypes } from "react";
import Event from './event';
import Market from './market';
import Outcome from './outcome';
import MarketSummary from './marketSummary';
import { formatDateTimeString } from '../../utils';
import filterTypes from '../../constants/filterTypes';

export default class RiskDataGridBody extends React.Component {
    constructor(props) {
        super(props);
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

    _renderOutcomesAndMarketSummaries(children) {
        const { columns } = this.props;
        return children.map((child, index, array)=> {
            if(child.key.split('')[0] === 'o') {
                return (
                    <Outcome data={child} columns={columns}/>
                )
            } else if(child.key.split('')[0] === 's') {
                return (
                    <MarketSummary data={child} columns={columns}/>
                )
            }
        });
    }

    _renderMarkets(markets) {
        const { columns } = this.props;
        return markets.map((market, index, array)=> {
            const outcomes = this._renderOutcomesAndMarketSummaries(market.children);
            return [
                <Market data={market} columns={columns}/>,
                outcomes
            ]
        });
    }


    _renderEvents() {
        const { data, columns, marketFilter, periodFilter, collapsedEvents, eventFilter } = this.props;
        if(!data.events) {
            return
        }
        return data.events.map((event)=> {
            const isCollapsed = collapsedEvents.indexOf(event.key) > -1;
            const marketsRendered = isCollapsed ? null : this._renderMarkets(event.children);
            return [
                <Event data={event} eventFilter={eventFilter} columns={columns} key={event.key} isCollapsed={isCollapsed} onCollapseToggle={(eventId, isCollapsed)=> this._toggleEventCollapseStatus(eventId, isCollapsed)}/>,
                marketsRendered
            ]
        });
    }

    render() {
        return(
            <tbody className="risk-data-grid-body">
                {this._renderEvents()}
            </tbody>
        )
    }
}