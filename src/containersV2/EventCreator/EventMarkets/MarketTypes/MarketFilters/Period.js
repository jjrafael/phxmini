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

const updateFilters = ({periodTypeIds, periodIds, marketTypes, searchStr, updateNewMarketFilters}) => {
    let filteredMarketTypes = marketTypes.filter(marketType => {
        return (
            periodTypeIds.includes(marketType.periodTypeId) &&
            periodIds.includes(marketType.periodId) &&
            marketType.description.toUpperCase().indexOf(searchStr) >= 0
        )
    })
    updateNewMarketFilters({periodTypeIds, periodIds, filteredMarketTypes});
}

const removeFilter = ({periodTypeIds, periodIds, periodTypeId, periodId}) => {
    let _periodTypeIds = [...periodTypeIds];
    let _periodIds = [...periodIds];
    if (periodTypeIds.includes(periodTypeId)) {
        let index = periodTypeIds.findIndex(periodType => periodType === periodTypeId);
        _periodTypeIds = [...periodTypeIds.slice(0, index), ...periodTypeIds.slice(index + 1)];
    }
    if (periodIds.includes(periodId)) {
        let index = periodIds.findIndex(periodType => periodType === periodId);
        _periodIds = [...periodIds.slice(0, index), ...periodIds.slice(index + 1)];
    }
    return {periodTypeIds: _periodTypeIds, periodIds: _periodIds}
}

const Period = ({period, periodTypeIds, periodIds, marketTypes, searchStr, updateNewMarketFilters}) => {
    let id = period.id;
    let elementId = `period-checkbox-${id}`;
    let periodTypeId = period.periodType.id;
    let periodId = period.id;
    let description = period.fullDescription;
    if (period.periodType.inRunning) {
        description = `Live ${description}`;
    }
    return <div key={id} className="market-filter">
        <input type="checkbox"
            id={elementId}
            checked={periodTypeIds.includes(periodTypeId) && periodIds.includes(periodId)}
            onChange={e => {
                let props = {marketTypes, searchStr, updateNewMarketFilters};
                e.target.checked ?
                updateFilters({
                    ...props,
                    periodTypeIds: [...periodTypeIds, periodTypeId],
                    periodIds: [...periodIds, periodId],
                }) :
                updateFilters({
                    ...props,
                    ...removeFilter({periodTypeIds, periodIds, periodTypeId, periodId}),
                });
            }}
        />
        <label htmlFor={elementId}>{description}</label>
    </div>
}

export default connect(mapStateToProps, mapDispatchToProps)(Period);