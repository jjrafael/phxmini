import React from 'react';
import { formatISODateString } from "phxUtils";

export default ({path, className='path-name-desc'}) => {
    let description = path.description;
    if (path.type === 'event') {
        if (path.startTime) {
            description += ` ${formatISODateString(path.startTime, 'MM/DD, hh:mm A')}`;
        }
    } else if (path.type === 'market') {
        description += ` - ${path.periodDesc} - ${formatISODateString(path.cutOffTime, 'MM/DD, hh:mm A')}`;
    }
    return <span className={`${className} type-${path.type}`}>{description}</span>
}