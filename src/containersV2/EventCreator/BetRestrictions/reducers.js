import actionTypes from './constants'
import isEqual from 'lodash.isequal'
import { makeIterable } from 'phxUtils'
import { processMatrix, getMultipleFlag, getSingleFlag, getBetTypeKey, generateCriteriaKey } from './helpers'

const steps = ['MATRIX', 'NEW_MATRIX', 'EVENT_PATH', 'EVENT_TYPE', 'PERIOD', 'MARKET_TYPE']
const stepsMap = {
    [steps[0]]: { key: steps[0], enabled: true, isFirstStep: true },
    [steps[1]]: { key: steps[1], enabled: false },
    [steps[2]]: { key: steps[2], enabled: false },
    [steps[3]]: { key: steps[3], enabled: true },
    [steps[4]]: { key: steps[4], enabled: false },
    [steps[5]]: { key: steps[5], enabled: true, isLastStep: true },
}
const initialStepIndex = 0
const defaultSportCode = 'BASK' // default sport in sports list dropdown

const defaultNewBetRestrictionData = {
    // required dynamic fields
    eventPathId: 0,
    eventPath: null,
    eventPathDescription: null,
    eventTypeId: 0,
    periodId: null,
    marketTypeGroupId: null,
    marketTypeGroupDesc: null,
    marketTypeId: 0,

    // require fields but fixed
    tagId: 0,
    phraseId: 0,
    bookTypeId: 0,
}

const initialState = {
    betTypes: [],
    unusedBetTypes: [],
    matrixDataCache: {}, // use to store matrix data for each bet restriction type
    activeBetType: {},
    activeBetTypeKey: '',
    activeCell: {},
    history: [],
    activeHistory: {},
    isEvaluationOrderVisible: false,

    pathIdForEvent: null,

    sportPeriods: [],
    sportPeriodsMap: {},
    marketTypeGroups: [],
    stepsMap: { ...stepsMap },
    steps: [...steps],
    stepIndex: initialStepIndex,
    step: stepsMap[steps[initialStepIndex]],
    newBetRestrictionData: {
        sportId: null,
        isNewMatrix: false,
        newMatrixBetType: {},
        selectedType: {},

        ...defaultNewBetRestrictionData,
    },
    lastSelectionValues: {
        min: 2,
        max: 2,
    },

    activeSportCode: defaultSportCode,

    isFetchingBetRestrictions: false,
    isFetchingBetRestrictionsFailed: false,

    isFetchingUnusedBetRestrictions: false,
    isFetchingUnusedBetRestrictionsFailed: false,

    isUpdatingBetRestrictions: false,
    isUpdatingBetRestrictionsFailed: false,

    isAddingNewBetRestriction: false,
    isAddingNewBetRestrictionFailed: false,

    isDeletingBetRestrictions: false,
    isDeletingBetRestrictionsFailed: false,

    isFetchingMatrixData: false,
    isFetchingMatrixDataFailed: false,

    isFetchingSportPeriods: false,
    isFetchingSportPeriodsFailed: false,

    isFetchingMarketTypeGroups: false,
    isFetchingMarketTypeGroupsFailed: false,

    isFetchingBetRestrictionsHistory: false,
    isFetchingBetRestrictionsHistoryFailed: false,

    isDeletingBetRestrictionsHistory: false,
    isDeletingBetRestrictionsHistoryFailed: false,

    isUpdatingBetRestrictionsHistory: false,
    isUpdatingBetRestrictionsHistoryFailed: false,

    isRestoringBetRestrictionsHistory: false,
    isRestoringBetRestrictionsHistoryFailed: false,
}

const betRestrictions = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.FETCH_BET_RESTRICTION_KEYS:
            return {
                ...state,
                isFetchingBetRestrictions: true,
                isFetchingBetRestrictionsFailed: false,
            }
        case actionTypes.FETCH_BET_RESTRICTION_KEYS_SUCCEEDED:
            return {
                ...state,
                isFetchingBetRestrictions: false,
                betTypes: action.response,
            }
        case actionTypes.FETCH_BET_RESTRICTION_KEYS_FAILED:
            return {
                ...state,
                isFetchingBetRestrictions: false,
                isFetchingBetRestrictionsFailed: true,
            }

        case actionTypes.FETCH_UNUSED_BET_RESTRICTION_KEYS:
            return {
                ...state,
                isFetchingUnusedBetRestrictions: true,
                isFetchingUnusedBetRestrictionsFailed: false,
            }
        case actionTypes.FETCH_UNUSED_BET_RESTRICTION_KEYS_SUCCEEDED:
            return {
                ...state,
                isFetchingUnusedBetRestrictions: false,
                unusedBetTypes: action.response,
            }
        case actionTypes.FETCH_UNUSED_BET_RESTRICTION_KEYS_FAILED:
            return {
                ...state,
                isFetchingUnusedBetRestrictions: false,
                isFetchingUnusedBetRestrictionsFailed: true,
            }

        case actionTypes.FETCH_BET_RESTRICTIONS_HISTORY:
            return {
                ...state,
                isFetchingBetRestrictionsHistory: true,
                isFetchingBetRestrictionsHistoryFailed: false,
            }
        case actionTypes.FETCH_BET_RESTRICTIONS_HISTORY_SUCCEEDED:
            return {
                ...state,
                isFetchingBetRestrictionsHistory: false,
                history: action.response,
            }
        case actionTypes.FETCH_BET_RESTRICTIONS_HISTORY_FAILED:
            return {
                ...state,
                isFetchingBetRestrictionsHistory: false,
                isFetchingBetRestrictionsHistoryFailed: true,
            }

        case actionTypes.DELETE_BET_RESTRICTIONS_HISTORY:
            return {
                ...state,
                isDeletingBetRestrictionsHistory: true,
                isDeletingBetRestrictionsHistoryFailed: false,
            }
        case actionTypes.DELETE_BET_RESTRICTIONS_HISTORY_SUCCEEDED:
            return (state => {
                let history = state.history
                let activeHistory = state.activeHistory
                let index = state.history.findIndex(history => history.id === action.id)
                if (index >= 0) {
                    history = [...history.slice(0, index), ...history.slice(index + 1)]
                }
                if (activeHistory.id === action.id) {
                    activeHistory = {}
                }
                return {
                    ...state,
                    isDeletingBetRestrictionsHistory: false,
                    history,
                    activeHistory,
                }
            })(state)

        case actionTypes.DELETE_BET_RESTRICTIONS_HISTORY_FAILED:
            return {
                ...state,
                isDeletingBetRestrictionsHistory: false,
                isDeletingBetRestrictionsHistoryFailed: true,
            }

        case actionTypes.UPDATE_BET_RESTRICTIONS_HISTORY:
            return {
                ...state,
                isUpdatingBetRestrictionsHistory: true,
                isUpdatingBetRestrictionsHistoryFailed: false,
            }
        case actionTypes.UPDATE_BET_RESTRICTIONS_HISTORY_SUCCEEDED:
            return (state => {
                let history = state.history
                let activeHistory = state.activeHistory
                let index = state.history.findIndex(history => history.id === action.data.id)
                if (index >= 0) {
                    let target = { ...state.history[index], description: action.data.description }
                    activeHistory = { ...target }
                    history = [...history.slice(0, index), target, ...history.slice(index + 1)]
                }
                return {
                    ...state,
                    isUpdatingBetRestrictionsHistory: false,
                    history,
                    activeHistory,
                }
            })(state)

        case actionTypes.UPDATE_BET_RESTRICTIONS_HISTORY_FAILED:
            return {
                ...state,
                isUpdatingBetRestrictionsHistory: false,
                isUpdatingBetRestrictionsHistoryFailed: true,
            }

        case actionTypes.RESTORE_BET_RESTRICTIONS_HISTORY:
            return {
                ...state,
                isRestoringBetRestrictionsHistory: true,
                isRestoringBetRestrictionsHistoryFailed: false,
            }
        case actionTypes.RESTORE_BET_RESTRICTIONS_HISTORY_SUCCEEDED:
            return (state => {
                let activeBetTypeKey = state.activeBetTypeKey
                let matrixDataCache = { ...state.matrixDataCache }
                matrixDataCache[activeBetTypeKey] = undefined
                return {
                    ...state,
                    isRestoringBetRestrictionsHistory: false,
                    matrixDataCache,
                }
            })(state)

        case actionTypes.RESTORE_BET_RESTRICTIONS_HISTORY_FAILED:
            return {
                ...state,
                isRestoringBetRestrictionsHistory: false,
                isRestoringBetRestrictionsHistoryFailed: true,
            }

        case actionTypes.UPDATE_BET_RESTRICTIONS:
            return {
                ...state,
                isUpdatingBetRestrictions: true,
                isUpdatingBetRestrictionsFailed: false,
            }
        case actionTypes.UPDATE_BET_RESTRICTIONS_SUCCEEDED:
            return (state => {
                let activeBetTypeKey = state.activeBetTypeKey
                let cache = state.matrixDataCache[activeBetTypeKey]
                return {
                    ...state,
                    matrixDataCache: {
                        ...state.matrixDataCache,
                        [activeBetTypeKey]: {
                            ...state.matrixDataCache[activeBetTypeKey],
                            updatedCellsArray: [],
                            newRestrictionsMap: {},
                            orignalMatrixMap: { ...cache.matrixMap },
                            originalMatrix: {
                                matrixData: [...cache.matrixData],
                                matrixArray: [...cache.matrixArray],
                                matrixMap: { ...cache.matrixMap },
                                matrixHeaders: [...cache.matrixHeaders],
                            },
                        },
                    },
                    isUpdatingBetRestrictions: false,
                }
            })(state)
        case actionTypes.UNDO_CHANGES:
            if (true) {
                let activeBetTypeKey = action.activeBetTypeKey
                let cache = state.matrixDataCache[activeBetTypeKey]
                const originalMatrix = cache.originalMatrix
                if (originalMatrix) {
                    return {
                        ...state,
                        matrixDataCache: {
                            ...state.matrixDataCache,
                            [activeBetTypeKey]: {
                                ...cache,
                                updatedCellsArray: [],
                                newRestrictionsMap: {},
                                multipleRulesMap: {},
                                deletedRestrictionsMap: {},
                                newlyAddedRestrictionKey: '',
                                cellData: {},
                                matrixMap: { ...originalMatrix.matrixMap },
                                matrixHeaders: [...originalMatrix.matrixHeaders],
                                matrixArray: [...originalMatrix.matrixArray],
                                matrixData: [...originalMatrix.matrixData],
                            },
                        },
                        activeCell: {},
                        isUpdatingBetRestrictions: false,
                    }
                } else {
                    // it means it's a newly created matrix
                    let matrixDataCache = { ...state.matrixDataCache }
                    matrixDataCache[activeBetTypeKey] = {
                        ...cache,
                        updatedCellsArray: [],
                        newRestrictionsMap: {},
                        multipleRulesMap: {},
                        deletedRestrictionsMap: {},
                        newlyAddedRestrictionKey: '',
                        cellData: {},
                        matrixMap: {},
                        matrixHeaders: [],
                        matrixArray: [],
                        matrixData: [],
                    }
                    return {
                        ...state,
                        matrixDataCache,
                        activeCell: {},
                        isUpdatingBetRestrictions: false,
                    }
                }
            }
            break;

        case actionTypes.UPDATE_BET_RESTRICTIONS_FAILED:
            return {
                ...state,
                isUpdatingBetRestrictions: false,
                isUpdatingBetRestrictionsFailed: true,
            }

        case actionTypes.UPDATE_BET_RESTRICTION_KEYS:
            return { ...state, betTypes: action.betTypes }

        case actionTypes.ADD_NEW_BET_RESTRICTION:
            return (state => {
                return (state => {
                    let activeBetTypeKey = getBetTypeKey(action.betType)
                    let matrixDataCache = { ...state.matrixDataCache }
                    matrixDataCache[activeBetTypeKey] = {
                        ...matrixDataCache[activeBetTypeKey],
                        newlyAddedRestrictionKey: '',
                    }
                    return {
                        ...state,
                        isAddingNewBetRestriction: true,
                        isAddingNewBetRestrictionFailed: false,
                        activeBetType: action.betType,
                        activeBetTypeKey,
                        matrixDataCache,
                    }
                })(state)
            })(state)

        case actionTypes.ADD_NEW_BET_RESTRICTION_FAILED:
            return {
                ...state,
                isAddingNewBetRestriction: false,
                isAddingNewBetRestrictionFailed: true,
            }

        case actionTypes.CREATE_NEW_BET_RESTRICTIONS_MATRIX:
            return {
                ...state,
                isAddingNewBetRestriction: true,
                isAddingNewBetRestrictionFailed: false,
            }
        case actionTypes.CREATE_NEW_BET_RESTRICTIONS_MATRIX_FAILES:
            return {
                ...state,
                isAddingNewBetRestriction: false,
                isAddingNewBetRestrictionFailed: true,
            }

        case actionTypes.DELETE_BET_RESTRICTIONS:
            return {
                ...state,
                isDeletingBetRestrictions: true,
                isDeletingBetRestrictionsFailed: false,
            }

        case actionTypes.DELETE_BET_RESTRICTIONS_SUCCEEDED:
            return (state => {
                let activeBetTypeKey = state.activeBetTypeKey
                let cache = state.matrixDataCache[activeBetTypeKey]
                return {
                    ...state,
                    matrixDataCache: {
                        ...state.matrixDataCache,
                        [activeBetTypeKey]: {
                            ...cache,
                            deletedRestrictionsMap: {},
                            originalMatrix: {
                                matrixData: [...cache.matrixData],
                                matrixArray: [...cache.matrixArray],
                                matrixMap: { ...cache.matrixMap },
                                matrixHeaders: [...cache.matrixHeaders],
                            },
                        },
                    },
                    isDeletingBetRestrictions: false,
                    isDeletingBetRestrictionsFailed: false,
                }
            })(state)

        case actionTypes.DELETE_BET_RESTRICTIONS_FAILED:
            return {
                ...state,
                isDeletingBetRestrictions: false,
                isDeletingBetRestrictionsFailed: true,
            }

        case actionTypes.FETCH_SPORT_PERIODS:
            return {
                ...state,
                sportPeriods: [],
                sportPeriodsMap: {},
                isFetchingSportPeriods: true,
                isFetchingSportPeriodsFailed: false,
            }
        case actionTypes.FETCH_SPORT_PERIODS_SUCCEEDED:
            return {
                ...state,
                isFetchingSportPeriods: false,
                sportPeriods: action.response,
                sportPeriodsMap: action.response.reduce((accu, period) => {
                    accu[period.id] = period
                    return accu
                }, {}),
            }
        case actionTypes.FETCH_SPORT_PERIODS_FAILED:
            return {
                ...state,
                isFetchingSportPeriods: false,
                isFetchingSportPeriodsFailed: true,
            }

        case actionTypes.FETCH_MARKET_TYPE_GROUPS:
            return {
                ...state,
                marketTypeGroups: [],
                isFetchingMarketTypeGroups: true,
                isFetchingMarketTypeGroupsFailed: false,
            }
        case actionTypes.FETCH_MARKET_TYPE_GROUPS_SUCCEEDED:
            return {
                ...state,
                isFetchingMarketTypeGroups: false,
                marketTypeGroups: action.response,
            }
        case actionTypes.FETCH_MARKET_TYPE_GROUPS_FAILED:
            return {
                ...state,
                isFetchingMarketTypeGroups: false,
                isFetchingMarketTypeGroupsFailed: true,
            }

        case actionTypes.FETCH_MATRIX_DATA:
            return {
                ...state,
                matrixData: null,
                activeCell: {},
                activeBetType: action.activeBetType,
                activeBetTypeKey: getBetTypeKey(action.activeBetType),
                isFetchingMatrixData: true,
                isFetchingMatrixDataFailed: false,
            }
        case actionTypes.FETCH_MATRIX_DATA_SUCCEEDED:
            return (state => {
                let activeBetTypeKey = state.activeBetTypeKey
                let matrixDataCache = { ...state.matrixDataCache }
                let { matrixData, matrixArray, matrixMap, matrixHeaders, multipleRulesMap } = processMatrix({
                    state,
                    response: action.response,
                })
                matrixDataCache[activeBetTypeKey] = {
                    matrixData,
                    matrixArray,
                    matrixMap,
                    matrixHeaders,
                    multipleRulesMap,
                    orignalMatrixMap: { ...matrixMap },
                    originalMatrix: {
                        matrixData: [...matrixData],
                        matrixArray: [...matrixArray],
                        matrixMap: { ...matrixMap },
                        matrixHeaders: [...matrixHeaders],
                    },
                    updatedCellsArray: [],
                    deletedRestrictionsMap: {},
                    cellData: {},
                    newRestrictionsMap: {},
                    newlyAddedRestrictionKey: '',
                }
                return {
                    ...state,
                    isFetchingMatrixData: false,
                    isAddingNewBetRestriction: false,
                    matrixDataCache,
                }
            })(state)

        case actionTypes.CREATE_NEW_BET_RESTRICTIONS_MATRIX_SUCCEEDED:
            return (state => {
                let activeBetType = action.betType
                let activeBetTypeKey = getBetTypeKey(activeBetType)
                let matrixDataCache = { ...state.matrixDataCache }
                let { matrixData, matrixArray, matrixMap, matrixHeaders, multipleRulesMap } = processMatrix({
                    state,
                    response: action.response,
                })
                let newRestrictionsMap = action.restrictions.reduce((accu, restriction) => {
                    let restrictionKey = generateCriteriaKey(restriction)
                    accu[restrictionKey] = { ...restriction }
                    return accu
                }, {})
                matrixDataCache[activeBetTypeKey] = {
                    matrixData,
                    matrixArray,
                    matrixMap,
                    matrixHeaders,
                    multipleRulesMap,
                    orignalMatrixMap: { ...matrixMap },
                    updatedCellsArray: [],
                    deletedRestrictionsMap: {},
                    cellData: {},
                    newRestrictionsMap,
                }
                return {
                    ...state,
                    isFetchingMatrixData: false,
                    isAddingNewBetRestriction: false,
                    matrixDataCache,
                    activeBetType,
                    activeBetTypeKey,
                }
            })(state)

        case actionTypes.FETCH_MATRIX_DATA_FAILED:
            return {
                ...state,
                isFetchingMatrixData: false,
                isFetchingMatrixDataFailed: true,
            }

        case actionTypes.ADD_NEW_BET_RESTRICTION_SUCCEEDED:
            return (state => {
                let activeBetTypeKey = state.activeBetTypeKey
                let matrixDataCache = { ...state.matrixDataCache }
                let cache = matrixDataCache[activeBetTypeKey]
                let { matrixData, matrixArray, matrixMap, matrixHeaders, multipleRulesMap } = processMatrix({
                    state,
                    response: action.response,
                })

                let orignalMatrixMap = { ...matrixMap, ...cache.orignalMatrixMap }
                let newRestrictionsMap = { ...cache.newRestrictionsMap }
                let deletedRestrictionsMap = { ...cache.deletedRestrictionsMap }
                action.restrictions.forEach(restriction => {
                    let restrictionKey = generateCriteriaKey(restriction)
                    if (!newRestrictionsMap[restrictionKey]) {
                        newRestrictionsMap[restrictionKey] = { ...restriction }
                    }
                    if (deletedRestrictionsMap[restrictionKey]) {
                        delete deletedRestrictionsMap[restrictionKey]
                    }
                })
                matrixDataCache[activeBetTypeKey] = {
                    ...matrixDataCache[activeBetTypeKey],
                    matrixData,
                    matrixArray,
                    matrixMap,
                    matrixHeaders,
                    multipleRulesMap,
                    orignalMatrixMap,
                    newRestrictionsMap,
                    deletedRestrictionsMap,
                    newlyAddedRestrictionKey: action.newlyAddedRestrictionKey,
                }
                return {
                    ...state,
                    isFetchingMatrixData: false,
                    isAddingNewBetRestriction: false,
                    matrixDataCache,
                }
            })(state)

        case actionTypes.DELETE_BET_RESTRICTIONS_TEMPORARILY:
            return (state => {
                let activeBetTypeKey = state.activeBetTypeKey
                let matrixDataCache = { ...state.matrixDataCache }
                let cache = matrixDataCache[activeBetTypeKey]
                let newRestrictionsMap = { ...cache.newRestrictionsMap }
                let activeCell = state.activeCell
                let { matrixData, matrixArray, matrixMap, matrixHeaders, multipleRulesMap } = processMatrix({
                    state,
                    response: action.response,
                })
                // let orignalMatrixMap = {...matrixMap};
                let deletedRestrictionsMap = { ...action.deletedRestrictionsMap }

                // convert updatedCellsArray to object first for easier mapping
                let updatedCellsMap = cache.updatedCellsArray.reduce((accu, key) => {
                    accu[key] = { persist: true, key }
                    return accu
                }, {})
                let newlyAddedRestrictionsAndDeleted = []

                // remove restriction reference from updatedCellsArray and newRestrictionsMap
                ;[...makeIterable(deletedRestrictionsMap, true)].map(restriction => {
                    cache.updatedCellsArray.forEach(key => {
                        if (key.indexOf(restriction.key) >= 0) {
                            updatedCellsMap[key].persist = false
                        }
                    })

                    if (newRestrictionsMap[restriction.key]) {
                        delete newRestrictionsMap[restriction.key]
                        newlyAddedRestrictionsAndDeleted.push(restriction.key)
                    }
                    if (activeCell.key) {
                        if (activeCell.key === restriction.key || activeCell.key.indexOf(restriction.key) >= 0) {
                            activeCell = {}
                        }
                    }
                })
                // create new updatedCellsArray using updatedCellsMap
                let updatedCellsArray = [...makeIterable(updatedCellsMap)]
                    .filter(cell => cell.persist)
                    .map(cell => cell.key)

                // remove from deletedRestrictionsMap if the restrictions are temporarily added and then deleted
                newlyAddedRestrictionsAndDeleted.forEach(key => {
                    if (deletedRestrictionsMap[key]) {
                        delete deletedRestrictionsMap[key]
                    }
                })

                matrixDataCache[activeBetTypeKey] = {
                    ...matrixDataCache[activeBetTypeKey],
                    matrixData,
                    matrixArray,
                    matrixMap,
                    matrixHeaders,
                    multipleRulesMap,
                    // orignalMatrixMap,
                    deletedRestrictionsMap,
                    updatedCellsArray,
                    newRestrictionsMap,
                }
                return {
                    ...state,
                    isFetchingMatrixData: false,
                    isAddingNewBetRestriction: false,
                    matrixDataCache,
                    activeCell,
                }
            })(state)

        case actionTypes.UPDATE_CELL_DATA:
            return (state => {
                let activeBetTypeKey = state.activeBetTypeKey
                let cache = state.matrixDataCache[activeBetTypeKey]
                let cellDataFromCache = cache.cellData
                let multipleRulesMapFromCache = cache.multipleRulesMap
                let orignalMatrixMapFromCache = cache.orignalMatrixMap
                let updatedCellsArrayFromCache = cache.updatedCellsArray
                let matrixMapFromCache = cache.matrixMap

                let cellData = { ...cellDataFromCache, ...action.data }
                let activeBetType = state.activeBetType
                let activeCellKey = state.activeCell.key
                let isSelectOutcome = activeBetType.betRestrictionTypeId === 1
                let multipleRulesMap = { ...multipleRulesMapFromCache }
                let originalCellData = orignalMatrixMapFromCache[activeCellKey].cell
                let updatedCellsArray = [...updatedCellsArrayFromCache]
                let flag = isSelectOutcome ? getSingleFlag(cellData.rules) : getMultipleFlag(cellData.rules)
                const hasRules = cellData.rules && cellData.rules.length
                if (flag.key === 'MULTIPLE') {
                    multipleRulesMap = {
                        ...multipleRulesMap,
                        [activeCellKey]: [...cellData.rules],
                    }
                }
                if (isEqual(cellData, originalCellData)) {
                    let index = updatedCellsArray.findIndex(key => key === activeCellKey)
                    if (index >= 0) {
                        updatedCellsArray = [
                            ...updatedCellsArray.slice(0, index),
                            ...updatedCellsArray.slice(index + 1),
                        ]
                    }
                } else {
                    if (!updatedCellsArray.includes(activeCellKey)) {
                        updatedCellsArray = [...updatedCellsArray, activeCellKey]
                    }
                }

                return {
                    ...state,
                    matrixDataCache: {
                        ...state.matrixDataCache,
                        [activeBetTypeKey]: {
                            ...state.matrixDataCache[activeBetTypeKey],
                            matrixMap: {
                                ...matrixMapFromCache,
                                [activeCellKey]: {
                                    ...matrixMapFromCache[activeCellKey],
                                    cell: cellData,
                                    desc: flag.desc,
                                    className: flag.className,
                                },
                            },
                            multipleRulesMap,
                            updatedCellsArray,
                            cellData,
                        },
                    },
                    lastSelectionValues: {
                        min: hasRules ? cellData.rules[0].minSelectionCount : state.lastSelectionValues.min,
                        max: hasRules ? cellData.rules[0].maxSelectionCount : state.lastSelectionValues.max,
                    },
                }
            })(state)

        case actionTypes.SET_ACTIVE_CELL:
            if (true) {
                const cellData = action.activeCell.cell
                const hasRules = cellData.rules && cellData.rules.length
                return {
                    ...state,
                    activeCell: action.activeCell,
                    matrixDataCache: {
                        ...state.matrixDataCache,
                        [state.activeBetTypeKey]: {
                            ...state.matrixDataCache[state.activeBetTypeKey],
                            cellData,
                        },
                    },
                    lastSelectionValues: {
                        min: hasRules ? cellData.rules[0].minSelectionCount : 2,
                        max: hasRules ? cellData.rules[0].maxSelectionCount : 2,
                    },
                }
            }
        break;
        case actionTypes.SET_ACTIVE_BET_TYPE:
            return (state => {
                let activeBetTypeKey = getBetTypeKey(action.activeBetType)
                return {
                    ...state,
                    activeCell: {},
                    activeBetType: { ...state.activeBetType, ...action.activeBetType },
                    matrixDataCache: {
                        ...state.matrixDataCache,
                        [activeBetTypeKey]: {
                            ...state.matrixDataCache[activeBetTypeKey],
                            newlyAddedRestrictionKey: '',
                        },
                    },
                    activeBetTypeKey,
                }
            })(state)

        case actionTypes.SET_ACTIVE_HISTORY:
            return { ...state, activeHistory: action.activeHistory }

        case actionTypes.SET_PATH_ID_FOR_EVENT:
            return { ...state, pathIdForEvent: action.pathIdForEvent }

        case actionTypes.SET_EVALUATION_ORDER_VISIBILITY:
            return { ...state, isEvaluationOrderVisible: action.isEvaluationOrderVisible }

        case actionTypes.NEXT_STEP:
            return (state => {
                let stepIndex = state.stepIndex + 1
                let step
                for (let i = stepIndex; i < state.steps.length; i++) {
                    let stepKey = state.steps[i]
                    if (state.stepsMap[stepKey].enabled) {
                        stepIndex = i
                        step = { ...state.stepsMap[stepKey] }
                        break
                    }
                }
                return { ...state, stepIndex, step }
            })(state)

        case actionTypes.PREVIOUS_STEP:
            return (state => {
                let stepIndex = state.stepIndex - 1
                let step
                for (let i = stepIndex; i >= 0; i--) {
                    let stepKey = state.steps[i]
                    if (state.stepsMap[stepKey].enabled) {
                        stepIndex = i
                        step = { ...state.stepsMap[stepKey] }
                        break
                    }
                }
                return { ...state, stepIndex, step }
            })(state)

        case actionTypes.UPDATE_STEP:
            return {
                ...state,
                stepsMap: {
                    ...state.stepsMap,
                    [action.key]: { ...state.stepsMap[action.key], ...action.data },
                },
            }

        case actionTypes.RESET_STEPS:
            return {
                ...state,
                stepsMap: { ...stepsMap },
                steps: [...steps],
                stepIndex: initialStepIndex,
                step: stepsMap[steps[initialStepIndex]],

                newBetRestrictionData: {
                    ...state.newBetRestrictionData,
                    ...defaultNewBetRestrictionData,
                    selectedType: {},
                    newMatrixBetType: {},
                },
            }

        case actionTypes.RESET_HISTORY_DATA:
            return { ...state, history: [], activeHistory: {} }

        case actionTypes.UPDATE_NEW_MATRIX_DATA:
            return { ...state, newBetRestrictionData: { ...state.newBetRestrictionData, ...action.data } }

        case actionTypes.RESET_CURRENT_DATA:
            return {
                ...initialState,
            }

        default:
            return { ...state }
    }
}

export default betRestrictions
