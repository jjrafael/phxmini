import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PlayerHandicaps12 from './Tables/PlayerHandicaps12';
import PlayerValues12 from './Tables/PlayerValues12';
import PlayerValues from './Tables/PlayerValues';
import Players12 from './Tables/Players12';
import Players from './Tables/Players';
import MainInput from './MainInputs/index';
import { updateNewMarketPayload } from '../actions';
import { getInitialMarketTypePayload } from '../helpers';

const mapStateToProps = (state, ownProps) => {
    return {
        marketPayload: state.eventCreatorEventMarkets.newMarketPayload[ownProps.id]
    };
};

const mapDispatchToProps = (dispatch, ownProps) => {
    return bindActionCreators({
        updateNewMarketPayload
    }, dispatch);
};

class MarketType extends Component {
    constructor (props) {
        super(props);
        let { market, playersArray, id } = this.props;
        let payload = {
            marketTypeId: market.marketType.id,
            periodId: market.periodId,
            opponentId: market.opponentId,
            instanceNumber: market.instanceNumber
        };
        this.initialPayload = getInitialMarketTypePayload(market, playersArray);
        let marketPayload = this.initialPayload;
        let hasMainInput = false;
        let PlayerType;
        switch (market.marketType.factoryFields) {
            case 'SINGLE_INTEGER':
            case 'SINGLE_FLOAT':
            case 'TWO_FLOATS':
            case 'THREE_FLOATS':
            case 'MULTI_RANGE_STRING':
            case 'SCORES_DYNAMIC':
                hasMainInput = true;
                break;
            case 'SCORES_DYNAMIC_PLAYERS12':
                hasMainInput = true;
                PlayerType = Players12;
                break;
            case 'PLAYERS':
                PlayerType = Players;
                break;
            case 'PLAYERS12':
                PlayerType = Players12;
                break;
            case 'STRING_PLAYERS':
                hasMainInput = true;
                PlayerType = Players;
                break;
            case 'PLAYER_HANDICAPS12':
                PlayerType = PlayerHandicaps12;
                break;
            case 'PLAYER_VALUES':
                PlayerType = PlayerValues;
                break;
            case 'PLAYER_VALUES12':
                PlayerType = PlayerValues12;
                break;
        }
        if (hasMainInput) {
            this.MainInputs = <MainInput
                id={id}
                market={market}
                playersArray={playersArray}
                inputs={marketPayload.inputs}
                selectInput={marketPayload.selectInput}
            />
        }
        if (PlayerType) {
            this.PlayersAndValues = <PlayerType
                id={id}
                market={market}
                playersArray={playersArray}
                marketPayload={marketPayload}
            />
        }
    }

    render () {
        let { typeIds, id, market, updateNewMarketPayload } = this.props;
        let marketPayload = this.props.marketPayload || this.initialPayload;
        return (
            <div className="market-type">
                <div className="market-row">
                    <div className="market-details">
                        <input id={id} type="checkbox" checked={marketPayload.checked} onChange={e => {
                            let checked = e.target.checked;
                            updateNewMarketPayload(id, {...marketPayload, checked});
                        }}/>
                        <label htmlFor={id}>[{typeIds}] {market.description} ({market.periodDescription})</label>
                    </div>
                    { this.MainInputs }
                </div>
                { this.PlayersAndValues }
            </div>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(MarketType);
