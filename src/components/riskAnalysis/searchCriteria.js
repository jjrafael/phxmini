import React, { PropTypes } from "react";
import { formatISODateString } from '../../utils';
import filterTypes from '../../constants/filterTypes';
import DateRangePicker from '../dateRangePicker';
import SelectBox from '../selectBox';
import moment from 'moment';
import { objectToArray } from '../../utils';

export default class SearchCriteria extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            filterFromDate: this.props.filterFromDate,
            filterToDate: this.props.filterToDate,
            filterDate: this.props.filterDate,
            filterFromTime: this.props.filterFromTime || '00:00',
            filterFromTimeValid: this.props.filterFromTime ? this._isTimeInputValid(this.props.filterFromTime) : this._isTimeInputValid('00:00'),
            filterToTime: this.props.filterToTime || '00:00',
            filterToTimeValid: this.props.filterToTime ? this._isTimeInputValid(this.props.filterToTime) : this._isTimeInputValid('00:00'),
            isValidDateRange: typeof this.props.isValidDateRange !== 'undefined' ? this.props.isValidDateRange : true,
        }
        this.toOptions = {
          disabledDays: day => {
            return moment(day) < moment(this.state.filterFromDate)
          }
        };
    }

    _fromDateChangeHandler(value) {
        this.toOptions = {
          disabledDays: day => {
            return moment(day) < moment(value)
          }
        };
        this.setState({
            filterFromDate: value
        });
    }

    _toDateChangeHandler(value) {
        this.setState({
            filterToDate: value
        });
    }

    _isTimeInputValid(value) {
        let hr, min, isInvalid;
        if(value.indexOf(':') > -1) {
            hr = value.split(':')[0];
            min = value.split(':')[1];
            if(isNaN(Number(hr)) || Number(hr) > 23 || Number(hr) < 0) {
                return false;
            }
            if(isNaN(Number(min)) || Number(min) > 59 || Number(min) < 0 || !min.length) {
                return false
            }
        } else {
            return false
        }
        return true
    }

    render() {
        const { filterFromDate, filterToDate, filterDate, filterToTime, filterFromTime, filterFromTimeValid, filterToTimeValid } = this.state;
        const { changeHandler, isValidDateRange, disableDateRange, disableAllInputs } = this.props;
        return (
            <div className="header-utilities-container">
                <div className="search-criteria filters-container">
                    <h3 className="inline-fields">Search Criteria</h3>
                    <div className="field-container">
                        <SelectBox
                            value={filterDate}
                            disabled={disableAllInputs}
                            onChange={(e)=> {
                                this.setState({
                                    filterDate: e.target.value
                                });
                                changeHandler('filterDate', e.target.value);
                            }}
                            options={objectToArray(filterTypes.PAST_DATES)}/>
                    </div>
                    <div className="field-container">
                        <DateRangePicker
                            disabled={disableDateRange || disableAllInputs}
                            showDatePickerOnFocus={true}
                            inputLabel="From"
                            inputClass={isValidDateRange ? '' : 'invalid'}
                            value={filterFromDate}
                            onDateChange={(value)=>{
                                this._fromDateChangeHandler(value);
                                changeHandler('filterFromDate', value);
                            }}/>
                    </div>
                    <div className="field-container">
                        <input
                            className={`short-input ${filterFromTimeValid ? '' : 'invalid'}`}
                            disabled={disableDateRange || disableAllInputs}
                            type="text"
                            value={filterFromTime}
                            onChange={(e)=> {
                                const isValid = this._isTimeInputValid(e.target.value);
                                this.setState({
                                    filterFromTime: e.target.value,
                                    filterFromTimeValid: isValid
                                });
                                changeHandler('filterFromTime', e.target.value);
                                changeHandler('filterFromTimeValid', isValid);
                            }}
                            onBlur={(e)=> {
                                if(!e.target.value.length) {
                                    this.setState({
                                        filterFromTime: '00:00',
                                        filterFromTimeValid: true
                                    });
                                    changeHandler('filterFromTime', '00:00');
                                    changeHandler('filterFromTimeValid', true);
                                }
                            }}/>
                    </div>
                    <div className="field-container">
                        <DateRangePicker
                            disabled={disableDateRange || disableAllInputs}
                            showDatePickerOnFocus={true}
                            inputLabel="To"
                            inputClass={isValidDateRange ? '' : 'invalid'}
                            value={filterToDate}
                            options={this.toOptions}
                            onDateChange={(value)=>{
                                this._toDateChangeHandler(value);
                                changeHandler('filterToDate', value);
                            }}/>
                    </div>
                    <div className="field-container">
                        <input
                            disabled={disableDateRange || disableAllInputs}
                            className={`short-input ${filterToTimeValid ? '' : 'invalid'}`}
                            type="text"
                            value={filterToTime}
                            onChange={(e)=> {
                                const isValid = this._isTimeInputValid(e.target.value);
                                this.setState({
                                    filterToTime: e.target.value,
                                    filterToTimeValid: isValid
                                });
                                changeHandler('filterToTime', e.target.value);
                                changeHandler('filterToTimeValid', isValid);
                            }}
                            onBlur={(e)=> {
                                if(!e.target.value.length) {
                                    this.setState({
                                        filterToTime: '00:00',
                                        filterToTimeValid: true
                                    });
                                    changeHandler('filterToTime', '00:00');
                                    changeHandler('filterToTimeValid', true);
                                }
                            }}/>
                    </div>
                    <div className="field-container">
                        <button
                            disabled={this.props.disableSearchButton}
                            className={this.props.disableSearchButton ? 'disabled' : 'btn-primary'}
                            onClick={(e)=>{
                                this.props.onSubmitClick();
                            }}>
                            Search
                        </button>
                    </div>
                </div>
            </div>
        )
    }
}