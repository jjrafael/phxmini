import React from 'react';
import VisibilityToggle from './Cells/VisibilityToggle';

export default ({updatedOpponents, updateAllOpponentsVisibility, useRaceCardNumber}) => {
    let targetNumberHeader = useRaceCardNumber ? 'Race Card Number' : 'Rotation Number';
    return <div className="rt-thead -header">
        <div className="rt-tr">
            <VisibilityToggle className="rt-th col-visibility"
                opponent={(e => {
                    return { hidden: updatedOpponents.filter(opponent => opponent.hidden).length === updatedOpponents.length ? true : false }
                })()}
                onClick={updateAllOpponentsVisibility}
            />
            <div className="rt-th col-numbers">{targetNumberHeader}</div>
            <div className="rt-th col-numbers">Lookup Code</div>
            <div className="rt-th col-description">Description</div>
        </div>
    </div>
}


