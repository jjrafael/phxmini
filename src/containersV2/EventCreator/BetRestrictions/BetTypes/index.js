import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { getBetTypeKey } from '../helpers';
import { fetchMatrixData, setActiveBetType } from '../actions';
import Types from './Types';

const mapStateToProps = (state, ownProps) => {
    return {
        betTypes: state.betRestrictions.betTypes,
        activeBetType: state.betRestrictions.activeBetType,
        eventPathId: state.sportsTree.activePathId,
        matrixDataCache: state.betRestrictions.matrixDataCache,
        activeAppId: state.apps.activeAppId,
        pathIdForEvent: state.betRestrictions.pathIdForEvent,
    };
};

const mapDispatchToProps = (dispatch, ownProps) => {
    return bindActionCreators({
        fetchMatrixData, setActiveBetType
    }, dispatch);
};

class BetTypes extends Component {
    render () {
        let { betTypes, activeBetType, fetchMatrixData, setActiveBetType, eventPathId, matrixDataCache, activeAppId, pathIdForEvent } = this.props;
        let { betRestrictionTypeId, betTypeGroupId, transSubTypeId } = activeBetType;
        return (
            <div className="bet-types-container">
                <div className="inner">{betTypes.map(types => {
                    return <Types
                        key={types.betRestrictionTypeDesc}
                        types={types}
                        betRestrictionTypeId={betRestrictionTypeId}
                        ownBetRestrictionTypeId={types.betRestrictionTypeId}
                        betTypeGroupId={betTypeGroupId}
                        transSubTypeId={transSubTypeId}
                        onItemClick={data => {
                            let betType = {...data};
                            let matrixDataKey = getBetTypeKey(betType);
                            if (activeAppId === 1) { // if current app is Event Creator
                                betType.eventPathId = eventPathId;
                                if (pathIdForEvent) {
                                    betType.eventPathId = pathIdForEvent;
                                }
                            }
                            if (matrixDataCache[matrixDataKey]) {
                                setActiveBetType(betType);
                            } else {
                                fetchMatrixData(betType);
                            }
                        }}
                    />
                })}</div>
            </div>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(BetTypes);