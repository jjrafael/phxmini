import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { updateNewMarketFilters } from '../../actions';

const mapStateToProps = (state, ownProps) => {
    return {
        periodTypeIds: state.eventCreatorEventMarkets.newMarketFilters.periodTypeIds,
        periodIds: state.eventCreatorEventMarkets.newMarketFilters.periodIds,
        marketTypes: state.eventCreatorEventMarkets.marketTypes,
        searchStr: state.eventCreatorEventMarkets.newMarketFilters.searchStr,
    };
};

const mapDispatchToProps = (dispatch, ownProps) => {
    return bindActionCreators({updateNewMarketFilters}, dispatch);
};

const Search = ({searchStr, periodTypeIds, periodIds, marketTypes, updateNewMarketFilters }) => {
    return <div className="search-filter">
        <input type="text" placeholder="Search..." onChange={e => {
            let _str = e.target.value.trim();
            if (_str.length >= 3) {
                let filteredMarketTypes = marketTypes.filter(marketType => {
                    return (periodTypeIds.includes(marketType.periodTypeId) &&
                        periodIds.includes(marketType.periodId) &&
                        marketType.description.toUpperCase().indexOf(_str.toUpperCase()) >= 0
                    )
                })
                updateNewMarketFilters({filteredMarketTypes, searchStr: _str});
            } else {
                if (searchStr !== '') {
                    let filteredMarketTypes = marketTypes.filter(marketType => {
                        return (periodTypeIds.includes(marketType.periodTypeId) && periodIds.includes(marketType.periodId))
                    })
                    updateNewMarketFilters({filteredMarketTypes, searchStr: ''});
                }
            }
        }}/>
    </div>
}

export default connect(mapStateToProps, mapDispatchToProps)(Search);