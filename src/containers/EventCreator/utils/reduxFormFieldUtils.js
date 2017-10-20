'use strict';
import React from "react";
import { Field, reduxForm, Form } from 'redux-form';
import KitColorChooser from 'eventCreatorOpponentsComponents/KitColorChooser';
import cx from 'classnames';


export function renderField ({ classOverride, input, label, type, disabled, isRequired, hidePlaceHolder, autoFocus, meta: { touched, error, warning }, placeholder }) {
    let overrideClassName = cx("form-group", {[classOverride]: classOverride});
    let frmGrpCtrlClass = cx('form-group-control', {'disabled': disabled});
    return (
        <div className={overrideClassName} data-required={isRequired}>
            <label className="form-group-label">{label} &nbsp;</label>
            <div className={frmGrpCtrlClass}>
                <input {...input} placeholder={hidePlaceHolder ? '' : placeholder ? placeholder : label} type={type} disabled={disabled} autoFocus={autoFocus}/>
                <span className="field-err">
                {touched && error && <span>{error}</span>}
                </span>
            </div>
        </div>
    );
};

export function renderSelectField ({ classOverride, input, label, type, disabled, lists, valueKey, defaultValue, value, hidePlaceHolder, removeLabel, isRequired, className, autoFocus, meta: { touched, error, warning } }) {
    let overrideClassName = cx("form-group", classOverride);
    return (
        <div className={overrideClassName} data-required={isRequired}>
            {!removeLabel &&
                <label className="form-group-label">{label} &nbsp; </label>
            }
            <div  className="form-group-control">
                <select {...input} disabled={disabled} className={className} autoFocus={autoFocus} >
                    {!hidePlaceHolder &&
                        <option>Select {label}</option>
                    }

                    { lists.map(list => {
                        let val = valueKey && list[valueKey] ? list[valueKey] : list.id;
                        if(list.description === 'None') { val = ""};
                        return <option key={list.id} value={val}>{list.description}</option>
                    }) }
                </select>
                <span className="field-err">
                {touched && error && <span>{error}</span>}
                </span>
            </div>
        </div>
    );
};

export function renderColorPicker({ input, label, disabled, isRequired, defaultValue, value, meta: { touched, error, warning }}) {
  let frmGrpCtrlClass = cx('form-group-control', 'color-picker', {'disabled': disabled});
  return (
    <div className="form-group" data-required={isRequired}>
      <label className="form-group-label">{label} &nbsp;</label>
      <div className={frmGrpCtrlClass}>
        <KitColorChooser initialColor={input.value} onColorChange={(color)=>{input.onChange(color.hex)}}/>
        <span className="field-err">
        {touched && error && <span>{error}</span>}
        </span>
      </div>
    </div>
  )
};
