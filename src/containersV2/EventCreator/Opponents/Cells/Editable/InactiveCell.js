import React, { Component } from 'react';

export default ({opponent, target}) =>  {
	let tgt = (target === "rotationNumber" && opponent[target] < 1) ?  '' : opponent[target];
    let content = opponent[target] !== undefined ? tgt : <span>&nbsp;</span>;
    return (
        <div className="rank-opponent-inactive">{content}</div>
    );
}