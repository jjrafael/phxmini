import React from "react";
import checkPermission from 'componentsV2/checkPermission/index';

const ListItem = (props) => {
    const { children, title, disabled, style, onClick, className } = props;
    const addClass = disabled ? 'disabled' : null;
    const onClickAction = !disabled ? onClick : null;
    return (
        <li className={`button btn-box ${addClass} ${className}`} 
            title={title} 
            style={{...style}}
            onClick={onClickAction}
        >
            {children}
        </li>
    )
}

export default checkPermission(ListItem);