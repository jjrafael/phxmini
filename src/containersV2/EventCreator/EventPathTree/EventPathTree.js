'use strict';
import React, { PropTypes } from "react";
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import appModes from './constants';
import { objectToArray, pruneNullOrUndefined, arrayFindWhere } from 'phxUtils';
import EventPathForm from './EventPathForm';
import { fetchEventPathTags, clearEventPathTagsError, fetchEventPathDetails, addEventPath, editEventPath, clearEventPathDetailsError, clearDeleteEventPathErrors, selectPath as selectEventCreatorPath } from './actions';
// import {  } from './actions';
import ModalWindow from 'phxComponents/modal';
import ModalConfirm from 'phxComponents/modalConfirm';
import LoadingIndicator from 'phxComponents/loadingIndicator';
import EventPathMain from './index';

import { enableHeaderButtons } from '../App/actions';
const appModeList = {
    'READ_MODE': 'read',
    'CREATE_MODE': 'create',
    'EDIT_MODE': 'edit',
    'DELETE_MODE': 'delete'
};

function mapStateToProps(state) {
    return {
        sportsParentId: state.eventCreatorEventPath.selectedSport ?  state.eventCreatorEventPath.selectedSport.id : null,
        selectedEventPath: state.eventCreatorEventPath.selectedPath,

        eventPathTagList: state.eventCreatorEventPath.eventPathTagList,
        isFetchingEventPathTagList: state.eventCreatorEventPath.isFetchingEventPathTagList,
        fetchingEventPathTagListFailed: state.eventCreatorEventPath.fetchingEventPathTagListFailed,
        fetchEventPathTagListErrMsg: state.eventCreatorEventPath.errorMessage,

        eventPathDetails: state.eventCreatorEventPath.eventPathDetails,
        isFetchingEventPathDetails: state.eventCreatorEventPath.isFetchingEventPathDetails,
        fetchingEventPathDetailsFailed: state.eventCreatorEventPath.fetchingEventPathDetailsFailed,

        isAddingEventPathDetails: state.eventCreatorEventPath.isAddingEventPathDetails,
        addingEventPathDetailsFailed: state.eventCreatorEventPath.addingEventPathDetailsFailed,

        isSavingEventPathChanges: state.eventCreatorEventPath.isSavingEventPathChanges,
        savingEventPathChangesFailed: state.eventCreatorEventPath.savingEventPathChangesFailed,

        isDeletingEventPath: state.eventCreatorEventPath.isDeletingEventPath,
        deletingEventPathFailed: state.eventCreatorEventPath.deletingEventPathFailed,
        deleteEventPathError: state.eventCreatorEventPath.deleteEventPathError,

        eventPathDetailsErrMsg: state.eventCreatorEventPath.errorMessage,

        currentMode: state.eventCreatorModes.currentMode,
    };
}


function mapDispatchToProps(dispatch) {
    return bindActionCreators({
            fetchEventPathTags,
            fetchEventPathDetails,
            addEventPath,
            editEventPath,
            clearEventPathTagsError,
            clearEventPathDetailsError,
            clearDeleteEventPathErrors,
            selectEventCreatorPath,
            enableHeaderButtons
    } , dispatch);
}


class EventPath extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            hadTransaction: false,
            transactionType: appModeList.READ_MODE,
        }
    }

    componentDidMount() {
        // console.log(appModeList);
        this.props.fetchEventPathTags();
        this.props.enableHeaderButtons('EVENTPATH');
    }

    componentWillUpdate(nextProps, nextState) {
        const {sportsParentId, selectedEventPath} = nextProps;
        const prevSelectedSportsId = this.props.sportsParentId;
        const prevSelectedEventPath = this.props.selectedEventPath;

        const eventPathId = selectedEventPath
          ? selectedEventPath.id
          : null;
        const prevEventPathId = prevSelectedEventPath
          ? prevSelectedEventPath.id
          : null;

        if (eventPathId && (eventPathId !== prevEventPathId)) {
            this.props.fetchEventPathDetails(eventPathId);
        } else if (sportsParentId &&
            (sportsParentId !== prevSelectedSportsId ||
                (prevEventPathId !== null && eventPathId === null/*current event path id is nullified*/))) {
            this.props.fetchEventPathDetails(sportsParentId);
        }
    }

    componentDidUpdate(prevProps, prevState) {
        if(
            (prevProps.isSavingEventPathChanges && this.props.isSavingEventPathChanges === false && !this.props.savingEventPathChangesFailed) ||
            (prevProps.isAddingEventPathDetails && this.props.isAddingEventPathDetails === false && !this.props.addingEventPathDetailsFailed)
        ) {
            this.setState({
                hadTransaction: true
            })
        }

        if(prevProps.isDeletingEventPath && this.props.isDeletingEventPath === false && !this.props.deletingEventPathFailed) {
            this.props.selectEventCreatorPath(null)
        }
    }

    _getEventPathDetails() {
        const { currentMode, sportsParentId, selectedEventPath, eventPathDetails, eventPathTagList } = this.props;
        const eventPathId = selectedEventPath ? selectedEventPath.id : null;
        const createMode = currentMode === appModeList.CREATE_MODE;
        let formInfoValues;
        if (createMode) {
            formInfoValues = {
                eventPathId: -1,
                parentId: eventPathId ? eventPathId : sportsParentId,
                description: null,
                feedCode: null,
                tagId: eventPathTagList[0].id,
                tag: eventPathTagList[0].description,
                suppressP2P: false,
                comments: null,
                publishSort: null, // bug from server short = sort
                eventPathCode: null,
                grade: 1,
                publish: true
            };
        } else {
            formInfoValues = {
            eventPathId: eventPathDetails.id,
            parentId: eventPathDetails.parentId,
            description: eventPathDetails.description,
            feedCode: eventPathDetails.feedCode,
            tagId: eventPathDetails.tagId,
            tag: eventPathDetails.tag,
            suppressP2P: eventPathDetails.suppressP2P,
            comments: eventPathDetails.comments,
            publishSort: eventPathDetails.publishShort, // bug from server short = sort
            eventPathCode: eventPathDetails.eventPathCode,
            grade: eventPathDetails.grade
                ? eventPathDetails.grade
                : 1,
            publish: eventPathDetails.publish
            };
        }

        formInfoValues.tagList = eventPathTagList;
        // console.log(formInfoValues);
        return formInfoValues;
    }

    _eventPathFormHandler(formData) {
        const { currentMode } = this.props
        const { eventPathId, parentId, description, feedCode, tagId, tag, tagList, suppressP2P, comments, publishSort, eventPathCode, grade, publish } = formData;
        const newTagValue = arrayFindWhere(tagList, { id: parseInt(tagId)}).description;

        if (currentMode === appModeList.EDIT_MODE) {
            this.props.editEventPath(eventPathId, pruneNullOrUndefined({
                parentId, tag: newTagValue, description, feedCode, publishSort, eventPathCode, grade, comments, suppressP2p: suppressP2P, published: true
            }));
            this.setState({transactionType: appModeList.EDIT_MODE});
        } else if (currentMode === appModeList.CREATE_MODE) {
            this.props.addEventPath(pruneNullOrUndefined({
                parentId, tag: newTagValue, description, feedCode, publishSort, eventPathCode, grade, comments, suppressP2p: suppressP2P, published: true
            }));
            this.setState({transactionType: appModeList.CREATE_MODE})
        }
    }

    _onModalCloseHandler() {
        const {fetchingEventPathTagListFailed, fetchingEventPathDetailsFailed, addingEventPathDetailsFailed, savingEventPathChangesFailed, deletingEventPathFailed} = this.props;

        if (fetchingEventPathTagListFailed) {
            this.props.clearEventPathTagsError();
        }

        if (fetchingEventPathDetailsFailed || addingEventPathDetailsFailed || savingEventPathChangesFailed ) {
            this.props.clearEventPathDetailsError();
        }

        if(deletingEventPathFailed) {
            this.props.clearDeleteEventPathErrors();
        }

        if (this.state.hadTransaction) {
            this.setState({
                hadTransaction: false,
                transactionType: appModeList.READ_MODE,
            });
        }
    }

    _renderForm() {
        const { currentMode } = this.props;
        const isFieldsLocked = (currentMode === appModeList.READ_MODE);

        return (
            <EventPathForm
                appMode={currentMode}
                initialValues={this._getEventPathDetails()}
                isFieldsLocked={isFieldsLocked}
                eventPathFormSubmitHandler={this._eventPathFormHandler.bind(this)} />
        )

    }

    _renderModal() {
        const {
                isDeletingEventPath, deletingEventPathFailed, deleteEventPathError,
                isFetchingEventPathDetails,
                fetchingEventPathDetailsFailed,
                isAddingEventPathDetails,
                addingEventPathDetailsFailed,
                isSavingEventPathChanges,
                savingEventPathChangesFailed,
                fetchingEventPathTagListFailed,
                eventPathDetailsErrMsg
            } = this.props;

        const isLoadingModalVisible = isAddingEventPathDetails || isSavingEventPathChanges || isDeletingEventPath;
        if(isLoadingModalVisible) {
            return (
                <ModalWindow
                    key="loading-modal"
                    className="small-box"
                    title="Loading"
                    name="error"
                    isVisibleOn={true}
                    shouldCloseOnOverlayClick={false}
                    closeButton={false}>
                    <div>
                        <LoadingIndicator/>
                    </div>
                </ModalWindow>
            );
        }


        const isModalErrorVisible = fetchingEventPathTagListFailed || fetchingEventPathDetailsFailed || addingEventPathDetailsFailed || savingEventPathChangesFailed || deletingEventPathFailed;
        if (isModalErrorVisible) {
            return (
                <ModalWindow
                    key="error-modal"
                    className="xsmall"
                    title="Error"
                    name="error"
                    isVisibleOn={isModalErrorVisible}
                    shouldCloseOnOverlayClick={true}
                    closeButton={true}
                    onClose={this._onModalCloseHandler.bind(this)}>
                    <div>
                        <h4>Error</h4>
                        <div style={{'padding': '5px'}}>
                            <p className="tcenter info-msg">
                                <i className="phxico phx-warning"></i>
                                {deletingEventPathFailed ? deleteEventPathError : eventPathDetailsErrMsg}
                            </p>
                        </div>
                    </div>
                </ModalWindow>
            );
        };

        const {currentMode} = this.props;
        const {hadTransaction, transactionType} = this.state;
        const isModalSuccessVisible = hadTransaction;
        const isTransCreateOrEdit = transactionType === appModeList.CREATE_MODE || transactionType === appModeList.EDIT_MODE;
        if (isModalSuccessVisible && isTransCreateOrEdit) {
            let msg = 'Event Path successfully ' + ((transactionType === appModeList.CREATE_MODE) ? 'created.' : 'updated.');
            return (
                <ModalConfirm
                    isVisibleOn={isModalSuccessVisible}
                    title="Success"
                    message={msg}
                    customConfirmText="OK"
                    removeCancel={true}
                    onConfirm={this._onModalCloseHandler.bind(this)}
                    />
            )
        };

    };

    render() {
        const {
            isFetchingEventPathTagList,
            isFetchingEventPathDetails,
        } = this.props;

        if (!isFetchingEventPathTagList || !isFetchingEventPathDetails) {
            return (
                <div>
                <EventPathMain/>
                <div className="main-wrapper">
                    { this._renderForm() }
                    { this._renderModal() }
                </div>
                </div>
            );
        } else {
            return null;
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(EventPath);