import React, { PropTypes } from "react";
import SelectBox from '../selectBox';
import { formatISODateString } from '../../utils';

export default class Rule4Results extends React.Component {
    constructor(props) {
        super(props);
        this._handleRule4DetailChange = this._handleRule4DetailChange.bind(this);
        const { data } = props;
        this.state = {
            rule4Results: data.rule4Results
        }
    }

    componentDidUpdate(prevProps, prevState) {
        if(this.props.shouldResetState) {
            this._resetState();
        }
    }

    _resetState() {
        this.setState({
            rule4Results: this.props.data.rule4Results
        });
    }

    _handleRule4DetailChange(rule4ResultIndex, rule4DetailIndex, propToChange,  value, isInvalid) {
        const { changeHandler } = this.props;
        const newRule4DetailState = { ...this.state.rule4Results[rule4ResultIndex].rule4Details[rule4DetailIndex], [propToChange]: value };
        if(typeof isInvalid !== 'undefined') {
            newRule4DetailState[`${propToChange}IsInvalid`] = isInvalid;
        };
        const newState = [ ...this.state.rule4Results ];
        newState[rule4ResultIndex].rule4Details[rule4DetailIndex] = newRule4DetailState;
        this.setState({
            rule4Results: newState
        });
        changeHandler('rule4Results.rule4Results', [newState[rule4ResultIndex]]);
    }

    render() {
        const { rule4Results } = this.state;
        return (
            <div className="rule4-results">
                <table cellPadding="0" cellSpacing="0">
                    <thead>
                        <tr>
                            <th>
                                Book
                            </th>
                            <th>
                                Non-Runners
                            </th>
                            <th>
                                Time
                            </th>
                            <th>
                                Price
                            </th>
                            <th>
                                R4 Deduction
                            </th>
                            <th>
                                Applied Price
                            </th>
                            <th>
                                Applied R4 Deduction
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {rule4Results.map((rule4Result, rule4ResultIndex)=> {
                            let rule4ResultRow = rule4Result.rule4Details.map((rule4Detail, rule4DetailIndex) => {
                                const r4deductions = ["0", "5", "10", "15", "20", "25", "30", "35", "40", "45", "50", "55", "60", "65", "70", "75", "80", "85", "90"].map((item)=> {
                                    return {
                                        value: item,
                                        desc: item + '%'
                                    }
                                });
                                return (
                                    <tr key={rule4DetailIndex}>
                                        <td>
                                            {rule4Detail.book}
                                        </td>
                                        <td>
                                            {rule4Detail.nonRunners}
                                        </td>
                                        <td>
                                            {formatISODateString(rule4Detail.time)}
                                        </td>
                                        <td>
                                            {!!rule4Detail.price && rule4Detail.price}
                                        </td>
                                        <td className="tright">
                                            {`${rule4Detail.r4Deduction}%`}
                                        </td>
                                        <td>
                                            <input
                                            type="text"
                                            className={`tright ${rule4Detail.appliedPriceIsInvalid ? 'invalid' : ''}`}
                                            value={rule4Detail.appliedPrice || ''}
                                            onChange={(e)=>{
                                                let value = e.target.value;
                                                value = isNaN(Number(value)) || value.charAt(value.length - 1) === '.' ? value : Number(value);
                                                const isInvalid = isNaN(Number(value));
                                                if(typeof value === 'number') {
                                                    value = Number(value.toFixed(2));
                                                }
                                               this._handleRule4DetailChange(rule4ResultIndex, rule4DetailIndex, 'appliedPrice', value, isInvalid);
                                            }}/>
                                        </td>
                                        <td className="tright">
                                            <SelectBox
                                                className="r4-deduction short-input"
                                                onChange={(e)=> {
                                                    this._handleRule4DetailChange(rule4ResultIndex, rule4DetailIndex, 'appliedR4Deduction', Number(e.target.value));
                                                }}
                                                value={rule4Detail.appliedR4Deduction.toString()}
                                                name="r4-deduction"
                                                options={r4deductions}/>
                                        </td>
                                    </tr>
                                )
                            });
                            let totalBookDeduction = 0;
                            rule4Result.rule4Details.forEach((rule4Detail) => {
                                if(rule4Detail.appliedR4Deduction && rule4Detail.appliedR4Deduction > 0) {
                                    totalBookDeduction += rule4Detail.appliedR4Deduction
                                };
                            });
                            rule4ResultRow.push(
                                <tr key={rule4Result.id} className="text-bold">
                                    <td colSpan="5">
                                    </td>
                                    <td>
                                        Total Book Deduction
                                    </td>
                                    <td className="tright">
                                        {`${totalBookDeduction}%`}
                                    </td>
                                </tr>
                            )
                            return rule4ResultRow;
                        })}
                    </tbody>
                </table>
            </div>
        )
    }
}