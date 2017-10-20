import React from 'react';

export default ({description, period, onClick, isActive}) => {
    let listItemClassName = isActive ? 'list-item-name active' : 'list-item-name';
    return <li className="list-item">
        <div className={listItemClassName} onClick={ e => onClick(period)}>{description}</div>
    </li>
}