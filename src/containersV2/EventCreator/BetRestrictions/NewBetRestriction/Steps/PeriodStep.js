import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { updateNewMatrixData } from '../../actions';
import Period from './Period/index';

const mapStateToProps = (state, ownProps) => {
    return {
        periodId: state.betRestrictions.newBetRestrictionData.periodId,
        sportPeriods: state.betRestrictions.sportPeriods,
    };
};

const mapDispatchToProps = (dispatch, ownProps) => {
    return bindActionCreators({ updateNewMatrixData }, dispatch);
};

class PeriodStep extends Component {
    render () {
        let { periodId, updateNewMatrixData, sportPeriods } = this.props;
        return (
            <div className="form-wrapper">
                <div className="header panel-header">
                    <div className="panel-header-title">Select Period</div>
                </div>
                <div className="panel-content">
                    <div>
                        <p>To which Period does the Bet Restriction apply?</p>
                    </div>
                    <div className="form-group">
                        <label><input type="radio" checked={!periodId} onChange={e => {
                            updateNewMatrixData({periodId: null})
                        }}/> Any Period</label>
                    </div>
                    <div className="form-group">
                        <label><input type="radio" disabled={!sportPeriods.length} checked={!!periodId} onChange={e => {
                            updateNewMatrixData({periodId: sportPeriods[0].id})
                        }}/> Specific Period</label>
                    </div>
                    <div className="list-container">
                        <ul>
                            {sportPeriods.map(period => {
                                let description = period.fullDescription;
                                if (period.periodType.inRunning) {
                                    description = `Live ${description}`;
                                }
                                return <Period
                                    key={period.id}
                                    description={description}
                                    period={period}
                                    isActive={periodId === period.id}
                                    onClick={ data => {
                                        updateNewMatrixData({periodId: data.id})
                                    }}
                                />
                            })}
                        </ul>
                    </div>
                </div>
            </div>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(PeriodStep);