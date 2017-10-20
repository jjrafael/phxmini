import React from "react";
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import TabComponent from 'components/Tabs';

import { fetchMarket } from './actions';
import { enableHeaderButtons } from '../App/actions';
import { paths } from '../App/constants';
import Market from './Market/index';
import ConfirmModal from 'componentsV2/Modal/ConfirmModal';
import BulkUpdate from 'containersV2/EventCreator/BulkUpdate';

const mapStateToProps = (state) => {
    let { market, isFetchingMarket, isFetchingMarketFailed } = state.eventCreatorEventMarkets
    return {
        isSaveButtonDisabled: state.eventCreatorApp.isSaveButtonDisabled,
        isBulkUpdateActive: state.eventCreatorApp.isBulkUpdateActive,
        market,
        isFetchingMarket,
        isFetchingMarketFailed
    }
};

const mapDispatchToProps = (dispatch) => {
    const actions = {
        fetchMarket,
        enableHeaderButtons
    }
    return bindActionCreators(actions, dispatch);
};

class EventMarkets extends React.Component {
    constructor (props) {
        super(props);
        this.state = {
            activeTabIndex: 0,
            showConfirmationModal: false
        }
    }
    componentDidMount() {
        this.props.enableHeaderButtons(paths.MARKET);
        this.props.fetchMarket(this.props.params.marketId);
    }

    componentWillUpdate (nextProps) {
        if (this.props.params.marketId !== nextProps.params.marketId) {
            this.props.fetchMarket(nextProps.params.marketId);
        }
    }

    render() {
        const { market, isFetchingMarket, isFetchingMarketFailed, isSaveButtonDisabled, isBulkUpdateActive } = this.props;
        return (
            <div className="market-page">
                {isFetchingMarketFailed &&
                    <p>Error loading market...</p>
                }
                {isFetchingMarket &&
                    <p>Loading...</p>
                }
                {!isFetchingMarket && !isFetchingMarketFailed && market &&
                    (isBulkUpdateActive
                        ? <TabComponent 
                            className={`tabular`}
                            selectedIndex={0}
                            items={[{title: 'Bulk Update', content: <BulkUpdate /> }]}
                        />
                        : <TabComponent
                            className={`tabular`}
                            selectedIndex={this.state.activeTabIndex}
                            onSelect={(index, callback) => {
                                if (!isSaveButtonDisabled) {
                                    this.setState({showConfirmationModal: true});
                                    this.pendingIndex = index;
                                } else {
                                    this.setState({activeTabIndex: index});
                                }
                            }}
                            items={[{title: 'Market', content: <Market /> }]}
                        />
                    )
                }
                {this.state.showConfirmationModal &&
                    <ConfirmModal
                        isVisible={true}
                        onConfirm={e => {
                            this.setState({showConfirmationModal: false});
                            this.setState({activeTabIndex: this.pendingIndex});
                        }}
                        onCancel={e => {
                            this.setState({showConfirmationModal: false})
                        }}
                    />
                }
            </div>
        )
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(EventMarkets);