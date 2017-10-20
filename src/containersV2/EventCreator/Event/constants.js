const constants = {
    'FETCH_EVENT' : 'EC::FETCH_EVENT',
    'FETCH_EVENT_SUCCEEDED' : 'EC::FETCH_EVENT_SUCCEEDED',
    'FETCH_EVENT_FAILED' : 'EC::FETCH_EVENT_FAILED',

    'DELETE_EVENT' : 'EC::DELETE_EVENT',
    'DELETE_EVENT_SUCCEEDED' : 'EC::DELETE_EVENT_SUCCEEDED',
    'DELETE_EVENT_FAILED' : 'EC::DELETE_EVENT_FAILED',

    'DELETE_EVENTS': 'EC::DELETE_EVENTS',

    'CREATE_EVENT' : 'EC::CREATE_EVENT',
    'CREATE_EVENT_SUCCEEDED' : 'EC::CREATE_EVENT_SUCCEEDED',
    'CREATE_EVENT_FAILED' : 'EC::CREATE_EVENT_FAILED',

    'UPDATE_EVENT' : 'EC::UPDATE_EVENT',
    'UPDATE_EVENT_SUCCEEDED' : 'EC::UPDATE_EVENT_SUCCEEDED',
    'UPDATE_EVENT_FAILED' : 'EC::UPDATE_EVENT_FAILED',

    'FETCH_EVENT_OPPONENTS' : 'EC::FETCH_EVENT_OPPONENTS',
    'FETCH_EVENT_OPPONENTS_SUCCEEDED' : 'EC::FETCH_EVENT_OPPONENTS_SUCCEEDED',
    'FETCH_EVENT_OPPONENTS_FAILED' : 'EC::FETCH_EVENT_OPPONENTS_FAILED',

    'FETCH_EVENT_DEFAULT_MARKET': 'FETCH_EVENT_DEFAULT_MARKET',
    'FETCH_EVENT_DEFAULT_MARKET_SUCCEEDED' : 'FETCH_EVENT_DEFAULT_MARKET_SUCCEEDED',
    'FETCH_EVENT_DEFAULT_MARKET_FAILED' : 'FETCH_EVENT_DEFAULT_MARKET_FAILED',

    'FETCH_EVENT_SELECTED_OPPONENTS': 'FETCH_EVENT_SELECTED_OPPONENTS',
    'FETCH_EVENT_SELECTED_OPPONENTS_SUCCEEDED' : 'FETCH_EVENT_SELECTED_OPPONENTS_SUCCEEDED',
    'FETCH_EVENT_SELECTED_OPPONENTS_FAILED' : 'FETCH_EVENT_SELECTED_OPPONENTS_FAILED',

    'SET_NEW_SELECTED_OPPONENTS' : 'SET_NEW_SELECTED_OPPONENTS',
    'CLEAR_NEW_SELECTED_OPPONENTS' : 'CLEAR_NEW_SELECTED_OPPONENTS',

    'FETCH_PLAYERS_OF_OPPONENTA' : 'EC::FETCH_PLAYERS_OF_OPPONENTA',
    'FETCH_PLAYERS_OF_OPPONENTA_SUCCEEDED' : 'EC::FETCH_PLAYERS_OF_OPPONENTA_SUCCEEDED',
    'FETCH_PLAYERS_OF_OPPONENTA_FAILED' : 'EC::FETCH_PLAYERS_OF_OPPONENTA_FAILED',

    'FETCH_PLAYERS_OF_OPPONENTB' : 'EC::FETCH_PLAYERS_OF_OPPONENTB`',
    'FETCH_PLAYERS_OF_OPPONENTB_SUCCEEDED' : 'EC::FETCH_PLAYERS_OF_OPPONENTB_SUCCEEDED',
    'FETCH_PLAYERS_OF_OPPONENTB_FAILED' : 'EC::FETCH_PLAYERS_OF_OPPONENTB_FAILED',

    'CLEAR_PLAYERS_OF_OPPONENTS_A_B' : 'CLEAR_PLAYERS_OF_OPPONENTS_A_B',
}

export const validRankEventProps = [
    'description',
    'sportCode',
    'type',
    'opponentAId',
    'opponentBId',
    'opponentARotationNumber',
    'opponentBRotationNumber',
    'startDateTime',
    'defaultAutoOpenTime',
    'countryId',
    'inRunningDelay',
    'groupNumber',
    'originalStartDateTime',
    'eventInformation',
    'autoSettle',
    'print',
    'calendarEvent',
    'americanFormat',
    'neutralGround',
    'ignoreFeed',
    'ignoreFeedLiveBook',
    'teaserBetsAllowed',
    'tieBreak',
    'eventTemplateId',
    'updateOutcomes',
    'rankEventDefaultMarketType',
    'outcomes',
    'handicapped',
    'forecast',
    'tricast',
    'bestOddsGuarantee',
    'feedCode'
];

export const validGameEventProps = [
    'description',
    'sportCode',
    'type',
    'opponentAId',
    'opponentBId',
    'opponentARotationNumber',
    'opponentBRotationNumber',
    'startDateTime',
    'defaultAutoOpenTime',
    'countryId',
    'inRunningDelay',
    'groupNumber',
    'originalStartDateTime',
    'eventInformation',
    'autoSettle',
    'print',
    'calendarEvent',
    'americanFormat',
    'neutralGround',
    'eventTemplateId',
    'bestOfSets',
    'ignoreFeed',
    'ignoreFeedLiveBook',
    'feedCode',
];

export const validOutcomeProps = [
    'id',
    'opponentId',
    'description',
    'lookupCode',
    'raceCardNumber',
    'rotationNumber',
    'marketId',
    'retailIndex',
    'ordinalPosition',
    'hiddenFlags',
];

export default constants;
