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
                    id={id}
                    market={market}
                    playersArray={playersArray}
                />
            </div>
        })}
    </div>
}