import React from 'react';

export default () => {
    return <div className="rt-tbody">
        {[1,2,3,4].map(index => {
            let className = 'rt-tr -odd';
            if (index % 2 === 0) {
                className = 'rt-tr -even';
            }
            return <div key={index} className="rt-tr-group">
                <div className={className}>
                    <div className="rt-td col-visibility">&nbsp;</div>
                    <div className="rt-td col-numbers">&nbsp;</div>
                    <div className="rt-td col-numbers">&nbsp;</div>
                    <div className="rt-td col-description">&nbsp;</div>
                </div>
            </div>
        })}
    </div>
}
