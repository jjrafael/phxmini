import React, { PropTypes } from "react";
import SelectBox from '../selectBox';
import checkPermission, { mapPermissionsToProps } from 'componentsV2/checkPermission/index';
import { permissionsCode } from 'containersV2/EventCreator/App/constants';

const InputComponent = ({checked, type, onChange, disabled}) => {
    return <input type={type} checked={checked} onChange={onChange} disabled={disabled} />
}
const Input = checkPermission(InputComponent);

class MarketLineConfigs extends React.Component {
    constructor(props) {
        super(props);
        const { marketLineConfigs } = props;
        this._handleLineConfigChange = this._handleLineConfigChange.bind(this);
        this._toggleAllRows = this._toggleAllRows.bind(this);
        this.state = {
            marketLineConfigs: marketLineConfigs.marketLineConfigs
        }
    }

    componentDidUpdate(prevProps, prevState) {
        if(this.props.shouldResetState) {
            this._resetState();
        }
    }

    _resetState() {
        this.setState({
            marketLineConfigs: this.props.marketLineConfigs.marketLineConfigs
        });
    }

    _handleLineConfigChange(configIndex, propToChange, value) {
        const { changeHandler } = this.props;
        const newConfig = { ...this.state.marketLineConfigs[configIndex], [propToChange]: value };
        const newState = [ ...this.state.marketLineConfigs ];
        newState[configIndex] = newConfig;
        this.setState({
            marketLineConfigs: newState
        });
        changeHandler('marketLineConfigs.marketLineConfigs', [newConfig], 'lineId');
    }

    _isAllRowsChecked(key) {
        let isAllChecked = true;
        for(var i = 0; i < this.state.marketLineConfigs.length; i++) {
            if(!this.state.marketLineConfigs[i][key]) {
                isAllChecked = false;
                break;
            }
        }
        return isAllChecked;
    }

    _toggleAllRows(key, value) {
        const { changeHandler } = this.props;
        const newState = this.state.marketLineConfigs.map((marketLineConfig)=> {
            return {
                ...marketLineConfig,
                [key]: value
            }
        });
        this.setState({
            marketLineConfigs: newState
        });
        changeHandler('marketLineConfigs.marketLineConfigs', [...newState], 'lineId');
    }

    render() {
        const { promotionLevels, lines, permissions } = this.props;
        const { marketLineConfigs } = this.state;
        const { updateDerivePrices } = this.props.marketLineConfigs;
        return (
            <div className="market-line-config form-wrapper">
                <h4>Market Line Configuration</h4>
                <div className="market-line-config-table-wrapper form-inner">
                    <table cellPadding="0" cellSpacing="0">
                        <thead>
                            <tr>
                                <th>Line</th>
                                <th><Input actionIds={[permissionsCode.EVENTS_CREATOR_MARKET_BET_RESTRICTIONS]} checked={this._isAllRowsChecked('allowSingleBets')} onChange={(e)=> this._toggleAllRows('allowSingleBets', e.target.checked)} type="checkbox"/> Allow Single Bets</th>
                                <th><Input actionIds={[permissionsCode.EVENTS_CREATOR_MARKET_BET_RESTRICTIONS]} checked={this._isAllRowsChecked('allowDoubleBets')} onChange={(e)=> this._toggleAllRows('allowDoubleBets', e.target.checked)} type="checkbox"/> Allow Double Bets</th>
                                <th><Input actionIds={[permissionsCode.EVENTS_CREATOR_MARKET_BET_RESTRICTIONS]} checked={this._isAllRowsChecked('allowCombinationBets')} onChange={(e)=> this._toggleAllRows('allowCombinationBets', e.target.checked)} type="checkbox"/> Allow Combination Bets</th>
                                <th>Price Expires</th>
                                <th>
                                    <Input
                                        actionIds={[permissionsCode.EVENTS_CREATOR_MARKET_BET_RESTRICTIONS]}
                                        checked={!updateDerivePrices ? false : this._isAllRowsChecked('derivePrices')}
                                        onChange={(e)=> this._toggleAllRows('derivePrices', e.target.checked)}
                                        type="checkbox"
                                        disabled={!updateDerivePrices}
                                    /> Derive Prices</th>
                                {permissions.includes(permissionsCode.VIEW_AND_EDIT_MARKET_LINE_PROMOTED_FLAG) && <th>Promotion Level</th>}
                                {permissions.includes(permissionsCode.VIEW_AND_EDIT_MARKET_LINE_SHOW_WHEN_UNPRICED_FLAG) &&
                                    <th><input checked={this._isAllRowsChecked('showUnpriced')} onChange={(e)=> this._toggleAllRows('showUnpriced', e.target.checked)} type="checkbox"/> Show when unpriced</th>
                                }
                            </tr>
                        </thead>
                        <tbody>
                            {marketLineConfigs.map((marketLineConfig, index)=> {
                                return (
                                    <tr key={marketLineConfig.lineId}>
                                        <td>{lines.find((line)=> Number(line.value) === marketLineConfig.lineId).desc}</td>
                                        <td className="tcenter"><Input actionIds={[permissionsCode.EVENTS_CREATOR_MARKET_BET_RESTRICTIONS]} type="checkbox" onChange={(e)=> this._handleLineConfigChange(index, 'allowSingleBets', e.target.checked)} checked={marketLineConfig.allowSingleBets}/></td>
                                        <td className="tcenter"><Input actionIds={[permissionsCode.EVENTS_CREATOR_MARKET_BET_RESTRICTIONS]} type="checkbox" onChange={(e)=> this._handleLineConfigChange(index, 'allowDoubleBets', e.target.checked)} checked={marketLineConfig.allowDoubleBets}/></td>
                                        <td className="tcenter"><Input actionIds={[permissionsCode.EVENTS_CREATOR_MARKET_BET_RESTRICTIONS]} type="checkbox" onChange={(e)=> this._handleLineConfigChange(index, 'allowCombinationBets', e.target.checked)} checked={marketLineConfig.allowCombinationBets}/></td>
                                        <td className="tcenter">{marketLineConfig.priceExpiry}</td>
                                        <td className="tcenter">
                                            <Input
                                                actionIds={[permissionsCode.EVENTS_CREATOR_MARKET_BET_RESTRICTIONS]}
                                                type="checkbox"
                                                onChange={(e)=> this._handleLineConfigChange(index, 'derivePrices', e.target.checked)}
                                                checked={!updateDerivePrices ? false : marketLineConfig.derivePrices}
                                                disabled={!updateDerivePrices}
                                            />
                                        </td>
                                        {permissions.includes(permissionsCode.VIEW_AND_EDIT_MARKET_LINE_PROMOTED_FLAG) &&
                                            <td>
                                                <SelectBox
                                                    className="promotion-level block-input"
                                                    onChange={(e)=> {
                                                        this._handleLineConfigChange(index, 'promotionLevel', e.target.value)
                                                    }}
                                                    value={marketLineConfig.promotionLevel}
                                                    name="promotion-level"
                                                    options={promotionLevels}/>
                                            </td>
                                        }
                                        {permissions.includes(permissionsCode.VIEW_AND_EDIT_MARKET_LINE_SHOW_WHEN_UNPRICED_FLAG) &&
                                            <td className="tcenter">
                                                <input type="checkbox" onChange={(e)=> this._handleLineConfigChange(index, 'showUnpriced', e.target.checked)} checked={marketLineConfig.showUnpriced}/>
                                            </td>
                                        }
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        )
    }
}

export default mapPermissionsToProps(MarketLineConfigs);