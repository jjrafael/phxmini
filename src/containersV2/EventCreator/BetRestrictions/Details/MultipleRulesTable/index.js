import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { createSelector } from 'reselect';
import RulesDropdown from '../RulesDropdown';
import { updateCellData } from '../../actions';
import { generateNewFlagsOnRules } from '../../helpers';

const activeBetTypeKeySelector = state => state.betRestrictions.activeBetTypeKey;
const matrixDataCacheSelector = state => state.betRestrictions.matrixDataCache;
const cellDataSelector = createSelector(
    activeBetTypeKeySelector,
    matrixDataCacheSelector,
    (activeBetTypeKey, matrixDataCache) => {
        let cache = matrixDataCache[activeBetTypeKey];
        if (cache) {
            return cache.cellData;
        } else {
            return {};
        }
    }
);
const mapStateToProps = (state) => {
    return {
        tags: state.apiConstants.values.tags,
        cellData: cellDataSelector(state),
    };
};

const mapDispatchToProps = (dispatch) => {
    return bindActionCreators({
        updateCellData
    }, dispatch);
};

class MultipleRulesTable extends Component {
    render () {
        let { tags, rules, updateCellData, cellData, isCellEditingDisabled } = this.props;
        rules.sort((a,b) => a.tagId - b.tagId)
        return (
            <div className="rt-tbody">
                {rules.map((rule, index) => {
                    let tag = tags.find(tag => tag.id === rule.tagId);
                    let tagName = tag ? tag.description : 'Event';
                    let isRuleSetEnabled = rule.sameFlag !== 'NOT_APPLICABLE';
                    return <div className="rt-tr-group">
                        <div className="rt-tr">
                            <div className="rt-td col-path">
                                <input
                                    type="checkbox"
                                    id={`rule-${rule.tagId}`}
                                    checked={!!isRuleSetEnabled}
                                    value={rule.tagId}
                                    disabled={isCellEditingDisabled}
                                    onChange={e => {
                                        if (isCellEditingDisabled) { return false; }
                                        let isChecked = e.target.checked;
                                        let value = 'NOT_APPLICABLE';
                                        if (isChecked) {
                                            value = 'REJECT';
                                        }
                                        let rules = generateNewFlagsOnRules({
                                            rules: cellData.rules,
                                            props: ['otherFlag', 'sameFlag'],
                                            index,
                                            value,
                                        })
                                        updateCellData({rules})
                                    }}
                                />
                                <label htmlFor={`rule-${rule.tagId}`}>{tagName}</label>
                            </div>
                            <div className="rt-td col-rule">
                                <RulesDropdown
                                    value={rule.sameFlag}
                                    disabled={isCellEditingDisabled || !isRuleSetEnabled}
                                    hasEmpty={!isRuleSetEnabled}
                                    onChange={e => {
                                        if (isCellEditingDisabled) { return false; }
                                        let value = e.target.value;
                                        let rules = generateNewFlagsOnRules({
                                            rules: cellData.rules,
                                            props: ['sameFlag'],
                                            index,
                                            value,
                                        })
                                        updateCellData({rules})
                                    }}
                                />
                            </div>
                            <div className="rt-td col-rule">
                                <RulesDropdown
                                    value={rule.otherFlag}
                                    disabled={isCellEditingDisabled || !isRuleSetEnabled}
                                    hasEmpty={!isRuleSetEnabled}
                                    onChange={e => {
                                        if (isCellEditingDisabled) { return false; }
                                        let value = e.target.value;
                                        let rules = generateNewFlagsOnRules({
                                            rules: cellData.rules,
                                            props: ['otherFlag'],
                                            index,
                                            value,
                                        })
                                        updateCellData({rules})
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                })}
            </div>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(MultipleRulesTable);