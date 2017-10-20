import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { generatePeriodsTree } from 'utils';
import { fetchGameResultsPeriodPoints, updateGameResultsPeriodPoints } from '../actions';
import { Field, reduxForm, Form, Fields } from 'redux-form';
import { InputField, DatePickerField, DatePickerFieldDisableAfterDates, ErrorDisplayField } from 'components/formInput';
import { required, time24, selectionRequired } from 'validations';
import { objectToArray} from 'utils';
import EventScoreForm from '../components/EventScoreForm';
import ModalLoader from 'phxV2Components/ModalLoader/';

const _pushContentToDOM = (domArr, data, className="") => {
    domArr.push(<tr className={className}>
        <td>{data.fullDescription}</td>
        <td>
        <Field name={`scores.['${data.id}'].eventId`} component={({ input, label, type, isRequired, disabled, className, meta: { touched, error, warning } }) => {
                          return <input type="hidden" {...input}/>;
                        }} />
        <Field name={`scores.['${data.id}'].periodId`} component={({ input, label, type, isRequired, disabled, className, meta: { touched, error, warning } }) => {
                          return <input type="hidden" {...input}/>;
                        }} />
        <Field name={`scores.['${data.id}'].opponentAId`} component={({ input, label, type, isRequired, disabled, className, meta: { touched, error, warning } }) => {
                          return <input type="hidden" {...input}/>;
                        }} />
        <Field name={`scores.['${data.id}'].opponentBId`} component={({ input, label, type, isRequired, disabled, className, meta: { touched, error, warning } }) => {
                          return <input type="hidden" {...input} />;
                        }} />
        <Field name={`scores.['${data.id}'].valueA`} component={({ input, label, type, isRequired, disabled, className, meta: { touched, error, warning } }) => {
            return <input type={type} {...input} />;
        }} classOverride="game_event_form_field game_event_form_field--no_label" type="text" label=""/></td>
        <td></td>
        <td><Field name={`scores.['${data.id}'].valueB`} component={({ input, label, type, isRequired, disabled, className, meta: { touched, error, warning } }) => {
            return <input type={type} {...input} />;
        }} classOverride="game_event_form_field game_event_form_field--no_label" type="text" label=""/></td>
    </tr>);
}

class EventScoreContainer extends React.Component {
  constructor(props) {
    super(props);
    this._getScoreDetails = this._getScoreDetails.bind(this);
    this._handleSubmit = this._handleSubmit.bind(this);
    this._generateFormData = this._generateFormData.bind(this);
    this.state = {
      tree : null,
      form : {}
    };
  }

  componentWillMount() {
      const {fetchGameResultsPeriodPoints, eventDetails, viewMarketStateDetails, fetchEventDetails} = this.props;
      let periods = [...this.props.gameResultMarketPeriods].sort((a, b) => {
          return Number(a.lookupCode) - Number(b.lookupCode);
      })
      this.setState({
          tree: generatePeriodsTree(periods),
      });

      let {periodPoints}= {...this.props.gameResults};

      if(periodPoints.length) {
        this._generateFormData(periodPoints);
      }

  }

  componentDidMount(){

  }

  componentWillReceiveProps(nextProps){
    let { gameResults } = this.props;
    let {isFetchingGameResultsPeriodPoints} = {...gameResults};
    let {periodPoints}= {...nextProps.gameResults};

    if(nextProps.isFetchingGameResultsPeriodPoints === false && periodPoints.length){
      this._generateFormData(periodPoints)
    }
  }

  _generateFormData(periodPoints) {
    let { event } = this.props;
    let eventDetails = event.event;
    let scores = {};
    periodPoints.forEach(period => {
        scores[period.gameResult.periodId] = {
          eventId : period.gameResult.eventId,
          periodId : period.gameResult.periodId,
          opponentAId : period.gameResult.opponentAId,
          opponentBId : period.gameResult.opponentBId,
          // abandonMoneyLine : period.gameResult.abandonMoneyLine,
          // abandonSpread : period.gameResult.abandonSpread,
          // abandonTotals : period.gameResult.abandonTotals,
          // abandonned : period.gameResult.abandonned,
          // complete : period.gameResult.complete,
          // id : period.gameResult.id,
          // new : period.gameResult.new,
          // pitcherAId : period.gameResult.pitcherAId,
          // pitcherBId : period.gameResult.pitcherBId,
          // resulted : period.gameResult.resulted,
          valueA : period.gameResult.valueA !== null ?  period.gameResult.valueA : "",
          valueB : period.gameResult.valueB !== null ?  period.gameResult.valueB : "",
          voidEnabled : period.gameResult.voidEnabled
        }
    });
      this.setState({form : {scores :scores}})
  }
  _getScoreDetails(periodId) {
    let { periodPoints } = this.props.gameResults;
    let selectedPeriod;
    periodPoints.forEach( period => {
      if(period.period.id === periodId)
        selectedPeriod = period;
    });

    return selectedPeriod;
  }

  _handleSubmit(values) {
    let scores = values.scores;
    let formData = [];
    for (let i in scores) {
      formData.push(scores[i])
    }

    this.props.updateGameResultsPeriodPoints(formData);
  }
  render() {
    const { handleSubmit, pristine, reset, submitting, dirty, periods, event, gameResults } = this.props
    let { eventDetails, newMarketFilters } = this.props;
    let {tree} = this.state;
    let {isFetchingGameResultsPeriodPoints, isUpdatingGameResultsPeriodPoints} = gameResults;
    if(!isFetchingGameResultsPeriodPoints && tree) {
      return (
          <div className="row">
            <div className="desktop-full">
                {
                  tree.length ? <EventScoreForm periodData={tree} initialValues={this.state.form} _handleSubmit={this._handleSubmit}/> : null
                }
            </div>
            { 
              isUpdatingGameResultsPeriodPoints ? <ModalLoader /> : null
            }
        </div>
      );
    }
    else return (
        <div className="loading tcenter">
            <i className="phxico phx-spinner phx-spin"></i>
        </div>
    );
  }
}

function mapStateToProps(state) {
    return {
        eventDetails: state.eventCreatorEvent.event,
        newMarketFilters: state.eventCreatorEventMarkets.newMarketFilters,
        gameResultMarketPeriods: state.eventCreatorEventMarkets.gameResultMarketPeriods,
        marketStateDetails: state.marketStateDetails,
        event: state.eventCreatorEvent,
        gameResults: state.gameResults,
        isUpdatingGameResultsPeriodPoints : state.gameResults.isUpdatingGameResultsPeriodPoints,
        isFetchingGameResultsPeriodPoints : state.gameResults.isFetchingGameResultsPeriodPoints,
        fetchGameResultMarketTypes : state.gameResults.fetchGameResultMarketTypes,
    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({ 
        fetchGameResultsPeriodPoints,
        updateGameResultsPeriodPoints
    }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(EventScoreContainer);