import React from 'react';

export default ({showToggle, onClick, direction}) => {
    if (showToggle) {
        return <span className='path-action' onClick={e => {
            e.preventDefault();
            e.stopPropagation();
            if (onClick) { onClick() }
        }}><i className={`phxico phx-chevron-${direction}`}></i></span>
    } else {
        return <span className='path-action'>&nbsp;</span>
    }
}