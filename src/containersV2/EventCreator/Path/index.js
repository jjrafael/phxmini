import React from "react";
import { hashHistory } from "react-router";
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import _ from 'underscore';
import { mapPermissionsToProps } from 'componentsV2/checkPermission/index';
import { permissionsCode } from 'containersV2/EventCreator/App/constants';
import { enableHeaderButtons } from '../App/actions';
import { fetchEventPathDetails, editEventPath, addEventPath, setEventPathActiveTabIndex } from './actions';

import TabComponent from 'components/Tabs';
import EventPathForm from './EventPathForm';
import EventPathTab from './EventPathTab';
import BulkUpdate from 'containersV2/EventCreator/BulkUpdate';
import Opponents from 'eventCreatorOpponentsContainers/Opponents';
import ConfirmModal from 'componentsV2/Modal/ConfirmModal';
import BetRestrictions from 'containersV2/EventCreator/BetRestrictions/index';
import { betRestrictionHasChanges } from 'containersV2/EventCreator/BetRestrictions/helpers';
import { modes } from './constants';
import { paths } from '../App/constants';
import { clearSelectedPath } from '../App/actions';
import EventPathBottomBar from './EventPathBottomBar';
import LoadingIndicator from 'phxComponents/loadingIndicator';
import ModalWindow from 'components/modal';
import { toastr } from 'phxComponents/toastr/index';

const mapStateToProps = (state) => {
    return {
        tags: state.apiConstants.values.tags || [],
        activePage: state.eventCreatorApp.activePage,
        isBulkUpdateActive: state.eventCreatorApp.isBulkUpdateActive,
        isSaveButtonDisabled: state.eventCreatorApp.isSaveButtonDisabled,
        activePathId: state.sportsTree.activePathId,
        eventPathDetails: state.eventCreatorEventPath.eventPathDetails,
        activeTabIndex: state.eventCreatorEventPath.activeTabIndex,
        eventPathMode: state.eventCreatorEventPath.eventPathMode,
        matrixDataCache: state.betRestrictions.matrixDataCache,
    }
};

const mapDispatchToProps = (dispatch) => {
    const actions = {
        enableHeaderButtons,
        fetchEventPathDetails,
        editEventPath,
        addEventPath,
        setEventPathActiveTabIndex,
        clearSelectedPath,
    }
    return bindActionCreators(actions, dispatch);
};

class EventPath extends React.Component {
    constructor (props) {
        super(props);
        this.state = {
            showConfirmationModal: false
        }
    }

    _getPathLevel(level) {
        if (level === 1) {
            return paths.SPORT;
        } else if (level === 2){
            return paths.COUNTRY;
        } else {
            return paths.LEAGUE;
        }
    }

    componentDidMount () {
        this.props.enableHeaderButtons(this._getPathLevel(this.props.eventPathDetails.level))
    }

    componentWillUpdate(nextProps) {    
        if (this.props.eventPathDetails.level !== nextProps.eventPathDetails.level) {
            this.props.enableHeaderButtons(this._getPathLevel(nextProps.eventPathDetails.level))
        }
    }

    componentWillUnmount () {
        this.props.setEventPathActiveTabIndex(0);
    }

    render() {
        const { activePage, params, matrixDataCache, isSaveButtonDisabled, isBulkUpdateActive, permissions } = this.props;
        const { isDelAllPlayerOfEPPerforming, isDelAllOppOfEPPerforming } = this.props;
        let isOnCreateMode = this.props.eventPathMode === modes.CREATE;
        let pathId = Number(params.pathId);
        let items = [
            {title: 'Event Path', content: <EventPathTab pathId={pathId} />},
            {title: 'Opponents', content: <Opponents {...params} {...this.props}/>},
        ];
        if (permissions.includes(permissionsCode.UPDATE_BET_RESTRICTIONS)) {
            items.push({title: 'Bet Restrictions', content:  <BetRestrictions {...params} {...this.props}/> });
        }
        return (
            <div style={{height: '100%'}}>
                {isBulkUpdateActive 
                    ? <TabComponent
                        selectedIndex={0}
                        className={`tabular`}
                        items={[{title: 'Bulk Update', content: <BulkUpdate />}]}
                    />
                    : <TabComponent
                        className={`tabular`}
                        selectedIndex={this.props.activeTabIndex}
                        onSelect={(index, callback) => {
                            let brHasChanges = betRestrictionHasChanges(matrixDataCache);
                            if (brHasChanges || !isSaveButtonDisabled) {
                                this.setState({showConfirmationModal: true});
                                this.pendingIndex = index;
                            } else {
                                this.props.setEventPathActiveTabIndex(index)
                            }
                        }}
                        items={items}
                    />
                }
                <ConfirmModal
                    isVisible={this.state.showConfirmationModal}
                    onConfirm={e => {
                        this.setState({showConfirmationModal: false});
                        this.props.setEventPathActiveTabIndex(this.pendingIndex)
                    }}
                    onCancel={e => {
                        this.setState({showConfirmationModal: false})
                    }}
                />

            </div>
            
        )
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(mapPermissionsToProps(EventPath));
