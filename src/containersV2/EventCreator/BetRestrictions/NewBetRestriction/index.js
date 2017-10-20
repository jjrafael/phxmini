import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { createSelector } from 'reselect'
import ConfirmModal from 'components/modalYesNo'
import { makeIterable } from 'phxUtils'
import utilitiesConstants from 'containersV2/Utilities/App/constants'
import {
    nextStep,
    previousStep,
    updateNewMatrixData,
    resetSteps,
    addNewBetRestrictions,
    createNewBetRestrictionsMatrix,
    updateStep,
} from '../actions'
import { reset as resetSportsTree, setInitialStateProps } from 'containersV2/SportsTree/actions'
import { generateCriteriaKey } from '../helpers'
import MatrixStep from './Steps/MatrixStep'
import NewMatrixStep from './Steps/NewMatrixStep'
import EventPathStep from './Steps/EventPathStep'
import EventTypeStep from './Steps/EventTypeStep'
import PeriodStep from './Steps/PeriodStep'
import MarketTypeStep from './Steps/MarketTypeStep'
import NewMatrixWarning from './NewMatrixWarning/index'

const activeBetTypeKeySelector = state => state.betRestrictions.activeBetTypeKey
const matrixDataCacheSelector = state => state.betRestrictions.matrixDataCache
const newRestrictionsMapSelector = createSelector(
    activeBetTypeKeySelector,
    matrixDataCacheSelector,
    (activeBetTypeKey, matrixDataCache) => {
        let cache = matrixDataCache[activeBetTypeKey]
        if (cache) {
            return cache.newRestrictionsMap
        } else {
            return {}
        }
    }
)
const mapStateToProps = state => {
    return {
        activeAppId: state.apps.activeAppId,
        sportId: state.sportsTree.activeSportId,
        pathsMap: state.sportsTree.pathsMap,
        activePathId: state.sportsTree.activePathId,
        step: state.betRestrictions.step,
        activeBetType: state.betRestrictions.activeBetType,
        newBetRestrictionData: state.betRestrictions.newBetRestrictionData,
        isAddingNewBetRestriction: state.betRestrictions.isAddingNewBetRestriction,
        isAddingNewBetRestrictionFailed: state.betRestrictions.isAddingNewBetRestrictionFailed,
        eventPathStep: state.betRestrictions.stepsMap['EVENT_PATH'],
        newRestrictionsMap: newRestrictionsMapSelector(state),
        newMatrixBetType: state.betRestrictions.newBetRestrictionData.newMatrixBetType,
        isNewMatrix: state.betRestrictions.newBetRestrictionData.isNewMatrix,
    }
}

const mapDispatchToProps = dispatch => {
    return bindActionCreators(
        {
            nextStep,
            previousStep,
            updateNewMatrixData,
            resetSteps,
            addNewBetRestrictions,
            createNewBetRestrictionsMatrix,
            updateStep,
            resetSportsTree,
            setInitialStateProps,
        },
        dispatch
    )
}

class NewBetRestriction extends Component {
    constructor(props) {
        super(props)
        this.state = { showNewMatrixConfirmationModal: false }
    }
    componentWillMount() {
        let {
            updateNewMatrixData,
            sportId,
            updateStep,
            activeAppId,
            activeBetType,
            eventPathStep,
            pathsMap,
            activePathId,
        } = this.props
        let updatedMatrixData = { sportId }
        if (activeAppId === 1 && activeBetType.betRestrictionTypeId === 1) {
            // if current app is Event Creator and Select Outcome type
            if (eventPathStep.enabled) {
                updateStep('EVENT_PATH', { enabled: false })
            }
            updatedMatrixData = {
                eventPathId: activePathId,
                eventPath: pathsMap[activePathId].path,
                eventPathDescription: pathsMap[activePathId].description,
                sportId,
            }
        } else {
            if (!eventPathStep.enabled) {
                updateStep('EVENT_PATH', { enabled: true })
            }
        }
        updateNewMatrixData(updatedMatrixData)
        if (utilitiesConstants.APPLICATION_ID === this.props.activeAppId) {
            this.props.setInitialStateProps({
                baseUrl: '/utilities',
                defaultParams: { lineId: 2 },
                datesParamFormat: '',
                marketStatusFilter: '',
                datesFilter: '',
                parameters: '',
                activePathId: null,
            })
        }
    }
    componentWillUpdate(nextProps) {
        let { isAddingNewBetRestriction, onClose } = this.props
        if (
            isAddingNewBetRestriction &&
            !nextProps.isAddingNewBetRestriction &&
            !nextProps.isAddingNewBetRestrictionFailed
        ) {
            onClose()
        }
    }
    componentWillUnmount() {
        this.props.resetSteps()
        if (utilitiesConstants.APPLICATION_ID === this.props.activeAppId) {
            this.props.resetSportsTree()
        }
    }
    render() {
        let {
            activeAppId,
            nextStep,
            previousStep,
            onClose,
            step,
            newBetRestrictionData,
            activeBetType,
            addNewBetRestrictions,
            createNewBetRestrictionsMatrix,
            newMatrixBetType,
            isNewMatrix,
            newRestrictionsMap,
        } = this.props
        return (
            <div className="new-bet-restriction-container">
                <div className="modal-main-content">
                    {step.key === 'MATRIX' && <MatrixStep />}
                    {step.key === 'NEW_MATRIX' && <NewMatrixStep />}
                    {step.key === 'EVENT_PATH' && <EventPathStep />}
                    {step.key === 'EVENT_TYPE' && <EventTypeStep />}
                    {step.key === 'PERIOD' && <PeriodStep />}
                    {step.key === 'MARKET_TYPE' && <MarketTypeStep />}
                </div>
                <div className="button-group modal-controls">
                    <button
                        type="button"
                        onClick={() => {
                            onClose()
                        }}
                    >
                        Cancel
                    </button>
                    <button
                        type="button"
                        disabled={!!step.isFirstStep}
                        onClick={() => {
                            previousStep()
                        }}
                    >
                        Previous
                    </button>
                    <button
                        type="button"
                        disabled={
                            !!step.isLastStep ||
                            (step.key === 'NEW_MATRIX' && newMatrixBetType.betRestrictionTypeId === undefined)
                        }
                        onClick={() => {
                            if (step.key === 'MATRIX' && newBetRestrictionData.isNewMatrix) {
                                this.setState({ showNewMatrixConfirmationModal: true })
                            } else {
                                nextStep()
                            }
                        }}
                    >
                        Next
                    </button>
                    <button
                        type="button"
                        disabled={
                            step.key === 'MATRIX' ||
                            (step.key === 'NEW_MATRIX' && newMatrixBetType.betRestrictionTypeId === undefined)
                        }
                        onClick={() => {
                            let payload = { ...newBetRestrictionData }
                            delete payload.sportId
                            delete payload.isNewMatrix
                            delete payload.newMatrixBetType
                            delete payload.selectedType
                            let betType = { ...activeBetType }
                            if (isNewMatrix) {
                                betType = { ...activeBetType, ...newMatrixBetType }
                            }
                            if (activeAppId !== 1) {
                                // if current app is not Event Creator
                                delete betType.eventPathId
                            }
                            let payloadKey = generateCriteriaKey(payload)
                            let finalPayload = [...makeIterable(newRestrictionsMap)]
                            if (!newRestrictionsMap[payloadKey]) {
                                finalPayload.push(payload)
                            }
                            if (isNewMatrix) {
                                finalPayload = [payload]
                                createNewBetRestrictionsMatrix(betType, finalPayload, payloadKey)
                            } else {
                                addNewBetRestrictions(betType, finalPayload, payloadKey)
                            }
                        }}
                    >
                        Finish
                    </button>
                </div>
                <ConfirmModal
                    title={'Warning'}
                    message={<NewMatrixWarning />}
                    isVisibleOn={this.state.showNewMatrixConfirmationModal}
                    yesButtonLabel={'Yes'}
                    onYesButtonClickHandler={() => {
                        nextStep()
                        this.setState({ showNewMatrixConfirmationModal: false })
                    }}
                    noButtonLabel={'No'}
                    onNoButtonClickedHandler={() => {
                        this.setState({ showNewMatrixConfirmationModal: false })
                    }}
                />
            </div>
        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(NewBetRestriction)
