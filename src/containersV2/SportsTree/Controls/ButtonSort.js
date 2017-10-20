import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { updateSortState } from '../actions';


const mapStateToProps = (state, ownProps) => {
    return {
        isSorted: state.sportsTree.isSorted
    };
};
const mapDispatchToProps = (dispatch, ownProps) => {
    return bindActionCreators({updateSortState}, dispatch);
};

const ButtonSort = ({updateSortState, isSorted}) => {
    let className = 'button btn-box';
    let title = 'Sort';
    if (isSorted) {
        className += ' active';
        title = "Remove sort";
    }
    return <button className={className}
        title={title}
        onClick={e => {updateSortState(!isSorted)}}
    ><i className="phxico phx-sort-alpha-asc"></i>
    </button>
}

export default connect(mapStateToProps, mapDispatchToProps)(ButtonSort);