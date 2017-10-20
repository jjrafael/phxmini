import React from 'react';

const rules = [
    {key: 'allIn', value: 'All in or not'},
    {key: 'nonRunner', value: 'Non-runner no bet'},
    {key: 'dayEvent', value: 'Day of event'},
];

export default ({onChange, ruleKey, name}) => {
    return <div className="form-group clearfix">
        <label className="form-group-label book-rules-label">Rules</label>
        <div  className="book-rules-container">
                { rules.map(rule => {
                    let desc = rule.value;
                    let id = `${name}-rule-${desc}`;
                    let isChecked = rule.key === ruleKey;
                    return <div>
                        <input
                            type="radio"
                            name={name}
                            id={id}
                            value={rule.key}
                            checked={isChecked}
                            onChange={onChange}
                        />
                        <label htmlFor={id}>{desc}</label>
                    </div>
                }) }
        </div>
    </div>
}