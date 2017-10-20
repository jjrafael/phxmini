import React, { PropTypes } from "react";

export default class SelectBox extends React.Component {
    constructor(props) {
        super(props);
    }

    _renderOptions() {
        const { options, value } = this.props;
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
    }

    render() {
        const {onChange, value, className, name, disabled} = this.props;
        return(
            <select disabled={disabled} className={className} name={name} value={value} onChange={(event) => onChange(event)}>
                {this._renderOptions()}
            </select>
        )
    }
}

// prop checks
SelectBox.propTypes = {
  onChange: PropTypes.func,
  options: PropTypes.array.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  className: PropTypes.string,
  name: PropTypes.string
}