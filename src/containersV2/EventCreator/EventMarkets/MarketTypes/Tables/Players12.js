import React from 'react';
import Table from './Table';

export default ({id, playersArray, marketPayload, market}) => {
    return <div className="market-row-players">
        {playersArray.map((players, i) => {
            return <div key={i} className="player-table">
                <Table
                    header={[{type: 'desc', value: 'Player'}]}
                    players={
                        players.map(player => {
                            return {desc: player.description, inputs: [], id: player.id}
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