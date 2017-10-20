import React from 'react';
import moment from 'moment';

import DayPicker, { DateUtils } from 'react-day-picker';

const overlayStyle = {
  position: 'absolute',
  background: 'white',
  boxShadow: '0 2px 5px rgba(0, 0, 0, .15)',
  zIndex: 99
};

export default class DateRangePicker extends React.Component {

  constructor(props) {
    super(props);
    const { value } = this.props;
    this.handleDayClick = this.handleDayClick.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.showCurrentDate = this.showCurrentDate.bind(this);
    this.handleInputFocus = this.handleInputFocus.bind(this);
    this.handleInputBlur = this.handleInputBlur.bind(this);
    this.handleContainerMouseDown = this.handleContainerMouseDown.bind(this);
    this.state = {
      showOverlay: this.props.showDatePickerOnFocus ? false : true,
      value: value && moment(value, 'L', true).isValid() ? value : '', // The value of the input field
      month: value && moment(value, 'L', true).isValid() ? moment(value, 'L').toDate() : new Date(), // The month to display in the calendar
    }
    this.clickedInside = false;
    this.clickTimeout = null;
  }

  showCurrentDate() {
    this.daypicker.showMonth(this.state.month);
  }

  handleContainerMouseDown() {
    this.clickedInside = true;
    this.clickTimeout = setTimeout(() => {
      this.clickedInside = false;
    }, 0);
  }

  handleInputChange(e) {
    const { value } = e.target;

    // Change the current month only if the value entered by the user
    // is a valid date, according to the `L` format
    if (moment(value, 'L', true).isValid()) {
      this.setState({
        month: moment(value, 'L').toDate(),
        value,
      }, this.showCurrentDate);
      if(this.props.onDateChange) {
        this.props.onDateChange(value);
      }
    } else {
      this.setState({ value }, this.showCurrentDate);
      if(this.props.onDateChange) {
        this.props.onDateChange(value);
      }
    }
  }

  handleDayClick(day, modifiers, e) {
    if (modifiers.disabled) {
      return;
    }
    this.setState({
      showOverlay: this.props.showDatePickerOnFocus ? false : true,
      value: moment(day).format('L'),
      month: day,
    });
    if(this.props.showDatePickerOnFocus) {
      this.input.blur();
    }
    if(this.props.onDateChange) {
      this.props.onDateChange(moment(day).format('L'));
    }
  }

  handleInputFocus() {
    if(!this.props.showDatePickerOnFocus) {
      this.showCurrentDate();
    } else {
      this.setState({
        showOverlay: true
      });
    }
  }

  handleInputBlur (e) {
    if(this.props.showDatePickerOnFocus) {
      const showOverlay = this.clickedInside;
      this.setState({
        showOverlay: this.clickedInside
      });

      if (this.clickedInside) {
        this.input.focus();
      }
    }
  }

  componentWillUpdate (nextProps, nextState) {
    if (this.props.value !== nextProps.value) {
      const { value } = nextProps;
      if (/^(0[1-9]|1[012])[- /.](0[1-9]|[12][0-9]|3[01])[- /.](19|20)\d\d$/.test(value)) {
        this.setState({
          value: value,
          month: value && value !== '' ? moment(value, 'L').toDate() : new Date(),
        })
      } else {
        this.setState({
          value: value,
        })
      }
    }
  }

  render() {
    const selectedDay = moment(this.state.value, 'L', true).toDate();
    const disabled = typeof this.props.disabled !== 'undefined' ? this.props.disabled : false;
    const { options={} } = this.props;
    const { placeholder, children } = this.props;

    const {disabledDaysAfter} = this.props;
    let disabledDays = [];
    if (disabledDaysAfter) {
      disabledDays.push({after: new Date(disabledDaysAfter)});
    }

    return (
      <div className={`datepicker-container ${this.props.mainClass}`} onMouseDown={ this.handleContainerMouseDown } style={ {position: 'relative'} }>
        <p>
          {this.props.inputLabel &&
          <label>
            {this.props.inputLabel}
          </label>
          }
          <input
            disabled={disabled}
            className={this.props.inputClass ? this.props.inputClass : ''}
            ref={ (el) => { this.input = el; } }
            type="text"
            value={ this.state.value }
            name={this.props.inputName}
            placeholder={ placeholder || "MM-DD-YYYY" }
            onChange={ this.handleInputChange }
            onFocus={ this.handleInputFocus }
            onBlur={ this.handleInputBlur }
            autoFocus={this.props.autoFocus}
          />
        </p>
        {children}
        {this.state.showOverlay &&
        <div className={`${this.props.datePickerClass} datepicker-inner`}>
          <div style={ this.props.showDatePickerOnFocus ? overlayStyle : {} }>
            <DayPicker
              ref={ (el) => { this.daypicker = el; } }
              initialMonth={ this.state.month }
              month={ this.state.month }
              selectedDays={ day => DateUtils.isSameDay(selectedDay, day) }
              onDayClick={ this.handleDayClick }
              disabledDays={disabledDays}
              {...options}
            />
          </div>
        </div>
        }
      </div>
    );
  }

}
