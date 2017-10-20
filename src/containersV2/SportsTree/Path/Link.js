import React from 'react';

export default (props) => {
    let { active, children, url, onClick, className='', style={}, enableClickWhileActive } = props;
    if (active) {
        className = `${className} active`;
    }
    return (
        <a href={url} className={className} style={style} onClick={(e) => {
            e.preventDefault();
            if (className && className.indexOf('disabled') >= 0) {
                // do nothing
            } else {
                if (onClick && (!active || enableClickWhileActive)) {
                    onClick(e);
                }
            }
        }}>{children}</a>
    );
}