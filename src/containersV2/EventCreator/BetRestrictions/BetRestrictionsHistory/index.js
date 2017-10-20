import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import ConfirmModal from 'components/modalYesNo';
import LoadingIndicator from 'phxComponents/loadingIndicator';
import {
    fetchBetRestrictionsHistory,
    deleteBetRestrictionsHistory,
    updateBetRestrictionsHistory,
    restoreBetRestrictionsHistory,
    resetHistoryData,
} from '../actions';
import History from './History';
import UpdateDescriptionInput from './UpdateDescriptionInput';

const mapStateToProps = (state) => {
    return {
        activeAppId: state.apps.activeAppId,
        activeBetType: state.betRestrictions.activeBetType,
        activeHistory: state.betRestrictions.activeHistory,
        history: state.betRestrictions.history,
        isRestoringBetRestrictionsHistory: state.betRestrictions.isRestoringBetRestrictionsHistory,
        isRestoringBetRestrictionsHistoryFailed: state.betRestrictions.isRestoringBetRestrictionsHistoryFailed,
        isFetchingBetRestrictionsHistory: state.betRestrictions.isFetchingBetRestrictionsHistory,
        isFetchingBetRestrictionsHistoryFailed: state.betRestrictions.isFetchingBetRestrictionsHistoryFailed,
    };
};

const mapDispatchToProps = (dispatch) => {
    return bindActionCreators({
        fetchBetRestrictionsHistory,
        deleteBetRestrictionsHistory,
        updateBetRestrictionsHistory,
        restoreBetRestrictionsHistory,
        resetHistoryData
    }, dispatch);
};


class NewBetRestriction extends Component {
    constructor (props) {
        super(props);
        this.state = {
            showDeleteConfirmationModal: false,
            showUpdateModal: false,
            showRestoreConfirmationModal: false,
        };
    }
    componentWillMount () {
        this.props.fetchBetRestrictionsHistory(this.props.activeBetType);
    }
    componentWillUnmount () {
        this.props.resetHistoryData();
    }

    componentWillUpdate (nextProps) {
        let {isRestoringBetRestrictionsHistory, onClose} = this.props;
        if (isRestoringBetRestrictionsHistory && !nextProps.isRestoringBetRestrictionsHistory && !nextProps.isRestoringBetRestrictionsHistoryFailed) {
            onClose();
        }
    }

    render () {
        let {
            onClose,
            activeHistory,
            history,
            deleteBetRestrictionsHistory,
            updateBetRestrictionsHistory,
            restoreBetRestrictionsHistory,
            isFetchingBetRestrictionsHistory,
            isFetchingBetRestrictionsHistoryFailed,
        } = this.props;
        let content;
        if (isFetchingBetRestrictionsHistory) {
            content = 'LOADING';
        } else if (isFetchingBetRestrictionsHistoryFailed) {
            content = 'ERROR';
        } else if (history.length === 0) {
            content = 'NO_RESULTS';
        } else {
            content = 'CONTENT';
        }
        
        return (
            <div className="new-bet-restriction-container">
                <div className="modal-main-content">
                    <div className="form-wrapper">
                        <div className="header panel-header">
                            <div className="panel-header-title"></div>
                            <div className="panel-header-actions">
                                <button className="button btn-box" title="Restore Bet Restrictions" onClick={() => {
                                    this.setState({showRestoreConfirmationModal: true});
                                }} disabled={!activeHistory.id}><i className="phxico phx-refresh"></i></button>
                                <button className="button btn-box" title="Edit" onClick={() => {
                                    this.setState({showUpdateModal: true, newDescription: activeHistory.description});
                                }} disabled={!activeHistory.id}><i className="phxico phx-pencil"></i></button>
                                <button className="button btn-box" title="Delete" onClick={() => {
                                    this.setState({showDeleteConfirmationModal: true});
                                }} disabled={!activeHistory.id}><i className="phxico phx-delete"></i></button>
                            </div>
                        </div>
                        <div className="panel-content history-content">
                            {content === 'LOADING' &&
                                <div className="loading-container"><LoadingIndicator /></div>
                            }
                            {content === 'NO_RESULTS' &&
                                <div className="loading-container">No results found.</div>
                            }
                            {content === 'ERROR' &&
                                <div className="loading-container">Error loading.</div>
                            }
                            {content === 'CONTENT' &&
                                <History />
                            }
                            
                        </div>
                    </div>
                </div>
                <div className="modal-controls">
                    <button type="button" onClick={() => { onClose() }}>Close</button>
                </div>
                <ConfirmModal
                    title={'Warning'}
                    message={<p>Are you sure you want to delete '{activeHistory.description}'?</p>}
                    isVisibleOn={this.state.showDeleteConfirmationModal}
                    yesButtonLabel={'Yes'}
                    onYesButtonClickHandler={() => {
                        this.setState({showDeleteConfirmationModal: false});
                        deleteBetRestrictionsHistory(activeHistory.id);
                    }}
                    noButtonLabel={'No'}
                    onNoButtonClickedHandler={() => {
                        this.setState({showDeleteConfirmationModal: false})
                    }}
                />
                <ConfirmModal
                    title={'Rename Bet Restriction History'}
                    message={
                        <UpdateDescriptionInput
                            value={this.state.newDescription}
                            onChange={ value => this.setState({newDescription: value})}
                        />
                    }
                    isVisibleOn={this.state.showUpdateModal}
                    yesButtonLabel={'Save'}
                    onYesButtonClickHandler={() => {
                        this.setState({showUpdateModal: false});
                        updateBetRestrictionsHistory({id: activeHistory.id, description: this.state.newDescription});
                    }}
                    noButtonLabel={'Cancel'}
                    onNoButtonClickedHandler={() => {
                        this.setState({showUpdateModal: false})
                    }}
                />
                <ConfirmModal
                    title={'Warning'}
                    message={
                        <div>
                            <p>Are you sure you want to restore '{activeHistory.description}'?</p>
                            <p>The current matrix will be saved to history.</p>
                        </div>
                    }
                    isVisibleOn={this.state.showRestoreConfirmationModal}
                    yesButtonLabel={'Yes'}
                    onYesButtonClickHandler={() => {
                        this.setState({showRestoreConfirmationModal: false});
                        restoreBetRestrictionsHistory(activeHistory.id);
                    }}
                    noButtonLabel={'No'}
                    onNoButtonClickedHandler={() => {
                        this.setState({showRestoreConfirmationModal: false})
                    }}
                />
            </div>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(NewBetRestriction);