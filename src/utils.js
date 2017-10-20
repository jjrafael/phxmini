import moment from 'moment';
import numeral from "numeral";
import channelConfig from './configs/channelConfig';
import filterTypes from './constants/filterTypes';
import _ from 'underscore';

export function objectToArray(obj) {
    var arr = [];
    for(var key in obj) {
        arr.push(obj[key]);
    };
    return arr;
}

export function prettifyTime(dateString) {
    var hours = dateString.substr(6,2);
    var minutes = dateString.substr(8,2);
    var seconds = dateString.substr(10,2);
    return `${hours}:${minutes}:${seconds}`;
}

export function getDaysDiffFromNow(then) {
    var format = format || 'MMMM Do YYYY, h:mm a';
    var year = "20" + then.substr(0,2);
    var month = then.substr(2,2);
    var day = then.substr(4,2);
    var hours = then.substr(6,2);
    var minutes = then.substr(8,2);
    var seconds = then.substr(10,2);

    var then2 = moment(`${year}-${month}-${day}T${hours}`);
    var now = moment();
    return then2.diff(now, 'days');
}

export function manipulateDate(dateTimeString, value, unit, format) {
    var format = format || 'MMMM Do YYYY, h:mm a';
    var year = "20" + dateTimeString.substr(0,2);
    var month = dateTimeString.substr(2,2);
    var day = dateTimeString.substr(4,2);
    var hours = dateTimeString.substr(6,2);
    var minutes = dateTimeString.substr(8,2);
    var seconds = dateTimeString.substr(10,2);
    return moment(`${year}-${month}-${day}T${hours}:${minutes}:${seconds}`).add(value, unit).format(format);
}

export function formatDecimalPrice(value) {
    return numeral(value).format('0,0.00')
}

export function formatCurrency(value, currencyCode) {
    currencyCode = currencyCode || '';
    return numeral(value).format('0,0.00') + ' ' + currencyCode;
}

export function getDateFromTimeString(dateTimeString) {
    var year = "20" + dateTimeString.substr(0,2);
    var month = dateTimeString.substr(2,2);
    var day = dateTimeString.substr(4,2);
    var hours = dateTimeString.substr(6,2);
    var minutes = dateTimeString.substr(8,2);
    return moment(`${year}-${month}-${day}T${hours}:${minutes}:00`);
}

export function formatDateTimeString(dateTimeString, format) {
    var format = format || 'MMMM Do YYYY, h:mm a';
    var momentDate = getDateFromTimeString(dateTimeString);
    var timeZoneOffset = channelConfig.timeZoneOffset;
    if(timeZoneOffset >= 0) {
        return momentDate.add(channelConfig.timeZoneOffset, 'hours').format(format);
    } else if(timeZoneOffset < 0) {
        return momentDate.subtract(channelConfig.timeZoneOffset, 'hours').format(format);
    }
}

export function formatISODateString(ISODateString, format) {
    var format = format || 'MMMM Do YYYY, h:mm:ss a';
    var date = new Date(ISODateString);
    if (date.toString() === 'Invalid Date') { // date returns invalid in safari when format is: 2017-05-30T18:30:00.000+0000
        // TODO: what if ISODateString timezone is not +0000?
        let regex = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2}).(\d{3})([+|-]\d{4})$/;
        if (regex.test(ISODateString)) {
            let match = ISODateString.match(regex);
            date = new Date(match[1], match[2], match[3], match[4], match[5], match[6]);
        }
    }
    var timeZoneOffset = channelConfig.timeZoneOffset;
    if(timeZoneOffset >= 0) {
        return moment(date).format(format);
    } else if(timeZoneOffset < 0) {
        return moment(date).format(format);
    }
}

export function getNext7DayText() {
    return `${moment().startOf('day').format('L')} to ${moment().add(6, 'days').endOf('day').format('L')}`;
}

export function getLast7DayText() {
    return `${moment().subtract(6, 'days').format('L')} to ${moment().endOf('day').format('L')}`;
}

export function getLastMonthText() {
    return `${moment().subtract(1, 'months').add(1, 'days').format('L')} to ${moment().endOf('day').format('L')}`;
}

export function formatFilterDates(date) {
    const filterDateTypes = filterTypes.DATES;
    const filterPastDates = filterTypes.PAST_DATES;
    const filterOtherDates = filterTypes.OTHER_DATES;
    const filterTransactionDates = filterTypes.TRANSACTION_DATES
    if(!date) {
        return {
            fromDate: null,
            toDate: null
        }
    }
    switch(date) {
        case filterDateTypes.TODAY:
        case filterPastDates.TODAY:
            return {
                fromDate: moment().startOf('day').format(),
                toDate: moment().endOf('day').format()
            };
        case filterOtherDates.EVENT_2HRS_AGO:
            return {
                fromDate: moment().subtract(2, 'hours').format(),
                toDate: moment().endOf('day').format()
            };
        case filterOtherDates.EVENT_4HRS_AGO:
            return {
                fromDate: moment().subtract(4, 'hours').format(),
                toDate: moment().endOf('day').format()
            };
        case filterDateTypes.ALL_DATES:
        case filterPastDates.ALL_DATES:
            return {
                fromDate: null,
                toDate: null
            };
        case filterDateTypes.YESTERDAY:
        case filterPastDates.YESTERDAY:
            const yesterday = moment().add(-1, 'days');
            return {
                fromDate: yesterday.startOf('day').format(),
                toDate: yesterday.endOf('day').format()
            };
        case filterDateTypes.TOMORROW:
            const tomorrow = moment().add(1, 'days');
            return {
                fromDate: tomorrow.startOf('day').format(),
                toDate: tomorrow.endOf('day').format()
            };
        case filterDateTypes.FUTURE:
            const future = moment().add(2, 'days');
            return {
                fromDate: future.startOf('day').format(),
                toDate: moment().add(99, 'years').endOf('day').format()
            };
        case filterDateTypes.NEXT_7_DAYS:
        case `${filterDateTypes.NEXT_7_DAYS} (${getNext7DayText()})`:
            return {
                fromDate: moment().startOf('day').format(),
                toDate: moment().add(6, 'days').endOf('day').format()
            };
        case filterOtherDates.LAST_7_DAYS:
        case `${filterOtherDates.LAST_7_DAYS} (${getLast7DayText()})`:
            return {
                fromDate: moment().subtract(6, 'days').startOf('day').format(),
                toDate: moment().endOf('day').format()
            }
        case filterPastDates.THIS_MONTH:
            return {
                fromDate: moment().startOf('month').format(),
                toDate: moment().endOf('month').format()
            };
        case filterOtherDates.LAST_MONTH:
        case `${filterOtherDates.LAST_MONTH} (${getLastMonthText()})`:
            return {
                fromDate: moment().subtract(1, 'months').add(1, 'days').format(),
                toDate: moment().endOf('day').format()
            };
        case filterPastDates.THIS_WEEK:
            return {
                fromDate: moment().startOf('week').add(1, 'days').format(),
                toDate: moment().startOf('week').add(7, 'days').format()
            };
        case filterPastDates.THIS_QUARTER:
            return {
                fromDate: moment().startOf('quarter').format(),
                toDate: moment().startOf('quarter').format()
            };
        case filterPastDates.THIS_YEAR:
            return {
                fromDate: moment().startOf('year').format(),
                toDate: moment().startOf('year').format()
            };
        case filterTransactionDates.LAST_HOUR:
            return {
                fromDate: moment().subtract(1, 'hours').format(),
                toDate: moment().format()
            }
        case filterTransactionDates.LAST_24:
            return {
                fromDate: moment().subtract(24, 'hours').format(),
                toDate: moment().format()
            }
        case filterTransactionDates.LAST_48:
            return {
                fromDate: moment().subtract(48, 'hours').format(),
                toDate: moment().format()
            }   
        case `${filterTransactionDates.THIS_WEEK} (${moment().startOf('week').format('L')} to ${moment().endOf('week').format('L')})`:
            return {
                fromDate: moment().startOf('week').format(),
                toDate: moment().endOf('week').format()
            }
        case `${filterTransactionDates.LAST_WEEK} (${moment().subtract(1,'w').startOf('week').format('L')} to ${moment().subtract(1,'w').endOf('week').format('L')})`:
            return {
                fromDate: moment().subtract(1,'w').startOf('week').format(),
                toDate: moment().subtract(1,'w').endOf('week').format()
            }
        case `${filterTransactionDates.THIS_MONTH} (${moment().startOf('month').format('L')} to ${moment().endOf('month').format('L')})`:
            return {
                fromDate: moment().startOf('month').format(),
                toDate: moment().endOf('month').format()
            }
        default:
            if(date.indexOf('-') > -1 && date.indexOf('/') > -1) {
                const from = date.split(' - ')[0];
                const to = date.split(' - ')[1];
                return {
                    fromDate: moment(from, 'L').startOf('day').format(),
                    toDate: moment(to, 'L').endOf('day').format()
                }
            }
            break
    }
}

export function formatNumber(numberString, noDecimal) {
   if(typeof numberString === 'number'){
       numberString = numberString.toString();
   }
   numberString = numberString.replace(/\B(?=(\d{3})+(?!\d))/g, ',').replace(/(\.)/g, '.'); // added comma to the number format

   var parts = numberString.split('.');
   if(noDecimal) {
    return parts[0];
   }
   if(parts.length === 1) {
       numberString = numberString + '.00'; // adding decimal part
   } else if (parts[1].length === 1) {
       numberString = numberString + '0'; // 2 decimal precision
   }
   return numberString;
};

export function getMarketStatusFromFlags(flags) {
    const statusTypes = objectToArray(filterTypes.STATUS);
    if(!flags) {
        return 'Open';
    }
    const matchingStatus = statusTypes.filter((status)=> {
        return flags.indexOf(status.desc.toLowerCase()) > -1;
    })
    return matchingStatus[0] && matchingStatus[0].desc ? matchingStatus[0].desc : 'Open';
}

export function isMarketsTotals(marketTypeGroup) {
    return ['TOTALS', 'FIXED_TOTAL', 'THREE_WAYS_TOTALS', 'RANGE_TOTALS'].indexOf(marketTypeGroup) > -1;
}

export function formatOutcomeSpreads(spread, spread2) {
    if(typeof spread === 'number' && spread !== null) {
        spread = spread.toString();
    }
    if(spread.indexOf('+') === -1 && spread !== '0' && spread.indexOf('-') === -1) {
        spread = '+' + spread;
    }
    if(typeof spread2 === 'number' && spread2 !== null) {
        spread2 = spread2.toString();
    }
    if(spread2.indexOf('+') === -1 && spread2 !== '0' && spread2.indexOf('-') === -1) {
        spread2 = '+' + spread2;
    }
    return {
        spread,
        spread2
    }
}

function mergeProperties(propertyKey, firstObject, secondObject, uniqueKey) {
    var propertyValue = firstObject[propertyKey];
    var uniqueKey = uniqueKey || 'id'; //unique keys are use to know whether which array item should be retained
    if(!secondObject || typeof secondObject[propertyKey] === 'undefined') {
        return firstObject[propertyKey];
    } else if(!firstObject || typeof firstObject[propertyKey] === 'undefined') {
        return secondObject[propertyKey];
    } else if(Object.prototype.toString.call( propertyValue ) === '[object Array]') {
        //uniqueKeys
        const uniqueKeysFound = secondObject[propertyKey].map((item) => {
            return item[uniqueKey];
        });
        const filteredOldArray = firstObject[propertyKey].filter((item) => {
            return uniqueKeysFound.indexOf(item[uniqueKey]) === -1;
        });

        return [ ...filteredOldArray, ...secondObject[propertyKey]];
    } else if (typeof(propertyValue) === "object") {
        return mergeNestedObjects(firstObject[propertyKey], secondObject[propertyKey], uniqueKey);
    }
    return secondObject[propertyKey];
}

export function mergeNestedObjects(firstObject, secondObject, uniqueKey) {
    var finalObject = {};

    // Merge first object and its properties.
    for (var propertyKey in firstObject) {
        finalObject[propertyKey] = mergeProperties(propertyKey, firstObject, secondObject, uniqueKey);
    }

    // Merge second object and its properties.
    for (var propertyKey in secondObject) {
        finalObject[propertyKey] = mergeProperties(propertyKey, secondObject, firstObject, uniqueKey);
    }

    return finalObject;
}

export function addParametersToUrl(url, parameters) {
    var qs = '';
    var qsPairs = [];
    if (url.indexOf('?') < 0) {
        qs = '?';
    } else { // it means there is already a parameter
        qs = '&';
    }
    for (var parameter in parameters) {
        if (url.indexOf(parameter) < 0 && parameters[parameter] !== null) {
            qsPairs.push(parameter + '=' + parameters[parameter]);
        }
    }
    if (qsPairs.length) {
        qs += qsPairs.join('&');
    } else {
        return url;
    }
    return (url + qs);
};

export function pruneNullOrUndefined(objectToPrune) {
    return _.omit(objectToPrune,
        _.filter(_.keys(objectToPrune), function(key) {
            return _.isUndefined(objectToPrune[key]) || _.isNull(objectToPrune[key])
        }));
};

export function arrayFindWhere(list, properties) {
    return _.findWhere(list, properties);
};

export function randomStr(num) {
    let m = num || 9;
    let s = '';
    let r = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (let i=0; i < m; i++) { s += r.charAt(Math.floor(Math.random()*r.length)); }
    return s;
};

export const parseString = (str) => {
    let result = null;
    try {
        result = JSON.parse(str);
    } catch (e) {}
    return result;
};

export const saveInStorage = (key, data) => {
    if (typeof key === 'string' && data) {
        localStorage.setItem(key, JSON.stringify(data));
    }
};

export const loadFromStorage = (key, skipParse) => {
    let result = null;
    if (typeof key === 'string') {
        let str = localStorage.getItem(key);
        if (skipParse) {
            result = str;
        } else {
            result = parseString(str);
        }
    }
    return result;
};

/**
 * Converts Object into an Iterable
 * Author: Jay-R Pampellona
 * Iterable Object can be used in for...of and in array destructuring ie. [...iterableObject]
 * @param  {Object}  object                     [Object to be converted into Iterable]
 * @param  {Boolean} returnAsKeyValuePairObject [if true, the value for each iteration will be an object with 'key' and 'value' props]
 * @return {Iterable Object}                    [An object converted into Iterable]
 */
export const makeIterable = (object, returnAsKeyValuePairObject=false) => {
    if (object instanceof Object) {
        let iterableObject = { ...object };
        iterableObject[Symbol.iterator] = function * () {
            const props = Object.keys(this);
            for (let key of props) {
                if (returnAsKeyValuePairObject) {
                    yield {key, value: this[key]}
                } else {
                    yield this[key]
                }
            }
        }
        return iterableObject
    } else {
        throw new Error('Must be an Object instance.')
    }
}

export const combineDateTime = (date, time, format='MM/DD/YYYYTHH:mm') => {
    if(!date || !time) return;
    const dateTime = `${date}T${time}`;
    return moment(dateTime, format).format();
}

export const selectValidProps = (array, objectProps) => {
    return array.map(obj => {
        return objectProps.reduce((accu, prop) => {
            if (obj[prop] !== undefined && obj[prop] !== null) {
                accu[prop] = obj[prop];
            }
            return accu;
        }, {})
    });
}

export const getMarketBookRuleKey = (book) => {
    let ruleKey = '';
    if (book.nonRunnerNoBet === true) {
        if (book.rule4) {
            ruleKey = 'dayEvent';
        } else {
            ruleKey = 'nonRunner';
        }
    } else {
        if (book.rule4) {
            // what rule?
        } else {
            ruleKey = 'allIn'
        }
    }
    return ruleKey;
}

const removeWhiteSpaces = (str) => {
    return str.replace(/\s/g, '');
}
export const generatePlaceTerms = (placeTerms, book) => {
    let targetPlaceTerm = placeTerms.find(term => removeWhiteSpaces(term.description) === removeWhiteSpaces(book.placeTerms[0].description));
    let placeTermsRequest = {
        deduction: 0,
        numPlaces: 0,
        fixed: false
    }
    if (targetPlaceTerm) { // this should always have a value
        placeTermsRequest = {
            deduction: targetPlaceTerm.placeTerms.deduction,
            numPlaces: targetPlaceTerm.placeTerms.numPlaces,
            fixed: targetPlaceTerm.fixed
        }
    }
    return placeTermsRequest;
}

const validBookProps = ['id', 'bookType', 'rule4DeductionEnabled', 'nonRunnerNoBet', 'currentBook', 'createSpBook', 'placeTermsRequest'];
export const generateBookPayload = (book) => {
    return selectValidProps([{...book, bookType: book.description, rule4DeductionEnabled: book.rule4}], validBookProps)[0];
}

export const pathNameToArray = (pathName='') => {
    let arr = [];
    pathName = pathName.replace(/^\/|\/$/g, '');
    if (pathName) {
        arr = pathName.split('/');
    }
    return arr;
};

export const parsePathName = (pathName='') => {
    let [baseUrl, sportCode, path, section] = pathNameToArray(pathName);
    return { baseUrl, sportCode, path, section };
}

export const getActiveEventInSportsTree = (sportsTree) => {
    const { activePathId, pathsMap } = sportsTree;
    const {parentId} = pathsMap[activePathId];
    
    return pathsMap[parentId];
}

export const generatePeriodsTree = (periods) => {
    let namespace = {};
    let tree = [];
    periods.forEach(period => {
        let currentPeriod = namespace[period.id] = {
            ...period,
            children: []
        }
        if (currentPeriod.parentId === 0) {
            tree.push(currentPeriod);
        } else {
            if (namespace[currentPeriod.parentId]) {
                namespace[currentPeriod.parentId].children.push(currentPeriod)
            }
        }

    });
    return tree.sort((a, b) => {
        let aIsInrunning = a.periodType.inRunning;
        let bIsInrunning = b.periodType.inRunning;
        if (aIsInrunning === bIsInrunning) {
            return 0
        } else if (aIsInrunning && !bIsInrunning) {
            return 1;
        } else if (bIsInrunning && !aIsInrunning) {
            return -1;
        }
    });
}

export const getOpponentDetails =(opponentId, opponentsArray) =>{
    let OpponentDetails = {};
    opponentsArray.forEach(opponent => {
        if(opponent.id == opponentId)
            OpponentDetails = opponent;
    });

    return OpponentDetails;
}