import React, { PropTypes } from "react";
import SelectBox from '../selectBox';

export default class LiabilityIndicators extends React.Component {
    constructor(props) {
        super(props);
        this._handleLiabilityIndicatorChange = this._handleLiabilityIndicatorChange.bind(this);
        const { data } = props;
        this.state = {
            liabilityIndicators: data.liabilityIndicators
        }
    }

    componentDidUpdate(prevProps, prevState) {
        if(this.props.shouldResetState) {
            this._resetState();
        }
    }

    _resetState() {
        this.setState({
            liabilityIndicators: this.props.data.liabilityIndicators
        });
    }

    _handleLiabilityIndicatorChange(index, propToChange, value, isInvalid) {
        const { changeHandler } = this.props;
        const regex = /^-?\d*\.?\d?$/g;
        if (value === '0-') { // quick fix to allow entering of - when current value is 0
            value = '-0';
        }
        if (!regex.test(value)) {
            return false;
        }
        const newLiabilityIndicatorState = {
            ...this.state.liabilityIndicators[index],
            [propToChange]: value 
        };
        if(typeof isInvalid !== 'undefined') {
            newLiabilityIndicatorState[`${propToChange}IsInvalid`] = isInvalid
        };
        const newState = [ ...this.state.liabilityIndicators ];
        newState[index] = newLiabilityIndicatorState;
        this.setState({
            liabilityIndicators: newState
        });
        changeHandler('liabilityIndicators.liabilityIndicators', [newLiabilityIndicatorState]);
    }

    render() {
        const { data, liabilityIndicatorsActions } = this.props;
        const { liabilityIndicators } = this.state;
        return (
            <div className="liability-indicators">
                <table cellPadding="0" cellSpacing="0" className="tcenter">
                    <thead>
                        <tr>
                            <th rowSpan="2">
                                Type
                            </th>
                            <th colSpan="2">
                                <i className="phxico phx-exclamation text-success"></i> Warning
                            </th>
                            <th colSpan="2">
                                <i className="phxico phx-exclamation text-error"></i> Critical
                            </th>
                        </tr>
                        <tr>
                            <th>
                                Limit
                            </th>
                            <th>
                                Rule/Action
                            </th>
                            <th>
                                Limit
                            </th>
                            <th>
                                Rule/Action
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {liabilityIndicators.map((liabilityIndicator, index)=> {
                            return (
                                <tr key={liabilityIndicator.id}>
                                    <td>
                                        {liabilityIndicator.liabilityIndicatorType.description}
                                    </td>
                                    <td className="editable tright">
                                    <input
                                        type="text"
                                        className={`tright ${liabilityIndicator.secondaryLimitIsInvalid ? 'invalid' : ''}`}
                                        value={liabilityIndicator.secondaryLimit}
                                        onChange={(e)=>{
                                            let value = isNaN(Number(e.target.value)) ? e.target.value : Number(e.target.value);
                                            const isInvalid = typeof value !== 'number';
                                            this._handleLiabilityIndicatorChange(index, 'secondaryLimit', value, isInvalid) 
                                        }}/>
                                    </td>
                                    <td className="editable">
                                        <SelectBox
                                            disabled={!liabilityIndicatorsActions.length}
                                            className="action"
                                            onChange={(e)=> {
                                                this._handleLiabilityIndicatorChange(index, 'secondaryActionId', Number(e.target.value));
                                            }}
                                            valueKey={'id'}
                                            descKey={'description'}
                                            value={liabilityIndicator.secondaryActionId}
                                            name="status"
                                            options={liabilityIndicatorsActions}/>
                                    </td>
                                    <td className="editable tright">
                                        <input
                                        className={`tright ${liabilityIndicator.primaryLimitIsInvalid ? 'invalid' : ''}`}
                                            type="text"
                                            value={liabilityIndicator.primaryLimit}
                                            onChange={(e)=>{
                                                let value = isNaN(Number(e.target.value)) ? e.target.value : Number(e.target.value);
                                                const isInvalid = typeof value !== 'number';
                                                this._handleLiabilityIndicatorChange(index, 'primaryLimit', value, isInvalid) 
                                            }}/>
                                    </td>
                                    <td className="editable">
                                        <SelectBox
                                            disabled={!liabilityIndicatorsActions.length}
                                            className="action"
                                            onChange={(e)=> {
                                                this._handleLiabilityIndicatorChange(index, 'primaryActionId', Number(e.target.value))
                                            }}
                                            valueKey={'id'}
                                            descKey={'description'}
                                            value={liabilityIndicator.primaryActionId}
                                            name="status"
                                            options={liabilityIndicatorsActions}/>
                                    </td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            </div>
        )
    }
}