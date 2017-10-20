import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { updateToggleState } from '../actions';

const mapDispatchToProps = (dispatch, ownProps) => {
    return bindActionCreators({updateToggleState}, dispatch);
};

const ButtonCollapseAll = ({updateToggleState}) => {
    return <button className="button btn-box"
        title="Collapse All"
        onClick={e => {updateToggleState({expandedAll: false, collapsedAll: true});}}
    ><i className="icon icon-medium phxico phx-unexpand-tree"></i>
    </button>
}

export default connect(null, mapDispatchToProps)(ButtonCollapseAll);