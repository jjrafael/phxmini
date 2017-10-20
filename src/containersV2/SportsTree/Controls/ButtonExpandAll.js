import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { updateToggleState } from '../actions';

const mapDispatchToProps = (dispatch, ownProps) => {
    return bindActionCreators({updateToggleState}, dispatch);
};

const ButtonExpandAll = ({updateToggleState}) => {
    return <button className="button btn-box"
        title="Expand All"
        onClick={e => {updateToggleState({expandedAll: true, collapsedAll: false});}}
    ><i className="icon icon-medium phxico phx-expand-tree"></i>
    </button>
}

export default connect(null, mapDispatchToProps)(ButtonExpandAll);