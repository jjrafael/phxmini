import React, { Component } from 'react'
import { connect } from 'react-redux'

import { createSelector } from 'reselect'
import {
    getUpdatedCellsArrayAndMatrixMap,
    betRestrictionHasChanges,
} from 'containersV2/EventCreator/BetRestrictions/helpers'

const activeBetTypeKeySelector = state => state.betRestrictions.activeBetTypeKey
const matrixDataCacheSelector = state => state.betRestrictions.matrixDataCache
const updatedCellsArrayAndMatrixMapSelector = createSelector(
    activeBetTypeKeySelector,
    matrixDataCacheSelector,
    getUpdatedCellsArrayAndMatrixMap
)
const hasChangesInAnyTypeSelector = createSelector(matrixDataCacheSelector, matrixDataCache => {
    return betRestrictionHasChanges(matrixDataCache)
})

const mapStateToProps = state => {
    const { updatedCellsArray, matrixMap, deletedRestrictions } = updatedCellsArrayAndMatrixMapSelector(state)
    return {
        hasChangesInAnyType: hasChangesInAnyTypeSelector(state),
        updatedCellsArray,
        deletedRestrictions,
        matrixMap,
    }
}

export default WrappedComponent => {
    class Wrapper extends Component {
        render() {
            const { hasChanges, matrixMap, updatedCellsArray, deletedRestrictions, hasChangesInAnyType } = this.props
            const newProps = {
                hasChanges: hasChanges || hasChangesInAnyType,
                hasChangesInCurrentType: !!(updatedCellsArray.length || deletedRestrictions.length),
                updatedCellsArray,
                deletedRestrictions,
                matrixMap,
            }
            return <WrappedComponent {...this.props} {...newProps} />
        }
    }
    return connect(mapStateToProps)(Wrapper)
}
