import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { updateNewMarketPayload } from '../../actions';

const mapDispatchToProps = (dispatch, ownProps) => {
    return bindActionCreators({updateNewMarketPayload}, dispatch);
};

const CheckBox = ({id, checkboxId, player, targetKey, siblingKey, marketPayload, updateNewMarketPayload}) => {
    let maxSelection = marketPayload.maxSelection;
    let minSelection = marketPayload.minSelection;
    let currentSelections = marketPayload[targetKey].filter(e => e.checked);
    let siblings = siblingKey ? marketPayload[siblingKey] : [];
    let siblingSelections = siblings.filter(e => e.checked);
    let checked = marketPayload[targetKey].find(e => e.targetId === player.id).checked;
    let disabled = false;
    if (currentSelections.length + siblingSelections.length >= maxSelection) {
        disabled = !checked;
    }
    return <input type="checkbox"
        id={checkboxId}
        checked={checked}
        disabled={disabled}
        onChange={e => {
            let checked = e.target.checked;
            let index = marketPayload[targetKey].findIndex(e => e.targetId === player.id)
            if (index >= 0) {
                let target = marketPayload[targetKey];
                let data = {
                    ...marketPayload,
                    [targetKey]: [
                        ...target.slice(0, index),
                        {...target[index], checked},
                        ...target.slice(index+1),
                    ]
                }
                if (checked) { // auto check market type
                    data = {...data, checked};
                }
                let currentSelections = data[targetKey].filter(e => e.checked);
                if (currentSelections.length + siblingSelections.length >= minSelection) {
                    data = {...data, error: ''};
                } else {
                    data = {...data, error: data.defaultError};
                }
                updateNewMarketPayload(id, data);
            }
        }}
    />
}

export default connect(null, mapDispatchToProps)(CheckBox);