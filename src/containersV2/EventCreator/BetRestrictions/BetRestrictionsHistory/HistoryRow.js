import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { formatISODateString } from 'phxUtils';
import { setActiveHistory } from '../actions';

const mapStateToProps = (state, ownProps) => {
    return {
        activeHistory: state.betRestrictions.activeHistory
    };
};

const mapDispatchToProps = (dispatch, ownProps) => {
    return bindActionCreators({
        setActiveHistory
    }, dispatch);
};

class HistoryRow extends Component {
    render () {
        let { history, activeHistory, setActiveHistory } = this.props;
        let isActive = activeHistory.id === history.id;
        let className = 'rt-tr-group';
        if (isActive) { className = `${className} active`; }
        return (
            <div className={className} onClick={e => {
                setActiveHistory(history);
            }}>
                <div className="rt-tr">
                    <div className="rt-td col-numbers">{formatISODateString(history.createdDate)}</div>
                    <div className="rt-td col-description">{history.description}</div>
                </div>
            </div>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(HistoryRow);