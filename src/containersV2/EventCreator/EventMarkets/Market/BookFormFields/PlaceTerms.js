import React from 'react';

export default ({placeTerms, book, onChange}) => {
    let value = book.placeTerms ? book.placeTerms[0].description : '';
    return <div className="form-group clearfix">
        <label className="form-group-label">Place Terms</label>
        <div  className="form-group-control">
            <select value={value} onChange={onChange}>
                { placeTerms.map((term, index) => {
                    return <option key={index} value={term.description}>{term.description}</option>
                }) }
            </select>
        </div>
    </div>
}