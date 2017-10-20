import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { fetchEPT } from '../actions';
import { DUMMY_ID } from '../constants';

const mapStateToProps = (state) => {
    return {
        isFetchingEPT: state.sportsTree.isFetchingEPT,
        parameters: state.sportsTree.parameters,
        activeSportId: state.sportsTree.activeSportId,
        isCreatingNewPath: !!state.sportsTree.pathsMap[DUMMY_ID]
    };
};
const mapDispatchToProps = (dispatch) => {
    return bindActionCreators({fetchEPT}, dispatch);
};

const ButtonRefresh = ({fetchEPT, activeSportId, parameters, isFetchingEPT, isCreatingNewPath, onClick}) => {
    return <button
        className="button btn-box"
        disabled={isFetchingEPT || isCreatingNewPath}
        title="Refresh"
        onClick={() => {
            if (onClick) {
                onClick(activeSportId, parameters);
            } else {
                fetchEPT(activeSportId, parameters, {persistOldPathsMap: true})
            }
        }}
    ><i className="phxico phx-refresh"></i>
    </button>
}

export default connect(mapStateToProps, mapDispatchToProps)(ButtonRefresh);