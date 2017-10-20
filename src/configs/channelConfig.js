let timeZoneOffset = (new Date().getTimezoneOffset() / 60) * -1;

const channelConfig = {
    originId: 11,
    lineId: 2,
    defaultEventPath: 'p227',
    defaultSportId: 227,
    timeZone: '+0800',
    timeZoneOffset,
};

export default channelConfig