import React, { Component } from 'react';
import ModalWindow from 'components/modal';
import { connect } from 'react-redux';
import isEqual from 'lodash.isequal';
import LoadingIndicator from 'phxComponents/loadingIndicator';
import { modes } from '../Path/constants';
import ImportOpponents from './ImportOpponents';
import Editable from './Cells/Editable';
import VisibilityToggle from './Cells/VisibilityToggle';
import TableEmpty from './TableEmpty';
import TableHeader from './TableHeader';
import TableBody from './TableBody';
import { sportsCodesWithRaceCardNumber } from '../App/constants';


class OpponentsTable extends Component {
    constructor (props) {
        super(props);
        this._updateOpponent = this._updateOpponent.bind(this);
        this._updateAllOpponentsVisibility = this._updateAllOpponentsVisibility.bind(this);
        this.state = {
            showModalImportOpponents: false,
            updatedOpponents: this.props.selectedOpponents,
            useRaceCardNumber: sportsCodesWithRaceCardNumber.includes(this.props.activeCode)
        }
    }
    componentWillUpdate (nextProps) {
        if (!isEqual(nextProps.selectedOpponents, this.props.selectedOpponents)) {
            this.setState({updatedOpponents: [...nextProps.selectedOpponents]})
        }
    }

    _updateOpponent (data) {
        let opponentId = data.opponent.opponentId;
        let currentOpponent = {...data.opponent};
        let value = data.value;
        let target = data.target;
        let opponentIndex = this.state.updatedOpponents.findIndex(opponent => opponent.opponentId === opponentId);
        if (opponentIndex >= 0) {
            let foundOpponent = this.props.selectedOpponents[opponentIndex]
            if (value !== undefined && value !== null) {
                if (foundOpponent && (value === '' || value === false)) {
                    if (foundOpponent[target] === undefined) {
                        delete currentOpponent[target];
                        if (target === 'hidden') {
                            delete currentOpponent['hiddenFlags'];
                        }
                    } else if (foundOpponent[target] === null) {
                        currentOpponent[target] = null;
                        if (target === 'hidden') {
                            delete currentOpponent['hiddenFlags'];
                        }
                    } else {
                        currentOpponent[target] = value;
                        if (target === 'hidden') {
                            currentOpponent['hiddenFlags'] = {hidden: value}
                        }
                    }
                } else {
                    currentOpponent[target] = value;
                    if (target === 'hidden') {
                        currentOpponent['hiddenFlags'] = {hidden: value}
                    }
                }
            }
            let updatedOpponents = [
                ...this.state.updatedOpponents.slice(0, opponentIndex),
                currentOpponent,
                ...this.state.updatedOpponents.slice(opponentIndex + 1)
            ];
            this.setState({ updatedOpponents })
            if (isEqual(updatedOpponents, this.props.selectedOpponents)) {
                this.props.clearNewSelectedOpponents();
            } else {
                this.props.setNewSelectedOpponents(updatedOpponents)
            }
        }
    }

    _updateAllOpponentsVisibility () {
        let showAll = this.state.updatedOpponents.filter(opponent => opponent.hidden).length === this.state.updatedOpponents.length ? false : true;
        let updatedOpponents = [];
        if (showAll) {
            updatedOpponents = this.state.updatedOpponents.map(opponent => {
                return { ...opponent, hidden: true, hiddenFlags: {hidden: true} }
            })
        } else {
            updatedOpponents = this.state.updatedOpponents.map(opponent => {
                let _opponent = { ...opponent, hidden: false, hiddenFlags: {hidden: false} };
                let originalOpponent = this.props.selectedOpponents.find(opponent => _opponent.opponentId);
                if (originalOpponent) {
                    if (originalOpponent.hidden === undefined) {
                        delete _opponent.hidden;
                        delete _opponent.hiddenFlags;
                    } else if (originalOpponent.hidden === null) {
                        _opponent.hidden = null;
                        delete _opponent.hiddenFlags;
                    }
                }
                return _opponent;
            })
        }
        this.setState({ updatedOpponents })
        if (isEqual(updatedOpponents, this.props.selectedOpponents)) {
            this.props.clearNewSelectedOpponents();
        } else {
            this.props.setNewSelectedOpponents(updatedOpponents)
        }
    }

    render () {
        let {
            className='opponents-table-container',
            selectedOpponents=[],
            availableOpponents=[],
            newSelectedOpponents=[],
            isCreatingNewOpponents=false,
            defaultMarketId=123, // dummy default id
            eventPathMode=modes.VIEW,
            hasImportButton=false,
            setNewSelectedOpponents,
            isGameEvent,
            isLoadingOpponents
        } = this.props;
        let { useRaceCardNumber } = this.state;
        let opponents = [
            ...this.state.updatedOpponents,
        ];
        if (isCreatingNewOpponents) {
            opponents = [ ...newSelectedOpponents ];
        }
        let hasOpponents = false;
        if (opponents.length > 0) {
            hasOpponents = true;
        }
        
        return (
            <div className={className}>
                {hasImportButton &&
                    <div className="import-button-container">
                        <button onClick={e => {
                            e.preventDefault();
                            this.setState({showModalImportOpponents: true})
                        }} disabled={availableOpponents.length === opponents.length ? true : false}>Import Opponents</button>
                        {!hasOpponents &&
                            <span style={{marginLeft: '5px'}}>At least 1 (one) opponent is required.</span>
                        }
                    </div>
                }
                <div className="custom-table">
                    <TableHeader
                        updatedOpponents={this.state.updatedOpponents}
                        updateAllOpponentsVisibility={this._updateAllOpponentsVisibility}
                        useRaceCardNumber={useRaceCardNumber}
                    />
                    { hasOpponents ?
                        <TableBody
                            opponents={opponents}
                            updateOpponent={this._updateOpponent}
                            useRaceCardNumber={useRaceCardNumber}
                            isGameEvent={isGameEvent}
                        /> :
                        <TableEmpty />
                    }
                </div>
                {(!defaultMarketId || isLoadingOpponents) && (modes.VIEW === eventPathMode) &&
                    <div className="loading-container">
                        <LoadingIndicator/>
                    </div>
                }
                {this.state.showModalImportOpponents &&
                    <ModalWindow
                        isVisibleOn={true}
                        title="Import Opponents"
                        onClose={()=>{this.setState({showModalImportOpponents: false})}}
                        className="import-opponents"
                        closeButton={true}>
                        <h4>{"Import Opponents"}</h4>
                        <ImportOpponents
                            onClose={()=>{this.setState({showModalImportOpponents: false})}}
                            opponents={(e => {
                                let selectedOpponentIds = selectedOpponents.map(opponent => opponent.opponentId);
                                return [ ...availableOpponents.filter(opponent => !selectedOpponentIds.includes(opponent.id)) ];
                            })()}
                            marketId={this.props.defaultMarketId}
                            selectedOpponents={selectedOpponents}
                            updatedOpponents={this.state.updatedOpponents}
                            onOpponentImport={updatedOpponents => {                                
                                this.setState({updatedOpponents});
                                setNewSelectedOpponents(updatedOpponents);
                            }}
                        />
                    </ModalWindow>
                }
            </div>
        );
    }
}

export default OpponentsTable;