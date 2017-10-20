import moment from 'moment';

const stakesFilter = [{
  'key': 'all',
  'desc': 'All Stakes',
  'lt': null,
  'gt': null
},{
  'key': 'lte25',
  'desc': '<= 25',
  'lt': 26,
  'gt': null
},{
  'key': 'gt25',
  'desc': '> 25',
  'lt': null,
  'gt': 25
},{
  'key': 'gt50',
  'desc': '> 50',
  'lt': null,
  'gt': 50
},{
  'key': 'gt100',
  'desc': '> 100',
  'lt': null,
  'gt': 100
},{
  'key': 'gt200',
  'desc': '> 200',
  'lt': null,
  'gt': 200
},{
  'key': 'gt500',
  'desc': '> 500',
  'lt': null,
  'gt': 500
}];

const transactionTypeFilter = [{
  key: 'all',
  desc: 'All Transaction Types',
  filter: null
},{
  key: 'bets',
  desc: 'Bets',
  filter: 'BET,CANCELLED_BET,TOTO_BET,CANCELLED_TOTO_BET'
},{
  key: 'adjustments',
  desc: 'Adjustments',
  filter: 'ADJUSTMENT'
},{
  key: 'transfers',
  desc: 'Transfers',
  filter: 'INTERNAL_TRANSFER,EXTERNAL_TRANSFER'
},{
  key: 'paymentreceipt',
  desc: 'Payment/Receipt',
  filter: 'PAYMENTRECEIPT'
},{
  key: 'taxed',
  desc: 'Taxed Transactions',
  filter: 'TAXED'
},{
  key: 'bonus',
  desc: 'Bonus Transactions',
  filter: 'BONUS'
}];

const transactionPermissions = {
  //VOID BET & BETSLIP
  'CUSTOMER_CARE_VOID_BETSLIP': 1205,
  'CUSTOMER_CARE_VOID_BET': 226,
  'CUSTOMER_CARE_VOID_BET_UNSETTLED': 1262,
  'OVERRIDE_VOID_TIME_LIMIT': 1008,
  'OVERRIDE_VOID_TIME_LIMIT_UNSETTLED': 1263,
  //CANCEL BET & BETSLIP
  'CUSTOMER_CARE_CANCEL_BETSLIP': 1204,
  'CUSTOMER_CARE_CANCEL_BET': 229,
  'CUSTOMER_CARE_CANCEL_BET_UNSETTLED': 1261,
  'OVERRIDE_CANCEL_TIME_LIMIT': 1009,
  'OVERRIDE_CANCEL_TIME_LIMIT_UNSETTLED': 1264,
  //DELETE TRANSACTION
  'CUSTOMER_CARE_DELETE_TRANSACTION': 824,
  'MANUAL_SETTLE_ALL_BETS': 227,
  'MANUAL_SETTLE_UNSETTLED_BETS': 1260
};

const transactionMessages = {
  'UNSETTLE_BET': 'Are you sure you want to unsettle this bet?',
  'VOID_BET' : 'Are you sure you want to void this bet?',
  'DELETE_TRANSACTION' : 'Are you sure you want to delete this transaction? This process cannot be reversed.',
  'CANCEL_BET' : 'Please specify a reason for this cancellation',
  'VOID_BETSLIP' : 'Please select a reason for voiding the bet'
};

export { stakesFilter, transactionTypeFilter, transactionPermissions, transactionMessages };