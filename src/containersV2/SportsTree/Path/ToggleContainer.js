import React from 'react';
import Toggle from './Toggle';

export default ({path, onClick}) => {
    let count = path.count || path.marketCount;
    if (path.type === 'market') {
        count = path.childMarkets.length;
    }
    let dir = !!path.isExpanded ? 'down' : 'right';
    if (path.level === 0) { return null }
    return <Toggle direction={dir} showToggle={!!count} onClick={onClick}/>
}