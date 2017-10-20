import React, { Component } from 'react';
import InputHOC from './InputHOC';

const Input = ({ id, targetKey, updateNewMarketPayload, setHOCState, value, marketPayload }) => {
    return (
        <input type="text" value={value}
            onChange={e => {
                let value = e.target.value.trim();
                if (marketPayload.allowedChars) {
                    let hasValidChars = false;
                    marketPayload.allowedChars.forEach(validation => {
                        if (!validation(value)) {
                            hasValidChars = true;
                        }
                    })
                    if (hasValidChars) {
                        setHOCState({value})
                    }
                } else {
                    setHOCState({value})
                }
            }}
            onBlur={e => {
                let value = e.target.value.trim();
                updateNewMarketPayload(id, {...marketPayload, [targetKey]: value});
            }}
        />
    );
}

export default InputHOC(Input);