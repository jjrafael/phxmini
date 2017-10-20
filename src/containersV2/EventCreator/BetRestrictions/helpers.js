import { RESTRICTION_FLAGS } from './constants';
import { makeIterable } from 'phxUtils';

export const getMatrixSize = (arrayLength, size) => {
    let newArrayLength = arrayLength - size;
    if (newArrayLength > 0) {
        size = getMatrixSize(newArrayLength, size + 1);
    }
    return size;
}

export const getNextAvailableCol = (matrixArray, row, col) => {
    if (matrixArray[row][col]) {
        col = getNextAvailableCol(matrixArray, row, col + 1);
    }
    return col;
}

export const processMatrix = ({state, response}) => {
    let matrixData = response;
    let activeBetType = state.activeBetType;
    let activeBetTypeKey = state.activeBetTypeKey;
    let periodsMap = state.sportPeriodsMap;
    let cache = state.matrixDataCache[activeBetTypeKey];
    // let isAddingNewBetRestriction = action.isNew;
    let dataLength = matrixData.length;
    let matrixSize = dataLength ? getMatrixSize(dataLength, 1) : 0;
    let matrixArray = [];
    let matrixMap = {};
    let multipleRulesMap = {};
    let matrixHeaders = [];
    let matrixHeaderKeys = [];
    let addedMatrixMap = {};
    let isSelectOutcome = activeBetType.betRestrictionTypeId === 1;
    if (!isSelectOutcome) { // if not Select Outcome type, matrix is multi-dimension
        let row = 0, col = 0;
        for (let i = matrixSize - 1; i >= 0; i--) {
            matrixArray[i] = [];
            for (let j = matrixSize - 1; j >= 0; j--) {
                matrixArray[i][j] = null;
            }
        }
        for (let cell of matrixData) {
            if (col >= matrixSize) {
                col = 0;
                row = row + 1;
            }
            if (row < matrixSize) {
                let cr0 = cell.criterias[0];
                let cr1 = cell.criterias[1];
                let pathDesc = cr0.eventPathDescription;
                let marketGroupDesc = cr0.marketTypeGroupDesc;
                let key1 = generateCriteriaKey(cr0);
                let key2 = generateCriteriaKey(cr1);
                let key = `${key1}-${key2}`;
                let flag = getMultipleFlag(cell.rules);
                const periodDesc = cr0.periodId ? periodsMap[cr0.periodId].fullDescription : '';

                let headerName = getHeaderName(pathDesc, marketGroupDesc, cr0.marketTypeDescription, cr0.eventTypeId, periodDesc);
                if (!matrixHeaderKeys.includes(key1)) {
                    matrixHeaderKeys.push(key1);
                    matrixHeaders.push({
                        desc: headerName,
                        descExpanded: getExpandedHeaderName(cr0.eventPath, pathDesc, marketGroupDesc, cr0.marketTypeDescription, cr0.eventTypeId, periodDesc),
                        key: key1,
                        criteria: {...cr0},
                        betType: {
                            betRestrictionType: cell.betRestrictionType,
                            betTypeGroup: cell.betTypeGroup,
                            transactionSubType: cell.transactionSubType,
                        }
                    });
                }
                if (!matrixMap[key]) {
                    matrixMap[key] = {
                        desc: flag.desc,
                        descExpanded: `${flag.desc} (${cell.level})`,
                        className: flag.className,
                        key,
                        cell,
                    };
                    if (cache && cache.matrixMap && cache.matrixMap[key]) {
                        matrixMap[key] = {...cache.matrixMap[key]} // get from cache if available
                        cell = matrixMap[key].cell;
                        flag = getMultipleFlag(cell.rules);
                    }
                    if (flag.key === 'MULTIPLE') {
                        multipleRulesMap[key] = [...cell.rules]
                    }
                    // if (isAddingNewBetRestriction) {
                    //     addedMatrixMap[key] = {...matrixMap[key]}
                    // }
                }
                
                if (matrixArray[row][col]) { // find the next available col in the row
                    col = getNextAvailableCol(matrixArray, row, col);
                } 
                matrixArray[row][col] = key;
                matrixArray[col][row] = key;
            }
            col++;
        }
    } else { // if single dimension
        for (let cell of matrixData) {
            let cr = cell.criterias[0];
            let pathDesc = cr.eventPathDescription;
            let marketGroupDesc = cr.marketTypeGroupDesc;
            let key = generateCriteriaKey(cr);
            let flag = getSingleFlag(cell.rules);
            const periodDesc = cr.periodId ? periodsMap[cr.periodId].fullDescription : '';
            let headerName = getHeaderName(pathDesc, marketGroupDesc, cr.marketTypeDescription, cr.eventTypeId, periodDesc);
            if (!matrixHeaderKeys.includes(key)) {
                matrixHeaderKeys.push(key);
                matrixHeaders.push({
                    desc: headerName,
                    descExpanded: getExpandedHeaderName(cr.eventPath, pathDesc, marketGroupDesc, cr.marketTypeDescription, cr.eventTypeId, periodDesc),
                    criteria: {...cr},
                    betType: {
                        betRestrictionType: cell.betRestrictionType,
                        betTypeGroup: cell.betTypeGroup,
                        transactionSubType: cell.transactionSubType,
                    },
                    key,
                });
            }
            if (!matrixMap[key]) {
                matrixMap[key] = {
                    desc: flag.desc,
                    descExpanded: `${flag.desc} (${cell.level})`,
                    className: flag.className,
                    key,
                    cell,
                }
                if (cache && cache.matrixMap && cache.matrixMap[key]) {
                    matrixMap[key] = {...cache.matrixMap[key]} // get from cache if available
                }
                // if (isAddingNewBetRestriction) {
                //     addedMatrixMap[key] = {...matrixMap[key]}
                // }
            }
            matrixArray.push([key])
        }
    }
    return {
        matrixData,
        matrixArray,
        matrixMap,
        matrixHeaders,
        multipleRulesMap,
    }
}

export const getHeaderName = (pathDesc, marketGroupDesc, marketTypeDesc, eventTypeId, periodDesc) => {
    let headerName = 'All';
    let descsArray = [];
    let eventTypeName = '';
    if (eventTypeId === 1) {
        eventTypeName = 'Game';
    } else if (eventTypeId === 2) {
        eventTypeName = 'Rank';
    }
    if (pathDesc) { descsArray.push(pathDesc); }
    if (eventTypeName) { descsArray.push(eventTypeName); }
    if (!marketTypeDesc && marketGroupDesc) {
        descsArray.push(marketGroupDesc);
    }
    if (marketTypeDesc) { descsArray.push(marketTypeDesc); }
    if (periodDesc) { descsArray.push(periodDesc); }
    if (descsArray.length) {
        headerName = descsArray.join(' - ');
    }
    return headerName;
}

export const getExpandedHeaderName = (eventPath, pathDesc, marketGroupDesc, marketTypeDesc, eventTypeId, periodDesc) => {
    let headerName = 'All';
    let descsArray = [];
    let eventTypeName = '';
    if (eventTypeId === 1) {
        eventTypeName = 'Game';
    } else if (eventTypeId === 2) {
        eventTypeName = 'Rank';
    }
    let pathPrefix = 'S: ';
    if (eventPath && eventPath.split('/').filter(e => !!e).length > 1) {
        // if the result length is more than 1, then the selected path must NOT be sport
        pathPrefix = 'EP: '
    }
    const eventTypePrefix = 'ET: ';
    const marketGroupPrefix = 'MTG: ';
    const marketTypePrefix = 'MTG: ';
    const periodPrefix = 'P: ';
    if (pathDesc) { descsArray.push(pathPrefix + pathDesc); }
    if (eventTypeName) { descsArray.push(eventTypePrefix + eventTypeName); }
    if (marketGroupDesc) { descsArray.push(marketGroupPrefix + marketGroupDesc); }
    if (marketTypeDesc) { descsArray.push(marketTypePrefix + marketTypeDesc); }
    if (periodDesc) { descsArray.push(periodPrefix + periodDesc); }
    if (descsArray.length) {
        headerName = descsArray.join(' - ');
    }
    return headerName;
}

export const getMultipleFlag = (rules) => {
    let flagKey = rules.length > 1 ? 'MULTIPLE' : rules[0] ? rules[0].sameFlag : 'NO_RULE';
    return RESTRICTION_FLAGS[flagKey];
}
export const getSingleFlag = (rules) => {
    let flagKey = rules[0] ? rules[0].sameFlag : 'NO_RULE';
    return RESTRICTION_FLAGS[flagKey];
}
export const generateNewMinMaxOnRules = ({isMultipleRulesChecked, key, cellData, value}) => {
    if (isMultipleRulesChecked) {
        return cellData.rules.map(rule => {
            return {...rule, [key]: value}
        });
    } else {
        return [{...cellData.rules[0], [key]: value }];
    }
}
export const generateNewFlagsOnRules = ({rules, index, value, props}) => {
    let otherProps = props.reduce((accu, prop) => {
        accu[prop] = value;
        return accu;
    }, {});
    return [
        ...rules.slice(0, index),
        {...rules[index], ...otherProps},
        ...rules.slice(index + 1),
    ]
}
export const generateCriteriaKey = (criteria) => {
    let typeDesc = criteria.marketTypeDescription ? criteria.marketTypeDescription : criteria.marketTypeGroupDesc;
    return `${criteria.eventPathDescription}-${typeDesc}-${criteria.eventPathId}-${criteria.eventTypeId}-${criteria.marketTypeGroupId}-${criteria.marketTypeId}-${criteria.periodId}`;
}
export const getBetTypeKey = (betType) => {
    return `${betType.betRestrictionTypeId}-${betType.betTypeGroupId}-${betType.transSubTypeId}`;
}
export const betRestrictionHasChanges = (matrixDataCache) => {
    let betRestrictionHasChanges = false;
    let betRestrictionsCacheArray = [...makeIterable(matrixDataCache)];
    for (let i = 0, l = betRestrictionsCacheArray.length; i < l; i++) {
        let cache = betRestrictionsCacheArray[i];
        if (Object.keys(cache.deletedRestrictionsMap).length || cache.updatedCellsArray.length) {
            betRestrictionHasChanges = true;
            break;
        }
    }
    return betRestrictionHasChanges;
}

export const getUpdatedCellsArrayAndMatrixMap = (activeBetTypeKey, matrixDataCache) => {
    if (matrixDataCache[activeBetTypeKey]) {
        let cache = matrixDataCache[activeBetTypeKey];
        return {
            matrixMap: cache.matrixMap,
            updatedCellsArray: cache.updatedCellsArray,
            deletedRestrictions: [...makeIterable(cache.deletedRestrictionsMap)]
        };
    } else {
        return {matrixMap: {}, updatedCellsArray: [], deletedRestrictions: []}
    }
}
