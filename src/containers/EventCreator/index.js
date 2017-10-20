import React from "react";
import { hashHistory } from "react-router";
import 'react-day-picker/lib/style.css';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import appNames from '../../constants/appNames';
import { useApp } from '../../actions/apps';
import { startupApp } from '../../actions/startup';
import Header from './Header';
import Sidebar from '../../containersV2/EventCreator/App/Sidebar';
import RoutesTab from 'eventCreatorComponents/RoutesTab';
import { push } from 'react-router-redux';
import { store } from 'phxStore';
import mainTabList from 'eventCreatorConfigs/mainTabList';
import { setEventCreatorPage } from 'eventCreatorActions/eventCreatorPages';
import ecPagesConstants from 'eventCreatorConstants/eventCreatorPages';
import { submit } from 'redux-form'
import { setEventCreatorMode } from 'eventCreatorActions/eventCreatorModes';
import appModes from 'phxConstants/appModes';



function mapStateToProps(state) {
    return {
        user: state.user,
        startup: state.startup,
        currentMode: state.eventCreatorModes.currentMode,
        currentPage: state.eventCreatorPages.currentEventCreatorPage,
        selectedId: state.eventCreatorEventPath.selectedPath ? state.eventCreatorEventPath.selectedPath.id : null
    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        startupApp,
        useApp,
        setEventCreatorPage,
        setEventCreatorMode,
        submit,
        push
    }, dispatch);
}

class EventCreator extends React.Component {
    componentDidMount() {
        this.props.startupApp(appNames.EVENT_CREATOR);
        this.props.useApp(this.props.user.details.id, 1);
    }

    _renderLoadingIndicator() {
        return (
            <div className="loading tcenter">
                <i className="phxico phx-spinner phx-spin"></i>
                <h3>Loading Event Creator</h3>
            </div>
        )
    }

    _redirectTo(pageName) {
        const { currentPage } = this.props;
        const page = mainTabList.find((page)=> page.pageName === pageName);
        if(page && currentPage !== page.pageName) {
            this._onTabSelected(page.pageName, page.routePath);
        }
    }

    _onTabSelected(selectedPagename, selectedRoutePath) {
        store.dispatch(push(selectedRoutePath));
        this.props.setEventCreatorPage(selectedPagename);
    }

    _onMenuClickHandler(event, menuAction) {
        const { currentPage, submit } = this.props;
        switch(menuAction) {
            // EVENT PATH
            case 'createPath':
                this.props.setEventCreatorMode(appModes.CREATE_MODE);
                this._redirectTo(ecPagesConstants.EVENT_PATH);
            break;

            case 'edit':
                this.props.setEventCreatorMode(appModes.EDIT_MODE);
                this._redirectTo(ecPagesConstants.EVENT_PATH);
            break;

            case 'cancel':
                this.props.setEventCreatorMode(appModes.READ_MODE);
                this._redirectTo(ecPagesConstants.EVENT_PATH);
            break;

            case 'delete':
                this.props.setEventCreatorMode(appModes.READ_MODE);
                this._redirectTo(ecPagesConstants.EVENT_PATH);
            break;

            case 'save':
                {
                    let formName;

                    if (currentPage === ecPagesConstants.EVENT_PATH) {
                        formName = 'EventPathForm';
                    } else if (currentPage === ecPagesConstants.EVENT_PATH) {
                        formName = 'OpponentsForm';
                    } else { // bet restrictions
                        formName = 'BetRestrictionsForm';
                    }

                    submit(formName);
                    submit('GameEventForm');
                }

            break;

            case 'createRank':
                this.props.push(`event-creator/event-path/${this.props.selectedId}/rank`);
            break;

            case 'createGame':
                this.props.push(`event-creator/event-path/${this.props.selectedId}/game`);
            break;

            case 'createMarket':
            break;

            // OPPONENTS

            // BET RESTRICTIONS

            // OTHERS
            default:
            break;
        };
    }


    render() {
        const { startup, user, currentPage } = this.props;
        const isAppStartingUp = startup.apps[appNames.EVENT_CREATOR] && startup.apps[appNames.EVENT_CREATOR].isStartingUp;
        const appStartUpFailed = startup.apps[appNames.EVENT_CREATOR] && !startup.apps[appNames.EVENT_CREATOR].isStartingUp && startup.apps[appNames.EVENT_CREATOR].startupFailed;
        return (
            <div id="app-event-creator">
                {(!startup.apps[appNames.EVENT_CREATOR] || isAppStartingUp) &&
                    this._renderLoadingIndicator()
                }
                {startup.apps[appNames.EVENT_CREATOR] && !isAppStartingUp && !appStartUpFailed &&
                    [
                    <Header key="header" menuClickHandler={this._onMenuClickHandler.bind(this)}/>,
                    <section key="page-container" className="page-container">
                        <Sidebar/>
                        <div className="page-main no-footer">
                            {this.props.children}
                        </div>
                    </section>,
                    ]
                }
            </div>
        )
    }
}


export default connect(mapStateToProps, mapDispatchToProps)(EventCreator);
