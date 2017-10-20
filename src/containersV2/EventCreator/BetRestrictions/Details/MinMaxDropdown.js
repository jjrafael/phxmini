import React from 'react';

const optionsArray = new Array(40);
optionsArray.fill(1);
const MinMaxDropdown = ({value, disabled, onChange}) => {
    return <select value={value} disabled={disabled} onChange={onChange}>
        {optionsArray.map((el, i) => {
            return <option value={i+1}>{i+1}</option>
        })}
    </select>
}

export default MinMaxDropdown;