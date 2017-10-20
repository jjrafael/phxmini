import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { updateNewMatrixData, updateStep } from '../../actions';

const mapStateToProps = (state, ownProps) => {
    return {
        isNewMatrix: state.betRestrictions.newBetRestrictionData.isNewMatrix,
        newMatrixStep: state.betRestrictions.stepsMap['NEW_MATRIX'],
    };
};

const mapDispatchToProps = (dispatch, ownProps) => {
    return bindActionCreators({ updateNewMatrixData, updateStep }, dispatch);
};

class MatrixStep extends Component {
    componentWillMount () {
        let { isNewMatrix, updateStep, newMatrixStep } = this.props;
        if (isNewMatrix) {
            if (!newMatrixStep.enabled) {
                updateStep('NEW_MATRIX', {enabled: true});
            }
        } else {
            if (newMatrixStep.enabled) {
                updateStep('NEW_MATRIX', {enabled: false});
            }
        }
    }
    render () {
        let { isNewMatrix, updateNewMatrixData, updateStep } = this.props;
        return (
            <div className="form-wrapper">
                <div className="header panel-header">
                    <div className="panel-header-title">Choose Bet Restriction Matrix</div>
                </div>
                <div className="panel-content">
                    <p>Where would you like to create the new Bet Restriction?</p>
                    <div className="form-group">
                        <label><input type="radio" checked={!isNewMatrix} onChange={e => {
                            updateStep('NEW_MATRIX', {enabled: false});
                            updateNewMatrixData({isNewMatrix: false});
                        }}/> In the current Matrix</label>
                    </div>
                    <div className="form-group">
                        <label><input type="radio" checked={isNewMatrix} onChange={e => {
                            updateStep('NEW_MATRIX', {enabled: true});
                            updateNewMatrixData({isNewMatrix: true});
                        }}/> In a new Matrix</label>
                    </div>
                </div>
            </div>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(MatrixStep);