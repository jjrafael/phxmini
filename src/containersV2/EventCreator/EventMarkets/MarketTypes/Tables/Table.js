import React, { Component } from 'react';
import { connect } from 'react-redux';
import { getInitialMarketTypePayload } from '../../helpers';
import PlayerCheckbox from './CheckBox';
import PlayerInput from './TextInput';

const mapStateToProps = (state, ownProps) => {
    return {
        marketPayload: state.eventCreatorEventMarkets.newMarketPayload[ownProps.id],
    };
};

class Table extends Component {
    constructor (props) {
        super(props);
        let { market, playersArray } = this.props;
        this.initialPayload = getInitialMarketTypePayload(market, playersArray)
    }
    render () {
        let { header, players, targetKey, market, playersArray, id, siblingKey } = this.props;
        let marketPayload = this.props.marketPayload || this.initialPayload;
        return (
            <div className="custom-table">
                <div className="rt-thead -header">
                    <div className="rt-tr">
                        {header.map((col, i) => {
                            return <div key={i} className={`rt-th col-${col.type}`}>{col.value}</div>
                        })}
                    </div>
                </div>
                <div className="rt-tbody">
                    {players.map(player => {
                        return <div className="rt-tr-group">
                            <div className="rt-tr">
                                <div className={`rt-td col-desc`}>
                                    <PlayerCheckbox
                                        id={id}
                                        marketPayload={marketPayload}
                                        player={player}
                                        targetKey={targetKey}
                                        checkboxId={`${id}-${player.id}`}
                                        siblingKey={siblingKey}
                                    />
                                    <label htmlFor={`${id}-${player.id}`}>{player.desc}</label>
                                </div>
                                {player.inputs.map(input => {
                                    return <div key={input.prop} className={`rt-td col-input`}>
                                        <PlayerInput
                                            id={id}
                                            market={market}
                                            playersArray={playersArray}
                                            player={player}
                                            targetKey={targetKey}
                                            input={input}
                                        />
                                    </div>
                                })}
                            </div>
                        </div>
                    })}
                </div>
            </div>
        );
    }
}

export default connect(mapStateToProps)(Table);
