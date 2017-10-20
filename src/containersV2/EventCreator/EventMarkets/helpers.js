import { positiveInteger, floatNumber, plusMinusSign } from 'validations';

const getCommonPayload = (market) => {
    return {
        marketTypeId: market.marketType.id,
        periodId: market.periodId,
        opponentId: market.opponentId,
        instanceNumber: market.instanceNumber
    };
}

export const getInitialMarketTypePayload = (market, playersArray) => {
    let commonPayload = getCommonPayload(market);
    switch (market.marketType.factoryFields) {
        case 'NONE': {
            return {
                ...commonPayload,
                inputs: [],
                checked: false
            };
        }
        case 'SINGLE_INTEGER':
            return {
                ...commonPayload,
                int1: '',
                inputs: [{targetKey: 'int1'}],
                allowedChars: [positiveInteger],
                checked: false
            }
        case 'SINGLE_FLOAT':
            return {
                ...commonPayload,
                float1: '',
                inputs: [{targetKey: 'float1'}],
                allowedChars: [plusMinusSign, floatNumber],
                checked: false
            }
        case 'TWO_FLOATS':
            return {
                ...commonPayload,
                float1: '',
                float2: '',
                inputs: [{targetKey: 'float1'}, {targetKey: 'float2'}],
                allowedChars: [plusMinusSign, floatNumber],
                checked: false
            }
        case 'THREE_FLOATS':
            return {
                ...commonPayload,
                float1: '',
                float2: '',
                float3: '',
                inputs: [{targetKey: 'float1'}, {targetKey: 'float2'}, {targetKey: 'float3'}],
                allowedChars: [plusMinusSign, floatNumber],
                checked: false
            }
        case 'MULTI_RANGE_STRING':
            return {
                ...commonPayload,
                multiRangeStr: '',
                inputs: [{targetKey: 'multiRangeStr'}],
                checked: false
            }
        case 'SCORES_DYNAMIC':
            return {
                ...commonPayload,
                maxScore1: '',
                maxScoreDraw: '',
                maxScore2: '',
                otherOutcomeType: 'NONE',
                inputs: [{targetKey: 'maxScore1'}, {targetKey: 'maxScoreDraw'}, {targetKey: 'maxScore2'}],
                selectInput: true,
                allowedChars: [positiveInteger],
                checked: false
            }
        case 'SCORES_DYNAMIC_PLAYERS12':
            return {
                ...commonPayload,
                maxScore1: '',
                maxScoreDraw: '',
                maxScore2: '',
                otherOutcomeType: 'NONE',
                inputs: [{targetKey: 'maxScore1'}, {targetKey: 'maxScoreDraw'}, {targetKey: 'maxScore2'}],
                selectInput: true,
                players1: playersArray[0].map(player => {
                    return {id: player.id, description: player.description, checked: false, targetId: player.id}
                }),
                players2: playersArray[1].map(player => {
                    return {id: player.id, description: player.description, checked: false, targetId: player.id}
                }),
                allowedChars: [positiveInteger],
                checked: false,
                targetKeys: ['players1', 'players2'],
                minSelection: 2,
                maxSelection: 2,
                defaultError: 'Please choose 2 players.',
                error: 'Please choose 2 players.'
            }
        case 'PLAYERS':
            return {
                ...commonPayload,
                players1: playersArray[0].map(player => {
                    return {id: player.id, description: player.description, checked: false, targetId: player.id}
                }),
                checked: false,
                targetKeys: ['players1'],
                minSelection: 0,
                maxSelection: Infinity,
            }
        case 'PLAYERS12':
            return {
                ...commonPayload,
                players1: playersArray[0].map(player => {
                    return {id: player.id, description: player.description, checked: false, targetId: player.id}
                }),
                players2: playersArray[1].map(player => {
                    return {id: player.id, description: player.description, checked: false, targetId: player.id}
                }),
                checked: false,
                targetKeys: ['players1', 'players2'],
                minSelection: 2,
                maxSelection: 2,
                defaultError: 'Please choose 2 players.',
                error: 'Please choose 2 players.'
            }
        case 'STRING_PLAYERS':
            return {
                ...commonPayload,
                str: '',
                inputs: [{targetKey: 'str'}],
                players1: playersArray[0].map(player => {
                    return {id: player.id, description: player.description, checked: false, targetId: player.id}
                }),
                checked: false,
                targetKeys: ['players1'],
                minSelection: 0,
                maxSelection: Infinity,
            }
        case 'PLAYER_HANDICAPS12':
            return {
                ...commonPayload,
                playerHandicapList1: playersArray[0].map(player => {
                    return {playerId: player.id, playerDesc: player.description, handicap: '', checked: false, targetId: player.id}
                }),
                playerHandicapList2: playersArray[1].map(player => {
                    return {playerId: player.id, playerDesc: player.description, handicap: '', checked: false, targetId: player.id}
                }),
                checked: false,
                targetKeys: ['playerHandicapList1', 'playerHandicapList2'],
                minSelection: 2,
                maxSelection: 2,
                defaultError: 'Please choose 2 players.',
                error: 'Please choose 2 players.'
            }
        case 'PLAYER_VALUES':
            return {
                ...commonPayload,
                playerValuesList1: playersArray[0].map(player => {
                    return {playerId: player.id, playerDesc: player.description, value1: '', value2: '', checked: false, targetId: player.id}
                }),
                checked: false,
                targetKeys: ['playerValuesList1'],
                minSelection: 0,
                maxSelection: Infinity,
            }
        case 'PLAYER_VALUES12':
            return {
                ...commonPayload,
                playerValuesList1: playersArray[0].map(player => {
                    return {playerId: player.id, playerDesc: player.description, value1: '', value2: '', checked: false, targetId: player.id}
                }),
                playerValuesList2: playersArray[1].map(player => {
                    return {playerId: player.id, playerDesc: player.description, value1: '', value2: '', checked: false, targetId: player.id}
                }),
                checked: false,
                targetKeys: ['playerValuesList1', 'playerValuesList2'],
                minSelection: 2,
                maxSelection: 2,
                defaultError: 'Please choose 2 players.',
                error: 'Please choose 2 players.'
            }
    }
}

export const flattenMarkets = (markets, result) => {
    markets.map(market => {
        let id = market.id.toString();
        result.push({
            desc: market.description,
            key: `m${id}`,
            period: market.periodDesc,
            id: id,
            rawDesc: market.rawDesc
        })
        if (market.childMarkets && market.childMarkets.length) {
            result = flattenMarkets(market.childMarkets, result);
        }
    })
    return result;
}