import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import LoadingIndicator from 'components/loadingIndicator'
import { fetchBetRestrictionKeys, resetCurrentData, setPathIdForEvent, fetchSportPeriods } from './actions'
import BetTypes from './BetTypes/index'
import Details from './Details/index'
import Matrix from './Matrix/index'
import MainPanelHeader from './MainPanelHeader/index'
import { fetchEventPathDetails } from '../Path/actions'

const mapStateToProps = state => {
    return {
        activeAppId: state.apps.activeAppId,
        activePathId: state.sportsTree.activePathId,
        pathsMap: state.sportsTree.pathsMap,
        event: state.eventCreatorEvent.event,
        isFetchingBetRestrictions: state.betRestrictions.isFetchingBetRestrictions,
        isFetchingMatrixData: state.betRestrictions.isFetchingMatrixData,
        isFetchingMatrixDataFailed: state.betRestrictions.isFetchingMatrixDataFailed,
        activeBetTypeKey: state.betRestrictions.activeBetTypeKey,
        matrixDataCache: state.betRestrictions.matrixDataCache,
        pathIdForEvent: state.betRestrictions.pathIdForEvent,
        sportCode: state.sportsTree.activeSportCode,
    }
}

const mapDispatchToProps = dispatch => {
    return bindActionCreators(
        {
            fetchBetRestrictionKeys,
            fetchSportPeriods,
            resetCurrentData,
            setPathIdForEvent,
            fetchEventPathDetails,
        },
        dispatch
    )
}

class BetRestrictions extends Component {
    componentWillMount() {
        let {
            activeAppId,
            pathsMap,
            activePathId,
            fetchBetRestrictionKeys,
            fetchSportPeriods,
            setPathIdForEvent,
            event,
            sportCode,
        } = this.props
        let eventTypeId = null
        if (activeAppId === 1) {
            let path = pathsMap[activePathId]
            if (path && path.type === 'event') {
                if (event && event.parentId) {
                    setPathIdForEvent(event.parentId)
                    if (event.type.toUpperCase() === 'GAME') {
                        eventTypeId = 1 // Game Event
                    } else {
                        eventTypeId = 2 // Rank Event
                    }
                }
            }
            let { pathId, fetchEventPathDetails } = this.props
            fetchEventPathDetails(pathId)
        }
        fetchSportPeriods(sportCode)
        fetchBetRestrictionKeys(eventTypeId)
    }

    componentWillUpdate(nextProps) {
        let { pathsMap, activePathId, activeAppId } = nextProps
        let nextPath = pathsMap[activePathId]
        if (activeAppId === 1) {
            if (this.props.activePathId !== activePathId) {
                this.props.resetCurrentData()
                if (nextPath && nextPath.type === 'path') {
                    this.props.fetchBetRestrictionKeys()
                }
            }

            if (nextProps.pathId !== this.props.pathId && nextProps.pathId >= 0) {
                this.props.fetchEventPathDetails(nextProps.pathId)
            }
        }
    }

    componentWillUnmount() {
        let { pathIdForEvent, resetCurrentData, setPathIdForEvent } = this.props
        resetCurrentData()
        if (pathIdForEvent) {
            setPathIdForEvent(null)
        }
    }

    render() {
        let {
            activeBetTypeKey,
            matrixDataCache,
            isFetchingMatrixData,
            isFetchingMatrixDataFailed,
            isFetchingBetRestrictions,
            activeAppId,
        } = this.props
        let { matrixData } = matrixDataCache[activeBetTypeKey] || {}
        return (
            <div className="bet-restrictions-container">
                <div className="form-wrapper">
                    {activeAppId === 1 && <MainPanelHeader />}
                    <div className="panel-content">
                        <div className="content-sidebar">
                            {isFetchingBetRestrictions && (
                                <div className="loading-container">
                                    <LoadingIndicator />
                                </div>
                            )}
                            {!isFetchingBetRestrictions && [<BetTypes key="betTypes" />, <Details key="betDetails" />]}
                        </div>
                        <div className="content-main">
                            {isFetchingMatrixData && (
                                <div className="loading-container">
                                    <LoadingIndicator />
                                </div>
                            )}
                            {isFetchingMatrixDataFailed && (
                                <div className="loading-container">Error loading bet restrictions.</div>
                            )}
                            {matrixData &&
                                matrixData.length === 0 && <div className="loading-container">No results found.</div>}
                            {matrixData && matrixData.length >= 1 && <Matrix />}
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(BetRestrictions)
