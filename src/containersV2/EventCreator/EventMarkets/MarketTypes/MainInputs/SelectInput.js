import React, { Component } from 'react';
import { updateNewMarketPayload } from '../../actions';
import { outcomeTypes } from '../../constants';
import InputHOC from './InputHOC';

const Input = ({ id, targetKey, updateNewMarketPayload, setHOCState, value, marketPayload }) => {
    return (
        <select name="outcome-type" value={value} onChange={e => {
            let value = e.target.value;
            setHOCState({value});
            updateNewMarketPayload(id, {...marketPayload, [targetKey]: value});
        }}>{
            outcomeTypes.map(type => {
                return <option value={type.key}>{type.value}</option>
            })
        }</select>
    );
}

export default InputHOC(Input);