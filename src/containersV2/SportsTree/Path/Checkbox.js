import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { addToPathSelections, removeFromPathSelections } from '../actions'

const mapStateToProps = (state, ownProps) => {
    return {
        isChecked: !!state.sportsTree.pathSelectionsMap[ownProps.path.id]
    };
};

const mapDispatchToProps = (dispatch, ownProps) => {
    return bindActionCreators({
        addToPathSelections,
        removeFromPathSelections
    }, dispatch);
};

const Checkbox = ({displayCheckbox, path, isChecked, addToPathSelections, removeFromPathSelections}) => {
    if (path.level === 0) { return null }
    if (displayCheckbox) {
        return <span className='path-checkbox'>
            <input type="checkbox"
                id={`check-${path.id}`}
                checked={isChecked}
                onClick={e => {
                    e.stopPropagation();
                }}
                onChange={e => {
                    if (e.target.checked) {
                        addToPathSelections(path);
                    } else {
                        removeFromPathSelections(path);
                    }
                }}
            />
        </span>
    } else {
        return null;
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Checkbox);