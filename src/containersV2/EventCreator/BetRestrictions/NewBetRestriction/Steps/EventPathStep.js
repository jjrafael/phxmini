import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { createSelector } from 'reselect';
import { updateNewMatrixData, updateStep } from '../../actions';
import utilitiesConstants from 'containersV2/Utilities/App/constants';
import { updateActivePathId } from 'containersV2/SportsTree/actions';
import PathsList from './PathsList/index';
import Controls from './PathsList/Controls';

const riskSportsSelector = state => state.apiConstants.values.riskSports;
const activeSportCodeSelector = state => state.sportsTree.activeSportCode;
const sportSelector = createSelector(
    [riskSportsSelector, activeSportCodeSelector],
    (riskSports, activeSportCode) => {
        return riskSports.find(sport => sport.code === activeSportCode)
    }
)

const mapStateToProps = (state) => {
    return {
        activeAppId: state.apps.activeAppId,
        eventPathId: state.betRestrictions.newBetRestrictionData.eventPathId,
        activePathId: state.sportsTree.activePathId,
        activeSportCode: activeSportCodeSelector(state),
        sport: sportSelector(state),
        active: state.sportsTree.active,
        pathsMap: state.sportsTree.pathsMap,
        activePathAncestors: state.sportsTree.activePathAncestors,
        periodStep: state.betRestrictions.stepsMap['PERIOD'],
    };
};

const mapDispatchToProps = (dispatch) => {
    return bindActionCreators({ updateNewMatrixData, updateStep, updateActivePathId }, dispatch);
};

class EventPathStep extends Component {
    constructor (props) {
        super(props);
        let textOnEventCreator;
        let { activeAppId, pathsMap, activePathAncestors } = this.props;
        if (activeAppId === 1) { // if current app is Event Creator
            let ancestorsText = activePathAncestors.map(id => pathsMap[id].description).reverse();
            textOnEventCreator = ancestorsText.join(' / ');
        }
        this.state = {
            textOnEventCreator
        }
    }
    componentWillMount() {
        let { periodStep, eventPathId, updateStep } = this.props;
        if (!eventPathId && periodStep.enabled) {
            updateStep('PERIOD', {enabled: false});
        }
        if (eventPathId && !periodStep.enabled) {
            updateStep('PERIOD', {enabled: true});
        }
    }
    render () {
        let {
            activeAppId,
            eventPathId,
            activePathId,
            updateNewMatrixData,
            updateStep,
            pathsMap,
            updateActivePathId,
            sport
        } = this.props;
        let text = this.state.textOnEventCreator || 'Specific Event Path';
        return (
            <div className="form-wrapper">
                <div className="header panel-header">
                    <div className="panel-header-title">Select Event Path</div>
                </div>
                <div className="panel-content">
                    <p>To which Event Path does the Bet Restriction apply?</p>
                    <div className="form-group">
                        <label><input type="radio" checked={!eventPathId} onChange={() => {
                            updateNewMatrixData({eventPathId: null, eventPath: null, eventPathDescription: ''})
                            updateStep('PERIOD', {enabled: false})
                            if (utilitiesConstants.APPLICATION_ID === activeAppId) {
                                updateActivePathId(null);
                            }
                        }}/> Any Event Path</label>
                    </div>
                    <div className="form-group">
                        <label><input type="radio" checked={!!eventPathId} onChange={() => {
                            updateStep('PERIOD', {enabled: true})
                            if (activeAppId === 1) { // if current app is Event Creator
                                let sportPath = pathsMap[activePathId].path;
                                updateNewMatrixData({
                                    eventPathId: activePathId,
                                    eventPath: sportPath,
                                    eventPathDescription: pathsMap[activePathId].description
                                })
                            }
                            if (utilitiesConstants.APPLICATION_ID === activeAppId) {
                                updateNewMatrixData({
                                    eventPathId: sport.defaultEventPathId,
                                    eventPath: sport.path,
                                    eventPathDescription: sport.description
                                })
                                updateActivePathId(sport.defaultEventPathId);
                            }
                        }}/> {text}</label>
                    </div>
                    {activeAppId === utilitiesConstants.APPLICATION_ID &&
                        [<Controls key="controls" />, <PathsList key="list" />]
                    }
                </div>
            </div>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(EventPathStep);