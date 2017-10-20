import React, { PropTypes } from "react";
import SelectBox from '../selectBox';
import ModalWindow from '../modal';
import { switchArrayItems, formatNumber } from '../../utils';
import HandicapInput from './HandicapInput';

export default class PriceAndWagerLimits extends React.Component {
    constructor(props) {
        super(props);
        this._handleOutcomeChange = this._handleOutcomeChange.bind(this);
        this._calculatePriceMargin = this._calculatePriceMargin.bind(this);
        const { data } = props;
        this.state = {
            outcomePriceAndWagerLimitsList: data.outcomePriceAndWagerLimitsList,
            priceMargin: this.props.book,
            currentOutcomePrices: {},
            invalidPrices: {}
        }
        this._outcomesMap = {};
    }

    componentDidUpdate(prevProps, prevState) {
        if(this.props.shouldResetState) {
            this._resetState();
        }
    }

    componentWillUnmount () {
        clearTimeout(this.invalidPriceTimer)
    }

    _resetState() {
        this.setState({
            outcomePriceAndWagerLimitsList: this.props.data.outcomePriceAndWagerLimitsList
        });
    }

    _getLineItemToShow(array) {
        let itemToShow = array.find((item)=> item.lineId === this.props.lineId);
        return itemToShow;
    }

    _getLineItemIndex(outcomeIndex) {
        let lineItemIndex = null;
        this.state.outcomePriceAndWagerLimitsList[outcomeIndex].priceList.forEach((price, index)=> {
            if(price.lineId === this.props.lineId) {
                lineItemIndex = index;
            }
        });
        return lineItemIndex;
    }

    _handleOutcomeChange(outcomeIndex, propToChange, value) {
        const { changeHandler } = this.props;
        const newOutcomeState = { ...this.state.outcomePriceAndWagerLimitsList[outcomeIndex], [propToChange]: value };
        const newState = [ ...this.state.outcomePriceAndWagerLimitsList ];
        newState[outcomeIndex] = newOutcomeState;
        this.setState({
            outcomePriceAndWagerLimitsList: newState
        });
        changeHandler('pricesAndWagerLimits.outcomePriceAndWagerLimitsList', [newOutcomeState], 'outcomeId');
    }
    _calculatePriceMargin(outcomesMap) {
        let keys = Object.keys(outcomesMap);
        let priceMargin = 0;
        keys.map(key => {
            if (outcomesMap[key] && outcomesMap[key] !== 0) {
                priceMargin += 100 / outcomesMap[key];
            }
        });
        priceMargin = Number(priceMargin.toFixed(2));
        if (this.state.priceMargin !== priceMargin) {
            this.setState({priceMargin});
            this.props.onPriceMarginChange(priceMargin)
        }
    }

    _handleOutcomePriceListChange(outcomeIndex, propToChange, value) {
        const { changeHandler, lineId } = this.props;
        let isInvalid = false;
        if(propToChange === 'decimal') {
            isInvalid = isNaN(value);
        }
        const newState = [ ...this.state.outcomePriceAndWagerLimitsList ];
        let lineItemIndex = this._getLineItemIndex(outcomeIndex);
        if(lineItemIndex !== null) {
            const newOutcomePriceState = {
                ...this.state.outcomePriceAndWagerLimitsList[outcomeIndex].priceList[lineItemIndex],
                [propToChange]: value,
                isInvalid
            };
            newState[outcomeIndex].priceList[lineItemIndex] = newOutcomePriceState;
        } else {
            const newOutcomePriceState = {
                [propToChange]: value,
                lineId
            }
            newState[outcomeIndex].priceList.push(newOutcomePriceState);
        }
        this.setState({
            outcomePriceAndWagerLimitsList: newState
        });
        changeHandler('pricesAndWagerLimits.outcomePriceAndWagerLimitsList', [newState[outcomeIndex]], 'outcomeId', {
            shouldCheckMarketFeedInfo: true
        });
    }

    _handleHandicapBlur(outcomeIndex, formattedSpread, marketTypeGroup) {
        if(marketTypeGroup === 'SPREAD') {
            this._formatSpreadHandicaps(outcomeIndex, formattedSpread);
        } else if(marketTypeGroup === 'THREE_WAYS_TOTALS' || marketTypeGroup === 'TOTALS') {
            this._formatTotalsHandicap(outcomeIndex, formattedSpread);
        }
    }

    _formatSpreadHandicaps(outcomeIndex, formattedSpread) {
        let otherOutcomeIndex = null;
        this.state.outcomePriceAndWagerLimitsList.forEach((outcome, index) => {
            if(index !== outcomeIndex) {
                otherOutcomeIndex = index;
            }
        });
        this._handleOutcomePriceListChange(otherOutcomeIndex, 'formattedSpread', this._getOppositeSpread(formattedSpread));
    }

    _formatTotalsHandicap(outcomeIndex, formattedSpread) {
        this.state.outcomePriceAndWagerLimitsList.forEach((outcome, index) => {
            if(index !== outcomeIndex) {
                this._handleOutcomePriceListChange(index, 'formattedSpread', formattedSpread);
            }
        });
    }

    _getOppositeSpread(formattedSpread) {
        let oppositeSpread = '';
        if(formattedSpread.indexOf(',') === -1) {
            oppositeSpread = (-Number(formattedSpread)).toString();
            if (oppositeSpread.indexOf('-') < 0) {
                oppositeSpread = '+' + oppositeSpread;
            }
        } else {
            formattedSpread.split(',').forEach((item, index) => {
                let num = (-Number(item)).toString().trim();
                if (num.indexOf('-') < 0) {
                    num = '+' + num;
                }
                if(index === 0) {
                    oppositeSpread += num;
                } else if(index === 1) {
                    oppositeSpread += `,${num}`;
                }
            })
        }
        if(typeof oppositeSpread === 'number') {
            oppositeSpread = oppositeSpread.toString();
        }
        if (oppositeSpread === '0') {
            return '';
        }
        return oppositeSpread;
    }

    _swapOutcomeOrder(currentPosition, nextPosition, outcomeCount) {
        if(currentPosition === 1 && nextPosition < 1
            || currentPosition === nextPosition
            || nextPosition > outcomeCount) {
            return
        }
        const { outcomePriceAndWagerLimitsList } = this.state;
        let currentPositionIndex = null;
        let nextPositionIndex = null;
        let newState = [ ...outcomePriceAndWagerLimitsList ];
        for(var i = 0; i < outcomePriceAndWagerLimitsList.length; i++) {
            const outcome = outcomePriceAndWagerLimitsList[i];
            if(outcome.ordinalPosition === currentPosition) {
                currentPositionIndex = i;
            } else if(outcome.ordinalPosition === nextPosition) {
                nextPositionIndex = i;
            }
            if(nextPositionIndex && currentPositionIndex) {
                break;
            }
        }
        newState[currentPositionIndex].ordinalPosition = nextPosition;
        newState[nextPositionIndex].ordinalPosition = currentPosition;
        this.setState({
            outcomePriceAndWagerLimitsList: newState
        });
        this.props.changeHandler('pricesAndWagerLimits.outcomePriceAndWagerLimitsList', [newState[currentPositionIndex], newState[nextPositionIndex]], 'outcomeId');
    }

    _reorderOutcomes(currentPosition, nextPosition, outcomeCount) {
       if(currentPosition === 1 && nextPosition < 1
            || currentPosition === nextPosition
            || nextPosition > outcomeCount) {
            return
        } 
        const { outcomePriceAndWagerLimitsList } = this.state;
        let currentPositionIndex = null;
        let newState = [ ...outcomePriceAndWagerLimitsList ];
        for(var i = 0; i < newState.length; i++) {
            const outcome = outcomePriceAndWagerLimitsList[i];
            if(outcome.ordinalPosition === 0) {
                continue
            } else if(outcome.ordinalPosition === currentPosition) {
                outcome.ordinalPosition = nextPosition;
            } else if(nextPosition === outcomeCount){
                outcome.ordinalPosition = outcome.ordinalPosition - 1;
            } else if(nextPosition === 1){
                outcome.ordinalPosition = outcome.ordinalPosition + 1;
            }
            this.setState({
                outcomePriceAndWagerLimitsList: newState
            });
            this.props.changeHandler('pricesAndWagerLimits.outcomePriceAndWagerLimitsList', [...newState], 'outcomeId');
        }
    }

    render() {
        const { data, lineId, lines, onLineChange, price, actions } = this.props;
        const book = this.state.priceMargin ? this.state.priceMargin : '0.00';
        const filteredOutcomes = this.state.outcomePriceAndWagerLimitsList.filter((outcome)=> {
            if(data.dogOrHorseRace && outcome.raceCardNumber === 0) {
                return false
            }
            return true
        }).sort((a,b) => {
          if (a.ordinalPosition < b.ordinalPosition)
            return -1;
          if (a.ordinalPosition > b.ordinalPosition)
            return 1;
          return 0;
        })
        return (
            <div className="price-and-wager-limits">
                <div className="clearfix">
                    <div className="fleft">
                        <label>
                            Viewing Line
                            <SelectBox className="status" onChange={onLineChange} value={lineId} name="line" options={lines}/>
                        </label>
                    </div>
                    <div className="fright text-bold">
                        <span className={(book < 103 || book === '0.00') ? 'text-error' : ''}>{`Book: ${book} %`}</span>
                    </div>
                </div>
                <div className="wager-table-container">
                    <table cellPadding="0" cellSpacing="0">
                        <thead>
                            <tr>
                                {data.dogOrHorseRace &&
                                <th></th>
                                }
                                <th>
                                    Rotation No.
                                </th>
                                <th>
                                    Runner
                                </th>
                                {!data.disableHandicaps &&
                                <th>
                                    Handicap
                                </th>
                                }
                                <th className="cell-smallw">
                                    Price
                                </th>
                                <th>
                                    Hidden Y/N
                                </th>
                                <th>
                                   Trading Message
                                </th>
                                <th>
                                    Restricted Outcome Y/N
                                </th>
                                <th>
                                    Max Bet Stake
                                </th>
                                <th>
                                    Max Bet Liability
                                </th>
                                <th>
                                    Rule/Action
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredOutcomes.map((outcome, index) => {
                                const outcomeCount = filteredOutcomes.length;
                                const linePriceToShow = !!outcome.priceList.length ? this._getLineItemToShow(outcome.priceList) : null;
                                const price = linePriceToShow ? linePriceToShow.decimal : '';
                                const isInvalidPrice = linePriceToShow ? linePriceToShow.isInvalid : false;
                                const formattedSpread = linePriceToShow ? linePriceToShow.formattedSpread : '';
                                const action = actions.find((action)=> action.id === outcome.actionId);
                                const { ordinalPosition } = outcome;
                                const currentOutcomePrice = this.state.currentOutcomePrices[outcome.outcomeId]
                                let currentPrice = currentOutcomePrice ? currentOutcomePrice : price;
                                let invalidPrice = this.state.invalidPrices[outcome.outcomeId];
                                if (currentPrice && !currentOutcomePrice) {
                                    let numPrice = Number(currentPrice);
                                    currentPrice = numPrice.toFixed(3);
                                    const lastCharPos = currentPrice.length - 1;
                                    if (currentPrice.charAt(lastCharPos) === '0') {
                                        currentPrice = currentPrice.substr(0, lastCharPos);
                                    }
                                }
                                this._outcomesMap[outcome.outcomeId] = price;
                                return (
                                    <tr key={outcome.outcomeId}>
                                        {data.dogOrHorseRace &&
                                        <td>
                                            <div className="clearfix">
                                                <a  title="Move on top" className="left push-right" onClick={(e)=> this._reorderOutcomes(ordinalPosition, 1, outcomeCount)}>
                                                    <span className="icon-small phxico phx-move-top "></span>
                                                </a>
                                                <a  title="Move up" className="left push-right" onClick={(e)=> this._swapOutcomeOrder(ordinalPosition, ordinalPosition-1, outcomeCount)}>
                                                    <span className="icon-small phxico phx-move-up"></span>
                                                </a>
                                                <a  title="Move down" className="left push-right" onClick={(e)=> this._swapOutcomeOrder(ordinalPosition, ordinalPosition+1, outcomeCount)}>
                                                    <span className="icon-small phxico phx-move-down"></span>
                                                </a>
                                                <a  title="Move at the bottom" className="left push-right" onClick={(e)=> this._reorderOutcomes(ordinalPosition, outcomeCount, outcomeCount)}>
                                                    <span className="icon-small phxico phx-move-bottom"></span>
                                                </a>
                                            </div>
                                        </td>
                                        }
                                        <td>
                                            {outcome.raceCardNumber > 0 ? outcome.raceCardNumber : ''}
                                        </td>
                                        <td style={{padding: '1px 3px'}}>
                                            <a
                                                
                                                className="text-bold"
                                                onClick={(e)=> {
                                                    e.preventDefault();
                                                    this.props.onOutcomeClick(outcome.outcomeId, outcome.runner);
                                                }}><button style={{margin: '0', height: '20px'}}>{outcome.runner}</button></a>
                                        </td>
                                        {!data.disableHandicaps &&
                                        <td className={`td-handicap ${data.disableHandicaps ? 'disabled' : 'editable'}`}>
                                        {<HandicapInput
                                            formattedSpread={formattedSpread}
                                            disableHandicaps={data.disableHandicaps}
                                            onOpenModal={e => {
                                                this.props.openModal('handicapValidFormats');
                                            }}
                                            onBlur={value => {
                                                this.props.outcomeDisconnectionHandler(outcome.outcomeId);
                                                this._handleOutcomePriceListChange(index, 'formattedSpread', value)
                                                setTimeout(e => {
                                                    this._handleHandicapBlur(index, value, outcome.marketTypeGroup);
                                                }, 10) // there's a bug when this is called immediately
                                            }}
                                        />
                                    }
                                    {
                                        // <input
                                        //     className="tright"
                                        //     type="text"
                                        //     disabled={data.disableHandicaps}
                                        //     value={formattedSpread}
                                        //     onChange={(e)=>{
                                        //         let value = e.target.value;
                                        //         this.props.outcomeDisconnectionHandler(outcome.outcomeId);
                                        //         this._handleOutcomePriceListChange(index, 'formattedSpread', value)
                                        //     }}
                                        //     onBlur={(e)=> {
                                        //         let value = e.target.value;
                                        //         if (['+', '-'].includes(value)) {
                                        //             value = '';
                                        //         }
                                        //         this.props.outcomeDisconnectionHandler(outcome.outcomeId);
                                        //         this._handleOutcomePriceListChange(index, 'formattedSpread', value)
                                        //         this._handleHandicapBlur(index, value, outcome.marketTypeGroup);
                                        //     }}/>
                                        }
                                        </td>
                                        }
                                        <td className="editable edit-market-price">
                                            <input
                                                type="text"
                                                className={`price-input tright ${isInvalidPrice ? 'invalid' : ''}`}
                                                value={ currentPrice }
                                                onChange={(e)=>{
                                                    let value = e.target.value;
                                                    let validDecimalNumber = /^(0*|[1-9]\d*)?(\.\d{0,3})?$/g;
                                                    if (validDecimalNumber.test(value) && value !== '.') {
                                                        const numValue = Number(value);
                                                        const numCurrentPrice = Number(currentPrice);
                                                        if (value === '' || (numValue !== numCurrentPrice && numValue > 1.001)) {
                                                            this._outcomesMap[outcome.outcomeId] = value;
                                                            this._calculatePriceMargin(this._outcomesMap);
                                                            this.props.outcomeDisconnectionHandler(outcome.outcomeId);
                                                            this._handleOutcomePriceListChange(index, 'decimal', value);
                                                        }
                                                        this.setState({
                                                            currentOutcomePrices: {
                                                                ...this.state.currentOutcomePrices,
                                                                [outcome.outcomeId]: value
                                                            }
                                                        })
                                                         
                                                    }
                                                }}
                                                onBlur={e => {
                                                    let newCurrentOutcomePrices = {...this.state.currentOutcomePrices};
                                                    if (newCurrentOutcomePrices[outcome.outcomeId]) {
                                                        delete newCurrentOutcomePrices[outcome.outcomeId]
                                                        this.setState({
                                                            currentOutcomePrices: newCurrentOutcomePrices
                                                        })
                                                        let numPrice = Number(e.target.value);
                                                        let formattedPrice = numPrice.toFixed(3);
                                                        const lastCharPos = formattedPrice.length - 1;
                                                        if (formattedPrice.charAt(lastCharPos) === '0') {
                                                            formattedPrice = formattedPrice.substr(0, lastCharPos);
                                                        }
                                                        if (numPrice < 1.001) {
                                                            this.setState({
                                                                invalidPrices: {
                                                                    ...this.state.invalidPrices,
                                                                    [outcome.outcomeId]: formattedPrice
                                                                }
                                                            });
                                                            this.invalidPriceTimer = setTimeout(e => {
                                                                let newInvalidPrices = {...this.state.invalidPrices};
                                                                if (newInvalidPrices[outcome.outcomeId]) {
                                                                    delete newInvalidPrices[outcome.outcomeId];
                                                                    this.setState({
                                                                        invalidPrices: newInvalidPrices
                                                                    })
                                                                }
                                                            }, 3000);
                                                        } else {
                                                            if (numPrice !== Number(price)) {
                                                                this._handleOutcomePriceListChange(index, 'decimal', formattedPrice);
                                                            }
                                                        }
                                                    }
                                                }}
                                                onKeyPress={e => {
                                                    if (e.key === 'Enter') {
                                                        e.target.blur();
                                                        // this._onBlur(e, outcome, price, index);
                                                    }
                                                }}
                                            />
                                            {invalidPrice &&
                                                <div className="rc-tooltip  rc-tooltip-placement-right rc-tooltip-warning">
                                                    <div className="rc-tooltip-content">
                                                        <div className="rc-tooltip-arrow"></div>
                                                        <div className="rc-tooltip-inner">
                                                            <div className="text-error">{invalidPrice} is an invalid price.</div>
                                                        </div>
                                                    </div>
                                                </div>
                                            }
                                        </td>
                                        <td className="tcenter">
                                            <input type="checkbox" onChange={(e)=> this._handleOutcomeChange(index, 'hidden', e.target.checked)}  checked={outcome.hidden}/>
                                        </td>
                                        <td className="editable cell-smallw">
                                            <input type="text" onChange={(e)=> this._handleOutcomeChange(index, 'tradingMessage', e.target.value)} value={outcome.tradingMessage || ''}/>
                                        </td>
                                        <td className="editable tcenter">
                                            <input type="checkbox" onChange={(e)=> this._handleOutcomeChange(index, 'restricted', e.target.checked)} checked={outcome.restricted}/>
                                        </td>
                                        <td className="tright">
                                            {formatNumber(outcome.maxBetStake, true)}
                                        </td>
                                        <td className="tright">
                                            {formatNumber(outcome.maxBetLiability, true)}
                                        </td>
                                        <td>
                                            {!!action && action.description}
                                        </td>
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