import React, { Component } from 'react';
import Period from './Period';

class PeriodPath extends Component {
    constructor (props) {
        super(props);
        this._onToggle = this._onToggle.bind(this);
        this.state = {
            isExpanded: true
        }
    }
    _onToggle () {
        this.setState({isExpanded: !this.state.isExpanded});
    }
    render () {
        let { period, addFilter, removeFilter, periodTypeIds, periodIds } = this.props;
        let { isExpanded } = this.state;
        let iconClassName = `fa fa-angle-${(isExpanded ? 'down' : 'right')}`;
        return (
            <ul><li>
                <div className="period-path-name">
                    {period.children.length > 0 &&
                        <span className="period-path-toggle" onClick={this._onToggle}><i className={iconClassName}></i></span>
                    }
                    {period.children.length === 0 &&
                        <span className="period-path-spacer"></span>
                    }
                    <Period period={period} />
                </div>
                {this.state.isExpanded && period.children.map(_period => {
                    return <PeriodPath period={_period} />
                })}
            </li></ul>
        );
    }
}

export default PeriodPath;