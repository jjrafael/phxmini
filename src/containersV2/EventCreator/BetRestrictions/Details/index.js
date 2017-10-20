import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import utilitiesConstants from 'containersV2/Utilities/App/constants';
import RulesDropdown from './RulesDropdown';
import MinMaxDropdown from './MinMaxDropdown';
import MultipleRulesTable from './MultipleRulesTable/index';
import { createSelector } from 'reselect';
import { updateCellData } from '../actions';
import { generateNewMinMaxOnRules } from '../helpers';
import { COMMON_RULE_PROPS } from '../constants';

const activeBetTypeKeySelector = state => state.betRestrictions.activeBetTypeKey;
const matrixDataCacheSelector = state => state.betRestrictions.matrixDataCache;
const cellDataAndMultipleRulesMapSelector = createSelector(
    activeBetTypeKeySelector,
    matrixDataCacheSelector,
    (activeBetTypeKey, matrixDataCache) => {
        if (matrixDataCache[activeBetTypeKey]) {
            let cache = matrixDataCache[activeBetTypeKey];
            return {cellData: cache.cellData, multipleRulesMap: cache.multipleRulesMap};
        } else {
            return {cellData: {}, multipleRulesMap: {}}
        }
    }
);
const mapStateToProps = (state) => {
    let {cellData, multipleRulesMap} = cellDataAndMultipleRulesMapSelector(state);
    const pathsMap = state.sportsTree.pathsMap;
    const activePathId = state.sportsTree.activePathId;
    return {
        activeAppId: state.apps.activeAppId,
        activeCell: state.betRestrictions.activeCell,
        activeBetType: state.betRestrictions.activeBetType,
        lastSelectionValues: state.betRestrictions.lastSelectionValues,
        tags: state.apiConstants.values.tags,
        cellData,
        multipleRulesMap,
        activePath: pathsMap[activePathId] || {}
    };
};

const mapDispatchToProps = (dispatch) => {
    return bindActionCreators({
        updateCellData
    }, dispatch);
};


class Details extends Component {
    render () {
        let { activeAppId, activeCell, activeBetType, activePath, cellData, multipleRulesMap, updateCellData, tags, lastSelectionValues } = this.props;
        let hasActiveCell = activeCell.key ? true : false;
        let isSelectOutcome = activeBetType && activeBetType.betRestrictionTypeId === 1;
        let oneRuleValue = 'NO_RULE';
        let isOneRuleChecked = false;
        let isMultipleRulesChecked = false;
        let isMinMaxDropdownsDisabled = true;
        let isCellEditingDisabled = true;
        let minDropdownValue = lastSelectionValues.min;
        let maxDropdownValue = lastSelectionValues.max;
        if (cellData.rules && cellData.rules[0]) {
            oneRuleValue = cellData.rules[0].sameFlag;
        }
        if (activeAppId === utilitiesConstants.APPLICATION_ID) {
            isCellEditingDisabled = false; // Bet Restriction in Utilities should be able to edit all
        } else {
            if (cellData.criterias && cellData.criterias[0]) {
                isCellEditingDisabled = cellData.criterias[0].eventPath !== activePath.path;
            }
        }
        if (isSelectOutcome || (cellData.rules && cellData.rules.length <= 1)) {
            isOneRuleChecked = true;
            if (cellData.rules && cellData.rules[0]) {
                minDropdownValue = cellData.rules[0].minSelectionCount;
                maxDropdownValue = cellData.rules[0].maxSelectionCount;
            }
        }
        if (!isSelectOutcome && cellData.rules && cellData.rules.length > 1) {
            isMultipleRulesChecked = true;
            isMinMaxDropdownsDisabled = false;
        }
        if (hasActiveCell && isOneRuleChecked) {
            if (['REFER', 'ALLOW'].includes(oneRuleValue)) {
                isMinMaxDropdownsDisabled = false;
            }
        }
        if (isMultipleRulesChecked) {
            if (cellData.rules && cellData.rules[0]) {
                minDropdownValue = cellData.rules[0].minSelectionCount;
                maxDropdownValue = cellData.rules[0].maxSelectionCount;
            }
        }
        return (
            <div className="bet-details">
                <div className="form-wrapper wrapper-selections">
                    <div className="header panel-header">
                        <div className="panel-header-title">Number of selections</div>
                    </div>
                    <div className="panel-content content-selections">
                        <div>
                            <label>Minimum:</label>
                            <MinMaxDropdown
                                value={minDropdownValue}
                                disabled={isCellEditingDisabled || isMinMaxDropdownsDisabled}
                                onChange={e => {
                                    if (isCellEditingDisabled) { return false }
                                    let value = Number(e.target.value);
                                    let rules = generateNewMinMaxOnRules({
                                        key: 'minSelectionCount',
                                        isMultipleRulesChecked,
                                        cellData,
                                        value,
                                    })
                                    updateCellData({rules})
                                }}
                            />
                        </div>
                        <div>
                            <label>Maximum:</label>
                            <MinMaxDropdown
                                value={maxDropdownValue}
                                disabled={isCellEditingDisabled || isMinMaxDropdownsDisabled}
                                onChange={e => {
                                    if (isCellEditingDisabled) { return false }
                                    let value = Number(e.target.value);
                                    let rules = generateNewMinMaxOnRules({
                                        key: 'maxSelectionCount',
                                        isMultipleRulesChecked,
                                        cellData,
                                        value,
                                    })
                                    updateCellData({rules})
                                }}
                            />
                        </div>
                    </div>
                </div>
                <div className="form-wrapper wrapper-rule">
                    <div className="header panel-header">
                        <div className="panel-header-title">Apply the following Rule:</div>
                    </div>
                    <div className="panel-content content-rule">
                        <div className="group group-one-rule">
                            <input type="radio"
                                checked={isOneRuleChecked}
                                disabled={isCellEditingDisabled || !hasActiveCell}
                                name="rule-count"
                                id="rule-count-single"
                                value="single"
                                onChange={e => {
                                    if (isCellEditingDisabled) { return false; }
                                    let isChecked = e.target.checked;
                                    let value = 'REJECT';
                                    let rules = [...cellData.rules];
                                    if (isChecked) {
                                        rules = [{...COMMON_RULE_PROPS,
                                            maxSelectionCount: cellData.rules[0] ? cellData.rules[0].maxSelectionCount : lastSelectionValues.max,
                                            minSelectionCount: cellData.rules[0] ? cellData.rules[0].minSelectionCount : lastSelectionValues.min,
                                            otherFlag: value,
                                            sameFlag: value,
                                            tagId: -1,
                                        }]
                                    }
                                    updateCellData({rules})
                                }}
                            />
                            <label htmlFor="rule-count-single">One rule: </label>
                            <RulesDropdown
                                value={oneRuleValue}
                                disabled={isCellEditingDisabled || !hasActiveCell || isMultipleRulesChecked}
                                onChange={e => {
                                    if (isCellEditingDisabled) { return false; }
                                    let value = e.target.value;
                                    let rules = [];
                                    if (value !== 'NO_RULE') {
                                        rules = [{...COMMON_RULE_PROPS,
                                            maxSelectionCount: cellData.rules[0] ? cellData.rules[0].maxSelectionCount : lastSelectionValues.max,
                                            minSelectionCount: cellData.rules[0] ? cellData.rules[0].minSelectionCount : lastSelectionValues.min,
                                            otherFlag: value,
                                            sameFlag: value,
                                            tagId: -1,
                                        }]
                                    }
                                    updateCellData({rules})
                                }}
                            />
                        </div>
                        <div className="group group-multiple-rule">
                            <input type="radio"
                                checked={isMultipleRulesChecked}
                                disabled={isCellEditingDisabled || !hasActiveCell || isSelectOutcome}
                                name="rule-count"
                                id="rule-count-multiple"
                                value="multiple"
                                onChange={() => {
                                    if (isCellEditingDisabled) { return false; }
                                    let rules = multipleRulesMap[activeCell.key];
                                    let maxSelectionCount = cellData.rules[0] ? cellData.rules[0].maxSelectionCount : 2;
                                    let minSelectionCount = cellData.rules[0] ? cellData.rules[0].minSelectionCount : 2;
                                    if (!rules) {
                                        rules = [
                                            { ...COMMON_RULE_PROPS, maxSelectionCount, minSelectionCount },
                                            ...tags.map(tag => {
                                                return {...COMMON_RULE_PROPS,
                                                    otherFlag: 'NOT_APPLICABLE',
                                                    sameFlag: 'NOT_APPLICABLE',
                                                    tagId: tag.id,
                                                    maxSelectionCount,
                                                    minSelectionCount
                                                }}
                                            )
                                        ]
                                    }
                                    updateCellData({rules})
                                }}
                            />
                            <label htmlFor="rule-count-multiple">Multiple rules: </label>
                        </div>
                        <div className="inner">
                            <div className="custom-table">
                                <div className="rt-thead -header">
                                    <div className="rt-tr">
                                        <div className="rt-th col-path">&nbsp;</div>
                                        <div className="rt-th col-rule">If the same</div>
                                        <div className="rt-th col-rule">If different</div>
                                    </div>
                                </div>
                                {isMultipleRulesChecked &&
                                    <MultipleRulesTable
                                        rules={cellData.rules}
                                        isCellEditingDisabled={isCellEditingDisabled}
                                    />
                                }
                                
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Details);