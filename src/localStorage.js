export const loadState = (appName) => {
  try {
    const serializedState = localStorage.getItem(appName);
    if (serializedState === null) return undefined;
    return JSON.parse(serializedState);
  } catch (err) {
    return undefined;
  }
}

export const saveState = (appName, state) => {
  try {
    localStorage.setItem(appName, JSON.stringify(state));
  } catch (err) {
  }
}