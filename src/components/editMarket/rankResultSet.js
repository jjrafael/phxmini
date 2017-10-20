import React, { PropTypes } from "react";
import SelectBox from '../selectBox';

export default class RankResultSet extends React.Component {
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
            outcomeResult.result = 'NO_RESULT';
            outcomeResult.voidReasonId = -1;
            outcomeResult.voidReason = null;
        }
        this.setState({
            results: newState
        });
        changeHandler('marketResults', newState);
    }

    _handleAbandonedChange(value) {
        this.setState({
            results: {...this.state.results, abandoned: value}
        });
        this.props.changeHandler('marketResults.abandoned', value);
    }

    _handleIgnoreChange(value) {
        this.setState({
            results: {...this.state.results, ignoreFeed: value}
        });
        this.props.changeHandler('marketResults.ignoreFeed', value);
    }

    _handleDividendRowChange(index, propToChange, value, isInvalid) {
        const { changeHandler } = this.props;
        const newRowState = { ...this.state.results.racingDividends[index], [propToChange]: value };
        if(typeof isInvalid !== 'undefined') {
            newRowState[`${propToChange}IsInvalid`] = isInvalid
        };
        const newState = { ...this.state.results };
        newState.racingDividends[index] = newRowState;
        this.setState({
            results: newState
        });
        changeHandler('marketResults.racingDividends', [...newState.racingDividends]);
    }

    _handleRowChange(index, propToChange, value) {
        const { changeHandler } = this.props;
        const newRowState = { ...this.state.results.outcomeResults[index], [propToChange]: value };
        const newState = { ...this.state.results };
        newState.outcomeResults[index] = newRowState;
        
        switch (value) {
            case 'WIN':
                for(var i = 0; i < newState.outcomeResults.length; i++) {
                    const outcomeResult = newState.outcomeResults[i];
                    if(i === index) {
                        outcomeResult.resultDesc = '1st';
                        outcomeResult.voidReasonId = -1;
                        outcomeResult.voidReasonNotes = '';
                        continue
                    }
                    if(outcomeResult.result === 'NO_RESULT') {
                        outcomeResult.result = 'LOSE';
                        outcomeResult.resultDesc = 'Loser';
                    }
                }
                break;
            case 'NO_RESULT':
                for(var i = 0; i < newState.outcomeResults.length; i++) {
                    const outcomeResult = newState.outcomeResults[i];
                    if(i === index) {
                        outcomeResult.resultDesc = 'N/R';
                        outcomeResult.voidReasonId = -1;
                        outcomeResult.voidReasonNotes = '';
                        continue
                    }
                    if(outcomeResult.result !== 'VOID') {
                        outcomeResult.result = 'NO_RESULT';
                        outcomeResult.resultDesc = 'N/R';
                        outcomeResult.voidReasonId = -1;
                        outcomeResult.voidReasonNotes = '';
                    }
                }
                break;
            case 'LOSE':
                for(var i = 0; i < newState.outcomeResults.length; i++) {
                    const outcomeResult = newState.outcomeResults[i];
                    if(i === index) {
                        outcomeResult.result = 'LOSE';
                        outcomeResult.resultDesc = 'Loser';
                        outcomeResult.voidReasonId = -1;
                        outcomeResult.voidReasonNotes = '';
                        continue
                    }
                    if(outcomeResult.result === 'NO_RESULT') {
                        outcomeResult.result = 'LOSE';
                        outcomeResult.resultDesc = 'Loser';
                    }
                }
                break;
            case 'VOID':
                newState.outcomeResults[index].resultDesc = 'N/R';
                newState.outcomeResults[index].voidReasonId = this._filteredVoidReasons[0].id;
                break;
            default:
                for(var i = 0; i < newState.outcomeResults.length; i++) {
                    const outcomeResult = newState.outcomeResults[i];
                    if(i === index && outcomeResult.result.indexOf('PLACE_') > -1) {
                        outcomeResult.voidReasonId = -1;
                        outcomeResult.voidReasonNotes = '';
                        outcomeResult.resultDesc = getPlaceAffix(Number(outcomeResult.result.split('_')[1]));
                        continue
                    }
                    if(outcomeResult.result === 'NO_RESULT') {
                        outcomeResult.result = 'LOSE';
                        outcomeResult.resultDesc = 'Loser';
                    }
                }
                break;
        };
        
        let sameResults = {};
        for(var i = 0; i < newState.outcomeResults.length; i++) {
            const outcomeResult = newState.outcomeResults[i];
            if(sameResults[outcomeResult.result]) {
                sameResults[outcomeResult.result].items.push(outcomeResult);
            } else {
                sameResults[outcomeResult.result] = {
                    items: [outcomeResult]
                }
            }
        };
        newState.outcomeResults.forEach((outcomeResult) => {
            const { result } = outcomeResult;
            const sameResultsCount = sameResults[result] ? sameResults[result].items.length : 0;
            let { resultDesc } = outcomeResult;
            if(result === 'WIN' && sameResultsCount > 1 && sameResultsCount <= 2) {
                outcomeResult.resultDesc = 'DH1';
            } else if(result === 'WIN' && sameResultsCount > 2) {
                outcomeResult.resultDesc = 'DH1' + ' 1 of ' + sameResultsCount;
            } else if(result.indexOf('PLACE_') > -1 && sameResultsCount > 1 && sameResultsCount <= 2) {
                outcomeResult.resultDesc = `DH${result.split('_')[1]}`;
            } else if(result.indexOf('PLACE_') > -1 && sameResultsCount > 2) {
                outcomeResult.resultDesc = `DH${result.split('_')[1]} 1 of ${sameResultsCount}`;
            }
        });
        for(var i = 0; i < Object.keys(sameResults).length; i++) {
            const key = Object.keys(sameResults)[i];
            let lowerKey = key.indexOf('PLACE_') > -1 ? Number(key.split('_')[1]) - 1 : null;
            let lowerKeys = [];
            if(lowerKey === 1) {
                lowerKeys.push('WIN');
            } else if(lowerKey > 1 && lowerKey !== null) {
                lowerKeys.push('WIN');
                while(lowerKey) {
                    if(lowerKey > 1) {
                        lowerKeys.push('PLACE_'+lowerKey);
                    }
                    lowerKey--
                }
            }
            sameResults[key].lowerKeys = lowerKeys;
        }


        this.setState({
            results: newState
        });
        changeHandler('marketResults.outcomeResults', [...newState.outcomeResults], 'outcomeId');
    }

    _renderPlaceColumnHeaders(maxNumPlaces) {
        const columnHeaders = [];
        if(maxNumPlaces === null) {
            maxNumPlaces = 3;
        }
        for (var i = 1; i <= maxNumPlaces; i++) {
            columnHeaders.push(
                <th key={i}>
                    {getPlaceAffix(i)}
                </th>
            )
        } 
        return columnHeaders;
    }

    _renderPlaceColumnCells(maxNumPlaces, outcomeResult, outcomeResultIndex) {
        const columnCells = [];
        const { disableResultEdit } = this.props;
        if(maxNumPlaces === null) {
            maxNumPlaces = 3;
        }
        function isChecked(result, place) {
            if(place === 1) {
                return result === 'WIN';
            } else {
                return result === `PLACE_${place}`;
            }
        }
        for (var i = 1; i <= maxNumPlaces; i++) {
            const resultName = i === 1 ? 'WIN' : `PLACE_${i}`;
            columnCells.push(
                <td key={i}>
                    <input disabled={disableResultEdit} type="radio" onChange={(e)=> this._handleRowChange(outcomeResultIndex, 'result', resultName)} name={`result-${outcomeResult.outcomeId}`} checked={isChecked(outcomeResult.result,i)}/>
                </td>
            )
        } 
        return columnCells;
    }

    render() {
        const data = this.state.results;
        const { disableResultEdit, hasEditedDividend, disableRacingDividendEdit, hasPermission } = this.props;
        return (
            <div>
                {disableResultEdit && hasPermission &&
                    <p className="tcenter">Please close the market first and save the changes to edit result</p>
                }
                {hasEditedDividend &&
                    <p className="tcenter">Please save the racing dividend results changes first before changing race results</p>
                }
                <div className="form-field">
                    <label className="push-right">
                        <input type="checkbox" className="push-right" checked={data.abandoned} onChange={(e)=> this._handleAbandonedChange(e.target.checked)}/>
                        Abandon Event
                    </label>
                    <label>
                        <input type="checkbox" className="push-right" checked={data.ignoreFeed} onChange={(e)=> this._handleIgnoreChange(e.target.checked)}/>
                        Ignore Feed
                    </label>
                </div>
                <table cellPadding="0" cellSpacing="0">
                    <thead>
                        <tr>
                            <th>
                                No.
                            </th>
                            <th>
                                Description
                            </th>
                            <th>
                                FS
                            </th>
                            <th>
                                SP
                            </th>
                            <th>
                                Fav
                            </th>
                            {this._renderPlaceColumnHeaders(data.maxNumPlaces)}
                            <th>
                                Withdrawn
                            </th>
                            <th>
                                Lose
                            </th>
                            <th>
                                No Result
                            </th>
                            <th>
                                Result
                            </th>
                            <th>
                                FPP
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
                        {data.outcomeResults.map((outcomeResult, index)=> {
                            const disableVoidData = outcomeResult.voidReasonId < 0;
                            return (
                                <tr key={index}>
                                    <td className="tleft">
                                        {outcomeResult.raceCardNumber}
                                    </td>
                                    <td>
                                        {outcomeResult.description}
                                    </td>
                                    <td>
                                        {outcomeResult.firstShowPrice > 0 ? outcomeResult.firstShowPrice : ''}
                                    </td>
                                    <td>
                                        {outcomeResult.sp}
                                    </td>
                                    <td>
                                        {outcomeResult.favValue}
                                    </td>
                                    {this._renderPlaceColumnCells(data.maxNumPlaces, outcomeResult, index)}
                                    <td>
                                        <input type="radio" disabled={disableResultEdit || hasEditedDividend} onChange={(e)=> this._handleRowChange(index, 'result', 'VOID')} name={`result-${outcomeResult.outcomeId}`} checked={outcomeResult.result === 'VOID'}/>
                                    </td>
                                    <td>
                                        <input type="radio" disabled={disableResultEdit || hasEditedDividend} onChange={(e)=> this._handleRowChange(index, 'result', 'LOSE')} name={`result-${outcomeResult.outcomeId}`} checked={outcomeResult.result === 'LOSE'}/>
                                    </td>
                                    <td>
                                        <input type="radio" disabled={disableResultEdit || hasEditedDividend} onChange={(e)=> this._handleRowChange(index, 'result', 'NO_RESULT')} name={`result-${outcomeResult.outcomeId}`} checked={outcomeResult.result === 'NO_RESULT'}/>
                                    </td>
                                    <td>
                                        {outcomeResult.resultDesc}
                                    </td>
                                    <td>
                                        {outcomeResult.firstPastPostPosition > 0 ? outcomeResult.firstPastPostPosition : ''}
                                    </td>
                                    <td>
                                        <SelectBox
                                            className="void-reason block-input"
                                            disabled={disableVoidData || disableResultEdit || hasEditedDividend}
                                            onChange={(e)=> {
                                                this._handleRowChange(index, 'voidReasonId', e.target.value);
                                            }}
                                            valueKey={'id'}
                                            descKey={'description'}
                                            value={disableVoidData < 0 ? '' : outcomeResult.voidReasonId}
                                            name="void-reason"
                                            options={disableVoidData < 0 ? [] : this._filteredVoidReasons}/>
                                    </td>
                                    <td>
                                        {outcomeResult.voidReasonNotes}
                                    </td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
                <p className="tleft">
                    Calculated SP: {data.calculateSp} %
                </p>
                {disableRacingDividendEdit &&
                    <p className="tcenter">Please save the racing results changes first before changing dividend results</p>
                }
                <table cellPadding="0" cellSpacing="0">
                    <thead>
                        <tr>
                            <th>
                                Type
                            </th>
                            <th>
                                1
                            </th>
                            <th>
                                2
                            </th>
                            <th>
                                3
                            </th>
                            <th>
                                Dividend
                            </th>
                            <th>
                                Void
                            </th>
                        </tr>
                    </thead>
                    <tbody className="tleft">
                        {data.racingDividends.map((racingDividend, index)=> {
                            return (
                                <tr key={index}>
                                    <td className="tleft">
                                        {racingDividend.typeName}
                                    </td>
                                    <td>
                                        {racingDividend.outcome1Desc}
                                    </td>
                                    <td>
                                        {racingDividend.outcome2Desc}
                                    </td>
                                    <td>
                                        {racingDividend.outcome3Desc}
                                    </td>
                                    <td>
                                        <input
                                            className={`tright ${racingDividend.racingDividendIsInvalid ? 'invalid' : ''}`}
                                            disabled={disableResultEdit || disableRacingDividendEdit}
                                            onChange={(e)=> {
                                                let value = e.target.value;
                                                value = isNaN(Number(value)) || value.charAt(value.length - 1) === '.' ? value : Number(value);
                                                const isInvalid = isNaN(Number(value));
                                                if(typeof value === 'number') {
                                                    value = Number(value.toFixed(2));
                                                }
                                                this._handleDividendRowChange(index, 'dividend', value, isInvalid);
                                            }}
                                            type="text"
                                            value={racingDividend.dividend}/>
                                    </td>
                                    <td>
                                        <input disabled={disableResultEdit || disableRacingDividendEdit} onChange={(e)=> this._handleDividendRowChange(index, 'voidYN', e.target.checked ? 1 : 0)} type="checkbox" checked={racingDividend.voidYN > 0}/>
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

function getPlaceAffix(place) {
    if(place === 1) {
        return '1st'
    } else if(place === 2) {
        return '2nd'
    } else if(place === 3) {
        return '3rd'
    } else {
        return `${place}th`
    }
}