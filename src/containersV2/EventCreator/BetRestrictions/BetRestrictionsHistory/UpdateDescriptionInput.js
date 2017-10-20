import React, { Component } from 'react';

class UpdateDescptionInput extends Component {
    componentDidMount () {
        this._input.select();
    }
    render () {
        let { value, onChange } = this.props;
        return (
            <div className="flex flex--align-center flex--align-self-top" style={{width: '100%'}}>
                <span className="flex--shrink" style={{paddingRight: '5px'}}>Description: </span>
                <input className="flex--grow" type="text"
                    ref={el => this._input = el}
                    value={value}
                    onChange={e => onChange(e.target.value) }
                />
            </div>
        );
    }
}

export default UpdateDescptionInput;