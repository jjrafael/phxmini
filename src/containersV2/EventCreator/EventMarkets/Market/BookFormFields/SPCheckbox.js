import React from 'react';

export default ({disabled, checked, onChange, name='check'}) => {
    let id = `${name}-book-type-sp`
    return <div className="sp-checkbox-container">
        <input
            type="checkbox"
            id={id}
            disabled={disabled}
            checked={checked}
            onChange={onChange}
        />
        <label htmlFor={id}>SP Book</label>
    </div>
}