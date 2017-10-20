import React from "react";
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { closeModal, openModal } from 'actions/modal';
import ModalWindow from 'components/modal';
import CutOffAndAutoOpenForm  from '../components/CutOffAndAutoOpenForm';
import { updateMarketDetails, setNewMarketOutcomes, updateMarketOutcomes, updateMarketBooks } from '../../EventMarkets/actions';
import { updateEvent } from '../../Event/actions';
import { objectToArray, formatFilterDates, formatISODateString, getActiveEventInSportsTree, combineDateTime} from 'utils';
import { updateMarketCutOffAndAutoOpenDateTime } from 'actions/marketStateDetails';
import { fetchMarketPeriodDetails } from 'actions/marketStateDetails';
import moment from 'moment';
import { selectEventPathTreeSport, fetchEventPathTree, resetEventPathTree } from 'actions/eventPathTree';
import filterTypes from 'constants/filterTypes';
import { fetchEventMarkets } from '../../../SportsTree/actions';

class CutOffAndAutoOpenModal extends React.Component {
  constructor(props) {
    super(props);
    this._handleSubmit = this._handleSubmit.bind(this);
    this._processMarketPeriodData = this._processMarketPeriodData.bind(this);

    this.state = {
        searchString: '',
        selectedSport: props.apiConstants.values.riskSports[0],
        marketStatusIds: filterTypes.STATUS.ANY_STATUS.value,
        filterDate: filterTypes.DATES.NEXT_7_DAYS,
        shouldUpdateEpt: null,
        editedPathValue: null,
        newPath: null,
        eventPathsReordered: {}
    };
  }

  componentWillMount() {
    const { event, fetchEventMarkets, parameters, fetchMarketPeriodDetails } = this.props;
    fetchMarketPeriodDetails(event.event.id);
    fetchEventMarkets(event.event.id, parameters);
  }

  componentDidMount() {

  }

  componentDidUpdate(prevProps, prevState){
    let {isFetchingMarketPeriodDetails} = this.props.marketStateDetails;
    const { periodDetails } = this.props.marketStateDetails;

    if(prevProps.marketStateDetails.isFetchingMarketPeriodDetails && isFetchingMarketPeriodDetails === false) {
        this._processMarketPeriodData();
    }

    if(prevProps.marketModal != this.props.marketModal)
        this._processMarketPeriodData();

  }

  _processMarketPeriodData(){
        const { marketModal } = this.props;
        let tempformattedPeriodDetails = {};
        let formattedPeriodDetails = {};
        let formatPDs = {};
        const {pathsMap, event} = this.props; 
        const { periodDetails } = this.props.marketStateDetails;
        const { periods } = this.props;
        if(periodDetails) {
            for (let i in  periodDetails){
                if(typeof periodDetails[i] != "function"){
                    if(marketModal == "CUTOFF") {
                        tempformattedPeriodDetails[periodDetails[i].id] = {
                            cutoffDate : periodDetails[i].cutoffTime ? moment(periodDetails[i].cutoffTime).format('L') : "",
                            cutoffTime : periodDetails[i].cutoffTime ? moment(periodDetails[i].cutoffTime).format('HH:mm') : ""    
                        }
                    }
                    else {
                        tempformattedPeriodDetails[periodDetails[i].id] = {
                            autoOpenDate : periodDetails[i].autoOpenTime ? moment(periodDetails[i].autoOpenTime).format('L') : "",
                            autoOpenTime : periodDetails[i].autoOpenTime ? moment(periodDetails[i].autoOpenTime).format('HH:mm') : ""
                        }
                    }
                    
                }
            }

            for (let i in periods) {
                if(typeof periods[i] != "function"){
                    const marketKeys = periods[i].marketKeys
                    formattedPeriodDetails[i] = {
                        ids : marketKeys
                    }
                    for (let pi in marketKeys){
                        if(typeof marketKeys[pi] != "function"){
                            const periodId = marketKeys[pi].replace("m", "");
                            if(tempformattedPeriodDetails.hasOwnProperty(periodId)) {
                                // if(marketModal == "CUTOFF") {
                                //     tempformattedPeriodDetails[periodId].cutoffDate = pathsMap[periodId]['cutOffTime'] ? moment(pathsMap[periodId]['cutOffTime']).format('L') : "" ;
                                //     tempformattedPeriodDetails[periodId].cutoffTime = pathsMap[periodId]['cutOffTime'] ? moment(pathsMap[periodId]['cutOffTime']).format('HH:mm') : ""; 
                                // }
                                // else {
                                //     tempformattedPeriodDetails[periodId].autoOpenDate = pathsMap[periodId]['autoOpenTime'] ? moment(pathsMap[periodId]['autoOpenTime']).format('L') : "";
                                //     tempformattedPeriodDetails[periodId].autoOpenTime = pathsMap[periodId]['autoOpenTime'] ? moment(pathsMap[periodId]['autoOpenTime']).format('HH:mm') : ""; 
                                // }   
                                formatPDs[i] = { ...formattedPeriodDetails[i], ...tempformattedPeriodDetails[periodId]};
                            }
                        }
                    }
                }
            }
            this.setState({
                periods : formatPDs
            })

        }
  }

  _handleSubmit(values) {
    const { marketModal, eventDetails, parameters, fetchMarketPeriodDetails } = this.props;
    let periodsFormValues = [];
    let periods = values.periods;
    let event = values.event;
    let {opponentAId,opponentBId,countryId, sportCode, type, autoSettle, bestOfSets, inRunningDelay, print, defaultOpenDateTime} = eventDetails;
    if((values.hasOwnProperty('event') || typeof event !== undefined) && Object.keys(event).length && marketModal == "CUTOFF"){
        if(event.date !== moment(eventDetails.startDateTime).format('L') || event.time !== moment(eventDetails.startDateTime).format('HH:mm')) {
            this.props.updateEvent(event.id, {
                opponentAId : opponentAId,
                opponentBId: opponentBId,
                countryId : countryId,
                sportCode : sportCode,
                type : type,
                autoSettle : autoSettle,
                bestOfSets : bestOfSets,
                inRunningDelay : inRunningDelay,
                print : print,
                startDateTime : combineDateTime(event.date, event.time),
                defaultOpenDateTime : defaultOpenDateTime
            })
        }
    }

    if((values.hasOwnProperty('periods') || typeof periods !== undefined) && Object.keys(periods).length) {
        Object.keys(periods).forEach(key => {
            let ids = periods[key].ids;
            ids.forEach(k => {
                if(marketModal == "CUTOFF") {
                    periodsFormValues.push({
                        id : k.replace("m", ""),
                        cutoffTime : combineDateTime(periods[key].cutoffDate, periods[key].cutoffTime)
                    });
                }
                else {
                    periodsFormValues.push({
                        id : k.replace("m", ""),
                        autoOpenTime : combineDateTime(periods[key].autoOpenDate, periods[key].autoOpenTime)
                    });
                }
            })
        })
        this.props.updateMarketCutOffAndAutoOpenDateTime(periodsFormValues);
    }
  }

  render() {
    let {
        market,
        eventDetails,
        marketModal
    } = this.props;
    const { periodDetails } = this.props.marketStateDetails;
    let data = { 
        event : {
            id:eventDetails.id,
            date:marketModal == "CUTOFF" && eventDetails.startDateTime ? moment(eventDetails.startDateTime).format('L') : marketModal == "CUTOFF" && eventDetails.defaultAutoOpenTime ? moment(eventDetails.defaultAutoOpenTime).format('L') : "",
            time:marketModal == "CUTOFF" && eventDetails.startDateTime ? moment(eventDetails.startDateTime).format('HH:mm') : marketModal == "CUTOFF" && eventDetails.defaultAutoOpenTime ? moment(eventDetails.defaultAutoOpenTime).format('HH:mm') : ""
        }
    };
    return (
        <ModalWindow
            className="small cutoff-market-modal"
            title={marketModal == "CUTOFF" ? "Period Cut-Off" : "Auto Open Time"}
            name="cutOffAndAutoOpenMarket"
            isVisibleOn={this.props.modals.cutOffAndAutoOpenMarket}
            shouldCloseOnOverlayClick={true}>
            <div className="cutoff-market-modal-container modal-content">
                <CutOffAndAutoOpenForm initialValues={Object.assign({},{periods : this.state.periods},data)} {...this.props} _handleSubmit={this._handleSubmit} marketModal={marketModal}/>
            </div>
        </ModalWindow>
    );
  }
}
const mapStateToProps = (state, ownProps) => {
    return {
        market: state.eventCreatorEventMarkets.market,
        eventCreatorEventMarkets: state.eventCreatorEventMarkets,
        eventDetails: state.eventCreatorEvent.event,
        parameters: state.sportsTree.parameters,
        pathsMap : state.sportsTree.pathsMap,
        activePathId: state.sportsTree.activePathId
    };
};

const mapDispatchToProps = (dispatch, ownProps) => {
    return bindActionCreators({
        updateMarketDetails,
        fetchMarketPeriodDetails,
        updateMarketCutOffAndAutoOpenDateTime,
        fetchEventMarkets,
        updateEvent
    }, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(CutOffAndAutoOpenModal);