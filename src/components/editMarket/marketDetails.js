import React, { PropTypes } from "react";
import { mapPermissionsToProps } from 'componentsV2/checkPermission';
import { permissionsCode } from 'containersV2/EventCreator/App/constants';
import SelectBox from '../selectBox';
import filterTypes from '../../constants/filterTypes';
import { formatDateTimeString, manipulateDate, objectToArray } from '../../utils';

class MarketDetails extends React.Component {
    constructor(props) {
        super(props);
        const { marketDetails } = props;
        this._handleOverrideChange = this._handleOverrideChange.bind(this);
        this._handleMarketStatusChange = this._handleMarketStatusChange.bind(this);
        this._handleAutoSettleChange = this._handleAutoSettleChange.bind(this);
        this._handlePriceFromFeedChange = this._handlePriceFromFeedChange.bind(this);
        this._handleResultFromFeedChange = this._handleResultFromFeedChange.bind(this);
        this._handleAddSecondsToCutOffTimeChange = this._handleAddSecondsToCutOffTimeChange.bind(this);
        this.state = {
            marketStatusId: marketDetails.marketStatusId,
            autoSettle: marketDetails.autoSettle,
            priceFromFeed: marketDetails.priceFromFeed,
            resultFromFeed: marketDetails.resultFromFeed,
            openAfterCutOffSeconds: marketDetails.openAfterCutOffSeconds,
            openAfterCutOffSecondsEnabled: marketDetails.openAfterCutOffSecondsEnabled,
            cutOffTime: marketDetails.cutOffTime,
            marketStatusIdEnabled: marketDetails.marketStatusIdEnabled,
            onlineSortOverride: marketDetails.onlineSortOverride
        }
    }

    componentDidUpdate(prevProps, prevState) {
        if(this.props.shouldResetState) {
            this._resetState();
        }
    }

    _resetState() {
        const { marketStatusId, autoSettle, priceFromFeed, resultFromFeed, openAfterCutOffSeconds, cutOffTime, marketStatusIdEnabled, onlineSortOverride } = this.props.marketDetails;
        this.setState({
            marketStatusId,
            autoSettle,
            priceFromFeed,
            resultFromFeed,
            openAfterCutOffSeconds,
            cutOffTime,
            marketStatusIdEnabled,
            onlineSortOverride
        });
    }

    _handleOverrideChange(e) {
        this.setState({
            onlineSortOverride: e.target.value
        });
        this.props.changeHandler('marketDetails.onlineSortOverride', e.target.value);
    }

    _handleMarketStatusChange(e) {
        this.setState({
            marketStatusId: e.target.value
        });
        this.props.changeHandler('marketDetails.marketStatusId', Number(e.target.value));
    }

    _handleAutoSettleChange(e) {
        this.setState({
            autoSettle: e.target.checked
        });
        this.props.changeHandler('marketDetails.autoSettle', e.target.checked);
    }

    _handlePriceFromFeedChange(e) {
        this.setState({
            priceFromFeed: e.target.checked
        });
        this.props.changeHandler('marketDetails.priceFromFeed', e.target.checked);
    }

    _handleResultFromFeedChange(e) {
        this.setState({
            resultFromFeed: e.target.checked
        });
        this.props.changeHandler('marketDetails.resultFromFeed', e.target.checked);
    }

    _handleAddSecondsToCutOffTimeChange(e) {
        const value = e.target.value
        if(value.match(/^-?[0-9]*$/)){
            this.props.changeHandler('marketDetails.openAfterCutOffSeconds', Number(value));
            this.setState({
                openAfterCutOffSeconds: value
            });
        }
    }

    render() {
        const { marketDetails, statuses, permissions } = this.props;
        const { marketStatusId, marketStatusIdEnabled, autoSettle, priceFromFeed, resultFromFeed, openAfterCutOffSeconds, cutOffTime, onlineSortOverride, openAfterCutOffSecondsEnabled } = this.state;
        const cutOffTimeDisplay = cutOffTime ? manipulateDate(cutOffTime, openAfterCutOffSeconds, 'seconds', 'MMMM Do YYYY, h:mm:ss a') : '';
        let hasNoMarketStatusPermission = false;
        if (!permissions.includes(permissionsCode.ALLOW_CLOSED_MARKET_REOPENING) && Number(marketDetails.marketStatusId) === 8) { // currently closed
            hasNoMarketStatusPermission = true;
        }
        return (
            <section className="market-details form-wrapper">
                <h4>Market Details</h4>
                <div className="form-inner">
                    <div className="form-field inline-form-field">
                        <label>
                            Market Status
                        </label>
                        <div className="input-container flex flex--column flex--grow">
                            {statuses.map(status => {
                                // <SelectBox
                                //     disabled={!marketStatusIdEnabled}
                                //     className="market-status block-input"
                                //     onChange={this._handleMarketStatusChange}
                                //     value={marketStatusId}
                                //     name="market-status"
                                //     options={statuses}/>
                                return <label className="market-status-label flex flex--align-center">
                                    <input
                                        type="radio"
                                        name="market-details-status"
                                        value={status.value}
                                        disabled={hasNoMarketStatusPermission || !marketStatusIdEnabled}
                                        onChange={this._handleMarketStatusChange}
                                        checked={Number(status.value) === Number(marketStatusId)}
                                    />
                                    <span><i className={`phxico phx-${status.desc.toLowerCase()}`}></i>{status.desc}</span>
                                </label>
                            })
                            }
                        </div>
                    </div>
                    <div className="form-field inline-form-field">
                        <label>
                            Add
                        </label>
                        <div className="input-container">
                            <input disabled={!openAfterCutOffSecondsEnabled} min={0} className="short-input push-right" value={openAfterCutOffSeconds} onChange={this._handleAddSecondsToCutOffTimeChange}/>
                            Seconds to market cut-off time.
                        </div>
                    </div>
                    <div className="form-field inline-form-field">
                        <label>
                            Cut-off time
                        </label>
                        <div className="input-container">
                            {cutOffTimeDisplay}
                        </div>
                    </div>
                    <div className="form-field inline-form-field">
                        <label>
                            Auto open time
                        </label>
                        <div className="input-container">
                            {!!marketDetails.autoOpenTime && formatDateTimeString(marketDetails.autoOpenTime, 'MMMM Do YYYY, h:mm:ss a')}
                        </div>
                    </div>
                    <div className="form-field inline-form-field">
                        <label>
                            Online sort override
                        </label>
                        <div className="input-container">
                            <SelectBox
                                disabled={!marketDetails.onlineSortOverrideEnabled}
                                className="market-override block-input"
                                onChange={this._handleOverrideChange}
                                value={onlineSortOverride}
                                name="market-override"
                                options={objectToArray(filterTypes.OVERRIDES)}/>
                        </div>
                    </div>
                    <div className="tleft form-field">
                        <label className="push-right">
                            <input type="checkbox"
                                disabled={!permissions.includes(permissionsCode.AUTO_SETTLEMENT)}
                                checked={autoSettle}
                                onChange={permissions.includes(permissionsCode.AUTO_SETTLEMENT) ? this._handleAutoSettleChange : () => {}}
                            />
                            Auto Settle
                        </label>
                        <label className="push-right">
                            <input type="checkbox" checked={priceFromFeed} disabled={!marketDetails.priceFromFeedEnabled} onChange={this._handlePriceFromFeedChange}/>
                            Price From Feed
                        </label>
                        <label className="push-right">
                            <input type="checkbox" disabled={!marketDetails.resultFromFeedEnabled} checked={resultFromFeed} onChange={this._handleResultFromFeedChange}/>
                            Result From Feed
                        </label>
                    </div>
                </div>
            </section>
        )
    }
}

export default mapPermissionsToProps(MarketDetails);