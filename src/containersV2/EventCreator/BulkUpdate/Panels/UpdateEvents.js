import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { createSelector } from 'reselect';
import _ from 'underscore';
import queryString from 'query-string';
import moment from 'moment';
import { makeIterable } from 'phxUtils';
import ConfirmModal from 'componentsV2/Modal/ConfirmModal';
import LoadingIndicator from 'phxComponents/loadingIndicator';
import ModalWindow from 'components/modal';
import { fetchApplicableTemplates, updateApplicableTemplates } from '../actions';

const pathSelectionsMapSelector = state => state.sportsTree.pathSelectionsMap;
const pathSelectionsSelector = state => state.sportsTree.pathSelections;
const selectedPathsSelector = createSelector(
    pathSelectionsMapSelector, pathSelectionsSelector, (pathSelectionsMap, pathSelections) => {
        return pathSelections.filter(pathId => pathSelectionsMap[pathId].type === 'path').map(pathId => pathSelectionsMap[pathId]);
    }
);
const selectedEventsSelector = createSelector(
    pathSelectionsMapSelector, pathSelectionsSelector, (pathSelectionsMap, pathSelections) => {
        return pathSelections.filter(pathId => pathSelectionsMap[pathId].type === 'event').map(pathId => pathSelectionsMap[pathId]);
    }
);

const mapStateToProps = (state, ownProps) => {
    return {
        selectedPaths: selectedPathsSelector(state),
        selectedEvents: selectedEventsSelector(state),
        eventPathIds: state.applicableTemplates.eventPathIds,
        templates: state.applicableTemplates.templates,
        isFetchingApplicableTemplates: state.applicableTemplates.isFetchingApplicableTemplates,
        isUpdatingApplicableTemplates: state.applicableTemplates.isUpdatingApplicableTemplates,
        parameters: state.sportsTree.parameters,
        marketStatusFilter: state.sportsTree.marketStatusFilter,
        pathsMap: state.sportsTree.pathsMap,
        activePathId: state.sportsTree.activePathId
    };
};

const mapDispatchToProps = (dispatch, ownProps) => {
    return bindActionCreators({
        fetchApplicableTemplates,
        updateApplicableTemplates
    }, dispatch);
};

class UpdateEventsPanel extends Component {
    constructor(props) {
        super(props);

        this.state = {
            applyTemplate: false,
            selectedTemplateId: "none",
            showConfirmationModal: false
        }
        this._onToggleTemplate = this._onToggleTemplate.bind(this);
        this._hasItemSelected = this._hasItemSelected.bind(this);
        this._onTemplateChange = this._onTemplateChange.bind(this);
        this._onTemplateSave = this._onTemplateSave.bind(this);
        this._renderLoadingIndicator = this._renderLoadingIndicator.bind(this);
    }

    componentWillUpdate(nextProps) {
        if (this.props.selectedEvents !== nextProps.selectedEvents) {
            let parentIds = _.uniq(nextProps.selectedEvents.map(selectedEvent => (selectedEvent.parentId)));
            if (nextProps.eventPathIds.join(',') !== parentIds.join(',') && parentIds.length > 0) {
                this.props.fetchApplicableTemplates(parentIds);
            }
        }

        if (this.props.selectedPaths !== nextProps.selectedPaths) {
            let pathIds = _.uniq(nextProps.selectedPaths.map(path => (path.id)));
            if (nextProps.eventPathIds.join(',') !== pathIds.join(',') && pathIds.length > 0) {
                this.props.fetchApplicableTemplates(pathIds);
            }
        }
    }

    _onToggleTemplate() {
        this.setState({applyTemplate: !this.state.applyTemplate});
    }

    _hasItemSelected() {
        return (this.props.selectedEvents.length > 0 ||
            this.props.selectedPaths.length > 0) &&
            this.props.templates.length > 0;
    }

    _onTemplateChange({target}) {
        const { value } = target;
        this.setState({selectedTemplateId: value});
    }

    _onTemplateSave() {
        // NOTE: dateFrom, dateTo and statusIds are all require once eventPathIds is present

        let { selectedEvents, selectedPaths, marketStatusFilter, parameters, pathsMap, activePathId } = this.props;
        const { selectedTemplateId } = this.state;
        this.setState({ showConfirmationModal: true });
        const paramsObj = queryString.parse(parameters);
        const eventIds = selectedEvents.map(se => se.id);
        const eventPathIds = selectedPaths.map(sp => sp.id);
        const activePath = pathsMap[activePathId];

        // NOTE: Check if the selected path should reload data.
        let pathObj = {};
        if (activePath && activePath.type === "event") {
            pathObj.isRankEvent = activePath.eventType === 2 ? true : false;
            pathObj.eventId = activePathId
        } else {
            pathObj = null;
        }

        let params = {
            eventIds,
            eventPathIds,
            templateId: parseInt(selectedTemplateId),
        };
        if (eventPathIds.length > 0) {
            params['eventPathIds'] = eventPathIds;
            params['dateFrom'] = moment(paramsObj.fromDate.split('T').shift(), 'YYYY-MM-DD').format('YYYY-MM-DD');
            params['dateTo'] = moment(paramsObj.toDate.split('T').shift(), 'YYYY-MM-DD').format('YYYY-MM-DD');
            params['statusIds'] = marketStatusFilter.split(',').map(s => parseInt(s));
        }
        this.props.updateApplicableTemplates(params, pathObj);
        this.setState({ showConfirmationModal: false });
    }

    _renderLoadingIndicator() {
        return (
            <ModalWindow
                key="loading-modal"
                className="small-box"
                title="Loading"
                name="error"
                isVisibleOn={true}
                shouldCloseOnOverlayClick={false}
                closeButton={false}>
                <div>
                    <LoadingIndicator />
                </div>
            </ModalWindow>
        )
    }

    render () {
        let { className, selectedEvents, selectedPaths, templates, isFetchingApplicableTemplates, isUpdatingApplicableTemplates } = this.props;
        const { applyTemplate, selectedTemplateId } = this.state;

        return (
            <div className="form-wrapper update-events-wrapper">
                <div className="header panel-header">
                    <div className="panel-header-title">Update Events</div>
                    <div className="panel-header-actions">
                        <button
                            className="button btn-box"
                            title="Update Markets"
                            onClick={e => {
                                this.setState({showConfirmationModal: true});
                            }}
                            disabled={!this._hasItemSelected() || !applyTemplate || selectedTemplateId === "none"}
                        ><i className="phxico phx-check"></i></button>
                    </div>
                </div>
                <div className="panel-content">
                    <div className="flex flex--align-center">
                        <label className="flex flex--shrink">
                            <input disabled={!this._hasItemSelected() || isFetchingApplicableTemplates} type="checkbox" value={applyTemplate} onChange={this._onToggleTemplate}/>
                            Apply the following template:
                        </label>
                        <select
                            disabled={!this._hasItemSelected() || !applyTemplate || isFetchingApplicableTemplates}
                            className="flex flex--grow"
                            name="templates"
                            onChange={this._onTemplateChange}
                        >
                            <option value="none"></option>
                            {templates.map(template =>
                                <option key={template.id} value={template.id}>{template.description}</option>
                            )}
                        </select>
                    </div>
                </div>

                {this.state.showConfirmationModal &&
                    <ConfirmModal
                        isVisible={true}
                        message={<div><p>You are about to update the template. Are you sure you want to proceed?</p></div>}
                        onConfirm={e => {
                            this._onTemplateSave();
                        }}
                        onCancel={e => {
                            this.setState({showConfirmationModal: false})
                        }}
                    />
                }
                {
                    (isUpdatingApplicableTemplates) && this._renderLoadingIndicator()
                }
            </div>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(UpdateEventsPanel);
