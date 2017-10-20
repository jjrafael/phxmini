import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { updateNewMarketPayload } from '../../actions';
import { getInitialMarketTypePayload } from '../../helpers';

const mapStateToProps = (state, ownProps) => {
    return {
        marketPayload: state.eventCreatorEventMarkets.newMarketPayload[ownProps.id],
        isCreatingNewMarkets: state.eventCreatorEventMarkets.isCreatingNewMarkets,
        isCreatingNewMarketsFailed: state.eventCreatorEventMarkets.isCreatingNewMarketsFailed,
    };
};

const mapDispatchToProps = (dispatch, ownProps) => {
    return bindActionCreators({
        updateNewMarketPayload
    }, dispatch);
};

export default function (WrappedComponent, data) {
    class Input extends Component {
        constructor (props) {
            super(props);
            this._setHOCSate = this._setHOCSate.bind(this);
            let { market, playersArray } = this.props;
            let initialPayload = getInitialMarketTypePayload(market, playersArray);
            let marketPayload = this.props.marketPayload || initialPayload;
            this.state = {
                value: marketPayload[this.props.targetKey],
                initialPayload
            }
        }
        shouldComponentUpdate (nextProps, nextState) {
            return !!this.props.marketPayload || this.state.value !== nextState.value;
        }
        componentWillUpdate (nextProps) {
            if (this.props.isCreatingNewMarkets && !nextProps.isCreatingNewMarkets && !nextProps.isCreatingNewMarketsFailed) {
                if (this.props.marketPayload) {
                    let { initialPayload } = this.state;
                    let state = {value: initialPayload[this.props.targetKey]}
                    if (this.instance && this.instance.getInitialValue) {
                        state = this.instance.getInitialValue(initialPayload);
                    }
                    this.setState(state);
                }
            }
        }
        _setHOCSate (state) {
            this.setState(state);
        }
        proc (instance) {
            this.instance = instance;
        }

        render () {
            let { updateNewMarketPayload } = this.props;
            let marketPayload = this.props.marketPayload || this.state.initialPayload;
            return (
                <WrappedComponent
                    {...this.props}
                    ref={this.proc.bind(this)}
                    value={this.state.value}
                    setHOCState={this._setHOCSate}
                    marketPayload={marketPayload}
                    updateNewMarketPayload={updateNewMarketPayload}
                />
            );
        }
    }
    return connect(mapStateToProps, mapDispatchToProps)(Input)
}