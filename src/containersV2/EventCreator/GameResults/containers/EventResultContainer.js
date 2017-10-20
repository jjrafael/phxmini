import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import _ from 'lodash';
import { fetchGameResultsPeriodPoints, updateGameResultsPeriodPoints, updateGameResultsVoidPeriod } from '../actions';
import {
    fetchGameResultMarketTypes,
    createNewMarkets,
    fetchGameResultPeriods,
    resetNewMarketPayload,
    setHideOutcomesOnCreateOption,
    updateGameResultsFilters,
    resetNewMarketFilters
} from '../../EventMarkets/actions';
import { fetchEvent, updateEvent, fetchPlayersOfOpponentA, fetchPlayersOfOpponentB, clearPlayersOfOpponentsAB } from '../../Event/actions';
import EventResultForm from '../components/EventResultForm';
import ModalLoader from 'phxV2Components/ModalLoader/';
import MorePeriodsModal from '../components/MorePeriodsModal';
import VoidPeriodsModal from '../components/VoidPeriodModal';
import { generatePeriodsTree } from 'utils';
import { closeModal, openModal } from 'actions/modal';

class EventResultContainer extends React.Component {
	constructor(props) {
	    super(props);
	    this._handleSubmit = this._handleSubmit.bind(this);
	    this._updateOthersTabDetails = this._updateOthersTabDetails.bind(this);
	    this._checkIfObjectIsEqual = this._checkIfObjectIsEqual.bind(this);
	    this._handleSubmitVoidPeriodModal = this._handleSubmitVoidPeriodModal.bind(this);
	    this._generateFormData = this._generateFormData.bind(this);

	    this.state = {
	      tree : [],
	      form : {
	      	scores : {},
	      	event : {},
	      	voidPeriod : {"eventId": null, "voidReasonId": null, "voidReasonNotes": "testing testing", "periodId": 211, "voidYN": true},
	      },
	      voidPeriodModalData: {"eventId": null, voidReasonId : null, voidReasonNotes :"", periodId: null, voidYN: null},
	      othersTab : {id:null,fullDescription:"",fullDescriptionOther:"Others", defaultView: null, enabledYN:null, fullAbbreviation:null, periodType: {}}
	    };
	}
  	componentWillMount(){
	    let {periodPoints}= {...this.props.gameResults};

	    if(periodPoints.length) {
	    	this._generateFormData(periodPoints);
	    }
  	}

    componentWillUpdate(nextProps){
        // if (prevProps.prevProps && this.props.isFetchingMarketTypes === "false" && prevProps.isFetchingMarketPeriods && this.props.isFetchingMarketPeriods == "false") {
        //     this._generateFilters(nextProps);
        // }
        const { marketStateDetails, eventDetails, isFetchingGameResultPeriods,  isFetchingGameResultMarketTypes, gameResults} = this.props;
        
        // if (this.props.gameResultMarketPeriods.length === 0 && nextProps.gameResultMarketPeriods.length) {
        if (isFetchingGameResultPeriods && nextProps.isFetchingGameResultPeriods === false) {
            this._generateFilters(nextProps);
        }
        if (isFetchingGameResultMarketTypes && nextProps.isFetchingGameResultMarketTypes === false) {
            this._generateFilters(nextProps);
        }
    }
	componentWillReceiveProps(nextProps){
	    let { gameResults, event } = this.props;
	    let eventDetails = event.event;
	    let {isFetchingGameResultsPeriodPoints, isUpdatingGameResultsPeriodPoints} = {...gameResults};
	    let {periodPoints}= {...nextProps.gameResults};
	    
	    if(/*isFetchingGameResultsPeriodPoints && */nextProps.isFetchingGameResultsPeriodPoints === false && periodPoints.length/*isFetchingGameResultsPeriodPoints === false  && Object.keys(this.state.form)*/){
	    	this._generateFormData(periodPoints)
	      	let periods = [...this.props.gameResultMarketPeriods].sort((a, b) => {
	          	return Number(a.lookupCode) - Number(b.lookupCode);
	      	})
	      	this.setState({
	          tree: generatePeriodsTree(periods),
	      	});
	    }

	}
	_generateFormData(periodPoints) {

	    let { event } = this.props;
	    let eventDetails = event.event;
		let scores = {};
	    let voidPeriod = {};
		periodPoints.forEach(period => {
	        scores[period.gameResult.periodId] = {
	          eventId : period.gameResult.eventId,
	          descriptionA : period.descriptionA,
	          descriptionB : period.descriptionB,
	          periodId : period.gameResult.periodId,
	          opponentAId : period.gameResult.opponentAId,
	          opponentBId : period.gameResult.opponentBId,
	          // abandonMoneyLine : period.gameResult.abandonMoneyLine,
	          // abandonSpread : period.gameResult.abandonSpread,
	          // abandonTotals : period.gameResult.abandonTotals,
	          // abandonned : period.gameResult.abandonned,
	          complete : period.gameResult.complete,
	          // id : period.gameResult.id,
	          // new : period.gameResult.new,
	          // pitcherAId : period.gameResult.pitcherAId,
	          // pitcherBId : period.gameResult.pitcherBId,
	          // resulted : period.gameResult.resulted,
	          valueA : period.gameResult.valueA != null ?  period.gameResult.valueA : "",
	          valueB : period.gameResult.valueB != null ?  period.gameResult.valueB : "",
	          voidEnabled : period.gameResult.voidEnabled
	        }
	        voidPeriod[period.gameResult.periodId] = {
	          	periodId : period.gameResult.periodId,
	        	eventId : eventDetails.id,
	          	voidYN : period.abandoned,
	        };
	    });
	      
	    this.setState({form : {scores :scores, voidPeriod:voidPeriod, event : {
	      	countryId: eventDetails.countryId, 
	      	autoSettle: eventDetails.autoSettle,
	      	opponentAId: eventDetails.opponentAId,
	      	opponentBId: eventDetails.opponentBId,
	      	startDateTime: eventDetails.startDateTime,
	      	"ignoreFeed": eventDetails.ignoreFeed, 
	      	"ignoreFeedLiveBook": eventDetails.ignoreFeedLiveBook, 
	      	"print": eventDetails.print, 
	      	"teaserBetsAllowed": eventDetails.teaserBetsAllowed, 
	      	"tieBreak": eventDetails.tieBreak,  
	      	"description": eventDetails.description, 
	      	"sportCode": eventDetails.sportCode, 
	      	"countryId": eventDetails.countryId, 
	      	"groupNumber": eventDetails.groupNumber, 
	      	"type": eventDetails.type, 
	      	// "defaultAutoOpenTime": eventDetails.defaultAutoOpenTime, 
	      	"originalStartDateTime": eventDetails.originalStartDateTime,  
	      	"eventInformation" : eventDetails.eventInformation,  
	      	"calendarEvent": eventDetails.calendarEvent, 
	      	"inRunningDelay": eventDetails.inRunningDelay, 
	      	"eventTemplateId": eventDetails.eventTemplateId, 
	      	"neutralGround": eventDetails.neutralGround
	    }}})
	}
    _generateFilters (props) {
        let { gameResultMarketPeriods, gameResultMarketTypes, gameResultMarketFilters, updateGameResultsFilters } = props;
        let filteredMarketTypes = gameResultMarketFilters.filteredMarketTypes;
        let periodTypeIds = [];
        let periodIds = [];
        let defaultFilters = gameResultMarketPeriods.filter(period => period.defaultView).sort((a, b) => {
            return Number(a.lookupCode) - Number(b.lookupCode);
        });
        let defaultFilter = defaultFilters[0];
        if (defaultFilter) {
            filteredMarketTypes = gameResultMarketTypes.filter(marketType => {
                return marketType.periodTypeId === defaultFilter.periodType.id
            })
            periodTypeIds = [defaultFilter.periodType.id];
            periodIds = [defaultFilter.id];
        }
        updateGameResultsFilters({filteredMarketTypes, defaultFilters, defaultFilter, periodTypeIds, periodIds});
    }

    _checkIfObjectIsEqual(Object1, Object2) {
    	return _.isEqual(Object1, Object2)
    }

	_handleSubmit(values) {
		let {eventDetails, updateEvent} = this.props;
	    let scores = values.scores;
	    let {form} = this.state;
	    let formData = [];

	    if(!this._checkIfObjectIsEqual(form.scores, values.scores))  {
			for (let i in scores) {
			    delete scores[i].descriptionA;
			    delete scores[i].descriptionB;
		      	formData.push(scores[i])
		    }
		    this.props.updateGameResultsPeriodPoints(formData);
	    }
	    if(!this._checkIfObjectIsEqual(form.event, values.event)){
	    	delete values.event.id;
	    	updateEvent(eventDetails.id, values.event)
	    }

	    if(!this._checkIfObjectIsEqual(form.voidPeriod, values.voidPeriod)) {
			let touchedVoidPeriod = _.filter(values.voidPeriod, (vr, i )=>{
				if(form.voidPeriod[i].voidYN !== vr.voidYN)
					return vr;
			});
			
			this.setState({voidPeriodModalData: {"eventId": touchedVoidPeriod[0].eventId, voidReasonId : 1, voidReasonNotes :"", periodId: touchedVoidPeriod[0].periodId, voidYN: touchedVoidPeriod[0].voidYN}})
           	
           	if(touchedVoidPeriod[0].voidYN)
           		this.props.openModal('voidPeriodModal');
           	else
				this.props.updateGameResultsVoidPeriod({"eventId": touchedVoidPeriod[0].eventId, voidReasonId : "", voidReasonNotes :"", periodId: touchedVoidPeriod[0].periodId, voidYN: touchedVoidPeriod[0].voidYN});
	    }
	}

	_handleSubmitVoidPeriodModal(values){
		const scores = {...this.state.form.scores};
		scores[values.periodId].valueA = "";
		scores[values.periodId].valueB = "";
	    let formData = [];
		for (let i in scores) {
		    delete scores[i].descriptionA;
		    delete scores[i].descriptionB;
	      	formData.push(scores[i])
	    }
		this.props.updateGameResultsVoidPeriod(values);
		this.props.updateGameResultsPeriodPoints(formData);
        this.props.closeModal('voidPeriodModal');
		// console.log(this.state.form.scores, values, "_handleSubmitVoidPeriodModal")
	}

	_updateOthersTabDetails(e, period, index){
		let self = this;
		let defaultOtherTab = {id:null,fullDescription:"", fullDescriptionOther:"Others", defaultView: null, enabledYN:null, fullAbbreviation:null};
		let othersTab = this.state.othersTab;
      	let checkboxes = document.querySelectorAll('.periods-checkboxes')
	     checkboxes.forEach( (checkbox) => {
	        if (e.target == checkbox)
	        {
        		if(e.target.checked) {
	            	checkbox.checked = true;
		            period.fullDescriptionOther = "Others";
		            period.index = index;
					self.setState({othersTab : period});
        		} else {
					self.setState({othersTab : defaultOtherTab});
        		}

	        }
	        else{
	            checkbox.checked = false;
	        } 
	     })
          // toggleCheckboxes(data);
	}

	render() {
        const { marketStateDetails, eventDetails, isFetchingGameResultPeriods,  isFetchingGameResultMarketTypes, gameResults} = this.props;
    	let {isFetchingGameResultsPeriodPoints, isUpdatingGameResultsPeriodPoints, isUpdatingGameResultsVoidPeriod} = gameResults;
    	let {tree} = this.state;
		if(!isFetchingGameResultPeriods && !isFetchingGameResultMarketTypes)
			return (
		      	<div className="row">
			        <div className="desktop-full">
			          	<EventResultForm othersTab={this.state.othersTab} initialValues={this.state.form} _handleSubmit={this._handleSubmit}/> 
			        </div>
			        { 
		              isUpdatingGameResultsPeriodPoints || isUpdatingGameResultsVoidPeriod ? <ModalLoader/> : null
		            }
		            <MorePeriodsModal tree={tree} updateOthersTabDetails={this._updateOthersTabDetails}/>
		            <VoidPeriodsModal initialValues={this.state.voidPeriodModalData} _handleSubmitVoidPeriodModal={this._handleSubmitVoidPeriodModal}/>
		      	</div>
		    );
		else  
			return (
		        <div className="loading tcenter">
		            <i className="phxico phx-spinner phx-spin"></i>
		        </div>
		    );
	}
}

function mapStateToProps(state) {
    return {
        eventDetails: state.eventCreatorEvent.event,
        gameResultMarketTypes: state.eventCreatorEventMarkets.gameResultMarketTypes,
        marketPlayers: state.eventCreatorEventMarkets.marketPlayers,
        gameResultMarketPeriods: state.eventCreatorEventMarkets.gameResultMarketPeriods,
        isCreatingNewMarkets: state.eventCreatorEventMarkets.isCreatingNewMarkets,
        isCreatingNewMarketsFailed: state.eventCreatorEventMarkets.isCreatingNewMarketsFailed,
        isFetchingGameResultPeriods: state.eventCreatorEventMarkets.isFetchingGameResultPeriods,
        isFetchingGameResultPeriodsFailed: state.eventCreatorEventMarkets.isFetchingGameResultPeriodsFailed,
        isFetchingGameResultMarketTypes: state.eventCreatorEventMarkets.isFetchingGameResultMarketTypes,
        isFetchingGameResultMarketTypesFailed: state.eventCreatorEventMarkets.isFetchingGameResultMarketTypesFailed,
        isFetchingMarketPlayers: state.eventCreatorEventMarkets.isFetchingMarketPlayers,
        isFetchingMarketPlayersFailed: state.eventCreatorEventMarkets.isFetchingMarketPlayersFailed,
        newMarketPayload: state.eventCreatorEventMarkets.newMarketPayload,
        gameResultMarketFilters: state.eventCreatorEventMarkets.gameResultMarketFilters,
        marketStateDetails: state.marketStateDetails,
        event: state.eventCreatorEvent,
        gameResults: state.gameResults,
        isUpdatingGameResultsPeriodPoints : state.gameResults.isUpdatingGameResultsPeriodPoints,
        isFetchingGameResultsPeriodPoints : state.gameResults.isFetchingGameResultsPeriodPoints,
    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({ 
        fetchGameResultMarketTypes,
        createNewMarkets,
        fetchGameResultPeriods,
        resetNewMarketPayload,
        setHideOutcomesOnCreateOption,
        updateGameResultsFilters,
        updateGameResultsPeriodPoints,
        updateGameResultsVoidPeriod,
        updateEvent,
        closeModal, 
        openModal
    }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(EventResultContainer);
