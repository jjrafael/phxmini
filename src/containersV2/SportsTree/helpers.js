import qs from 'query-string';
import { makeIterable, formatFilterDates } from 'phxUtils';
import { DUMMY_ID } from './constants';

export const getParentPaths = (path, pathsMap, parentPaths) => {
    let parentPath = pathsMap[path.id];
    if (parentPath) {
        if (parentPath.level !== 0) {
            parentPaths.push({id: parentPath.id, data: {isExpanded: true}});
            getParentPaths(pathsMap[parentPath.parentId], pathsMap, parentPaths);
        } else {
            parentPaths.push({id: path.id, data: {}}); // push the root path for ancestors array
        }
    }
    return parentPaths;
}

const defaultParams = { includeEvents: true, virtual: 0 };
export const generateParameters = ({defaultParams=defaultParams, datesFilter, marketStatusFilter, datesParamFormat="FROMDATE"}) => {
    let dates = datesFilter ? formatFilterDates(datesFilter) : {};
    if (datesParamFormat === 'DATEFROM') {
        dates = {
            dateFrom: dates.fromDate,
            dateTo: dates.toDate,
        }
    }
    return qs.stringify({
        ...defaultParams && defaultParams,
        ...dates,
        ...marketStatusFilter && {marketStatusIds: marketStatusFilter}
    }, {encode: false})
}
export const hasDescMatch = (path, str) => {
    if (path) {
        return path.description.trim().toLowerCase().indexOf(str.toLowerCase()) >= 0;
    } else {
        return false;
    }
}
export const resetMatchSearchProps = (path) => {
    let _path = { ...path };
    if (path.directMatch !== undefined) {
        delete _path.directMatch;
    }
    if (path.hasChildWithMatch !== undefined) {
        delete _path.hasChildWithMatch;
    }
    if (path.hasDirectMatchOnParent !== undefined) {
        delete _path.hasDirectMatchOnParent;
    }
    if (path.level !== 0) {
        _path.isExpanded = false;
    }
    if (_path.type === 'path') {
        _path.searchCount = 0; // reset search count
    }
    return _path;
}

export const insertUniqueId = (array, id) => {
    if (array.includes(id)) {
        return array;
    } else {
        return [...array, id];
    }
}

export const generatePathsMap = ({paths, pathsMap, newPathsMap, parentId, level, baseUrl, sportCode, activePathId, type}) => {
    paths.forEach(path => {
        let oldRef = { ...pathsMap[path.id] };
        // Remove eventCount and marketCount because these are not sent as props when these have no values
        delete oldRef.eventCount;
        delete oldRef.marketCount;
        let ref = { ...oldRef, ...path, eventPaths: [], events: [], childMarkets: [], parentId, level };
        if (type) {
            ref.type = type;
        } else {
            if (path.eventType === undefined) {
                ref.type = 'path';
            } else {
                ref.type = 'event';
            }
        }
        if (ref.type === 'event') {
            ref.childMarkets = oldRef.childMarkets ? [...oldRef.childMarkets] : [];
        }
        ref.isActive = activePathId === path.id ? true : false;
        if (level === 0) {
            ref.isExpanded = true;
        }
        switch (ref.type) {
            case "event": ref.url = `${baseUrl}/${sportCode}/e${path.id}`; break;
            default: ref.url = `${baseUrl}/${sportCode}/p${path.id}`;
        }
        if (parentId && newPathsMap[parentId]) {
            newPathsMap[parentId].eventPaths = insertUniqueId(newPathsMap[parentId].eventPaths, path.id);
        }
        newPathsMap[path.id] = { ...ref }
        let commonProps = { parentId: path.id, level: level + 1, pathsMap, newPathsMap, baseUrl, sportCode, activePathId };
        if (path.events) {
            newPathsMap = generatePathsMap({ paths: path.events, ...commonProps, type: 'event' });
        }
        if (path.eventPaths) {
            newPathsMap = generatePathsMap({ paths: path.eventPaths, ...commonProps });
        }
    })
    return newPathsMap;
}

export const generateChildMarkets = ({markets, pathsMap, parentId, level, baseUrl, sportCode, activePathId, eventId}) => {
    markets.forEach(path => {
        let oldRef = { ...pathsMap[path.id] };
        let ref = { ...oldRef, ...path, eventPaths: [], events: [], childMarkets: [], type: 'market', parentId, level };
        ref.isActive = activePathId === path.id ? true : false;
        ref.url = `${baseUrl}/${sportCode}/m${path.id}?eventId=${eventId}`;
        if (parentId && pathsMap[parentId]) {
            pathsMap[parentId].childMarkets = insertUniqueId(pathsMap[parentId].childMarkets, path.id);
        }
        pathsMap[path.id] = { ...ref }
        let commonProps = { parentId: path.id, level: level + 1, pathsMap, baseUrl, sportCode, activePathId, eventId };
        if (path.childMarkets) {
            pathsMap = generateChildMarkets({ markets: path.childMarkets, ...commonProps });
        }
    })
    return pathsMap;
}

export const generatePathAncestors = ({path, pathsMap, ancestors}) => {
    let parentPath = pathsMap[path.parentId];
    ancestors.push(path.id);
    if (parentPath) {
        ancestors = generatePathAncestors({path: parentPath, pathsMap, ancestors})
    }
    return ancestors;
}

export const markParentPath  = (path, newPathsMap) => {
    if (path && !path.hasChildWithMatch) {
        path.hasChildWithMatch = true;
        path.isExpanded = true;
        markParentPath(newPathsMap[path.parentId], newPathsMap);
    }
    return newPathsMap;
}

export const searchPaths = (paths, str, pathsMap, newPathsMap) => {
    paths.forEach(id => {
        let path = pathsMap[id];
        let parentPath = newPathsMap[path.parentId];
        let ref = resetMatchSearchProps(path);
        if (hasDescMatch(ref, str)) {
            ref.directMatch = true;
            newPathsMap = markParentPath(parentPath, newPathsMap);
        }
        if (parentPath && (parentPath.directMatch || parentPath.hasDirectMatchOnParent)) {
            ref.hasDirectMatchOnParent = true;
        }
        newPathsMap[id] = ref;
        if (path.type === 'path') {
            path.searchCount = 0; // reset search count
        }
        if (path.events) {
            newPathsMap = searchPaths(path.events, str, pathsMap, newPathsMap);
        }
        if (path.eventPaths) {
            newPathsMap = searchPaths(path.eventPaths, str, pathsMap, newPathsMap);
        }
    })
    return newPathsMap;
}

export const modifyParentPathsCountBy = (pathsMap, path, value) => {
    if (path) {
        path.count = path.count ? path.count + value : 0 + value;
        path.eventCount = path.eventCount ? path.eventCount + value : 0 + value;
        if (path.count < 0) { path.count = 0 }
        if (path.eventCount < 0) { path.eventCount = 0 }
        if (path && path.parentId) {
            modifyParentPathsCountBy(pathsMap, pathsMap[path.parentId], value);
        }
    }
    return pathsMap;
}

export const sortChildrenByDescription = (array) => {
    return [...array].sort((a, b) => {
        var descA = a.description.toUpperCase();
        var descB = b.description.toUpperCase();
        if (descA < descB) {return -1; }
        if (descA > descB) {return 1; }
        return 0;
    })
}

export const getSortedPaths = (array, pathsMap) => {
    let sortedEventPaths = array.map(id => {
        return {id, description: pathsMap[id].description}
    });
    return sortChildrenByDescription(sortedEventPaths).map(e => e.id);
}

export const search = ({pathsMap, searchStr, state}) => {
    let newPathsMap = {};
    if (searchStr) {
        newPathsMap = {
            [state.activeSportId]: pathsMap[state.activeSportId],
            ...searchPaths(
                [...pathsMap[state.activeSportId].eventPaths, ...pathsMap[state.activeSportId].events],
                searchStr,
                pathsMap,
                {}
            )
        };
    } else {
        newPathsMap = [...makeIterable(pathsMap)].reduce((accu, val) => {
            let newVal = resetMatchSearchProps(val);
            if (val.level === 0) {
                accu[val.id] = newVal;
            } else {
                accu[val.id] = {...newVal, isExpanded: false};
            }
            return accu;
        }, {});
    }
    let events = [...makeIterable(newPathsMap)].filter(path => {
        if(path.type === 'event') {
            if (path.directMatch || path.hasDirectMatchOnParent) {
                return true;
            }
        }
    });
    if (events.length) {
        events.forEach(event => {
            addCountToParentPath({searchStr, pathsMap: newPathsMap,  path: newPathsMap[event.parentId]});
        })
    } else { // if no results found, set active sport's searchCount to 0
        newPathsMap[state.activeSportId].searchCount = 0;
    }
    return newPathsMap;
}

export const getCommonPathProps = ({pathsMap, activePathId, sportCode}) => {
    return {
        childMarkets: [],
        count: 0,
        eventCount: 0,
        eventPaths: [],
        events: [],
        id: DUMMY_ID,
        isActive: true,
        isExpanded: false,
        level: pathsMap[activePathId].level + 1,
        parentId: activePathId,
        type: "path",
        url: "",
        sportCode,
    }
}

export const deletePath = ({state, id}) => {
    let pathsMap = { ...state.pathsMap };
    let path = pathsMap[id];
    let parentPath = pathsMap[path.parentId];
    let pathForModification = null;
    let otherProps = {
        eventPaths: [...pathsMap[parentPath.id].eventPaths],
        events: [...pathsMap[parentPath.id].events],
        childMarkets: [...pathsMap[parentPath.id].childMarkets],
    }
    let targetKey;
    if (path.type === 'path') {
        targetKey = 'eventPaths';
        otherProps.count = parentPath.count ? parentPath.count - 1 : 0;
        otherProps.eventCount = parentPath.eventCount ? parentPath.eventCount - 1 : 0;
    } else if (path.type === 'event') {
        targetKey = 'events';
        otherProps.count = parentPath.count ? parentPath.count - 1 : 0;
        otherProps.eventCount = parentPath.eventCount ? parentPath.eventCount - 1 : 0;
        pathForModification = {...parentPath};
    } else if (path.type === 'market') {
        targetKey = 'childMarkets';
        if (parentPath.type === 'event') {
            otherProps.marketCount = parentPath.marketCount ? parentPath.marketCount - 1 : 0;
        }
    }
    otherProps[targetKey] = otherProps[targetKey].filter(id => id !== path.id);
    pathsMap[parentPath.id] = {
        ...parentPath,
        ...otherProps
    }
    delete pathsMap[path.id];
    if (pathForModification && pathForModification.parentId) {
        pathsMap = modifyParentPathsCountBy(pathsMap, pathsMap[pathForModification.parentId], -1);
    }
    return { ...state, pathsMap }
}

export const addInitialCountToParentPath = ({pathsMap, path}) => {
    path.count++;
    if (pathsMap[path.parentId]) {
        addInitialCountToParentPath({pathsMap, path: pathsMap[path.parentId]})
    }
    return pathsMap;
}

export const getParentEvent = ({pathsMap, path, event}) => {
    if (path.type === 'event') {
        event = path;
    } else {
        if (pathsMap[path.id]) {
            event = getParentEvent({pathsMap, event, path: pathsMap[path.id]})
        }
    }
    return event;
}

export const addCountToParentPath = ({pathsMap, path, searchStr}) => {
    if (path.searchStr !== searchStr) {
        path.searchStr = searchStr;
        path.searchCount = 1;
    } else {
        path.searchCount++;
    }
    if (pathsMap[path.parentId]) {
        addCountToParentPath({pathsMap, searchStr, path: pathsMap[path.parentId]})
    }
    return pathsMap;
}