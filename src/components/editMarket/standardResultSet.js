import React, { PropTypes } from "react";
import SelectBox from '../selectBox';

export default class StandardResultSet extends React.Component {
    constructor(props) {
        super(props);
        const { data, voidReasons } = props;
        this._removeResults = this._removeResults.bind(this);
        this._filteredVoidReasons = voidReasons.filter((voidReason) => voidReason.enabled);
        this.state = {
            results: data
        }
    }

    componentDidUpdate(prevProps, prevState) {
        if(this.props.shouldResetState) {
            this._resetState();
        }
    }

    _resetState() {
        this.setState({
            results: this.props.data
        });
    }

    _removeResults() {
        const { changeHandler } = this.props;
        const newState = { ...this.state.results };
        for(var i = 0; i < newState.outcomeResults.length; i++) {
            const outcomeResult = newState.outcomeResults[i];
            // if(outcomeResult.result !== 'VOID') { // commented out because in toolbar, selections reset to 'No Result' even if current selection is Void
                outcomeResult.result = 'NO_RESULT';
                outcomeResult.voidReasonId = -1;
                outcomeResult.voidReason = null;
            // }
        }
        this.setState({
            results: newState
        });
        changeHandler('marketResults.outcomeResults', [...newState.outcomeResults], 'outcomeId');
    }

    _isOppositeSpreadOutcome(outcome1, outcome2, marketTypeGroup) {
        let isOpposite = false;
        if(marketTypeGroup !== 'TOTALS') {
            if(outcome1.spread > 0 && outcome2.spread > 0 && outcome1.spread === 0 && outcome2.spread === 0) {
                isOpposite = outcome1.spread === -(outcome2.spread);
            } else if(outcome1.spread === 0 && outcome2.spread === 0 && outcome1.spread > 0 && outcome2.spread > 0) {
                isOpposite = outcome1.spread2 === -(outcome2.spread2);
            } else if(outcome1.spread !== 0 && outcome2.spread !== 0 && outcome1.spread !== 0 && outcome2.spread !== 0) {
                isOpposite = outcome1.spread2 === -(outcome2.spread2) && outcome1.spread === -(outcome2.spread)
            }
        } else {
            if((outcome1.description === 'Over' && outcome2.description === 'Under' || outcome2.description === 'Over' && outcome1.description === 'Under') && outcome1.spread === outcome2.spread) {
                isOpposite = true
            }
        }
        return isOpposite;
    }
    _handleRowChange(index, propToChange, value) {
        const { changeHandler, disableHandicaps, marketTypeGroup } = this.props;
        const newRowState = { ...this.state.results.outcomeResults[index], [propToChange]: value };
        const newState = { ...this.state.results };
        newState.outcomeResults[index] = newRowState;
        const changedOutcome = newState.outcomeResults[index];
        if(propToChange === 'result') {
            switch (value) {
                case 'WIN':
                    for(var i = 0; i < newState.outcomeResults.length; i++) {
                        if(i === index) {
                            continue
                        }
                        const outcomeResult = newState.outcomeResults[i];
                        if((outcomeResult.result === 'WIN' || outcomeResult.result === 'NO_RESULT') && disableHandicaps) {
                            outcomeResult.result = 'LOSE';
                        } else if(!disableHandicaps && outcomeResult.result === 'NO_RESULT') {
                            outcomeResult.result = 'LOSE';
                        } else if(!disableHandicaps && this._isOppositeSpreadOutcome(changedOutcome, outcomeResult, marketTypeGroup) && outcomeResult.result !== 'VOID') {
                            outcomeResult.result = 'LOSE';
                        }
                    }
                    newState.outcomeResults[index].voidReasonId = -1;
                    break;
                case 'NO_RESULT':
                    for(var i = 0; i < newState.outcomeResults.length; i++) {
                        if(i === index) {
                            continue
                        }
                        const outcomeResult = newState.outcomeResults[i];
                        if(outcomeResult.result !== 'VOID') {
                            outcomeResult.result = 'NO_RESULT';
                        }
                    }
                    newState.outcomeResults[index].voidReasonId = -1;
                    break;
                case 'LOSE':
                    for(var i = 0; i < newState.outcomeResults.length; i++) {
                        if(i === index) {
                            continue
                        }
                        const outcomeResult = newState.outcomeResults[i];
                        if(outcomeResult.result === 'NO_RESULT') {
                            outcomeResult.result = 'LOSE';
                        }
                    }
                    newState.outcomeResults[index].voidReasonId = -1;
                    break;
                case 'VOID':
                    newState.outcomeResults[index].voidReasonId = this._filteredVoidReasons[0].id;
                    break;
                default: 
                    break;
            };
        }
        
        this.setState({
            results: newState
        });
        changeHandler('marketResults.outcomeResults', [...newState.outcomeResults], 'outcomeId');
    }

    render() {
        const { voidReasons, disableResultEdit, hasPermission } = this.props;
        return (
            <div>
                {disableResultEdit && hasPermission &&
                    <p className="tcenter">Please close the market first and save the changes to edit result</p>
                }
                <table cellPadding="0" cellSpacing="0">
                    <thead>
                        <tr>
                            <th>
                                Description
                            </th>
                            <th>
                                Win
                            </th>
                            <th>
                                Lose
                            </th>
                            <th>
                                Void
                            </th>
                            <th>
                                No Result
                            </th>
                            <th>
                                Void Reason
                            </th>
                            <th>
                                Void Reason Notes
                            </th>
                        </tr>
                    </thead>
                    <tbody className="tcenter">
                        {this.state.results.outcomeResults.map((outcomeResult, index)=> {
                            const disableVoidData = outcomeResult.voidReasonId < 0;
                            return (
                                <tr key={index}>
                                    <td className="tleft">
                                        {!!outcomeResult.fDescription ? outcomeResult.fDescription : outcomeResult.description} {outcomeResult.formattedSpread}
                                    </td>
                                    <td className="editable">
                                        <input disabled={disableResultEdit} onChange={(e)=> this._handleRowChange(index, 'result', 'WIN')} name={`result-${outcomeResult.outcomeId}-${index}`} type="radio" checked={outcomeResult.result === 'WIN'}/>
                                    </td>
                                    <td className="editable">
                                        <input disabled={disableResultEdit} onChange={(e)=> this._handleRowChange(index, 'result', 'LOSE')} name={`result-${outcomeResult.outcomeId}-${index}`} type="radio" checked={outcomeResult.result === 'LOSE'}/>
                                    </td>
                                    <td className="editable">
                                        <input disabled={disableResultEdit} onChange={(e)=> this._handleRowChange(index, 'result', 'VOID')} name={`result-${outcomeResult.outcomeId}-${index}`} type="radio" checked={outcomeResult.result === 'VOID'}/>
                                    </td>
                                    <td className="editable">
                                        <input disabled={disableResultEdit} onChange={(e)=> this._handleRowChange(index, 'result', 'NO_RESULT')} name={`result-${outcomeResult.outcomeId}-${index}`} type="radio" checked={outcomeResult.result === 'NO_RESULT'}/>
                                    </td>
                                    <td className="editable">
                                        <SelectBox
                                            className="void-reason block-input"
                                            onChange={(e)=> {
                                                this._handleRowChange(index, 'voidReasonId', e.target.value)
                                            }}
                                            disabled={disableVoidData || disableResultEdit}
                                            valueKey={'id'}
                                            descKey={'description'}
                                            value={disableVoidData < 0 ? '' : outcomeResult.voidReasonId}
                                            name="void-reason"
                                            options={disableVoidData < 0 ? [] : this._filteredVoidReasons}/>
                                    </td>
                                    <td className="editable tleft">
                                        <input
                                            type="text"
                                            value={outcomeResult.voidReasonNotes || ''}
                                            disabled={disableVoidData || disableResultEdit}
                                            onChange={(e)=>{
                                               this._handleRowChange(index, 'voidReasonNotes', e.target.value) 
                                            }}/>
                                    </td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
                <button
                    className="btn btn-action"
                    disabled={disableResultEdit}
                    onClick={disableResultEdit ? (e) => {e.preventDefault();} : this._removeResults}>Clear</button>
            </div>
        )
    }
}