import React from 'react';
import Table from './Table';
import { floatNumber, plusMinusSign } from 'validations';

export default ({id, playersArray, marketPayload, market}) => {
    return <div className="market-row-players">
        {playersArray.map((players, i) => {
            return <div key={i} className="player-table">
                <Table
                    header={[{type: 'desc', value: 'Player'}, {type: 'input', value: 'Value 1'}, {type: 'input', value: 'Value 2'}]}
                    players={
                        players.map(player => {
                            return {
                                desc: player.description,
                                inputs: [
                                    {prop: 'value1', allowedChars: [plusMinusSign, floatNumber]},
                                    {prop: 'value2', allowedChars: [plusMinusSign, floatNumber]}
                                ],
                                id: player.id
                            }
                        })
                    }
                    targetKey={marketPayload.targetKeys[i]}
                    id={id}
                    market={market}
                    playersArray={playersArray}
                />
            </div>
        })}
    </div>
}