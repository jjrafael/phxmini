import React from "react";
import moment from 'moment';

export function getUniqueId() {
  return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c =>
    (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
  )
}

function getIcon(originId, origins, channels) {
  if (origins[0] && channels[0]) {
    const channelId = origins.find((origin) => origin.id === originId).channelId;
    return channels.find((channel) => channel.id === channelId).description;
  } else {
    return ''
  }
}

export function parseBetsData(bets, sports, origins, channels, brands) {
  const parsedBets = [];
  const dateFormatter = 'MM/DD/YYYY HH:mm:ss';
  // const dateFormatter = new Intl.DateTimeFormat('en-GB', {
  //   year: 'numeric',
  //   month: 'numeric',
  //   day: 'numeric',
  //   hour: 'numeric',
  //   minute: 'numeric',
  //   second: 'numeric'
  // });

  bets.forEach((bet) => {
    const brandId = origins.find((origin) => origin.id === bet.iaBets[0].originId).brandId;
    parsedBets.push({
      icon: getIcon(bet.iaBets[0].originId, origins, channels),
      date: moment(bet.submitTime).format(dateFormatter),
      shop: '',
      username: bet.iaBets[0].account.userName,
      accountDescription: bet.iaBets[0].accountDescription,
      description: bet.iaBets[0].description,
      sport: sports.find((sport) => sport.code === bet.iaBets[0].sportCode).description,
      sportCodeLower: bet.iaBets[0].sportCode.toLowerCase(),
      events: bet.iaBets[0].betDatas
        .map(data => ({id: data.eventId, description: data.eventDescription, startTime: moment(data.eventStartTime).format('MM/DD/YYYY')}))
        .reduce((accu, val) => {
          if (!accu.find(event => event.id === val.id)) {
            accu.push(val);
          }
          return accu;
        }, []),
      unitStake: bet.unitStake,
      totalStake: bet.totalStake,
      winAmount: bet.potentialWin,
      unitStakeP: bet.unitStake * bet.iaBets[0].fxrate,
      totalStakeP: bet.totalStake * bet.iaBets[0].fxrate,
      winAmountP: bet.potentialWin * bet.iaBets[0].fxrate,
      type: (bet.iaBets[1] || bet.iaBets[0].betDatas[1]) ? 'multiple' : 'single',
      isLive: bet.iaBets[0].betDatas[0].marketResponse.period.periodType.inRunning,
      betColor: bet.iaBets[0].account.playerProfileFlags[0] ? bet.iaBets[0].account.playerProfileFlags[0].colour : '',
      brand: brands.find((brand) => brand.id === brandId).description
    });
  });

  return parsedBets;
}

export function parseAccountsData(accounts, origins, channels, brands) {
  const parsedAccounts = [];
  const dateFormatter = 'MM/DD/YYYY HH:mm:ss';
  // const dateFormatter = new Intl.DateTimeFormat('en-GB', {
  //   year: 'numeric',
  //   month: 'numeric',
  //   day: 'numeric',
  //   hour: 'numeric',
  //   minute: 'numeric',
  //   second: 'numeric'
  // });

  accounts.forEach((account) => {
    const brandId = origins.find((origin) => origin.id === account.originId).brandId;
    parsedAccounts.push({
      icon: getIcon(account.originId, origins, channels),
      date: moment(account.createdDate).format(dateFormatter),
      account: account.accountNumber,
      username: account.userName,
      name: `${account.firstName} ${account.lastName}`,
      email: account.email,
      site: 'website',
      referrer: account.referer,
      brand: brands.find((brand) => brand.id === brandId).description
    });
  });

  return parsedAccounts;
}

export function parsePaymentsData(payments, origins, brands) {
  const parsedPayments = [];
  // const dateFormatter = new Intl.DateTimeFormat('en-GB', {
  //   hour: 'numeric',
  //   minute: 'numeric',
  //   second: 'numeric'
  // });
  const dateFormatter = 'HH:mm:ss';
  payments.forEach((payment) => {
    const brandId = origins.find((origin) => origin.id === payment.originId).brandId;
    parsedPayments.push({
      time: moment(payment.createDate).format(dateFormatter),
      account: payment.accountNumber,
      description: payment.description,
      credit: payment.credit,
      debit: payment.debit,
      brand: brands.find((brand) => brand.id === brandId).description
    })
  });

  return parsedPayments;
}

export function parseFailedBetsData(failedBets, origins, brands) {
  const parsedFailedBets = [];
  const dateFormatter = 'MM/DD/YYYY HH:mm:ss';
  // const dateFormatter = new Intl.DateTimeFormat('en-GB', {
  //   year: 'numeric',
  //   month: 'numeric',
  //   day: 'numeric',
  //   hour: 'numeric',
  //   minute: 'numeric',
  //   second: 'numeric'
  // });
  failedBets.forEach((bet) => {
    const brandId = origins.find((origin) => origin.id === bet.originId).brandId;
    parsedFailedBets.push({
      date: moment(bet.createDate).format(dateFormatter),
      username: bet.userName,
      account: bet.accountNumber,
      description: bet.description,
      stake: bet.unitStake * bet.fxrate,
      brand: brands.find((brand) => brand.id === brandId).description
    })
  });

  return parsedFailedBets;
}

export function getBetsColumns(headersPreferences) {
  const columns = [{
    header: 'Origin',
    accessor: 'icon',
    style: { textAlign: 'center', alignSelf: 'center' },
    show: headersPreferences.icon,
    getHeaderProps: () => ({ className: 'icon-header' }),
    className: "icon-cell",
    render: ({value}) => {
      switch(value){
        case 'Telebet':
          return <i className='phx-telebet' title={value}></i>
        case 'Internet':
          return <i className='phx-internet' title={value}></i>
        case 'RTG':
          return <i className='phx-rtg' title={value}></i>
        case 'Mobile':
          return <i className='phx-mobile' title={value}></i>  
        case 'BetPoint':
          return <i className='phx-betpoint' title={value}></i>
        case 'Kiosk':
          return <i className='phx-kiosk' title={value}></i>
        case 'Opera Mini':
          return <i className='phx-opera' title={value}></i>
        case 'Remote Bet Slip':
          return <i className='phx-remote' title={value}></i>
        case 'SMS':
          return <i className='phx-comment' title={value}></i>
        case 'Tablet':
          return <i className='phx-tablet' title={value}></i>
        default:
          return (value)
      }
    },
    minWidth:50
  },
  {
    header: 'Date/Time',
    accessor: 'date',
    show: headersPreferences.date,
    getHeaderProps: () => ({ className: 'date-header' }),
    className: "date-cell",
    render: props =>
      <span style={{textOverflow:'ellipsis',whiteSpace:'normal'}}>
        <span style={{wordWrap:'break-word'}}>
          {props.value.split(' ')[0]}
        </span>
        <br/>
        <span style={{wordWrap:'break-word'}}>
          {props.value.split(' ')[1]}
        </span>
      </span>,
    minWidth:85
  },
  {
    header: 'Shop',
    accessor: 'shop',
    getHeaderProps: () => ({ className: 'shop-header' }),
    className: "shop-cell",
    show: headersPreferences.shop,
    minWidth:60
  },
  {
    header: 'Username',
    accessor: 'username',
    getHeaderProps: () => ({ className: 'username-header' }),
    className: "username-cell",
    show: headersPreferences.username,
    minWidth:80
  },
  {
    header: 'Account Description',
    accessor: 'accountDescription',
    getHeaderProps: () => ({ className: 'account-description-header' }),
    className: "account-description-header",
    show: headersPreferences.accountDescription,
    minWidth:120
  },
  {
    header: 'Description',
    accessor: 'description',
    getHeaderProps: () => ({ className: 'description-header' }),
    className: "description-cell",
    show: headersPreferences.description,
    style: { display: 'none' }
  },
  {
    header: 'Sport',
    accessor: 'sport',
    getHeaderProps: () => ({ className: 'sport-header' }),
    className: "sport-cell",
    show: headersPreferences.sport,
    minWidth:65
  },
  {
    header: 'Unit Stake',
    accessor: 'unitStake',
    getHeaderProps: () => ({ className: 'unit-stake-header' }),
    className: "unit-stake-cell",
    show: headersPreferences.unitStake,
    render: props => <span>{`${props.rowValues.description.split(' ')[0]} ${props.value}`}</span>,
    minWidth:65
  },
  {
    header: 'Total Stake',
    accessor: 'totalStake',
    getHeaderProps: () => ({ className: 'total-stake-header' }),
    className: "total-stake-cell",
    show: headersPreferences.totalStake,
    render: props => <span>{`${props.rowValues.description.split(' ')[0]} ${props.value}`}</span>,
    minWidth:75
  },
  {
    header: 'Win Amount',
    accessor: 'winAmount',
    getHeaderProps: () => ({ className: 'win-amount-header' }),
    className: "win-amount-cell",
    show: headersPreferences.winAmount,
    render: props => <span>{`${props.rowValues.description.split(' ')[0]} ${props.value}`}</span>,
    minWidth:85
  },
  {
    header: props => <span>Unit Stake (&#8369;)</span>,
    accessor: 'unitStakeP',
    getHeaderProps: () => ({ className: 'unit-stake-p-header' }),
    className: "unit-stake-p-cell",
    show: headersPreferences.unitStakeP,
    render: props => <span>{`PHP ${props.value}`}</span>,
    minWidth:95
  },
  {
    header: props => <span>Total Stake (&#8369;)</span>,
    accessor: 'totalStakeP',
    getHeaderProps: () => ({ className: 'total-stake-p-header' }),
    className: "total-stake-p-cell",
    show: headersPreferences.totalStakeP,
    render: props => <span>{`PHP ${props.value}`}</span>,
    minWidth:95
  },
  {
    header: props => <span>Win Amount (&#8369;)</span>,
    accessor: 'winAmountP',
    getHeaderProps: () => ({ className: 'win-amount-p-header' }),
    className: "win-amount-p-cell",
    show: headersPreferences.winAmountP,
    render: props => <span>{`PHP ${props.value}`}</span>,
    minWidth:110
  }];

  return columns;
}

export function getAccountsColumns(headersPreferences) {
  const columns = [{
    header: 'Origin',
    accessor: 'icon',
    style: { textAlign: 'center', alignSelf: 'center' },
    show: headersPreferences.icon,
    getHeaderProps: () => ({ className: 'icon-header' }),
    className: "icon-cell",
    render: ({value}) => {
      switch(value){
        case 'Telebet':
          return <i className='phx-telebet' title={value}></i>
        case 'Internet':
          return <i className='phx-internet' title={value}></i>
        case 'RTG':
          return <i className='phx-rtg' title={value}></i>
        case 'Mobile':
          return <i className='phx-mobile' title={value}></i>  
        case 'BetPoint':
          return <i className='phx-betpoint' title={value}></i>
        case 'Kiosk':
          return <i className='phx-kiosk' title={value}></i>
        case 'Opera Mini':
          return <i className='phx-opera' title={value}></i>
        case 'Remote Bet Slip':
          return <i className='phx-remote' title={value}></i>
        case 'SMS':
          return <i className='phx-comment' title={value}></i>
        case 'Tablet':
          return <i className='phx-tablet' title={value}></i>
        default:
          return (value)
      }
    },
    minWidth:50
  },
  {
    header: 'Date/Time',
    accessor: 'date',
    show: headersPreferences.date,
    getHeaderProps: () => ({ className: 'date-header' }),
    className: "date-cell",
    render: props =>
    <span style={{textOverflow:'ellipsis',whiteSpace:'normal'}}>
        <span style={{wordWrap:'break-word'}}>
          {props.value.split(' ')[0]}
        </span>
        <br/>
        <span style={{wordWrap:'break-word'}}>
          {props.value.split(' ')[1]}
        </span>
      </span>,
  },
  {
    header: 'Account',
    accessor: 'account',
    getHeaderProps: () => ({ className: 'account-header' }),
    className: "account-cell",
    show: headersPreferences.account
  },
  {
    header: 'Username',
    accessor: 'username',
    getHeaderProps: () => ({ className: 'username-header' }),
    className: "username-cell",
    show: headersPreferences.username
  },
  {
    header: 'Name',
    accessor: 'name',
    getHeaderProps: () => ({ className: 'name-header' }),
    className: "name-cell",
    show: headersPreferences.name
  },
  {
    header: 'Email',
    accessor: 'email',
    getHeaderProps: () => ({ className: 'email-header' }),
    className: "email-cell",
    show: headersPreferences.email
  },
  {
    header: 'Site',
    accessor: 'site',
    getHeaderProps: () => ({ className: 'site-header' }),
    className: "site-cell",
    show: headersPreferences.site
  },
  {
    header: 'Referrer',
    accessor: 'referrer',
    getHeaderProps: () => ({ className: 'referrer-header' }),
    className: "referrer-cell",
    show: headersPreferences.referrer
  }];

  return columns;
}

export function getPaymentColumns(headersPreferences) {
  const columns = [{
    header: 'Date/Time',
    accessor: 'time',
    show: headersPreferences.time,
    style: { whiteSpace: 'pre-wrap', wordWrap:'break-word'}
  },
  {
    header: 'Account',
    accessor: 'account',
    show: headersPreferences.account,
    style: { whiteSpace: 'pre-wrap', wordWrap:'break-word'}
  },
  {
    header: 'Description',
    accessor: 'description',
    show: headersPreferences.description,
    style: { whiteSpace: 'pre-wrap', wordWrap:'break-word'}
  },
  {
    header: 'Credit',
    accessor: 'credit',
    show: headersPreferences.credit,
    style: { whiteSpace: 'pre-wrap', wordWrap:'break-word'}
  },
  {
    header: 'Debit',
    accessor: 'debit',
    show: headersPreferences.debit,
    style: { whiteSpace: 'pre-wrap', wordWrap:'break-word'}
  }];

  return columns;
}

export function getFailedBetsColumns(headersPreferences) {
  const columns = [{
    header: 'Date/Time',
    accessor: 'date',
    show: headersPreferences.date,
    render: props =>
    <span style={{textOverflow:'ellipsis',whiteSpace:'normal'}}>
        <span style={{wordWrap:'break-word'}}>
          {props.value.split(' ')[0]}
        </span>
        <br/>
        <span style={{wordWrap:'break-word'}}>
          {props.value.split(' ')[1]}
        </span>
      </span>,
  },
  {
    header: 'Username',
    accessor: 'username',
    show: headersPreferences.username,
    style: { whiteSpace: 'normal',wordWrap:'break-word' }
  },
  {
    header: 'Account',
    accessor: 'account',
    show: headersPreferences.account,
    style: { whiteSpace: 'normal',wordWrap:'break-word' }
  },
  {
    header: 'Description',
    accessor: 'description',
    show: headersPreferences.description,
    style: { whiteSpace: 'normal', wordWrap:'break-word' }
  },
  {
    header: props => <span>Stake (&#8369;)</span>,
    accessor: 'stake',
    show: headersPreferences.stake,
    render: props => <span>{`PHP ${props.value}`}</span>,
    style: { whiteSpace: 'normal', wordWrap:'break-word' }
  }];

  return columns;
}

export function getFilteredBets(bets, filters, brandFilter) {
  return bets.filter((bet) => applyFilters(bet, filters, brandFilter));
}

export function getFilteredAccounts(accounts, brandFilter) {
  return accounts.filter((account) => {
    if (brandFilter !== 'All') {
      if (account.brand !== brandFilter) return false;
    }
    return true;
  });
}

export function getFilteredPayments(payments, brandFilter) {
  return payments.filter((payment) => {
    if (brandFilter !== 'All') {
      if (payment.brand !== brandFilter) return false;
    }
    return true;
  });
}

export function getFilteredFailedBets(failedBets, brandFilter) {
  return failedBets.filter((failedBet) => {
    if (brandFilter !== 'All') {
      if (failedBet.brand !== brandFilter) return false;
    }
    return true;
  });
}

function applyFilters(bet, filters, brandFilter) {
  if (filters.betType.active && filters.betType.value) {
    if (bet.type !== filters.betType.value) return false;
  }

  if (!filters.markets.active) return false;

  if (filters.markets.active) {
    if (!filters.markets.mainbook && !filters.markets.live) return false;
    if (!filters.markets.live && bet.isLive) return false;
    if (!filters.markets.mainbook && !bet.isLive) return false;
  }

  if (filters.totalStake.active) {
    if (filters.totalStake.type === 'atLeast') {
      if (bet.totalStakeP < filters.totalStake.value) return false;
    }

    if (filters.totalStake.type === 'lessThan') {
      if (bet.totalStakeP >= filters.totalStake.value) return false;
    }
  }

  if (filters.riskAmount.active) {
    if (filters.riskAmount.type === 'atLeast') {
      if (bet.winAmountP < filters.riskAmount.value) return false;
    }

    if (filters.riskAmount.type === 'lessThan') {
      if (bet.winAmountP > filters.riskAmount.value) return false;
    }
  }

  if (filters.sports.active && filters.sports.type) {
    if (filters.sports.type === 'show' && filters.sports.items[0]) {
      if (!filters.sports.items.some((item) => bet.sport === item)) return false;
    }

    if (filters.sports.type === 'exclude' && filters.sports.items[0]) {
      if (filters.sports.items.some((item) => bet.sport === item)) return false;
    }
  }

  if (brandFilter !== 'All') {
    if (bet.brand !== brandFilter) return false;
  }

  return true;
}

export const generateRiskUrl = ({rowInfo, event}) => {
  let url = `/risk-manager/${rowInfo.sportCodeLower}/e${event.id}`;
  if (event.startTime !== moment().format('MM/DD/YYYY')) {
    const dateRange = `${event.startTime} - ${moment(event.startTime).add(1, 'days').format('MM/DD/YYYY')}`;
    url = `${url}?dateFilter=${encodeURI(dateRange)}`;
  }
  return url;
}