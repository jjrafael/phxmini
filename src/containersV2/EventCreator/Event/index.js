import React from "react";
import GameEvent from './GameEvent/UpdateContainer';
import RankEvent from './RankEvent/UpdateContainer';

import NewMarket from '../EventMarkets/MarketTypes/NewMarket';
import { mapPermissionsToProps } from 'componentsV2/checkPermission/index';
import { permissionsCode } from 'containersV2/EventCreator/App/constants';
import { hashHistory } from "react-router";
import { push } from 'react-router-redux';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { fetchEvent } from './actions';

import TabComponent from 'components/Tabs';
import { enableHeaderButtons } from '../App/actions';
import { paths } from '../App/constants';
import NewMarketModal from '../EventMarkets/MarketTypes/index';
import EditMarketModal from '../EventMarkets/EditMarket/index';

import Market from 'containersV2/EventCreator/Markets/';
import BulkUpdate from 'containersV2/EventCreator/BulkUpdate';
import GameResults from 'containersV2/EventCreator/GameResults/';
import ConfirmModal from 'componentsV2/Modal/ConfirmModal';
import BetRestrictions from 'containersV2/EventCreator/BetRestrictions/index';
import { betRestrictionHasChanges } from 'containersV2/EventCreator/BetRestrictions/helpers';
import FeedHistory from './FeedHistory/';

const mapStateToProps = (state) => {
    let activePathId = state.sportsTree.activePathId;
    let pathsMap = state.sportsTree.pathsMap;
    return {
        activePath: pathsMap[activePathId],
        eventStatus: state.eventCreatorEvent.eventStatus,
        event: state.eventCreatorEvent.event,
        newMarket: state.modals.newMarket,
        editMarket: state.modals.editMarket,
        datesFilter: state.sportsTree.datesFilter,
        marketStatusFilter: state.sportsTree.marketStatusFilter,
        matrixDataCache: state.betRestrictions.matrixDataCache,
        isSaveButtonDisabled: state.eventCreatorApp.isSaveButtonDisabled,
        isBulkUpdateActive: state.eventCreatorApp.isBulkUpdateActive,
        activePathId,
    }
};

const mapDispatchToProps = (dispatch) => {
    const actions = {
        fetchEvent,
        enableHeaderButtons,
        push,
    }
    return bindActionCreators(actions, dispatch);
};

class Event extends React.Component {
    constructor (props) {
        super(props);
        this.state = {
            activeTabIndex: 0,
            showConfirmationModal: false
        }
    }
    
    componentDidMount() {
        let { activePath } = this.props;
        const { eventId } =this.props.params;
        if (eventId && activePath) {
            this.props.fetchEvent(activePath.id, activePath.eventType === 2 ? true : false);
        }
    };

    _getSportsTreeParams () {
        const { datesFilter, marketStatusFilter } = this.props;
        const { fromDate, toDate } = formatFilterDates(datesFilter);
        return { fromDate, toDate, marketStatusIds: marketStatusFilter }
    }

    componentWillUpdate(nextProps) {
        let nextActivePath = nextProps.activePath;
        let nextActivePathId = nextProps.activePathId;
        if (nextActivePathId && this.props.activePathId === nextActivePathId) {
            if (!this.props.activePath && nextActivePath) {
                this.setState({activeTabIndex: 0});
                this.props.fetchEvent(nextActivePathId, nextActivePath.eventType === 2 ? true : false);
            }
        } else if (this.props.activePathId !== nextActivePathId) {
            this.setState({activeTabIndex: 0});
            if (nextActivePath) {
                this.props.fetchEvent(nextActivePathId, nextActivePath.eventType === 2 ? true : false);
            }
        }
    }

    render() {
        const { eventStatus, event, matrixDataCache, permissions, isSaveButtonDisabled, isBulkUpdateActive } = this.props;
        if(eventStatus === 'LOADING' || eventStatus === 'ERROR') {
            return <h3>{eventStatus}</h3>;
        }

        if(event && event.eventType === 'GAMEEVENT') {
            const hasFeedHistory = event.feedCode !== null;
            const gameEventContent = <div className="game-event">
                <div className={`${hasFeedHistory ? 'desktop-three-quarter' : 'desktop-full'}`}>
                    <GameEvent />
                </div>
                {
                    hasFeedHistory ? <div className="desktop-quarter">
                        <div>
                            <FeedHistory />
                        </div>
                    </div> : null
                }
            </div>
            let items = [
                {title: 'Game Event', content: gameEventContent },
                {title: 'Game Results', content: <GameResults />},
                {title: 'Markets', content: <Market /> },
            ]
            if (permissions.includes(permissionsCode.UPDATE_BET_RESTRICTIONS)) {
                items.push({title: 'Bet Restrictions', content: <BetRestrictions />});
            }
            return  (
                <div className="event-container">
                    { isBulkUpdateActive
                        ? <TabComponent
                            selectedIndex={0}
                            className={`tabular`}
                            items={[{title: 'Bulk Update', content: <BulkUpdate /> }]}
                        />
                        : <TabComponent 
                            className={`tabular`}
                            selectedIndex={this.state.activeTabIndex}
                            onSelect={(index, callback) => {
                                let brHasChanges = betRestrictionHasChanges(matrixDataCache);
                                if (brHasChanges || !isSaveButtonDisabled) {
                                    this.setState({showConfirmationModal: true});
                                    this.pendingIndex = index;
                                } else {
                                    this.setState({activeTabIndex: index});
                                }
                            }}
                            items={items} 
                        />
                    }
                    <ConfirmModal
                        isVisible={this.state.showConfirmationModal}
                        onConfirm={e => {
                            this.setState({showConfirmationModal: false});
                            this.setState({activeTabIndex: this.pendingIndex});
                        }}
                        onCancel={e => {
                            this.setState({showConfirmationModal: false})
                        }}
                    />
                    {this.props.newMarket &&
                        <NewMarketModal />
                    }
                    {this.props.editMarket &&
                        <EditMarketModal />
                    }
                </div>
            )
        }

        if(event && event.eventType === 'RANKEVENT') {
            const hasFeedHistory = event.feedCode !== null;
            const rankEventContent = <div className="rank-event">
                <div className={`${hasFeedHistory ? 'desktop-three-quarter' : 'desktop-full'}`}>
                    <RankEvent />
                </div>
                {
                    hasFeedHistory ? <div className="desktop-quarter">
                        <div>
                            <FeedHistory />
                        </div>
                    </div> : null
                }
            </div>;

            let items = [
                {title: 'Rank Event', content: rankEventContent},
                {title: 'Markets', content: <Market />}
            ]
            
            if (permissions.includes(permissionsCode.UPDATE_BET_RESTRICTIONS)) {
                items.push({title: 'Bet Restrictions', content: <BetRestrictions />});
            }
            return  (
                <div className="event-container">
                    { isBulkUpdateActive
                        ? <TabComponent
                            selectedIndex={0}
                            className={`tabular`}
                            items={[{title: 'Bulk Update', content: <BulkUpdate /> }]}
                        />
                        : <TabComponent
                            className={`tabular`}
                            selectedIndex={this.state.activeTabIndex}
                            onSelect={(index, callback) => {
                                let brHasChanges = betRestrictionHasChanges(matrixDataCache);
                                if (brHasChanges) {
                                    this.setState({showConfirmationModal: true});
                                    this.pendingIndex = index;
                                } else {
                                    this.setState({activeTabIndex: index});
                                }
                            }}
                            items={items} 
                        />
                    }
                    <ConfirmModal
                        isVisible={this.state.showConfirmationModal}
                        onConfirm={e => {
                            this.setState({showConfirmationModal: false});
                            this.setState({activeTabIndex: this.pendingIndex});
                        }}
                        onCancel={e => {
                            this.setState({showConfirmationModal: false})
                        }}
                    />
                    {this.props.newMarket &&
                        <NewMarketModal />
                    }
                    {this.props.editMarket &&
                        <EditMarketModal />
                    }
                </div>
            )            
        }

        return null;
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(mapPermissionsToProps(Event));