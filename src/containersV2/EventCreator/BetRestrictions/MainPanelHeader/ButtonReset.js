import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import checkChanges from 'containersV2/EventCreator/BetRestrictions/hocs/checkChanges'
import { undoChanges } from 'containersV2/EventCreator/BetRestrictions/actions'
import utilitiesConstants from 'containersV2/Utilities/App/constants'

const activeBetTypeKeySelector = state => state.betRestrictions.activeBetTypeKey

const mapStateToProps = state => {
    return {
        activeAppId: state.apps.activeAppId,
        activeBetType: state.betRestrictions.activeBetType,
        activeBetTypeKey: activeBetTypeKeySelector(state),
    }
}

const mapDispatchToProps = dispatch => {
    return bindActionCreators(
        {
            undoChanges,
        },
        dispatch
    )
}

class ButtonReset extends Component {
    constructor(props) {
        super(props)
        this._reset = this._reset.bind(this)
    }
    _reset() {
        const { undoChanges, activeBetTypeKey } = this.props
        undoChanges(activeBetTypeKey)
    }
    render() {
        let { activeAppId, hasChangesInCurrentType } = this.props
        if (activeAppId === utilitiesConstants.APPLICATION_ID) {
            return (
                <button className="button btn-box" title="Reset" disabled={!hasChangesInCurrentType} onClick={this._reset}>
                    <i className={`phxico icon-medium phx-undo`} />
                </button>
            )
        } else {
            return null
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(checkChanges(ButtonReset))
