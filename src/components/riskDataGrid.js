import React, { PropTypes } from "react";
import RiskDataGridHead from './riskDataGrid/riskDataGridHead';
import RiskDataGridBody from './riskDataGrid/riskDataGridBody';

export default class RiskDataGrid extends React.Component {
    constructor(props) {
        super(props);
    }

    _filterData() {
        const { data, eventFilter } = this.props;
        if(!eventFilter.length) {
            return { ...data };
        } else if(!data.events.length) {
            return false
        } else {
            return {
                ...data,
                events: data.events.filter((event)=> event.matchedSearchString)
            }
        }
    }

    render() {
        const { data, marketFilter, periodFilter, eventFilter, onCollapseEvent, onExpandEvent, onExpandAllEvents, collapsedEvents } = this.props;
        const filteredData = this._filterData();
        return(
            <div className="risk-data-grid-container">
                {filteredData.events && filteredData.events.length > 0 &&
                <table className="risk-data-grid" cellSpacing="0" cellPadding="0">
                    <RiskDataGridHead columns={this.props.columns}/>
                    <RiskDataGridBody collapsedEvents={collapsedEvents} columns={this.props.columns} data={filteredData} eventFilter={eventFilter} marketFilter={marketFilter} periodFilter={periodFilter} onCollapseEvent={onCollapseEvent} onExpandEvent={onExpandEvent} onExpandAllEvents={onExpandAllEvents}/>
                </table>
                }
                {(!filteredData.events || filteredData.events.length === 0) &&
                <div className="message-container">
                    <p className="tcenter">
                        Risk Data is empty.
                    </p>
                </div>
                }
            </div>
        )
    }
}