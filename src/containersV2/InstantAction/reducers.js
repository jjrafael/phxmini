import update from 'immutability-helper';
import constants from './constants';
import { parseBetsData, parseAccountsData, parsePaymentsData, parseFailedBetsData } from './helpers';
import { loadState } from 'localStorage';

const initialState = {
	betFilters: {
		betType: {
			active: false,
			expanded: true,
			value: null
		},
		markets: {
			active: true,
			expanded: true,
			mainbook: true,
			live: true
		},
		totalStake: {
			active: false,
			type: 'atLeast',
			value: 500
		},
		riskAmount: {
			active: false,
			type: 'atLeast',
			value: 500
		},
		sports: {
			active: false,
			expanded: true,
			type: null,
			items: []
		}
	},
	betDisplay: {
		maxRows: '',
		lowerLimit: '',
		upperLimit: '',
		fontColor: '#000000',
		backgroundColor: '#ffffff',
		items: []
	},
	brandFilter: 'All',
	lastKeys: {
		bets: null,
		accounts: null,
		payments: null,
		failedBets: null
	},
	connected: {
		bets: null,
		accounts: null,
		payments: null,
		failedBets: null
	},
	tablesData: {
		bets: null,
		payments: null,
		accounts: null,
		failedBets: null
	},
	locks: {
		bets: false,
		accounts: false,
		payments: false,
		failedBets: false
	},
	headersPreferences: {
		bets: {
			icon: true,
			date: true,
			shop: true,
			username: true,
			accountDescription: true,
			description: true,
			sport: true,
			unitStake: true,
			totalStake: true,
			winAmount: true,
			unitStakeP: true,
			totalStakeP: true,
			winAmountP: true
		},
		accounts: {
			icon: true,
			date: true,
			account: true,
			username: true,
			name: true,
			email: true,
			site: true,
			referrer: true
		},
		payments: {
			time: true,
			account: true,
			description: true,
			credit: true,
			debit: true
		},
		failedBets: {
			date: true,
			username: true,
			account: true,
			description: true,
			stake: true
		}
	},
	activeTabIndex: 0,
	showPreferencesModal: false,
	scrollTop: false,
	allSports: [],
	origins: [],
	channels: [],
	brands: []
}

const instantAction = (state = initialState, action) => {
	switch (action.type) {
		case constants.REHYDRATE_STATE: {
			const persistedState = loadState('instantAction');
			if (persistedState) {
				state = { ...state, betFilters: persistedState.betFilters };
			}
			return state;
		}

		case constants.FETCH_INITIAL_BETS_DATA_SUCCEEDED:
			const initialBets = parseBetsData(action.results.betSlipList, state.allSports, state.origins, state.channels, state.brands);
			return {
				...state,
				lastKeys: update(state.lastKeys, { bets: { $set: action.results.lastKey } }),
				tablesData: update(state.tablesData, { bets: { $set: initialBets } }),
				connected: update(state.connected, { bets: { $set: true } })
			}
		case constants.FETCH_INITIAL_BETS_DATA_FAILED:
			return {
				...state,
				connected: update(state.connected, { bets: { $set: false } })
			}

		case constants.FETCH_SUBSEQUENT_BETS_DATA_SUCCEEDED: {
			const newBets = action.results.lastKey !== state.lastKeys.bets
				? parseBetsData(action.results.betSlipList, state.allSports, state.origins, state.channels, state.brands)
				: [];
			return {
				...state,
				lastKeys: update(state.lastKeys, { bets: { $set: action.results.lastKey } }),
				connected: update(state.connected, { bets: { $set: true } }),
				tablesData: update(state.tablesData, { bets: { $push: newBets } })
			}
		}
		case constants.FETCH_SUBSEQUENT_BETS_DATA_FAILED:
			return {
				...state,
				connected: update(state.connected, { bets: { $set: false } })
			}

		case constants.FETCH_INITIAL_ACCOUNTS_DATA_SUCCEEDED:
			const initialAccounts = parseAccountsData(action.results.accountList, state.origins, state.channels, state.brands);
			return {
				...state,
				lastKeys: update(state.lastKeys, { accounts: { $set: action.results.lastKey } }),
				tablesData: update(state.tablesData, { accounts: { $set: initialAccounts } }),
				connected: update(state.connected, { accounts: { $set: true } })
			}
		case constants.FETCH_INITIAL_ACCOUNTS_DATA_FAILED:
			return {
				...state,
				connected: update(state.connected, { accounts: { $set: false } })
			}

		case constants.FETCH_SUBSEQUENT_ACCOUNTS_DATA_SUCCEEDED: {
			const newAccounts = action.results.lastKey !== state.lastKeys.bets
				? parseAccountsData(action.results.accountList, state.origins, state.channels, state.brands)
				: [];
			return {
				...state,
				lastKeys: update(state.lastKeys, { accounts: { $set: action.results.lastKey } }),
				tablesData: update(state.tablesData, { accounts: { $push: newAccounts } }),
				connected: update(state.connected, { accounts: { $set: true } })
			}
		}
		case constants.FETCH_SUBSEQUENT_ACCOUNTS_DATA_FAILED:
			return {
				...state,
				connected: update(state.connected, { accounts: { $set: false } })
			}

		case constants.FETCH_INITIAL_PAYMENTS_DATA_SUCCEEDED:
			const initialPayments = parsePaymentsData(action.results.transactionList, state.origins, state.brands);
			return {
				...state,
				lastKeys: update(state.lastKeys, { payments: { $set: action.results.lastKey } }),
				tablesData: update(state.tablesData, { payments: { $set: initialPayments } }),
				connected: update(state.connected, { payments: { $set: true } })
			}
		case constants.FETCH_INITIAL_PAYMENTS_DATA_FAILED:
			return {
				...state,
				connected: update(state.connected, { payments: { $set: false } })
			}

		case constants.FETCH_SUBSEQUENT_PAYMENTS_DATA_SUCCEEDED: {
			const newPayments = action.results.lastKey !== state.lastKeys.bets
				? parsePaymentsData(action.results.transactionList, state.origins, state.brands)
				: [];
			return {
				...state,
				lastKeys: update(state.lastKeys, { payments: { $set: action.results.lastKey } }),
				tablesData: update(state.tablesData, { payments: { $push: newPayments } }),
				connected: update(state.connected, { payments: { $set: true } })
			}
		}
		case constants.FETCH_SUBSEQUENT_PAYMENTS_DATA_FAILED:
			return {
				...state,
				connected: update(state.connected, { payments: { $set: false } })
			}

		case constants.FETCH_INITIAL_FAILEDBETS_DATA_SUCCEEDED:
			const initialFailedBets = parseFailedBetsData(action.results.transactionList, state.origins, state.brands);
			return {
				...state,
				lastKeys: update(state.lastKeys, { failedBets: { $set: action.results.lastKey } }),
				tablesData: update(state.tablesData, { failedBets: { $set: initialFailedBets } }),
				connected: update(state.connected, { failedBets: { $set: true } })
			}
		case constants.FETCH_INITIAL_FAILEDBETS_DATA_FAILED:
			return {
				...state,
				connected: update(state.connected, { failedBets: { $set: false } })
			}

		case constants.FETCH_SUBSEQUENT_FAILEDBETS_DATA_SUCCEEDED: {
			const newFailedBets = action.results.lastKey !== state.lastKeys.bets
				? parseFailedBetsData(action.results.transactionList, state.origins, state.brands)
				: [];
			return {
				...state,
				lastKeys: update(state.lastKeys, { failedBets: { $set: action.results.lastKey } }),
				tablesData: update(state.tablesData, { failedBets: { $push: newFailedBets } }),
				connected: update(state.connected, { failedBets: { $set: true } })
			}
		}
		case constants.FETCH_SUBSEQUENT_FAILEDBETS_DATA_FAILED:
			return {
				...state,
				connected: update(state.connected, { failedBets: { $set: false } })
			}

		case constants.ADD_SPORT:
			return {
				...state,
				betFilters: update(state.betFilters, { sports: { items: { $push: [action.name] } } })
			}
		case constants.REMOVE_SPORT:
			const removeIndex = state.betFilters.sports.items.indexOf(action.name);
			return {
				...state,
				betFilters: update(state.betFilters, { sports: { items: { $splice: [[removeIndex, 1]] } } })
			}

		case constants.CHANGE_BET_TYPE:
			return {
				...state,
				betFilters: update(state.betFilters, { betType: { value: { $set: action.value } } })
			}

		case constants.TOGGLE_EXPAND:
			return {
				...state,
				betFilters: update(state.betFilters, { [action.name]: { expanded: { $set: !state.betFilters[action.name].expanded } } })
			}

		case constants.TOGGLE_ACTIVE:
			return {
				...state,
				betFilters: update(state.betFilters, { [action.name]: { active: { $set: !state.betFilters[action.name].active } } })
			}

		case constants.TOGGLE_MARKETS_TYPE:
			return {
				...state,
				betFilters: update(state.betFilters, { markets: { [action.name]: { $set: !state.betFilters.markets[action.name] } } })
			}

		case constants.CHANGE_TOTAL_STAKE_TYPE:
			return {
				...state,
				betFilters: update(state.betFilters, { totalStake: { type: { $set: action.value } } })
			}

		case constants.CHANGE_TOTAL_STAKE_VALUE:
			return {
				...state,
				betFilters: update(state.betFilters, { totalStake: { value: { $set: action.value } } })
			}

		case constants.CHANGE_RISK_AMOUNT_TYPE:
			return {
				...state,
				betFilters: update(state.betFilters, { riskAmount: { type: { $set: action.value } } })
			}

		case constants.CHANGE_RISK_AMOUNT_VALUE:
			return {
				...state,
				betFilters: update(state.betFilters, { riskAmount: { value: { $set: action.value } } })
			}

		case constants.CHANGE_SPORTS_TYPE:
			return {
				...state,
				betFilters: update(state.betFilters, { sports: { type: { $set: action.value } } })
			}

		case constants.CHANGE_MAX_ROWS:
			return {
				...state,
				betDisplay: update(state.betDisplay, { maxRows: { $set: action.value } })
			}

		case constants.CHANGE_ACTIVE_TAB_INDEX:
			return {
				...state,
				activeTabIndex: action.index
			}

		case constants.CHANGE_LOWER_LIMIT:
			return {
				...state,
				betDisplay: update(state.betDisplay, { lowerLimit: { $set: action.value } })
			}
		case constants.CHANGE_UPPER_LIMIT:
			return {
				...state,
				betDisplay: update(state.betDisplay, { upperLimit: { $set: action.value } })
			}
		case constants.CHANGE_FONT_COLOR:
			return {
				...state,
				betDisplay: update(state.betDisplay, { fontColor: { $set: action.value } })
			}
		case constants.CHANGE_BACKGROUND_COLOR:
			return {
				...state,
				betDisplay: update(state.betDisplay, { backgroundColor: { $set: action.value } })
			}
		case constants.ADD_FORMATTER_ITEM:
			return {
				...state,
				betDisplay: update(state.betDisplay, {
					lowerLimit: { $set: '' },
					upperLimit: { $set: '' },
					fontColor: { $set: '#000000' },
					backgroundColor: { $set: '#ffffff' },
					items: { $push: [action.item] }
				})
			}
		case constants.REMOVE_FORMATTER_ITEM:
			const newItems = state.betDisplay.items.filter((item) => item.id !== action.id);
			return {
				...state,
				betDisplay: update(state.betDisplay, { items: { $set: newItems } })
			}

		case constants.LOCK_TABLE:
			return {
				...state,
				locks: update(state.locks, { [action.table]: { $set: true } }),
				scrollTop: false
			}
		case constants.UNLOCK_TABLE:
			return {
				...state,
				locks: update(state.locks, { [action.table]: { $set: false } }),
				scrollTop: true
			}

		case constants.SHOW_PREFERENCES_MODAL:
			return {
				...state,
				showPreferencesModal: true
			}
		case constants.HIDE_PREFERENCES_MODAL:
			return {
				...state,
				showPreferencesModal: false
			}

		case constants.SET_HEADER_PREFERENCE:
			return {
				...state,
				headersPreferences: update(state.headersPreferences, { [action.table]: { [action.header]: { $set: action.value } } }),
			}

		case constants.SAVE_CONSTANTS_TO_STORE:
			return {
				...state,
				allSports: update(state.allSports, { $push: action.sports }),
				origins: update(state.origins, { $push: action.origins }),
				channels: update(state.channels, { $push: action.channels }),
				brands: update(state.brands, { $push: action.brands })
			}

		case constants.CHANGE_BRAND_VALUE:
			return {
				...state,
				brandFilter: action.value,
			}

		case constants.REMOVE_SCROLL_TOP:
			return {
				...state,
				scrollTop: false,
			}

		default:
			return { ...state }
	}
}

export default instantAction;