import React from "react";
import cx from 'classnames';

class Selectbox extends React.Component {
  _renderOptions() {
    const { options, value, children } = this.props;
    if(options){
      const valueKey = this.props.valueKey || 'value';
      const descKey = this.props.descKey || 'desc';
      return options.map((element, index) => {
          if(typeof element === 'string') {
              return (
                <option value={element} key={index}>{element}</option>
              )
          } else {
              return (
                <option value={element[valueKey]} key={index}>{element[descKey]}</option>
              )
          }
      });
    } else {
      return children;
    }
  }

  render() {
    const { label,
            hideLabel,
            required,
            indicator,
            highlight,
            disabled,
            errMsg,
            type,
            value,
            name,
            options,
            onChange,
            children,
            active,
            wrapperClass} = this.props;
    const isRequired = required ? 'required' : '';
    let containerClass = cx('input-wrapper', wrapperClass, {
      'has-indicator' : indicator,
      'no-label' : hideLabel,
      'error' : errMsg
    });
    let fieldClass = cx({
      'active': active,
      'disabled': disabled,
      'required': required
    });
    return (
      <div className={containerClass}>
        <label>{label}
          {required && <span className="required-symbol">*</span>}
        </label>
        <select placeholder={label}
              required={required}
              className={` ${highlight}`}
              disabled={disabled}
              value={value}
              name={name}
              onChange={onChange}>
            {this._renderOptions()}
        </select>
        <div className="error">{errMsg}</div>
      </div>
    )
  }
}

export default Selectbox;
