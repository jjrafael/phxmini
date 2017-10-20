import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import SelectBox from 'components/selectBox';
import filterTypes from 'constants/filterTypes';
import { makeIterable } from 'phxUtils';
import { setMarketStatusFilter } from '../actions';
import { DUMMY_ID } from '../constants';

const mapStateToProps = (state, ownProps) => {
    return {
        marketStatusFilter: state.sportsTree.marketStatusFilter,
        isFetchingEPT: state.sportsTree.isFetchingEPT,
        isCreatingNewPath: !!state.sportsTree.pathsMap[DUMMY_ID]
    };
};

const mapDispatchToProps = (dispatch, ownProps) => {
    return bindActionCreators({setMarketStatusFilter}, dispatch);
};

const MarketStatusDropdown = ({sports, marketStatusFilter, isFetchingEPT, setMarketStatusFilter, isCreatingNewPath}) => {
    return <SelectBox
        disabled={isFetchingEPT || isCreatingNewPath}
        onChange={e => {setMarketStatusFilter(e.target.value)}}
        value={marketStatusFilter}
        name="status"
        options={[...makeIterable(filterTypes.STATUS)]}
    />
}

export default connect(mapStateToProps, mapDispatchToProps)(MarketStatusDropdown);