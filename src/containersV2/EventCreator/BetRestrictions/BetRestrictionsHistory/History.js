import React, { Component } from 'react';
import { connect } from 'react-redux';
import HistoryRow from './HistoryRow';

const mapStateToProps = (state, ownProps) => {
    return {
        history: state.betRestrictions.history,
    };
};

const History = ({history}) => {
    return <div className="custom-table">
        <div className="rt-thead -header">
            <div className="rt-tr">
                <div className="rt-th">Created Date</div>
                <div className="rt-th">Description</div>
            </div>
        </div>
        <div className="rt-tbody">{history.map(item => {
            return <HistoryRow key={item.id} history={item}/>
        })}</div>
    </div>
}

export default connect(mapStateToProps)(History);