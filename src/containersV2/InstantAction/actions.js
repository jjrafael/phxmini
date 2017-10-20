import constans from "./constants";

export function fetchInitialData(type) {
  return {
    type: constans[`FETCH_INITIAL_${type.toUpperCase()}_DATA`]
  };
}

export function fetchSubsequentData(type, lastKey) {
  return {
    type: constans[`FETCH_SUBSEQUENT_${type.toUpperCase()}_DATA`],
    lastKey
  };
}

export function changeBetType(value) {
  return {
    type: constans.CHANGE_BET_TYPE,
    value
  };
}

export function changeMarketsFilter(value) {
  return {
    type: constans.CHANGE_MARKETS_FILTER,
    value
  };
}

export function toggleExpand(name) {
  return {
    type: constans.TOGGLE_EXPAND,
    name
  }
}

export function toggleActive(name) {
  return {
    type: constans.TOGGLE_ACTIVE,
    name
  }
}

export function toggleMarketsType(name) {
  return {
    type: constans.TOGGLE_MARKETS_TYPE,
    name
  }
}

export function changeTotalStakeType(value) {
  return {
    type: constans.CHANGE_TOTAL_STAKE_TYPE,
    value
  };
}

export function changeTotalStakeValue(value) {
  return {
    type: constans.CHANGE_TOTAL_STAKE_VALUE,
    value
  };
}

export function changeRiskAmountType(value) {
  return {
    type: constans.CHANGE_RISK_AMOUNT_TYPE,
    value
  };
}

export function changeRiskAmountValue(value) {
  return {
    type: constans.CHANGE_RISK_AMOUNT_VALUE,
    value
  };
}

export function changeSportsType(value) {
  return {
    type: constans.CHANGE_SPORTS_TYPE,
    value
  };
}

export function addSport(name) {
  return {
    type: constans.ADD_SPORT,
    name
  };
}

export function removeSport(name) {
  return {
    type: constans.REMOVE_SPORT,
    name
  };
}

export function changeMaxRows(value) {
  return {
    type: constans.CHANGE_MAX_ROWS,
    value
  };
}

export function changeLowerLimit(value) {
  return {
    type: constans.CHANGE_LOWER_LIMIT,
    value
  };
}

export function changeUpperLimit(value) {
  return {
    type: constans.CHANGE_UPPER_LIMIT,
    value
  };
}

export function changeFontColor(value) {
  return {
    type: constans.CHANGE_FONT_COLOR,
    value
  };
}

export function changeBackgroundColor(value) {
  return {
    type: constans.CHANGE_BACKGROUND_COLOR,
    value
  };
}

export function addFormatterItem(item) {
  return {
    type: constans.ADD_FORMATTER_ITEM,
    item
  };
}

export function removeFormatterItem(id) {
  return {
    type: constans.REMOVE_FORMATTER_ITEM,
    id
  };
}

export function changeActiveTabIndex(index) {
  return {
    type: constans.CHANGE_ACTIVE_TAB_INDEX,
    index
  };
}

export function lockTable(table) {
  return {
    type: constans.LOCK_TABLE,
    table
  };
}

export function unlockTable(table) {
  return {
    type: constans.UNLOCK_TABLE,
    table
  };
}

export function showPreferencesModal() {
  return {
    type: constans.SHOW_PREFERENCES_MODAL
  };
}

export function hidePreferencesModal() {
  return {
    type: constans.HIDE_PREFERENCES_MODAL
  };
}

export function setHeaderPreference(table, header, value) {
  return {
    type: constans.SET_HEADER_PREFERENCE,
    table,
    header,
    value
  };
}

export function saveConstantsToStore(sports, origins, channels, brands) {
  return {
    type: constans.SAVE_CONSTANTS_TO_STORE,
    sports,
    origins,
    channels,
    brands
  };
}

export function changeBrandValue(value) {
  return {
    type: constans.CHANGE_BRAND_VALUE,
    value
  };
}

export function rehydrateState() {
  return {
    type: constans.REHYDRATE_STATE
  }
}

export function removeScrollTop() {
  return {
    type: constans.REMOVE_SCROLL_TOP
  }
}