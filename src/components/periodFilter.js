import React, { PropTypes } from "react";
import SelectBox from './selectBox';

export default class PeriodFilter extends React.Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        const { value, periods, onChange } = this.props;
        if(periods.indexOf(value) === -1) {
            onChange(periods[0]);
        }
    }

    componentDidUpdate() {
        const { value, periods, onChange } = this.props;
        if(periods.indexOf(value) === -1) {
            onChange(periods[0]);
        }
    }

    render() {
        const { value, periods, onChange, disabled } = this.props;
        return(
            <SelectBox disabled={disabled} className="periods" onChange={ (event) => { onChange(event.target.value) } } value={value} name="status" options={periods}/>     
        )
    }
}