import React from 'react';
import { Field } from 'redux-form';
import { renderSelectField } from 'eventCreatorUtils/reduxFormFieldUtils';

export default ({sportOtherOptions, sportCode}) => {
    let label = 'Best of sets: ';
    let options;
    if (sportCode === 'SNOO') {
        label = 'Best of frames: ';
    }
    if (sportOtherOptions.length <= 2) {
        options = sportOtherOptions.map(option => {
            return <span className="other-options-option" key={option}>
                <Field
                    component="input"
                    type="radio"
                    name="bestOfSets"
                    parse={(value) => {return Number(value)}}
                    value={Number(option)} />
                    {option}
            </span>
        })
    } else {
        options = <Field name="bestOfSets"component="select" type={'select'}>{
            sportOtherOptions.map(e => <option value={e}>{e}</option>)
        }</Field>
    }

    return <div className="other-options">
        <span className="other-options-label">{label}</span>
        {options}
    </div>
}