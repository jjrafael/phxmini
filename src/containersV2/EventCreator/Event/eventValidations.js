import moment from 'moment';

const validTime24 = (value) => value && /^([0-9]|0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/i.test(value);

const openTimeMustNotAfterStartTime = (value, allValues) => {

  // do not validate if no value yet
  if (value === undefined ||
    !validTime24(allValues.defaultStartTime) ||
    !validTime24(allValues.startTime) ||
    allValues.startDateTime === undefined) {
    return undefined;
  }

  const startTimeHHMM = allValues.startTime;
  const startTimeHHMMColonIdx = startTimeHHMM.indexOf(':');
  const startTimeHH = startTimeHHMM.slice(0, startTimeHHMMColonIdx);
  const startTimeMM = startTimeHHMM.slice(startTimeHHMMColonIdx + 1);

  const openStartTimeHHMM = allValues.defaultStartTime;
  const openStartTimeHHMMColonIdx = openStartTimeHHMM.indexOf(':');
  const openStartTimeHH = openStartTimeHHMM.slice(0, openStartTimeHHMMColonIdx);
  const openStartTimeMM = openStartTimeHHMM.slice(openStartTimeHHMMColonIdx + 1);

  let startTimeMoment = moment(allValues.startDateTime);
  startTimeMoment = startTimeMoment.set('hour', startTimeHH);
  startTimeMoment = startTimeMoment.set('minute', startTimeMM);

  let openTimeMoment = moment(value);
  openTimeMoment = openTimeMoment.set('hour', openStartTimeHH);
  openTimeMoment = openTimeMoment.set('minute', openStartTimeMM);
  
  const openTimeIsAfterStartTime = openTimeMoment.isAfter(startTimeMoment);

  return openTimeIsAfterStartTime ? "Auto open time must not be after the start time" : undefined;
};

const startTimeMustNotBeforeOpenTime = (value, allValues) => {

  // do not validate if no auto open time value yet
  if (value === undefined ||
    !validTime24(allValues.startTime) ||
    allValues.defaultAutoOpenTime === undefined ||
    !validTime24(allValues.defaultStartTime)) {
    return undefined;
  }

  const openStartTimeHHMM = allValues.defaultStartTime;
  const openStartTimeHHMMColonIdx = openStartTimeHHMM.indexOf(':');
  const openStartTimeHH = openStartTimeHHMM.slice(0, openStartTimeHHMMColonIdx);
  const openStartTimeMM = openStartTimeHHMM.slice(openStartTimeHHMMColonIdx + 1);

  const startTimeHHMM = allValues.startTime;
  const startTimeHHMMColonIdx = startTimeHHMM.indexOf(':');
  const startTimeHH = startTimeHHMM.slice(0, startTimeHHMMColonIdx);
  const startTimeMM = startTimeHHMM.slice(startTimeHHMMColonIdx + 1);

  let openTimeMoment = moment(allValues.defaultAutoOpenTime);
  openTimeMoment = openTimeMoment.set('hour', openStartTimeHH);
  openTimeMoment = openTimeMoment.set('minute', openStartTimeMM);

  let startTimeMoment = moment(value);
  startTimeMoment = startTimeMoment.set('hour', startTimeHH);
  startTimeMoment = startTimeMoment.set('minute', startTimeMM);

  const openTimeIsAfterStartTime = openTimeMoment.isAfter(startTimeMoment);

  return openTimeIsAfterStartTime ? "Start time must not be before auto open time" : undefined;
}

export {
  openTimeMustNotAfterStartTime,
  startTimeMustNotBeforeOpenTime
};
