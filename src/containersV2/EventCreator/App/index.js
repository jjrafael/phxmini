import React from "react";
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import ensureAppIsAllowed from 'componentsV2/ensureAppIsAllowed/index';

//for login
import appNames from 'constants/appNames';
import { useApp, fetchAppPermissions } from 'actions/apps';
import { startupApp } from 'actions/startup';
import Sidebar from './Sidebar';
import Header from './Header';
import LoadingIndicator from 'phxComponents/loadingIndicator';
import ModalWindow from 'phxComponents/modal';
import ImportFeedsModalContainer from '../Event/FeedHistory/containers/ImportFeedsModalContainer';

import _ from 'underscore';
import { parseFeedHistoryFeedImportXML } from '../Event/FeedHistory/actions';
import { closeModal, openModal } from 'actions/modal';

const mapStateToProps = (state) => {
    const {
        isAddingEventPathDetails,
        isSavingEventPathChanges,
        isDeletingEventPath,
    } = state.eventCreatorEventPath;
    const {
        isUpdatingMarketDetails,
        isUpdatingMarketOutcomes,
        isUpdatingMarketBooks,
        isDeletingMarket,
        isCreatingNewMarkets
    } = state.eventCreatorEventMarkets;
    const {
        isCreatingNewEvent,
        isUpdatingEvent,
        isDeletingEvent,
    } = state.eventCreatorEvent;

    const {
        isUpdatingBetRestrictions,
        isAddingNewBetRestriction,
        isDeletingBetRestrictions,
        isDeletingBetRestrictionsHistory,
        isUpdatingBetRestrictionsHistory,
        isRestoringBetRestrictionsHistory,
    } = state.betRestrictions;

    const { isSavingPathsOrder } = state.sportsTree;
    const { isFetchingAppPermissions } = state.apps;

    const {
        parsedFeedXMLData,
        isParsingFeedHistoryFeedXML
    } = state.feedHistory;

    return {
        startup: state.startup,
        user: state.user.details,
        isFetchingAppPermissions,
        isDeletingEvent,
        isDeletingEventPath,
        isAddingEventPathDetails,
        isSavingEventPathChanges,
        isCreatingNewEvent,
        isUpdatingEvent,
        isUpdatingMarketDetails,
        isUpdatingMarketOutcomes,
        isUpdatingMarketBooks,
        isDeletingMarket,
        isCreatingNewMarkets,
        isSavingPathsOrder,
        isUpdatingBetRestrictions,
        isAddingNewBetRestriction,
        isDeletingBetRestrictions,
        isDeletingBetRestrictionsHistory,
        isUpdatingBetRestrictionsHistory,
        isRestoringBetRestrictionsHistory,
        parsedFeedXMLData,
        isParsingFeedHistoryFeedXML,
        modals : state.modals
    }
}

const mapDispatchToProps = (dispatch) => {
    return bindActionCreators({
        startupApp,
        useApp,
        fetchAppPermissions,
        parseFeedHistoryFeedImportXML,
        openModal
    }, dispatch);
}

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            feedXMLData : {
                contents : []
            },
            fileDetails : {},
            fileToProcess : {},
        }
    }
    
    componentDidUpdate(prevProps, prevState){
        let {
            parsedFeedXMLData,
            isParsingFeedHistoryFeedXML
        } = this.props;
        if(prevProps.isParsingFeedHistoryFeedXML && isParsingFeedHistoryFeedXML === false) {
            this.setState({
                feedXMLData : this.props.parsedFeedXMLData
            })
        }
        
    }

    componentDidMount() {
        this.props.fetchAppPermissions(this.props.user.id, 1);
        this.props.startupApp(appNames.EVENT_CREATOR);
        this.props.useApp(this.props.user.id, 1);
    }

    _renderLoadingIndicator() {
        return (
            <div className="loading tcenter">
                <i className="phxico phx-spinner phx-spin"></i>
                <h3>Loading Event Creator</h3>
            </div>
        )
    }

    _renderModal() {
        const {
            isDeletingEvent,
            isDeletingEventPath,
            isAddingEventPathDetails,
            isSavingEventPathChanges,
            isCreatingNewEvent,
            isUpdatingEvent,
            isUpdatingMarketDetails,
            isUpdatingMarketOutcomes,
            isUpdatingMarketBooks,
            isDeletingMarket,
            isCreatingNewMarkets,
            isSavingPathsOrder,
            isUpdatingBetRestrictions,
            isAddingNewBetRestriction,
            isDeletingBetRestrictions,
            isDeletingBetRestrictionsHistory,
            isUpdatingBetRestrictionsHistory,
            isRestoringBetRestrictionsHistory,
        } = this.props;


        const isLoadingModalVisible = isAddingEventPathDetails ||
            isSavingEventPathChanges ||
            isDeletingEvent ||
            isDeletingEventPath ||
            isCreatingNewEvent ||
            isUpdatingEvent ||
            isUpdatingMarketDetails ||
            isUpdatingMarketOutcomes ||
            isUpdatingMarketBooks ||
            isDeletingMarket ||
            isCreatingNewMarkets ||
            isSavingPathsOrder ||
            isUpdatingBetRestrictions ||
            isAddingNewBetRestriction ||
            isDeletingBetRestrictions ||
            isDeletingBetRestrictionsHistory ||
            isUpdatingBetRestrictionsHistory ||
            isRestoringBetRestrictionsHistory
        if (isLoadingModalVisible) {
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
    };

    render() {
        const { startup, user, parseFeedHistoryFeedImportXML, openModal, modals, isFetchingAppPermissions } = this.props;
        const {feedXMLData, fileDetails, fileToProcess} = this.state;
        const app = startup.apps[appNames.EVENT_CREATOR];
        const isAppStartingUp =  app && app.isStartingUp;
        if(!startup.apps[appNames.EVENT_CREATOR] || isAppStartingUp || isFetchingAppPermissions) {
            return this._renderLoadingIndicator();
        }
        //after startup
        return (
            <div id="app-event-creator">
                <Header />
                <section className="page-container">
                    <Sidebar location={this.props.location}/>
                    <div className="page-main no-footer">
                        {this.props.children}
                    </div>
                    <ImportFeedsModalContainer parsedFeedXMLData={feedXMLData} parsedFileDetails={fileDetails} fileToProcess={fileToProcess}/>
                    <div className="hidden">
                        <input type="file" accept=".xml" className="hidden" id="importXML" name="importXML" onChange={(e) => {
                            let getBuffer = (resolve) => {
                                let reader = new FileReader();
                                reader.readAsArrayBuffer(fileData);
                                reader.onload = function() {
                                  let arrayBuffer = reader.result
                                  let bytes = new Uint8Array(arrayBuffer);
                                  resolve(bytes);
                                }
                            }
                            let files = e.target.files;
                            let fileData = new Blob([files[0]]);
                            let promise = new Promise(getBuffer);
                            promise.then( data => {
                                this.setState({
                                    fileDetails : files[0],
                                    fileToProcess : {
                                        fileName : files[0].name,
                                        importFileData : Array.from(data)
                                    }
                                })
                                parseFeedHistoryFeedImportXML({
                                    fileName : files[0].name,
                                    importFileData : Array.from(data)
                                })
                                if(!modals.importFeedHistory)
                                    openModal('importFeedHistory');
                            }).catch( err => {
                                console.log('Error: ',err);
                            });

                        }}/>
                    </div>
                </section>
                {this._renderModal()}
            </div>
        )
    }
}


export default connect(mapStateToProps, mapDispatchToProps)(ensureAppIsAllowed({appKey: 'EVENT_CREATOR'})(App));
