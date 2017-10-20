import React from 'react';
import VisibilityToggle from './Cells/VisibilityToggle';
import Editable from './Cells/Editable';

export default ({opponents, updateOpponent, useRaceCardNumber, isGameEvent=false}) => {
    let targetNumber = useRaceCardNumber ? 'raceCardNumber' : 'rotationNumber';
    return <div className="rt-tbody">
        {opponents.map( (opponent, index) => {
            let className = 'rt-tr -odd';
            if (index % 2 === 0) {
                className = 'rt-tr -even';
            }
            return <div key={opponents.id} className="rt-tr-group">
                <div className={className}>
                    <VisibilityToggle className="rt-td col-visibility" opponent={opponent} target='hidden' onClick={updateOpponent} />
                    <Editable className="rt-td col-numbers" opponent={opponent} target={targetNumber} onBlur={updateOpponent} disabled={!!!useRaceCardNumber}/>
                    <Editable className="rt-td col-numbers" opponent={opponent} target='lookupCode' onBlur={updateOpponent} disabled={isGameEvent}/>
                    <Editable className="rt-td col-description" opponent={opponent} target='description' onBlur={updateOpponent} disabled={isGameEvent}/>
                </div>
            </div>
        })}
    </div>
}