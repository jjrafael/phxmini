/**
 * Used in redux-form
 * onClick, value, placeholder, etc. of input will be inherited
 *
 */
import React from "react";
import DateRangePicker from 'components/dateRangePicker';

const InputField = ({ input, label, type, isRequired, disabled, defaultValue, initialValue, className, classOverride,  meta: { touched, error, warning } }) => {
    const classError = touched && error ? 'input-error' : '';
    let modifiedValue = input.value;
    return (
        <div className={`form-group clearfix ${className} ${classError} ${classOverride}`} data-required={isRequired}>
            <label className="form-group-label">{label}</label>
            <div className="form-group-control">
                <input {...input} type={type} disabled={disabled} value={modifiedValue}/>
                <span className="field-err">
                    {touched && error && <span>{error}</span>}
                </span>
            </div>
        </div>
    );
}

const SelectField = ({input, label, isRequired, disabled, className, meta: { touched, error, warning }, children, style }) => {
    const classError = touched && error ? 'input-error' : '';
    return (
        <div style={{...style}}>
            <select {...input} disabled={disabled}>
                {children}
            </select>
            <span className="field-err">
                {touched && error && <span>{error}</span>}
            </span>
        </div>
    );
}

const SexSelectField = ({input, label, isRequired, disabled, className, meta: { touched, error, warning }, children, style }) => {
    const classError = touched && error ? 'input-error' : '';
    return (
        <div className={`form-group clearfix ${className} ${classError}`} data-required={isRequired}>
            <label className="form-group-label">{label}</label>
            <div className="form-group-control">
                <select {...input} disabled={disabled}>
                    {children}
                </select>
                <span className="field-err">
                    {touched && error && <span>{error}</span>}
                </span>
            </div>
        </div>
    );
}

const DatePickerField = ({ input, disabled, label, type, isRequired, autoFocus, meta: { touched, error, warning }, style }) => (
            <DateRangePicker
                showDatePickerOnFocus={true}
                value={input.value}
                autoFocus={autoFocus}
                disabled={disabled}
                onDateChange={(value)=>{
                    input.onChange(value);
                }}
            />
);

const DatePickerFieldDisableAfterDates = (fields) => (
  <DateRangePicker
    showDatePickerOnFocus={true}
    value={fields[fields.valueFieldName].input.value}
    autoFocus={fields.autoFocus}
    onDateChange={(value)=>{
      fields[fields.valueFieldName].input.onChange(value);
    }}
    disabledDaysAfter={fields[fields.disabledDaysAfterFieldName].input.value}
    />
);

const ErrorDisplayField = ({ meta: { error } }) => {
  return (
    <div className={'form-group clearfix'}>
      <span className="field-err-inline">
        {error &&
          <span>
            {error}
          </span>
        }
      </span>
    </div>
)};

const CheckBoxField = ({ input, label, type, isRequired, disabled, className='form-group', onChange, meta: { touched, error, warning } }) => {
    const classError = touched && error ? 'input-error' : '';
    let sublabel = null;
    let otherProps = {};
    if (onChange) { otherProps.onChange = onChange; }
    if(input.name === 'americanFormat'){
        if(input.value){
            sublabel = <span className="sublabel">Description will be B @ A</span>
        }else{
            sublabel = <span className="sublabel">Description will be A vs B</span>
        }
    }
    return (
        <div className={`${className} clearfix`}>
                <input {...input} type={type} disabled={disabled} data-value={input.value} id={input.name} {...otherProps}/>
                <span className="checkbox-label">
                    <label htmlFor={input.name}>
                        {label}
                    </label>
                    {sublabel && sublabel}
                </span>
                <span className="field-err">
                    {touched && error && <span>{error}</span>}
                </span>
        </div>
    );
}

export { InputField, SelectField, DatePickerField, DatePickerFieldDisableAfterDates, ErrorDisplayField, CheckBoxField, SexSelectField }
