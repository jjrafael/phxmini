import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import checkChanges from 'containersV2/EventCreator/BetRestrictions/hocs/checkChanges'
import { updateBetRestrictions, deleteBetRestrictions } from 'containersV2/EventCreator/BetRestrictions/actions'
import utilitiesConstants from 'containersV2/Utilities/App/constants'

const mapStateToProps = state => {
    return {
        activeAppId: state.apps.activeAppId,
        activeBetType: state.betRestrictions.activeBetType,
    }
}

const mapDispatchToProps = dispatch => {
    return bindActionCreators(
        {
            updateBetRestrictions,
            deleteBetRestrictions,
        },
        dispatch
    )
}

class ButtonSave extends Component {
    constructor(props) {
        super(props)
        this._save = this._save.bind(this)
    }
    _save() {
        const { updatedCellsArray, deletedRestrictions, matrixMap, activeBetType } = this.props
        const { deleteBetRestrictions, updateBetRestrictions } = this.props
        if (updatedCellsArray.length) {
            let restrictions = updatedCellsArray.map(key => {
                return matrixMap[key].cell
            })
            updateBetRestrictions(restrictions)
        }
        if (deletedRestrictions.length) {
            let restrictions = deletedRestrictions.map(res => res.criteria)
            deleteBetRestrictions(activeBetType, restrictions)
        }
    }
    render() {
        let { activeAppId, hasChangesInCurrentType } = this.props
        if (activeAppId === utilitiesConstants.APPLICATION_ID) {
            return (
                <button className="button btn-box" title="Save" disabled={!hasChangesInCurrentType} onClick={this._save}>
                    <i className={`phxico icon-medium phx-save`} />
                </button>
            )
        } else {
            return null
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(checkChanges(ButtonSave))
