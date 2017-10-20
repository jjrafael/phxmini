import React from 'react';
import filterTypes from 'constants/filterTypes';
import { makeIterable } from 'phxUtils';

const STATUS_ARRAY = [...makeIterable(filterTypes.STANDARD_MARKET_STATUSES)];
export default ({path, config}) => {
    const iconTypes = config.iconTypes || ['path', 'event', 'market'];
    if (path.level === 0) {
        return <span className={`path-icon path-icon--path sports-ico-${path.sportCode}`}></span>
    }
    switch (path.type) {
        case 'event':
            if (!iconTypes.includes('event')) { return null; }
            if (path.eventType === 1) {
                return <span className="path-icon path-icon--event"><i className="phxico phx-game-event icon-small"></i></span>;
            } else {
                return <span className="path-icon path-icon--event"><i className="phxico phx-rank-event icon-small"></i></span>;
            }
            break;
        case 'market':
            if (!iconTypes.includes('market')) { return null; }
            let marketIcon = '';
            let status = STATUS_ARRAY.find(e => Number(e.value) === path.statusId);
            if (status) {
                marketIcon = <i className={`phxico phx-${status.desc.toLowerCase()}`}></i>;
            } else {
                throw new Error('Market status not found');
            }
            return <span className="path-icon path-icon--market">{marketIcon}</span>;
        case 'path':
            if (!iconTypes.includes('path')) { return null; }
            return <span className="path-icon path-icon--path"><i className="phxico phx-event-path icon-small"></i></span>;
        default: return null;
    }
}