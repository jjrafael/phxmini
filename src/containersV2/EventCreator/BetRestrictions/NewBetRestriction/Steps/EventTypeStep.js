import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { updateNewMatrixData } from '../../actions';

const mapStateToProps = (state, ownProps) => {
    return {
        eventTypeId: state.betRestrictions.newBetRestrictionData.eventTypeId,
        newMatrixBetType: state.betRestrictions.newBetRestrictionData.newMatrixBetType,
        isNewMatrix: state.betRestrictions.newBetRestrictionData.isNewMatrix,
        activeBetType: state.betRestrictions.activeBetType,
    };
};

const mapDispatchToProps = (dispatch, ownProps) => {
    return bindActionCreators({ updateNewMatrixData }, dispatch);
};

class EventTypeStep extends Component {
    constructor (props) {
        super(props);
        let { activeBetType, newMatrixBetType, isNewMatrix } = this.props;
        this.state = {
            activeBetType: isNewMatrix ? newMatrixBetType : activeBetType
        }
    }
    componentWillMount () {
        let { eventTypeId, updateNewMatrixData } = this.props;
        let { activeBetType } = this.state;
        if (activeBetType.eventTypeId === 1) {
            if (eventTypeId !== 1) {
                updateNewMatrixData({eventTypeId: 1});
            }
        } else if (activeBetType.eventTypeId === 2) {
            if (eventTypeId !== 2) {
                updateNewMatrixData({eventTypeId: 2});
            }
        }
    }
    render () {
        let { eventTypeId, updateNewMatrixData } = this.props;
        let { activeBetType } = this.state;
        return (
            <div className="form-wrapper">
                <div className="header panel-header">
                    <div className="panel-header-title">Select Event Type</div>
                </div>
                <div className="panel-content">
                    <p>To which type of event does the Bet Restriction apply?</p>
                    <div className="form-group">
                        <label>
                            <input type="radio"
                                checked={eventTypeId === 0}
                                disabled={activeBetType.eventTypeId === 1 || activeBetType.eventTypeId === 2}
                                onChange={e => {
                                    updateNewMatrixData({eventTypeId: 0})
                                }}
                            /> Both Game and Rank events
                        </label>
                    </div>
                    <div className="form-group">
                        <label>
                            <input type="radio"
                                disabled={activeBetType.eventTypeId === 2}
                                checked={eventTypeId === 1}
                                onChange={e => {
                                    updateNewMatrixData({eventTypeId: 1})
                                }}
                            /> Only Game events
                        </label>
                    </div>
                    <div className="form-group">
                        <label>
                            <input type="radio"
                                checked={eventTypeId === 2}
                                disabled={activeBetType.eventTypeId === 1}
                                onChange={e => {
                                    updateNewMatrixData({eventTypeId: 2})
                                }}
                            /> Only Rank Events
                        </label>
                    </div>
                </div>
            </div>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(EventTypeStep);