import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { createSelector } from 'reselect';
import { makeIterable } from 'phxUtils';
import ConfirmModal from 'componentsV2/Modal/ConfirmModal';
import { deleteEventPaths } from '../../Path/actions';
import { removeIdsfromPathSelections } from 'containersV2/SportsTree/actions';

const pathSelectionsMapSelector = state => state.sportsTree.pathSelectionsMap;
const pathSelectionsSelector = state => state.sportsTree.pathSelections;
const selectedPathsSelector = createSelector(
    pathSelectionsMapSelector, pathSelectionsSelector, (pathSelectionsMap, pathSelections) => {
        return pathSelections.filter(pathId => pathSelectionsMap[pathId].type === 'path').map(pathId => pathSelectionsMap[pathId]);
    }
);

const mapStateToProps = (state) => {
    return {
        selectedPaths: selectedPathsSelector(state),
    }
};

const mapDispatchToProps = (dispatch) => {
    return bindActionCreators({
        deleteEventPaths, removeIdsfromPathSelections
    }, dispatch);
};

class DeletePathsPanel extends Component {
    constructor (props) {
        super(props);
        this._onDeleteEventsPaths = this._onDeleteEventsPaths.bind(this);
        this._onClearSelections = this._onClearSelections.bind(this);
        this.state = {
            showConfirmationModal: false
        }
    }
    _onDeleteEventsPaths () {
        this.setState({showConfirmationModal: true });
    }
    _onClearSelections () {
        let {selectedPaths, removeIdsfromPathSelections} = this.props;
        let ids = [...selectedPaths.map(path => path.id)];
        removeIdsfromPathSelections(ids);
    }
    render () {
        let {
            deleteEventPaths,
            selectedPaths
        } = this.props;
        return (
            <div className="form-wrapper delete-paths-wrapper">
                <div className="header panel-header">
                    <div className="panel-header-title">Delete Event Paths</div>
                    <div className="panel-header-actions">
                        <button
                            className="button btn-box"
                            title="Clear selected event paths"
                            onClick={this._onClearSelections}
                            disabled={!selectedPaths.length}
                        ><i className="phxico phx-undo"></i></button>
                        <button
                            className="button btn-box"
                            title="Delete Events and/or Markets"
                            onClick={this._onDeleteEventsPaths}
                            disabled={!selectedPaths.length}
                        ><i className="phxico phx-delete"></i></button>
                    </div>
                </div>
                <div className="panel-content delete-paths-panel flex flex--column flex--grow">
                    <div className="panel-desc">Delete all selected event paths</div>
                    <div className="flex flex--grow">
                        <div className="selection-list-panel">
                            <div>Selected Event Paths</div>
                            <div className="list-container">
                                {!!selectedPaths.length
                                    ? <ul>{selectedPaths.map(event => {
                                        return <li>{event.description}</li>
                                    })}</ul>
                                    : <div>No selected event paths</div>
                                }
                            </div>
                        </div>
                    </div>
                </div>
                {this.state.showConfirmationModal &&
                    <ConfirmModal
                        isVisible={true}
                        message={<div><p>You are about to delete event paths. Are you sure you want to proceed?</p></div>}
                        onConfirm={e => {
                            this.setState({showConfirmationModal: false});
                            deleteEventPaths(selectedPaths.map(path => path.id))
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

export default connect(mapStateToProps, mapDispatchToProps)(DeletePathsPanel);