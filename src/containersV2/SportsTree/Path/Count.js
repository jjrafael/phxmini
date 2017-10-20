import React from 'react';

export default ({path, isSearching, config}) => {
    let count = path.eventCount || path.marketCount;
    let content;
    // if (path.level === 0) { return null }
    if (path.type === 'market') {
        count = path.childMarkets.length;
    }
    if (config.useCount) {
        count = path.count;
    }
    if (isSearching) {
        count = path.searchCount;
    }
    if (count) {
        content = <span className="path-count">{count}</span>
    }
    return <div className="path-count-container">{content}</div>
}