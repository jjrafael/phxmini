import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { createSelector } from 'reselect';
import { setActiveCell } from '../actions';

const activeBetTypeKeySelector = state => state.betRestrictions.activeBetTypeKey;
const matrixDataCacheSelector = state => state.betRestrictions.matrixDataCache;
const cachePropsSelector = createSelector(
    activeBetTypeKeySelector,
    matrixDataCacheSelector,
    (activeBetTypeKey, matrixDataCache) => {
        let cache = matrixDataCache[activeBetTypeKey];
        if (cache) {
            return {updatedCellsArray: cache.updatedCellsArray, newlyAddedRestrictionKey: cache.newlyAddedRestrictionKey}
        } else {
            return {updatedCellsArray: [], newlyAddedRestrictionKey: ''}
        }
    }
);

const mapStateToProps = (state, ownProps) => {
    let { updatedCellsArray, newlyAddedRestrictionKey} = cachePropsSelector(state);
    return {
        activeCell: state.betRestrictions.activeCell,
        isEvaluationOrderVisible: state.betRestrictions.isEvaluationOrderVisible,
        updatedCellsArray,
        newlyAddedRestrictionKey
    };
};

const mapDispatchToProps = (dispatch, ownProps) => {
    return bindActionCreators({
        setActiveCell
    }, dispatch);
};

class Cell extends Component {
    render () {
        let {
            data,
            hasTitle,
            cellSize,
            activeCell,
            setActiveCell,
            updatedCellsArray,
            restrictionKey,
            newlyAddedRestrictionKey,
            isEvaluationOrderVisible,
        } = this.props;
        let className = data.className ? `cell ${data.className}` : 'cell';
        const style={width: `${cellSize}px`, height: `${cellSize}px`}
        const isActive = activeCell.key && activeCell.key === data.key;
        const hasChanges = updatedCellsArray.includes(data.key);
        const isNew = newlyAddedRestrictionKey && restrictionKey.indexOf(newlyAddedRestrictionKey) >= 0;
        const desc = isEvaluationOrderVisible ? data.descExpanded : data.desc;
        if (isActive) {
            className += ' active';
        }
        let props = {
            className,
            style,
            ...hasTitle && {
                title: desc
            }
        }     
        return (
            <div {...props} onClick={() => {
                if (data.cell && !isActive) {
                    setActiveCell(data);
                }
            }}>
                <span className="cell-desc">{desc}</span>
                {isNew && <span className="highlight-indicator"></span>}
                {hasChanges && <span className="changes-indicator">*</span>}
                {isActive && <span className="active-indicator"></span>}
            </div>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Cell);