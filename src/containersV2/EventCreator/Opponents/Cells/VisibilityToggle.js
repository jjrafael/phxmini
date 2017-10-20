import React, { Component } from 'react';

const VisibilityToggle = (props) => {
    let {className, onClick, opponent={}} = props;
    let iconClassName = opponent.hidden ? 'phx-eye-off-outline' : 'phx-eye-outline';
    return (
        <div className={className} onClick={e => {
            onClick({...props, value: !!!opponent.hidden})
        }}><i className={`phxico icon-medium ${iconClassName}`}></i></div>
    );
}

export default VisibilityToggle;