import React from 'react';

export default ({types, book, onChange, name, disabled}) => {
    return <div className="form-group clearfix">
        <label className="form-group-label">Type</label>
        <div  className="book-types-container">
            { types.map(type => {
                let desc = type.description;
                let id = `${name}-book-${desc}`;
                let isChecked = desc === book.description;
                return <div>
                    <input
                        type="radio"
                        name={name}
                        id={id}
                        checked={isChecked}
                        value={desc}
                        onChange={onChange}
                        disabled={disabled}
                    />
                    <label htmlFor={id}>{desc}</label>
                </div>
            }) }
        </div>
    </div>
}