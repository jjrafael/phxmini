import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import ModalWindow from 'components/modal';
import { closeModal } from '../../../../actions/modal';
import NewMarket from './NewMarket';
import { paths } from '../../App/constants';
import { fetchEvent } from '../../Event/actions';
import { fetchMarketPlayers } from '../actions';
import LoadingIndicator from 'phxComponents/loadingIndicator';

const mapStateToProps = (state, ownProps) => {
    return {
        activePage: state.eventCreatorApp.activePage,
        market: state.eventCreatorEventMarkets.market,
        event: state.eventCreatorEvent.event,
        eventPlayersMap: state.eventCreatorEvent.eventPlayersMap,
        opponents: state.eventCreatorEvent.opponents,
        rankOpponents: state.eventCreatorEvent.selectedOpponents,
    };
};

const mapDispatchToProps = (dispatch, ownProps) => {
    return bindActionCreators({
        closeModal,
        fetchEvent,
        fetchMarketPlayers
    }, dispatch);
};

class MarketModal extends Component {
    constructor (props) {
        super(props);
        this._generateGameEventPlayers = this._generateGameEventPlayers.bind(this);
        this._generateRankEventPlayers = this._generateRankEventPlayers.bind(this);
        this.state = {
            players: []
        }
    }
    componentDidMount () {
        let { fetchEvent, market, activePage, event, fetchMarketPlayers, eventPlayersMap, } = this.props;
        if (activePage === paths.MARKET) {
            if (!event) {
                fetchEvent(market.eventId);
            } else {
                if (event.eventType === 'GAMEEVENT') {
                    this._generateGameEventPlayers({eventPlayersMap, event})  
                } else {
                    this._generateRankEventPlayers({eventPlayersMap, event})
                }
            }
        } else {
            if (activePage === paths.GAME_EVENT) {
                this._generateGameEventPlayers({eventPlayersMap, event})  
            } else if (activePage === paths.RANK_EVENT) {
                this._generateRankEventPlayers({eventPlayersMap, event})
            }
        }
    }
    componentWillUpdate (nextProps) {
        let { fetchMarketPlayers } = this.props;
        if (nextProps.event) {
            let event = nextProps.event;
            let eventPlayersMap = nextProps.eventPlayersMap;
            if (!this.props.event || (
                eventPlayersMap[event.id] &&
                eventPlayersMap[event.id].players &&
                !this.props.eventPlayersMap[event.id].players
            )) {
                if (event.eventType === 'GAMEEVENT') {
                    this._generateGameEventPlayers({eventPlayersMap, event})
                } else {
                    this._generateRankEventPlayers({eventPlayersMap, event})
                }
            }
        }
    }
    _generateGameEventPlayers ({eventPlayersMap, event}) {
        if (eventPlayersMap[event.id]){
            let { fetchMarketPlayers } = this.props;
            if (eventPlayersMap[event.id].players) {
                let { players } = eventPlayersMap[event.id];
                this.setState({players: [
                    players[event.opponentAId].map(outcome => ({id: outcome.id, description: outcome.description})),
                    players[event.opponentBId].map(outcome => ({id: outcome.id, description: outcome.description}))
                ]})
            } else {
                fetchMarketPlayers([event.opponentAId, event.opponentBId], event.id)
            }
        }
    }
    _generateRankEventPlayers ({eventPlayersMap, event}) {
        if (eventPlayersMap[event.id]){
            let { players } = eventPlayersMap[event.id];
            this.setState({players: [players.map(outcome => ({id: outcome.opponentId, description: outcome.description}))]})
        }
    }
    render () {
        let { closeModal, event } = this.props;
        let { players } = this.state;
        let content = <div className="modal-content-loading-container"><LoadingIndicator /></div>
        if (event) {
            content = <NewMarket onClose={()=>{ closeModal('newMarket') }} players={players} event={event} />
        }
        return <ModalWindow
            isVisibleOn={true}
            title="New Market"
            onClose={()=>{ closeModal('newMarket') }}
            className="large new-market"
            closeButton={true}>
            <h4>New Market</h4>
            {content}
        </ModalWindow>
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(MarketModal);