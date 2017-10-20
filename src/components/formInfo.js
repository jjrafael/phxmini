import React, { PropTypes } from "react";
import { Field, reduxForm } from 'redux-form';
import DateRangePicker from './dateRangePicker';
import FormElement from './FormElement';

const renderField = ({ input, defaultChecked, defaultValue, label, type, disabled, placeholder, fieldLook, val, checked, onClick, change, formClass, isRequired, meta: { touched, error, warning } }) => (
    <div className={'form-group '+fieldLook} data-required={isRequired}>
        <label className="form-group-label">{label} &nbsp;</label>
        <div className={`form-group-control ${disabled}`}>
                <input {...input} 
                    placeholder={placeholder} 
                    type={type} 
                    defaultValue={defaultValue} 
                    value={val} 
                    onClick={onClick} 
                    defaultChecked={defaultChecked} 
                    checked={checked} 
                    disabled={disabled}
                    className={formClass}/>
            <span className="field-err">
            {touched && error && <span>{error}</span>}
            </span>
        </div>
    </div>
);

const renderSelectField = ({ input, label, lists, valueKey, hidePlaceHolder, removeLabel, disabled, placeholder, defaultValue, formClass, value, change, isRequired, fieldLook, meta: { touched, error, warning } }) => (
    <div className={'form-group '+fieldLook} data-required={isRequired}>
        {!removeLabel &&
            <label className="form-group-label">{label} &nbsp; </label>
        }
        <div className={`form-group-control ${disabled}`}>
            <select {...input} disabled={disabled} defaultValue={defaultValue} value={value} className={formClass}>
                {!hidePlaceHolder &&
                    <option>{placeholder && <span>Select {placeholder}</span>}</option>
                }

                { lists && lists.length && lists.map(list => {
                    const val = valueKey && list[valueKey] ? list[valueKey] : list.id;
                    return <option key={list.id} value={val} >{list.description}</option>
                }) }
            </select>
            <span className="field-err">
            {touched && error && <span>{error}</span>}
            </span>
        </div>
    </div>
);

const renderDateField = ({ input, defaultValue, label, disabled, placeholder, fieldLook, value, isRequired, showDatePickerOnFocus, onDateChange, mainClass, datePickerClass, inputName, errorMessage, formClass, meta: { touched, error, warning } }) => (
     <div className={'form-group '+fieldLook} data-required={isRequired}>
        <label className="form-group-label" style={{lineHeight: '20px'}}>{label}</label>
        <DateRangePicker 
            disabled={disabled}
            value={!!value ? value : defaultValue}
            onDateChange={(value)=>{
              input.onChange(value);
            }}
            showDatePickerOnFocus={showDatePickerOnFocus}
            mainClass={mainClass}
            datePickerClass={datePickerClass}
            inputName={inputName}
            inputClass={formClass}
            placeholder={placeholder}>
            <span className="field-err">
                {error && <span>{error}</span>}
            </span>
        </DateRangePicker>
    </div>
);

export default class FormInfo extends React.Component {
    constructor(props) {
        super(props);
    }

    _rendererComponent(component) {
        switch(component) {
            case 'select':
                return renderSelectField;
            break;
            case 'date':
                return renderDateField;
            break;
            default:
                return renderField;
        }
    };

    render() {
        const { className, formInfo, fieldLook, formHead } = this.props;
        return(
            <div>
            {formInfo.map((info, index) => {
                return <FormElement key={index} title={formHead} formWrapperClass={className}>
                    {info.data.map((data,index) => {
                        return <Field fieldLook={fieldLook} key={index} defaultValue={data.defaultValue} defaultChecked={data.defaultChecked} name={data.name} component={this._rendererComponent(data.type)} type={data.type} disabled={data.disabled} label={data.label} placeholder={data.placeholder} onChange={data.onChange} checked={data.checked} lists={data.lists} hidePlaceHolder={data.hidePlaceHolder} validate={data.validate} isRequired={data.isRequired} validate={data.validate} value={data.value} showDatePickerOnFocus={data.showDatePickerOnFocus} onDateChange={data.onDateChange} mainClass={data.mainClass} datePickerClass={data.datePickerClass} inputName={data.inputName} errorMessage={data.errorMessage} formClass={data.formClass}/> 
                    })}
                </FormElement>
            })}
            </div>
        )
    }
}