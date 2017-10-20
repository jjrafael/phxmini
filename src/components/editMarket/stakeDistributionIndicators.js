import React, { PropTypes } from "react";
import SelectBox from '../selectBox';

export default class StakeDistributionIndicators extends React.Component {
    constructor(props) {
        super(props);
        this._handleRowChange = this._handleRowChange.bind(this);
        const { data } = props;
        this.state = {
            stakeDistributionIndicators: data.stakeDistributionIndicators
        }
    }

    componentDidUpdate(prevProps, prevState) {
        if(this.props.shouldResetState) {
            this._resetState();
        }
    }

    _resetState() {
        this.setState({
            stakeDistributionIndicators: this.props.data.stakeDistributionIndicators
        });
    }

    _handleRowChange(index, propToChange, value, isInvalid) {
        const { changeHandler } = this.props;
        const newRowState = { ...this.state.stakeDistributionIndicators[index], [propToChange]: value };
        if(typeof isInvalid !== 'undefined') {
            newRowState[`${propToChange}IsInvalid`] = isInvalid
        };
        const newState = [ ...this.state.stakeDistributionIndicators ];
        newState[index] = newRowState;
        this.setState({
            stakeDistributionIndicators: newState
        });
        changeHandler('stakeDistributionIndicators.stakeDistributionIndicators', [newRowState]);
    }

    render() {
        const { data, liabilityIndicatorsActions, stakeTypes, wagerLimitsGroups } = this.props;
        const { stakeDistributionIndicators } = this.state;
        return (
            <div className="stake-distribution-indicators">
                <table cellPadding="0" cellSpacing="0">
                    <thead>
                        <tr>
                            <th rowSpan="2">
                                Wager Limit Group
                            </th>
                            <th rowSpan="2">
                                Stake Type
                            </th>
                            <th rowSpan="2">
                                Min. Market Bet Count
                            </th>
                            <th rowSpan="2">
                                Min. Market Total Stake
                            </th>
                            <th colSpan="2">
                                <i className="phxico phx-exclamation text-success"></i> Warning
                            </th>
                            <th colSpan="2">
                                <i className="phxico phx-exclamation text-error"></i> Critical
                            </th>
                        </tr>
                        <tr>
                            <th>
                                Stake Deviation Percentage
                            </th>
                            <th>
                                Rule/Action
                            </th>
                            <th>
                                Stake Deviation Percentage
                            </th>
                            <th>
                                Rule/Action
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {stakeDistributionIndicators.map((stakeDistributionIndicator, index)=> {
                            return (
                                <tr key={stakeDistributionIndicator.id}>
                                    <td>
                                        {
                                            wagerLimitsGroups.find((item)=> item.id === stakeDistributionIndicator.marketTypeWagerLimitGroupId).description
                                        }
                                    </td>
                                    <td className="editable">
                                        <SelectBox
                                            className="status"
                                            onChange={(e)=> {
                                                this._handleRowChange(index, 'stakeType', e.target.value);
                                            }}
                                            value={stakeDistributionIndicator.stakeType}
                                            name="stake-types"
                                            options={stakeTypes}/>
                                    </td>
                                    <td className="editable">
                                        <input
                                            type="text"
                                            className={`tright ${stakeDistributionIndicator.minMarketBetCountIsInvalid ? 'invalid' : ''}`}
                                            value={stakeDistributionIndicator.minMarketBetCount}
                                            onChange={(e)=>{
                                                let value = isNaN(Number(e.target.value)) ? e.target.value : Number(e.target.value);
                                                const isInvalid = typeof value !== 'number';
                                                this._handleRowChange(index, 'minMarketBetCount', value, isInvalid) 
                                            }}/>
                                    </td>
                                    <td className="editable">
                                        <input
                                            type="text"
                                            className={`tright ${stakeDistributionIndicator.minMarketTotalStakeIsInvalid ? 'invalid' : ''}`}
                                            value={stakeDistributionIndicator.minMarketTotalStake}
                                            onChange={(e)=>{
                                                let value = isNaN(Number(e.target.value)) ? e.target.value : Number(e.target.value);
                                                const isInvalid = typeof value !== 'number';
                                                this._handleRowChange(index, 'minMarketTotalStake', value, isInvalid) 
                                            }}/>
                                    </td>
                                    <td className="editable">
                                        <input
                                            type="text"
                                            className={`tright ${stakeDistributionIndicator.secondaryDeviationPercentageIsInvalid ? 'invalid' : ''}`}
                                            value={stakeDistributionIndicator.secondaryDeviationPercentage}
                                            onChange={(e)=>{
                                                let value = isNaN(Number(e.target.value)) ? e.target.value : Number(e.target.value);
                                                const isInvalid = typeof value !== 'number';
                                                this._handleRowChange(index, 'secondaryDeviationPercentage', value, isInvalid) 
                                            }}/>
                                    </td>
                                    <td className="editable">
                                        <SelectBox
                                            className="status block-input"
                                            onChange={(e)=> {
                                                this._handleRowChange(index, 'secondaryActionId', Number(e.target.value));
                                            }}
                                            valueKey={'id'}
                                            descKey={'description'}
                                            value={stakeDistributionIndicator.secondaryActionId}
                                            name="stake-types"
                                            options={liabilityIndicatorsActions}/>
                                    </td>
                                    <td className="editable">
                                        <input
                                            type="text"
                                            className={`tright ${stakeDistributionIndicator.primaryDeviationPercentageIsInvalid ? 'invalid' : ''}`}
                                            value={stakeDistributionIndicator.primaryDeviationPercentage}
                                            onChange={(e)=>{
                                                let value = isNaN(Number(e.target.value)) ? e.target.value : Number(e.target.value);
                                                const isInvalid = typeof value !== 'number';
                                                this._handleRowChange(index, 'primaryDeviationPercentage', value, isInvalid)
                                            }}/>
                                    </td>
                                    <td className="editable">
                                        <SelectBox
                                            className="status block-input"
                                            onChange={(e)=> {
                                                this._handleRowChange(index, 'primaryActionId', Number(e.target.value));
                                            }}
                                            valueKey={'id'}
                                            descKey={'description'}
                                            value={stakeDistributionIndicator.primaryActionId}
                                            name="stake-types"
                                            options={liabilityIndicatorsActions}/>
                                    </td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            </div>
        )
    }
}