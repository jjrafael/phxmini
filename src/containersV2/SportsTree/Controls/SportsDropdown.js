import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import SelectBox from 'components/selectBox';
import { DUMMY_ID } from '../constants';

const mapStateToProps = (state, ownProps) => {
    return {
        activeSportId: state.sportsTree.activeSportId,
        isFetchingEPT: state.sportsTree.isFetchingEPT,
        isCreatingNewPath: !!state.sportsTree.pathsMap[DUMMY_ID]
    };
};

const SportsDropdown = ({sports, activeSportId, isFetchingEPT, onSportChange, isCreatingNewPath}) => {
    return <SelectBox
        value={activeSportId}
        disabled={isFetchingEPT || isCreatingNewPath}
        onChange={e => { onSportChange(Number(e.target.value)) }}
        descKey={'description'}
        valueKey={'defaultEventPathId'}
        name="sports"
        options={sports}
    />
}

export default connect(mapStateToProps)(SportsDropdown);