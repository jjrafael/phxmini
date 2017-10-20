import React, { Component } from 'react';

class HandicapInput extends Component {
    constructor (props) {
        super(props);
        this.state = {
            value: this.props.formattedSpread,
            finalValue: this.props.formattedSpread,
            isInvalid: false,
            isEditing: false,
            isVisible: false,
        }
    }

    componentWillUpdate (nextProps, nextState) {
        if (this.props.formattedSpread !== nextProps.formattedSpread) {
            if (!this.state.isEditing) {
                this.setState({
                    value: nextProps.formattedSpread,
                    finalValue: nextProps.formattedSpread,
                })
            }
        }
    }

    componentWillUnmount() {
        clearTimeout(this.invalidTimer);
    }

    render () {
        let {
            className,
            disableHandicaps,
        } = this.props;
        return (
            <div className="handicap-input-container">
                <input
                    type="text"
                    disabled={disableHandicaps}
                    value={this.state.value}
                    onFocus={e => {
                        let fractionPart, integerPart;
                        if (this.state.finalValue.indexOf(',') >= 0) {
                            let [first, second] = [...this.state.finalValue.split(',')];
                            if (first.indexOf('.') >= 0) {
                                if (Number(first) === .5) {
                                    fractionPart = '.5';
                                } else {
                                    fractionPart = '.75';
                                }
                                integerPart = second.trim();
                            } else {
                                if (Number(second) === .5) {
                                    fractionPart = '.5';
                                } else {
                                    fractionPart = '.25';
                                }
                                integerPart = first.trim();
                            }
                            let sign = integerPart.substr(0,1);
                            let integer = integerPart.substr(1);
                            if (fractionPart === '.75') {
                                integer = Number(integer) - 1;
                            }
                            let value = `${sign}${integer}${fractionPart}`;
                            this.setState({
                                isEditing: true,
                                finalValue: value,
                                value,
                            });
                        }
                    }}
                    onChange={(e)=>{
                        let value = e.target.value;
                        let validInput = /^[+-]?[0-9]*[.]?[\d]{0,2}?$/g;
                        if (validInput.test(value)) {
                            let validFormat = /^[+-]?[\d]+.?((0|00|25|5|50|75))?$/g;
                            if (validFormat.test(value)) {
                                clearTimeout(this.invalidTimer);
                                this.setState({
                                    isInvalid: false,
                                    isVisible: false,
                                    finalValue: value,
                                    value
                                });
                            } else {
                                this.setState({value, isInvalid: true})
                                this.invalidTimer = setTimeout(e => {
                                    this.setState({
                                        isVisible: true,
                                    });
                                }, 1000)
                            }
                        }
                    }}
                    onBlur={(e) => {
                        clearTimeout(this.invalidTimer);
                        if (this.state.isInvalid) {
                            this.setState({
                                isEditing: false,
                                isVisible: true,
                                finalValue: this.props.formattedSpread
                            });
                            this.invalidTimer = setTimeout(e => {
                                this.setState({
                                    isInvalid: false,
                                    isVisible: false,
                                    value: this.props.formattedSpread,
                                });
                            }, 1000)
                        } else {
                            this.setState({
                                isEditing: false,
                            });
                            this.props.onBlur(this.state.finalValue)
                        }
                    }}
                />
                {this.state.isInvalid && this.state.isVisible &&
                    <div className="rc-tooltip  rc-tooltip-placement-right rc-tooltip-warning">
                        <div className="rc-tooltip-content">
                            <div className="rc-tooltip-arrow"></div>
                            <div className="rc-tooltip-inner">
                                <div className="text-error">Invalid handicap: {this.state.value}. <span className="tooltip-help" onClick={this.props.onOpenModal}>?</span></div>
                            </div>
                        </div>
                    </div>
                }
            </div>
        );
    }
}
HandicapInput.propTypes = {
    // className: React.PropTypes.string.isRequired,
};

export default HandicapInput;