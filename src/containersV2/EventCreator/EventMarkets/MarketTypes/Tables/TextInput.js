import React, { Component } from 'react';
import InputHOC from '../MainInputs/InputHOC';

class PlayerInput extends Component {
    constructor (props) {
        super(props);
        this.getInitialValue = this.getInitialValue.bind(this);
    }
    componentDidMount () {
        let { setHOCState, marketPayload } = this.props;
        setHOCState(this.getInitialValue(marketPayload))
    }
    getInitialValue (marketPayload) {
        let { input, targetKey, player } = this.props;
        return {
            value: marketPayload[targetKey].find(e => e.targetId === player.id)[input.prop]
        };
    }
    render () {
        let { updateNewMarketPayload, marketPayload, targetKey, player, input, id, setHOCState, value } = this.props; 
        return (
            <input type="text"
                value={value}
                onChange={e => {
                    let value = e.target.value.trim();
                    let hasValidChars = false;
                    input.allowedChars.forEach(validation => {
                        if (!validation(value)) {
                            hasValidChars = true;
                        }
                    })
                    if (hasValidChars) {
                        setHOCState({value})
                    }
                }}
                onBlur={e => {
                    let value = e.target.value;
                    let key = input.prop;
                    let index = marketPayload[targetKey].findIndex(e => e.targetId === player.id)
                    if (index >= 0) {
                        let target = marketPayload[targetKey];
                        let data = {
                            ...marketPayload,
                            [targetKey]: [
                                ...target.slice(0, index),
                                {...target[index], [key]: value},
                                ...target.slice(index+1),
                            ]
                        }
                        updateNewMarketPayload(id, data);
                    }
                }}
            />
        );
    }
}

export default InputHOC(PlayerInput);