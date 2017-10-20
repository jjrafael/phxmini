import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PeriodPath from './PeriodPath';
import { generatePeriodsTree } from 'utils';

const mapStateToProps = (state, ownProps) => {
    return {
        marketPeriods: state.eventCreatorEventMarkets.marketPeriods
    };
};

const mapDispatchToProps = (dispatch, ownProps) => {
    return bindActionCreators({
    }, dispatch);
};

class MorePeriods extends Component {
    constructor (props) {
        super(props);
        let periods = [...this.props.marketPeriods].sort((a, b) => {
            return Number(a.lookupCode) - Number(b.lookupCode);
        })
        this.state = {
            tree: generatePeriodsTree(periods)
        }
    }
    render () {
        let { tree } = this.state;
        return (
            <div className="more-periods-container">
            {tree.map(period => {
                return <PeriodPath period={period} />
            })}
            </div>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(MorePeriods);