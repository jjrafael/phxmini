import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import ModalWindow from 'components/modal';
import utilitiesConstants from 'containersV2/Utilities/App/constants';
import cx from 'classnames';
import { setEvaluationOrderVisibility } from '../actions';
import NewBetRestriction from '../NewBetRestriction/index';
import DeleteBetRestriction from '../DeleteBetRestriction/index';
import BetRestrictionsHistory from '../BetRestrictionsHistory/index';
import ButtonSave from './ButtonSave';
import ButtonReset from './ButtonReset';

const mapStateToProps = (state) => {
    return {
        activeAppId: state.apps.activeAppId,
        isFetchingBetRestrictions: state.betRestrictions.isFetchingBetRestrictions,
        isFetchingMatrixData: state.betRestrictions.isFetchingMatrixData,
        isEvaluationOrderVisible: state.betRestrictions.isEvaluationOrderVisible,
    };
};

const mapDispatchToProps = (dispatch) => {
    return bindActionCreators({
        setEvaluationOrderVisibility
    }, dispatch);
};

class PanelHeader extends Component {
    constructor (props) {
        super(props);
        this._isDisabled = this._isDisabled.bind(this);
        this.state = {
            showNewBetRestrictionModal: false,
            showDeleteBetRestrictionModal: false,
            showBetRestrictionsHistoryModal: false,
        }
    }
    _isDisabled () {
        let { isFetchingMatrixData, isFetchingBetRestrictions } = this.props;
        return isFetchingMatrixData || isFetchingBetRestrictions;
    }
    render () {
        let {
            activeAppId,
            isEvaluationOrderVisible,
            setEvaluationOrderVisibility
        } = this.props;
        let eOrderClassName = isEvaluationOrderVisible ? 'phx-eye-outline' : 'phx-eye-off-outline';
        let eOrderTitle = isEvaluationOrderVisible ? 'Hide evaluation order' : 'Show evaluation order';
        let icoClassNames = cx('phxico', {'icon-medium': activeAppId === utilitiesConstants.APPLICATION_ID});
        return (
            <div className="header panel-header">
                <div className="panel-header-title"></div>
                <div className="panel-header-actions">
                    <button
                        className="button btn-box"
                        title="Add Bet Restriction"
                        onClick={() => {
                            this.setState({showNewBetRestrictionModal: true});
                        }}
                        disabled={this._isDisabled()}
                    ><i className={`${icoClassNames} phx-plus`}></i></button>
                    <button
                        className="button btn-box"
                        title="Delete Bet Restrictions"
                        onClick={() => {
                            this.setState({showDeleteBetRestrictionModal: true});
                        }}
                        disabled={this._isDisabled()}
                    ><i className={`${icoClassNames} phx-delete`}></i></button>
                    <button
                        className="button btn-box"
                        title="Bet Restrictions History"
                        onClick={() => {
                            this.setState({showBetRestrictionsHistoryModal: true});
                        }}
                        disabled={this._isDisabled()}
                    ><i className={`${icoClassNames} phx-calendar`}></i></button>
                    <button
                        className="button btn-box"
                        title={eOrderTitle}
                        onClick={() => {
                            setEvaluationOrderVisibility(!isEvaluationOrderVisible);
                        }}
                    ><i className={`${icoClassNames} ${eOrderClassName}`}></i></button>
                    <ButtonSave />
                    <ButtonReset />
                </div>
                {this.state.showNewBetRestrictionModal &&
                    <ModalWindow
                        isVisibleOn={true}
                        title="New Bet Restriction"
                        onClose={ () => { this.setState({showNewBetRestrictionModal: false}) }}
                        className="medium new-bet-restriction-modal"
                        closeButton={true}>
                        <h4>New Bet Restriction</h4>
                        <NewBetRestriction onClose={ () => { this.setState({showNewBetRestrictionModal: false}) }}/>
                    </ModalWindow>
                }
                {this.state.showDeleteBetRestrictionModal &&
                    <ModalWindow
                        isVisibleOn={true}
                        title="Delete Bet Restrictions"
                        onClose={ () => { this.setState({showDeleteBetRestrictionModal: false}) }}
                        className="medium new-bet-restriction-modal"
                        closeButton={true}>
                        <h4>Delete Bet Restrictions</h4>
                        <DeleteBetRestriction onClose={ () => { this.setState({showDeleteBetRestrictionModal: false}) }}/>
                    </ModalWindow>
                }
                {this.state.showBetRestrictionsHistoryModal &&
                    <ModalWindow
                        isVisibleOn={true}
                        title="Bet Restrictions History"
                        onClose={ () => { this.setState({showBetRestrictionsHistoryModal: false}) }}
                        className="medium new-bet-restriction-modal"
                        closeButton={true}>
                        <h4>Bet Restrictions History</h4>
                        <BetRestrictionsHistory onClose={ () => { this.setState({showBetRestrictionsHistoryModal: false}) }}/>
                    </ModalWindow>
                }
            </div>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(PanelHeader);