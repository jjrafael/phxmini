import React, { Component } from 'react';

class ActiveCell extends Component {
    constructor (props) {
        super(props);
        this._onChange = this._onChange.bind(this);
        this._onBlur = this._onBlur.bind(this);
        this._onFocus = this._onFocus.bind(this);
        let { opponent, target } = this.props;
        let value = opponent[target];
        if (value === undefined || value === null) {
            value = '';
        }
        this.state = {
            lastValidValue: value,
            value
        }
    }
    componentWillUpdate (nextprops) {
        if (nextprops.opponent[nextprops.target] !== this.props.opponent[this.props.target]) {
            let value = nextprops.opponent[nextprops.target] || '';
            this.setState({value})
        }
    }
    _onChange (e) {
        let value = e.target.value;
        if (this.props.target === 'description') {
            this.setState({value});
        } else {
            let reg = /^\d*$/g;
            if (reg.test(value)) {
                this.setState({value});
            }
        }
    }
    _onBlur () {
        let value = this.state.value;
        if (value) {
            switch (this.props.target) {
                case 'rotationNumber':
                case 'raceCardNumber':
                    value = Number(value);
                    break;
            }
        }
        if (this.props.target === 'description') {
            if (value === '') {
                // don't let user save empty description
                this.setState({value: this.state.lastValidValue})
                return false;
            } else {
                this.setState({lastValidValue: value})
            }
        }
        this.props.onBlur({
            ...this.props,
            value
        });
    }
    _onFocus () {
        this.input.select();
    }
    render () {
        let {
            onBlur
        } = this.props;
        return (
            <input
                className="rank-opponent-input"
                value={this.state.value}
                ref={el => this.input = el}
                type="text"
                onBlur={this._onBlur}
                onChange={this._onChange}
                onFocus={this._onFocus}
            />
        );
    }
}

export default ActiveCell;