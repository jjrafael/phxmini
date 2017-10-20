import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { saveNewPathsOrder } from '../actions';
import { DUMMY_ID } from '../constants';

const mapStateToProps = (state, ownProps) => {
    return {
        isFetchingEPT: state.sportsTree.isFetchingEPT,
        isCreatingNewPath: !!state.sportsTree.pathsMap[DUMMY_ID],
        pathsOrder: state.sportsTree.pathsOrder,
    };
};
const mapDispatchToProps = (dispatch, ownProps) => {
    return bindActionCreators({saveNewPathsOrder}, dispatch);
};

const ButtonRefresh = ({isFetchingEPT, isCreatingNewPath, saveNewPathsOrder, pathsOrder}) => {
    let hasNewPathsOrder = Object.keys(pathsOrder).length ? true : false;
    return <button
        className="button btn-box"
        disabled={isFetchingEPT || isCreatingNewPath || !hasNewPathsOrder}
        title="Save"
        onClick={e => {saveNewPathsOrder(pathsOrder)} }
    ><i className="phxico phx-save"></i>
    </button>
}

export default connect(mapStateToProps, mapDispatchToProps)(ButtonRefresh);