import filterTypes from 'constants/filterTypes';
import actionTypes, { DUMMY_ID, availableDates } from './constants';
import { makeIterable } from 'phxUtils';
import eventCreatorConstants from 'containersV2/EventCreator/App/constants';
import {
    generateParameters,
    generatePathsMap,
    generateChildMarkets,
    generatePathAncestors,
    search,
    getSortedPaths,
    deletePath,
    modifyParentPathsCountBy,
    addInitialCountToParentPath,
} from './helpers';

const datesFilter = availableDates[0];
const defaultParams = { includeEvents: true, virtual: 0 };
const datesParamFormat = '';
const marketStatusFilter = [...makeIterable(filterTypes.STATUS)][0].value;

const initialState = {
    pathsMap: {},
    // TODO: get from config
    activeSportId: 227, // the id of selected sport.
    activeSportCode: 'BASK',
    activePathId: 227, // the id of selected path. On first load, this will be the id of the default sport
    activePathAncestors: [227],
    isFetchingEPT: false,
    isFetchingEPTFailed: false,
    baseUrl: '/event-creator',
    isFirstLoad: true, // use to determine if api call is on first load. Set as false upon first fetchEPT success
    isFiltered: false,
    isLoaded: false, // use to determine if tree is already loaded
    isSorted: false,
    parameters: generateParameters({datesFilter, marketStatusFilter, defaultParams, datesParamFormat}),
    searchStr: '',
    pathsOrder: {},
    isSavingPathsOrder: false,
    isSavingPathsOrderFailed: false,
    marketStatusFilter,
    datesFilter,
    defaultParams,
    pathSelectionsMap: {},
    pathSelections: [],
    config: {
        displayCheckbox: false, // a checkbox component will be rendered beside path name based on this config
    }, 

    sportsMap: {},
};

const sportsTree = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.UPDATE_PATH_BASE_URL:
            return { ...state, baseUrl: action.baseUrl };
        case actionTypes.FETCH_EPT:
        case actionTypes.FETCH_RESTRICTION_EPT:
            return { ...state, isFetchingEPT: true, isFetchingEPTFailed: false,
                pathsOrder: {}, // clear pathsOrder state when sports tree is refreshed since eventPaths will be overwritten by the new data
                isLoaded: false,
            }; 
        case actionTypes.FETCH_EVENT_MARKETS_SUCCEEDED:
            return (state => {
                let path = state.pathsMap[action.eventId];
                let pathsMap = generateChildMarkets({
                    markets: action.response,
                    pathsMap: {...state.pathsMap, [action.eventId]: {...path}}, // PUZZLE: it doesn't update on first expand of event when passed as {...state.pathsMap}
                    parentId: action.eventId,
                    eventId: action.eventId,
                    level: path.level + 1,
                    baseUrl: state.baseUrl,
                    sportCode: path.sportCode.toLowerCase(),
                    activePathId: state.activePathId
                });
                return {
                    ...state,
                    pathsMap: {
                        ...state.pathsMap,
                        ...pathsMap
                    }
                };
            })(state)
            
        case actionTypes.FETCH_EPT_SUCCEEDED:
            return (state => {
                let sport = action.response.eventPaths.find(path => path.id === state.activeSportId);
                let baseMap = action.persistOldPathsMap ? {...state.pathsMap} : {}; // Either create a new map from scratch or use the old map
                let pathsMap = {};
                if (sport) {
                    pathsMap = generatePathsMap({
                        paths: action.response.eventPaths.filter(path => path.id === state.activeSportId),
                        pathsMap: {...state.pathsMap},
                        newPathsMap: baseMap,
                        parentId: 0,
                        level: 0,
                        baseUrl: state.baseUrl,
                        sportCode: sport.sportCode.toLowerCase(),
                        activePathId: state.activePathId
                    });
                }
                let sportsMap = action.response.eventPaths.reduce((accu, sport) => {
                    accu[sport.id] = {
                        count: sport.count,
                        rawDesc: sport.description,
                        description: `${sport.description} (${sport.count})`,
                        id: sport.id,
                        sportCode: sport.sportCode
                    }
                    return accu;
                }, {})

                // this is to make the count similar to eventCount in Event Creator
                // if being used in Risk Manager
                if (state.config.useCount) {
                    let events = [];
                    [...makeIterable(pathsMap)].map(path => {
                        if (path.type === 'event') {
                            events.push(path);
                        } else if (path.type === 'path') {
                            path.count = 0; // set to zero by default
                        }
                    });
                    if (events.length) {
                        events.forEach(event => {
                            addInitialCountToParentPath({ pathsMap,  path: pathsMap[event.parentId]});
                        })
                    } else { // if no results found, set active sport's count to 0
                        if (pathsMap[state.activeSportId]) {
                            pathsMap[state.activeSportId].count = 0;
                        }
                    }
                }
                if (state.searchStr) {
                    // search again if searchStr is set after fetching the tree
                    pathsMap = search({pathsMap, searchStr: state.searchStr, state});
                }
                return {
                    ...state,
                    isFetchingEPT: false,
                    isFirstLoad: false,
                    isLoaded: true,
                    pathsMap,
                    sportsMap
                };
            })(state)
            
        case actionTypes.FETCH_EPT_FAILED:
            return { ...state,  isFetchingEPT: false, isFetchingEPTFailed: true };

        case actionTypes.UPDATE_PATH:
            return {
                ...state,
                pathsMap: {
                    ...state.pathsMap,
                    [action.id]: {...state.pathsMap[action.id], ...action.data }
                }
            };
        case actionTypes.UPDATE_PATHS:
            let updatedPaths = action.pathsArray.reduce((accu, val) => {
                accu[val.id] = { ...state.pathsMap[val.id], ...val.data }
                return accu;
            }, {})
            return {
                ...state,
                pathsMap: {
                    ...state.pathsMap,
                    ...updatedPaths
                }
            };
        case actionTypes.UPDATE_ACTIVE_SPORT_CODE_AND_ID:
            return {
                ...state,
                activeSportId: action.activeSportId,
                activeSportCode: action.activeSportCode,
                activePathId: action.activeSportId,
                activePathAncestors: [action.activeSportId],
                pathSelectionsMap: {},
                pathSelections: []
            }
        case actionTypes.UPDATE_ACTIVE_PATH_ID:
            let currentActivePath = { ...state.pathsMap[state.activePathId], isActive: false };
            let newActivePath = { ...state.pathsMap[action.activePathId], isActive: true }
            if (!state.pathsMap[action.activePathId]) {
                return {
                    ...state,
                    activePathId: action.activePathId,
                    activePathAncestors: [],
                    pathsMap: { ...state.pathsMap, [currentActivePath.id]: currentActivePath }
                }
            }
            let activePathAncestors = generatePathAncestors({
                path: newActivePath,
                pathsMap: state.pathsMap,
                ancestors: []
            })
            let _pathsMap = {
                ...state.pathsMap,
                [currentActivePath.id]: currentActivePath,
                [newActivePath.id]: newActivePath,
            };
            if (!currentActivePath.id) {
                delete _pathsMap[currentActivePath.id];
            }
            return {
                ...state,
                activePathId: action.activePathId,
                pathsMap: _pathsMap,
                activePathAncestors
            }
        case actionTypes.UPDATE_ACTIVE_PATH_ANCESTORS:
            return {
                ...state,
                activePathAncestors: action.activePathAncestors
            }

        case actionTypes.UPDATE_TOGGLE_STATE:
            return (state => {
                let pathsMap = {};
                if (action.toggleState.expandedAll) {
                    pathsMap = [...makeIterable(state.pathsMap)].reduce((accu, val) => {
                        if (val.eventType) {
                            accu[val.id] = val;
                        } else {
                            accu[val.id] = {...val, isExpanded: true};
                        }
                        return accu;
                    }, {});
                } else if (action.toggleState.collapsedAll) {
                    pathsMap = [...makeIterable(state.pathsMap)].reduce((accu, val) => {
                        if (val.level === 0) {
                            accu[val.id] = val;
                        } else {
                            accu[val.id] = {...val, isExpanded: false};
                        }
                        return accu;
                    }, {});
                }
                return { ...state, pathsMap }
            })(state)
            
        case actionTypes.UPDATE_FILTER_STATE:
            return { ...state, isFiltered: action.isFiltered }

        case actionTypes.UPDATE_SORT_STATE:
            return (state => {
                let pathsMap = state.pathsMap;
                if (action.isSorted) {
                    pathsMap = [...makeIterable(state.pathsMap)].reduce((accu, val) => {
                        let sortedEventPaths = val.eventPaths;
                        let sortedEvents = val.events;
                        if (val.eventPaths.length) {
                            sortedEventPaths = getSortedPaths(val.eventPaths, pathsMap);
                        }
                        if (val.events.length) {
                            sortedEvents = getSortedPaths(val.events, pathsMap);
                        }
                        accu[val.id] = {...val, sortedEvents, sortedEventPaths}
                        return accu;
                    }, {});
                }
                return { ...state, isSorted: action.isSorted, pathsMap }
            })(state)
            
        case actionTypes.SET_DATES_FILTER:
            return {
                ...state,
                datesFilter: action.datesFilter,
                parameters: generateParameters({
                    datesFilter: action.datesFilter,
                    marketStatusFilter: state.marketStatusFilter,
                    defaultParams: state.defaultParams,
                    datesParamFormat: state.datesParamFormat,
                })
            };
        case actionTypes.SET_MARKET_STATUS_FILTER:
            return {
                ...state,
                marketStatusFilter: action.marketStatusFilter,
                parameters: generateParameters({
                    datesFilter: state.datesFilter,
                    marketStatusFilter: action.marketStatusFilter,
                    defaultParams: state.defaultParams,
                    datesParamFormat: state.datesParamFormat
                })
            };

        case actionTypes.UPDATE_CONFIG: // update config
            return {
                ...state,
                config: {...state.config, ...action.config}
            };

        case actionTypes.SET_PARAMETERS: // directly set parameters from components
            return {
                ...state,
                parameters: action.parameters
            };
        case actionTypes.SET_DEFAULT_PARAMETERS: // directly set the default parameters from components
            return {
                ...state,
                defaultParams: action.defaultParams
            };
        case actionTypes.SET_DATES_PARAM_FORMAT: // set how date params are formatted: fromDate/toDate or dateFrom/dateTo
            return {
                ...state,
                datesParamFormat: action.datesParamFormat
            };
        case actionTypes.SET_INITIAL_STATE_PROPS:
            return {
                ...state,
                ...action.props
            };

        case actionTypes.UPDATE_SEARCH_STR:
            return (state => {
                let { pathsMap } = state;
                let searchStr = action.searchStr.trim();
                if (searchStr === state.searchStr) return state;
                let newPathsMap = search({pathsMap, searchStr, state});
                return {
                    ...state,
                    searchStr: searchStr,
                    pathsMap: newPathsMap
                }
            })(state)

        case actionTypes.CREATE_PATH:
            return (state => {
                let parentPath = state.pathsMap[action.data.parentId];
                let path = action.data;
                let otherProps = { count: parentPath.count ? parentPath.count + 1 : 1 };
                let pathForModification = null;
                if (path.type === 'path') {
                    otherProps.eventPaths = [...parentPath.eventPaths, action.id]
                } else if (path.type === 'event') { // increment count and eventCount as well
                    otherProps.events = [...parentPath.events, action.id]
                    otherProps.count = parentPath.count ? parentPath.count + 1 : 1;
                    otherProps.eventCount = parentPath.eventCount ? parentPath.eventCount + 1 : 1;
                    pathForModification = {...parentPath};
                }
                let pathsMap = {
                    ...state.pathsMap,
                    [action.id]: path,
                    [path.parentId]: {
                        ...parentPath,
                        ...otherProps,
                        isExpanded: true,
                    }
                }
                if (pathForModification && pathForModification.parentId) {
                    pathsMap = modifyParentPathsCountBy(pathsMap, pathsMap[pathForModification.parentId], 1);
                }
                return {
                    ...state,
                    pathsMap
                }
            })(state);

        case actionTypes.FINALIZE_PATH:
            return (state => {
                let parentPath = state.pathsMap[action.data.parentId];
                let path = state.pathsMap[DUMMY_ID];
                let prefix = 'p', targetKey = 'eventPaths';
                if (path.type === 'event') {
                    prefix = 'e';
                    targetKey = 'events';
                };
                let pathsMap = {...state.pathsMap};
                pathsMap[action.data.id] = {
                    ...pathsMap[DUMMY_ID],
                    ...action.data,
                    url: `${state.baseUrl}/${parentPath.sportCode.toLowerCase()}/${prefix}${action.data.id}`
                }
                let targetIndex = parentPath[targetKey].findIndex(id => id === DUMMY_ID);
                pathsMap[parentPath.id] = {
                    ...parentPath,
                    [targetKey]: [
                        ...parentPath[targetKey].slice(0, targetIndex),
                        ...parentPath[targetKey].slice(targetIndex + 1),
                        action.data.id
                    ]
                }
                delete pathsMap[DUMMY_ID];
                return { ...state, activePathId: action.data.id, pathsMap }
            })(state)

        case actionTypes.DELETE_PATH:
            return deletePath({state, id:action.id});

        case actionTypes.DELETE_PATHS:
            return (state => {
                let newState = {...state};
                let pathSelectionsMap = {...state.pathSelectionsMap};
                let pathSelections = [...state.pathSelections];
                for (let id of action.ids) {
                    newState = deletePath({state: newState, id})
                    delete pathSelectionsMap[id];
                    pathSelections = pathSelections.filter(pathId => pathId !== id);
                }
                return {...newState, pathSelectionsMap, pathSelections}
            })(state)

        case actionTypes.SET_NEW_PATHS_ORDER:
            return {...state, pathsOrder: {...state.pathsOrder, ...action.pathsOrder}}

        case actionTypes.SAVE_NEW_PATHS_ORDER:
            return {...state, isSavingPathsOrder: true, isSavingPathsOrderFailed: false}
        case actionTypes.SAVE_NEW_PATHS_ORDER_SUCCEEDED:
            return {...state, isSavingPathsOrder: false, pathsOrder: {}}
        case actionTypes.SAVE_NEW_PATHS_ORDER:
            return {...state, isSavingPathsOrder: false, isSavingPathsOrderFailed: true}
        case actionTypes.SET_AS_FIRST_LOAD:
            return {...state, isFirstLoad: action.isFirstLoad }
        case actionTypes.ADD_PATH_TO_SELECTIONS:
            return {
                ...state,
                pathSelectionsMap: {
                    ...state.pathSelectionsMap,
                    [action.path.id]: action.path
                },
                pathSelections: state.pathSelectionsMap[action.path.id]
                    ? state.pathSelections
                    : [...state.pathSelections, action.path.id]
            }
        case actionTypes.REMOVE_PATH_FROM_SELECTIONS:
            return (state => {
                let newPathSelectionsMap = {...state.pathSelectionsMap};
                let pathSelections = state.pathSelections.filter(pathId => pathId !== action.path.id);
                delete newPathSelectionsMap[action.path.id];
                return {...state, pathSelectionsMap: newPathSelectionsMap, pathSelections}
            })(state)
        case eventCreatorConstants.TOGGLE_BULK_UPDATE:
            return {
                ...state,
                pathSelectionsMap: action.isBulkUpdateActive ? state.pathSelectionsMap : {},
                pathSelections: action.isBulkUpdateActive ? state.pathSelections : [],
                config: {...state.config, displayCheckbox: action.isBulkUpdateActive}
            }
        case actionTypes.REMOVE_IDS_FROM_SELECTIONS:
            return (state => {
                let newPathSelectionsMap = {...state.pathSelectionsMap};
                let pathSelections = state.pathSelections.filter(pathId => !action.ids.includes(pathId));
                for (let id of action.ids) {
                    delete newPathSelectionsMap[id];
                }
                return {...state, pathSelectionsMap: newPathSelectionsMap, pathSelections}
            })(state)
        case actionTypes.RESET:
            return {  ...initialState };
        default:
            return { ...state };
    }
}

export default sportsTree;