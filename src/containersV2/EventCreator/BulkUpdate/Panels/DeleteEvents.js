import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { createSelector } from 'reselect';
import { makeIterable, formatISODateString} from 'phxUtils';
import ConfirmModal from 'componentsV2/Modal/ConfirmModal';
import { deleteEvents } from '../../Event/actions';
import { deleteMarkets } from '../../EventMarkets/actions';
import Description from 'containersV2/SportsTree/Path/Description';
import { removeIdsfromPathSelections } from 'containersV2/SportsTree/actions';

const pathSelectionsMapSelector = state => state.sportsTree.pathSelectionsMap;
const pathSelectionsSelector = state => state.sportsTree.pathSelections;
const selectedEventsSelector = createSelector(
    pathSelectionsMapSelector, pathSelectionsSelector, (pathSelectionsMap, pathSelections) => {
        return pathSelections.filter(pathId => pathSelectionsMap[pathId].type === 'event').map(pathId => pathSelectionsMap[pathId]);
    }
);
const selectedMarketsSelector = createSelector(
    pathSelectionsMapSelector, pathSelectionsSelector, (pathSelectionsMap, pathSelections) => {
        return pathSelections.filter(pathId => pathSelectionsMap[pathId].type === 'market').map(pathId => pathSelectionsMap[pathId]);
    }
);

const mapStateToProps = (state, ownProps) => {
    return {
        selectedEvents: selectedEventsSelector(state),
        selectedMarkets: selectedMarketsSelector(state),
    };
};

const mapDispatchToProps = (dispatch, ownProps) => {
    return bindActionCreators({
        deleteEvents, deleteMarkets, removeIdsfromPathSelections
    }, dispatch);
};

class DeleteEventsPanel extends Component {
    constructor (props) {
        super(props);
        this._onDeleteEvents = this._onDeleteEvents.bind(this);
        this._onClearSelections = this._onClearSelections.bind(this);
        this.state = {
            showConfirmationModal: false
        }
    }
    _onDeleteEvents () {
        this.setState({showConfirmationModal: true });
    }
    _onClearSelections () {
        let {selectedEvents, selectedMarkets, removeIdsfromPathSelections} = this.props;
        let ids = [...selectedEvents.map(event => event.id), ...selectedMarkets.map(market => market.id)];
        removeIdsfromPathSelections(ids);
    }
    render () {
        let {
            selectedEvents,
            selectedMarkets,
            deleteEvents,
            deleteMarkets
        } = this.props;
        return (
            <div className="form-wrapper delete-events-wrapper">
                <div className="header panel-header">
                    <div className="panel-header-title">Delete Events</div>
                    <div className="panel-header-actions">
                        <button
                            className="button btn-box"
                            title="Clear selected events and/or markets"
                            onClick={this._onClearSelections}
                            disabled={!selectedEvents.length && !selectedMarkets.length}
                        ><i className="phxico phx-undo"></i></button>
                        <button
                            className="button btn-box"
                            title="Delete Events"
                            onClick={this._onDeleteEvents}
                            disabled={!selectedEvents.length && !selectedMarkets.length}
                        ><i className="phxico phx-delete"></i></button>
                    </div>
                </div>
                <div className="panel-content flex flex--column flex--grow">
                    <div className="panel-desc">Delete all selected events and/or markets</div>
                    <div className="flex flex--grow">
                        <div className="selection-list-panel">
                            <div>Selected Events</div>
                            <div className="list-container">
                                {!!selectedEvents.length
                                    ? <ul>{selectedEvents.map(event => {
                                        return <li><Description path={event} className="" /></li>
                                    })}</ul>
                                    : <div>No selected events</div>
                                }
                            </div>
                            
                        </div>
                        <div className="selection-list-panel">
                            <div>Selected Markets</div>
                            <div className="list-container">
                                {!!selectedMarkets.length
                                    ? <ul>{selectedMarkets.map(market => {
                                        return <li><Description path={market} className="" /></li>
                                    })}</ul>
                                    : <div>No selected markets</div>
                                }
                            </div>
                        </div>
                    </div>
                </div>
                {this.state.showConfirmationModal &&
                    <ConfirmModal
                        isVisible={true}
                        message={<div><p>You are about to delete events and/or markets. Are you sure you want to proceed?</p></div>}
                        onConfirm={e => {
                            this.setState({showConfirmationModal: false});
                            let selectedEventIds = selectedEvents.map(path => path.id)
                            let selectedMarketIds = selectedMarkets
                                .filter(path => !selectedEventIds.includes(path.parentId))
                                .map(path => path.id);
                            if (selectedEventIds.length) {
                                deleteEvents(selectedEventIds);
                            }
                            if (selectedMarketIds.length) {
                                deleteMarkets(selectedMarketIds);
                            }
                        }}
                        onCancel={e => {
                            this.setState({showConfirmationModal: false})
                        }}
                    />
                }
            </div>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(DeleteEventsPanel);
