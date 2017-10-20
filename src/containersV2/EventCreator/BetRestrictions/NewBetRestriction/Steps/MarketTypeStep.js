import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { createSelector } from 'reselect';
import qs from 'query-string';
import { updateNewMatrixData, fetchMarketTypeGroups } from '../../actions';
import MarketTypeGroup from './MarketTypeGroup/index';

const sportIdSelector = state => state.betRestrictions.newBetRestrictionData.sportId;
const sportsCodesSelector = state => state.apiConstants.values.riskSports;
const sportCodeSelector = createSelector(
    sportIdSelector,
    sportsCodesSelector,
    (sportId, sportCodes) => {
        let sport = sportCodes.find(sport => sport.defaultEventPathId === sportId);
        return sport.code;
    }
);

const mapStateToProps = (state, ownProps) => {
    return {
        marketTypeId: state.betRestrictions.newBetRestrictionData.marketTypeId,
        eventTypeId: state.betRestrictions.newBetRestrictionData.eventTypeId,
        marketTypeGroupId: state.betRestrictions.newBetRestrictionData.marketTypeGroupId,
        marketTypeGroupDesc: state.betRestrictions.newBetRestrictionData.marketTypeGroupDesc,
        activeBetType: state.betRestrictions.activeBetType,
        sportCode: sportCodeSelector(state),
        marketTypeGroups: state.betRestrictions.marketTypeGroups,
    };
};

const mapDispatchToProps = (dispatch, ownProps) => {
    return bindActionCreators({ updateNewMatrixData, fetchMarketTypeGroups }, dispatch);
};

class MarketTypeStep extends Component {
    componentWillMount () {
        let { sportCode, fetchMarketTypeGroups, activeBetType, eventTypeId } = this.props;
        if (activeBetType.betRestrictionTypeId === 1) {
            sportCode = null;
        }
        let paramsObj, params='';
        if (sportCode || eventTypeId) {
            paramsObj = {};
            if (sportCode) { paramsObj.sportCode = sportCode };
            if (eventTypeId) { paramsObj.eventTypeId = eventTypeId };
            params = `?${qs.stringify(paramsObj)}`;
        }
        fetchMarketTypeGroups(params);
    }
    render () {
        let { marketTypeId, updateNewMatrixData, marketTypeGroups, marketTypeGroupDesc, marketTypeGroupId } = this.props;
        return (
            <div className="form-wrapper">
                <div className="header panel-header">
                    <div className="panel-header-title">Select Market Type</div>
                </div>
                <div className="panel-content">
                    <p>To which MarketType does the Bet Restriction apply?</p>
                    <div className="form-group">
                        <label><input type="radio" checked={!marketTypeGroupDesc} onChange={e => {
                            updateNewMatrixData({
                                marketTypeId: 0,
                                marketTypeGroupId: null,
                                marketTypeGroupDesc: ''
                            })
                        }}/> Any MarketType</label>
                    </div>
                    <div className="form-group">
                        <label>
                            <input type="radio"
                                disabled={!marketTypeGroups.length}
                                checked={!!marketTypeGroupDesc}
                                onChange={e => {
                                    let firstGroup = marketTypeGroups[0];
                                    updateNewMatrixData({
                                        marketTypeId: firstGroup.id,
                                        marketTypeGroupId: firstGroup.id,
                                        marketTypeGroupDesc: firstGroup.description
                                    })
                                }}
                            /> Specific MarketType</label>
                    </div>
                    <div className="list-container">
                        <ul>{marketTypeGroups.map(group => {
                            return <MarketTypeGroup
                                key={group.id}
                                description={group.description}
                                marketTypeId={marketTypeId}
                                marketTypeGroupId={marketTypeGroupId}
                                isActive={marketTypeGroupDesc === group.description && marketTypeGroupId === group.id}
                                group={group}
                                items={group.marketTypeResponseList}
                                data={{
                                    marketTypeGroupDesc: group.description,
                                    marketTypeId: 0,
                                    marketTypeGroupId: group.id
                                }}
                                onItemClick={data => {
                                    updateNewMatrixData(data);
                                }}
                            />
                        })}</ul>
                    </div>
                </div>
            </div>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(MarketTypeStep);