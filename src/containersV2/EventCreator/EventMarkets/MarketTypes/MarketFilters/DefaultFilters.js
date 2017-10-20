import React, { Component } from 'react';
import { connect } from 'react-redux';
import Period from './Period';

const mapStateToProps = (state, ownProps) => {
    return {
        defaultFilters: state.eventCreatorEventMarkets.newMarketFilters.defaultFilters
    };
};

const DefaultFilters = ({defaultFilters}) => {
    return <div className="default-filters">
        {defaultFilters.map(period => {
            return <Period period={period} />
        })}
    </div>
}

export default connect(mapStateToProps)(DefaultFilters);