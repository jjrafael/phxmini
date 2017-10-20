import React from 'react';

const RulesDropdown = ({value, disabled, onChange, hasEmpty}) => {
    return <select value={value} disabled={disabled} onChange={onChange}>
        {hasEmpty && <option value="NOT_APPLICABLE">--</option>}
        <option value="NO_RULE">No Rule</option>
        <option value="ALLOW">Allow</option>
        <option value="REFER">Refer</option>
        <option value="REJECT">Reject</option>
    </select>
}

export default RulesDropdown;