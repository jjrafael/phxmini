import React, { Component } from 'react';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import { bindActionCreators } from 'redux';
import { updateNewMatrixData, fetchUnusedBetRestrictionKeys } from '../../actions';
import BetType from '../../../BetRestrictions/BetTypes/BetType/index';

const restrictionTypesSelector = br => br.unusedBetTypes;
const newMatrixBetTypeSelector = br => br.newBetRestrictionData.newMatrixBetType;
const selectedTypeIdSelector = br => br.newBetRestrictionData.newMatrixBetType.betRestrictionTypeId;
const betTypesSelector = createSelector(
    restrictionTypesSelector,
    selectedTypeIdSelector,
    (restrictionTypes, selectedTypeId) => {
        let selected = restrictionTypes.find(type => type.betRestrictionTypeId === selectedTypeId);
        if (selected) {
            return selected.keys;
        } else {
            return [];
        }
    }
);
const mapStateToProps = (state, ownProps) => {
    return {
        isNewMatrix: state.betRestrictions.newBetRestrictionData.isNewMatrix,
        newMatrixBetType: newMatrixBetTypeSelector(state.betRestrictions),
        restrictionTypes: restrictionTypesSelector(state.betRestrictions),
        betTypes: betTypesSelector(state.betRestrictions),
        selectedTypeId: selectedTypeIdSelector(state.betRestrictions),
    };
};

const mapDispatchToProps = (dispatch, ownProps) => {
    return bindActionCreators({ updateNewMatrixData, fetchUnusedBetRestrictionKeys }, dispatch);
};

class NewMatrixStep extends Component {
    componentWillMount () {
        this.props.fetchUnusedBetRestrictionKeys();
    }
    render () {
        let { isNewMatrix, updateNewMatrixData, restrictionTypes, betTypes, selectedTypeId, newMatrixBetType } = this.props;
        return (
            <div className="form-wrapper">
                <div className="header panel-header">
                    <div className="panel-header-title">Create new Bet Restriction Matrix</div>
                </div>
                <div className="panel-content new-matrix-form-content">
                    <p>Please select the Restriction and Bet types for the new Matrix.</p>
                    <div className="form-group flex--align-center flex--shrink">
                        <label>Restriction Type: </label>
                        <select className="flex--grow"
                            value={newMatrixBetType.betRestrictionTypeId}
                            disabled={false}
                            onChange={e => {
                                let value = Number(e.target.value);
                                let target = restrictionTypes.find(type => type.betRestrictionTypeId === value);
                                let selectedType = {...target, subTypes: [], betRestrictionTypeId: value};
                                updateNewMatrixData({
                                    newMatrixBetType: {
                                        betRestrictionTypeId: value,
                                        betTypeGroupId: target.keys[0].betTypeGroupId,
                                        transSubTypeId: target.keys[0].transSubTypeId,
                                        eventTypeId: target.keys[0].eventTypeId
                                    },
                                    selectedType
                                })
                            }}
                        >{restrictionTypes.map(type => {
                            let value = type.betRestrictionTypeId;
                            return <option key={value} value={value}>{type.betRestrictionTypeDesc}</option>
                        })}</select>
                    </div>
                    <div className="form-group flex--grow">
                        <label>Bet Type: </label>
                        <div className="list-container">{!!betTypes.length &&
                            <ul>{betTypes.map(type => {
                                return <BetType
                                    key={`${type.betTypeGroupId}-${type.transSubTypeId}`}
                                    description={type.keyDesc}
                                    isActive={
                                        newMatrixBetType.betTypeGroupId === type.betTypeGroupId &&
                                        newMatrixBetType.transSubTypeId === type.transSubTypeId
                                    }
                                    data={{
                                        betRestrictionTypeId: selectedTypeId,
                                        betTypeGroupId: type.betTypeGroupId,
                                        transSubTypeId: type.transSubTypeId,
                                        eventTypeId: type.eventTypeId
                                    }}
                                    betRestrictionTypeId={selectedTypeId}
                                    ownBetRestrictionTypeId={selectedTypeId}
                                    type={type}
                                    betTypeGroupId={newMatrixBetType.betTypeGroupId}
                                    transSubTypeId={newMatrixBetType.transSubTypeId}
                                    items={type.subTypes.length ? type.subTypes : null}
                                    onItemClick={data => {
                                        let selectedType;
                                        let target = betTypes.find(type => {
                                            return (type.betTypeGroupId === data.betTypeGroupId && type.transSubTypeId === data.transSubTypeId)
                                        })
                                        if (target) {
                                            selectedType = {...target, subTypes: []};
                                        } else {
                                            for (let i = 0, l = betTypes.length; i < l; i++) {
                                                let target = betTypes[i].subTypes.find(type => {
                                                    return (type.betTypeGroupId === data.betTypeGroupId && type.transSubTypeId === data.transSubTypeId)
                                                });
                                                if (target) {
                                                    selectedType = {...betTypes[i], subTypes: [{...target}]};
                                                    break;
                                                }
                                            }
                                        }
                                        selectedType.betRestrictionTypeId = selectedTypeId;
                                        updateNewMatrixData({newMatrixBetType: data, selectedType})
                                    }}
                                />
                            })}</ul>
                        }</div>
                    </div>
                </div>
            </div>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(NewMatrixStep);