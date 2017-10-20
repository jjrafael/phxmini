import React, { PropTypes } from "react";
import SelectBox from './selectBox';

export default class MarketFilter extends React.Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        const { value, markets, onChange } = this.props;
        if(markets.indexOf(value) === -1) {
            onChange(markets[0]);
        }
    }

    componentDidUpdate() {
        const { value, markets, onChange } = this.props;
        if(markets.indexOf(value) === -1) {
            onChange(markets[0]);
        }
    }

    render() {
        const { value, markets, onChange, disabled } = this.props;
        return(
            <SelectBox disabled={disabled} className="markets" onChange={ (event) => { onChange(event.target.value) } } value={value} name="status" options={markets}/>     
        )
    }
}