import {formatNumber} from 'utils';

const required = value => value ? undefined : 'Required';
const minLength = min => value => value && value.length < min ? `Must be ${min} characters or more` : undefined;
const maxLength = max => value => value && value.length > max ? `Upto ${max} characters only` : undefined;
const equalLength = equal => value => value && value.length !== equal ? `Must be ${equal} characters` : undefined;
const number = value => value && isNaN(Number(value)) ? 'Must be a number' : undefined;
const email = value => value && !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(value) ? 'Invalid email address' : undefined;
const time24 = value => value && !/^([0-9]|0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/i.test(value) ? 'Invalid time format' : undefined;
const alphanumericunderscore = value => value && !/^[A-Za-z0-9\_]+$/i.test(value) ? 'Only letters, numbers and underscore are allowed' : undefined;
const alpha  = value => value && !/^[A-Za-z]+$/i.test(value) ? 'Only letters are allowed' : undefined;
const alphaspace = value => value && !/^[A-Za-z ]+$/i.test(value) ? 'Only letters and spaces are allowed' : undefined;
const positivenumberonly = value => value && value < 0 ? 'Must be a positive number' : undefined;
const selectionRequired = value => value === undefined || (value && value < 0) ? 'Must have a selection' : undefined;
const handicap = value => value && !/^[+-]?[\d]+.?((0|00|25|5|50|75))?$/g.test(value) ? 'Invalid handicap format' : undefined;
const incompleteHandicap = value => value && !/^[+-]?[\d]+.?((2|7|))?$/g.test(value) ? 'Invalid handicap format' : undefined;
const positiveInteger = value => value && !/^\d*$/g.test(value) ? 'Positive integer only' : undefined;
const plusMinusSign = value => value && !/^[+-]{1}$/g.test(value) ? 'Must start with + or -' : undefined;
const floatNumber = value => value && !/^[+-]?[\d]+\.?\d{0,4}?$/g.test(value) ? 'Float number only' : undefined;
const dateFormat = value => value && !/^(0[1-9]|1[012])[- /.](0[1-9]|[12][0-9]|3[01])[- /.](19|20)\d\d$/.test(value) ? 'Invalid date format' : undefined;
const maxNumber = max => value => value && parseFloat(value) > parseFloat(max) ? `The maximum value allowed is ${formatNumber(max)}` : undefined;



export {
    required,
    minLength,
    maxLength,
    equalLength,
    number,
    email,
    alphanumericunderscore,
    alpha,
    alphaspace,
    positivenumberonly,
    selectionRequired,
    time24,
    handicap,
    incompleteHandicap, // allows user to enter incomplete handicap like 1.2 -> 1.25 or 1.7 -> 1.75
    positiveInteger,
    plusMinusSign,
    floatNumber,
    maxNumber
}
