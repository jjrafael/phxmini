import React from 'react';
import Table from './Table';
import { handicap, incompleteHandicap, plusMinusSign } from 'validations';

export default ({id, playersArray, marketPayload, market}) => {
    return <div className="market-row-players">
        {playersArray.map((players, i) => {
            return <div key={i} className="player-table">
                <Table
                    header={[{type: 'desc', value: 'Player'}, {type: 'input', value: 'Handicap'}]}
                    players={
                        players.map(player => {
                            return {
                                desc: player.description,
                                inputs: [{prop: 'handicap', allowedChars: [plusMinusSign, incompleteHandicap, handicap]}],
                                id: player.id
                            }
                        })
                    }
                    targetKey={marketPayload.targetKeys[i]}
                    siblingKey={marketPayload.targetKeys[(i === 0 ? 1 : 0)]}
                    id={id}
                    market={market}
                    playersArray={playersArray}
                />
            </div>
        })}
    </div>
}