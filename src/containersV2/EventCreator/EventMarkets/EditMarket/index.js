import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import ModalWindow from 'components/modal';
import { closeModal } from 'phxActions/modal';
import { formatFilterDates } from 'phxUtils';
import EditMarket from 'phxContainers/RiskManager/Pages/EditMarket';
import { setEditMarketMarkets, setEditMarketSelectedMarketId, fetchEditMarketDetails } from 'phxActions/editMarket';
import { fetchEventMarkets } from 'actions/eventPathTree';
import { flattenMarkets } from '../helpers';
import { fetchEvent } from '../../Event/actions';
import { paths } from '../../App/constants';
import { fetchRiskData } from 'actions/riskData';

const mapStateToProps = (state) => {
    return {
        activePage: state.eventCreatorApp.activePage,
        selectedMarketId: state.editMarket.selectedMarketId,
        datesFilter: state.sportsTree.datesFilter,
        marketStatusFilter: state.sportsTree.marketStatusFilter,
        markets: state.eventPathTree.markets,
        event: state.eventCreatorEvent.event
    };
};

const mapDispatchToProps = (dispatch) => {
    return bindActionCreators({
        closeModal,
        setEditMarketSelectedMarketId,
        setEditMarketMarkets,
        fetchEditMarketDetails,
        formatFilterDates,
        fetchEventMarkets,
        fetchEvent,
        fetchRiskData
    }, dispatch);
};

class EditMarketModal extends Component {
    constructor (props) {
        super(props);
        this._getSportsTreeParams = this._getSportsTreeParams.bind(this);
    }
    componentDidMount () {
        let {
            market,
            activePage,
            event,
            fetchEventMarkets,
            fetchRiskData
        } = this.props;
        if (activePage === paths.MARKET) {
            if (!event) {
                this.props.fetchEvent(market.eventId, market.parentType === 'RANKEVENT' ? true : false)
            } else {
                fetchRiskData({code: `e${market.eventId}`});
                fetchEventMarkets(market.eventId, this._getSportsTreeParams());
            }
        } else {
            if (event) {
                fetchRiskData({code: `e${event.id}`});
                fetchEventMarkets(event.id, this._getSportsTreeParams())
            }
        }
    }

    componentWillUpdate (nextProps) {
        let { fetchEventMarkets, fetchRiskData } = this.props;
        if (!this.props.event && nextProps.event) {
            fetchRiskData({code: `e${nextProps.event.id}`});
            fetchEventMarkets(nextProps.event.id, this._getSportsTreeParams());
        }
        if (nextProps.event) {
            let eventId = nextProps.event.id;
            let { setEditMarketSelectedMarketId, fetchEditMarketDetails, setEditMarketMarkets } = nextProps;
            if (this.props.markets[eventId] && this.props.markets[eventId].length === 0 && nextProps.markets[eventId].length) {
                const market = nextProps.markets[eventId][0]; // select the first market;
                const id = nextProps.activePage === 'MARKET' ?  nextProps.selectedMarketId.toString() : market.id.toString();
                const markets = flattenMarkets(nextProps.markets[eventId], []);
                setEditMarketSelectedMarketId(id);
                fetchEditMarketDetails(id);
                setEditMarketMarkets(markets);
            }
        }
    }

    _getSportsTreeParams () {
        const { datesFilter, marketStatusFilter } = this.props;
        const { fromDate, toDate } = formatFilterDates(datesFilter);
        return { fromDate, toDate, marketStatusIds: marketStatusFilter }
    }

    render () {
        let { selectedMarketId } = this.props;
        return <ModalWindow
            className="full-screen"
            key={'editMarket'}
            title="Edit Market"
            closeButton={false}
            name="editMarket"
            isVisibleOn={true}
            shouldCloseOnOverlayClick={false}>
            <div>
                <h4 className="text-bold tcenter">
                    <span className="text-large">
                    Edit Market
                    </span>
                </h4>
                {selectedMarketId &&
                    <EditMarket />
                }
            </div>
        </ModalWindow>
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(EditMarketModal);