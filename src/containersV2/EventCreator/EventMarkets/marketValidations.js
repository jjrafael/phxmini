import moment from 'moment';

const validTime24 = (value) => value && /^([0-9]|0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/i.test(value);

const openTimeMustNotAfterCutOffTime = (value, allValues) => {

  // do not validate if no value yet
  if (value === undefined ||
    !validTime24(allValues.formAutoOpenTime) ||
    !validTime24(allValues.formCutoffTime) ||
    allValues.formCutoffDate === undefined) {
    return undefined;
  }

  const cutOffTimeHHMM = allValues.formCutoffTime;
  const cutOffTimeHHMMColonIdx = cutOffTimeHHMM.indexOf(':');
  const cutOffTimeHH = cutOffTimeHHMM.slice(0, cutOffTimeHHMMColonIdx);
  const cutOffTimeMM = cutOffTimeHHMM.slice(cutOffTimeHHMMColonIdx + 1);

  const openStartTimeHHMM = allValues.formAutoOpenTime;
  const openStartTimeHHMMColonIdx = openStartTimeHHMM.indexOf(':');
  const openStartTimeHH = openStartTimeHHMM.slice(0, openStartTimeHHMMColonIdx);
  const openStartTimeMM = openStartTimeHHMM.slice(openStartTimeHHMMColonIdx + 1);

  let cutOffTimeMoment = moment(allValues.formCutoffDate);
  cutOffTimeMoment = cutOffTimeMoment.set('hour', cutOffTimeHH);
  cutOffTimeMoment = cutOffTimeMoment.set('minute', cutOffTimeMM);

  let openTimeMoment = moment(value);
  openTimeMoment = openTimeMoment.set('hour', openStartTimeHH);
  openTimeMoment = openTimeMoment.set('minute', openStartTimeMM);

  const openTimeIsAfterCutOffTime = openTimeMoment.isAfter(cutOffTimeMoment);

  return openTimeIsAfterCutOffTime ? "Auto open time must not be after the cut-off time" : undefined;
};

const cutOffTimeMustNotBeforeAutoOpenTime = (value, allValues) => {

  // do not validate if no auto open time value yet
  if (value === undefined ||
    !validTime24(allValues.formCutoffTime) ||
    allValues.formAutoOpenDate === undefined ||
    !validTime24(allValues.formAutoOpenTime)) {
    return undefined;
  }

  const openStartTimeHHMM = allValues.formAutoOpenTime;
  const openStartTimeHHMMColonIdx = openStartTimeHHMM.indexOf(':');
  const openStartTimeHH = openStartTimeHHMM.slice(0, openStartTimeHHMMColonIdx);
  const openStartTimeMM = openStartTimeHHMM.slice(openStartTimeHHMMColonIdx + 1);

  const cutOffTimeHHMM = allValues.formCutoffTime;
  const cutOffTimeHHMMColonIdx = cutOffTimeHHMM.indexOf(':');
  const cutOffTimeHH = cutOffTimeHHMM.slice(0, cutOffTimeHHMMColonIdx);
  const cutOffTimeMM = cutOffTimeHHMM.slice(cutOffTimeHHMMColonIdx + 1);

  let openTimeMoment = moment(allValues.formAutoOpenDate);
  openTimeMoment = openTimeMoment.set('hour', openStartTimeHH);
  openTimeMoment = openTimeMoment.set('minute', openStartTimeMM);

  let cutOffTimeMoment = moment(value);
  cutOffTimeMoment = cutOffTimeMoment.set('hour', cutOffTimeHH);
  cutOffTimeMoment = cutOffTimeMoment.set('minute', cutOffTimeMM);

  const openTimeIsAfterCutOffTime = openTimeMoment.isAfter(cutOffTimeMoment);

  return openTimeIsAfterCutOffTime ? "Cut-Off time must not be before auto open time" : undefined;
}

export {
  openTimeMustNotAfterCutOffTime,
  cutOffTimeMustNotBeforeAutoOpenTime
};
