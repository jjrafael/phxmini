import React from 'react';
import SelectInput from './SelectInput';
import TextInput from './TextInput';

export default ({id, market, playersArray, inputs, selectInput}) => {
    return (
        <div className="market-main-inputs">
            {inputs.map((input, i) => {
                return <div className="input-container">
                    <TextInput id={id} targetKey={input.targetKey} market={market} playersArray={playersArray}/>
                </div>
            })}
            {selectInput &&
                <SelectInput id={id} targetKey='otherOutcomeType' market={market} playersArray={playersArray}/>
            }
        </div>
    );
}
