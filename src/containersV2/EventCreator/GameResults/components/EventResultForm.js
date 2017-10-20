import React from 'react';
import { Field, reduxForm, Form, Fields, reset, formValueSelector } from 'redux-form';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import checkPermission from 'componentsV2/checkPermission/index';
import { permissionsCode } from 'containersV2/EventCreator/App/constants';
import { InputField, DatePickerField, DatePickerFieldDisableAfterDates, ErrorDisplayField } from 'components/formInput';
import { required, time24, selectionRequired } from 'validations';
import { renderField } from 'eventCreatorUtils/reduxFormFieldUtils';
import TabComponent from 'components/Tabs';
import { getOpponentDetails } from 'utils';
import { closeModal, openModal } from 'actions/modal';
import _ from 'lodash';


const Input = ({input, type, disabled}) => {
   return  <input {...input} type={type} disabled={disabled}/>
}

const InputScore = ({ input, label, type, isRequired, disabled, className, isInputDisabled,  meta: { touched, error, warning } }) => {
    return <PermittedInput actionIds={[permissionsCode.MARKET_EDITOR_ENTER_RESULTS, permissionsCode.MARKET_EDITOR_UPDATE_RESULTS]} input={input} type={type}  disabled={!isInputDisabled}/>;
}

const InputCheckbox = {component: ({input, type, disabled}) => (<input {...input} type={type} disabled={disabled}/>), type: 'checkbox', parse: (value) => {return !!value}};

const PermittedInput = checkPermission(Input);
const PermittedField = checkPermission(Field);

let others = false;
let prevOtherTab
let selectedLastTab = 0;
let EventResultForm = props => {
    const { handleSubmit, 
        pristine, 
        reset, 
        submitting, 
        dirty, 
        eventDetails, 
        event, 
        gameResults, 
        periodData, 
        gameResultMarketFilters, 
        _handleSubmit, 
        isFetchingGameResultPeriods, 
        isFetchingGameResultMarketTypes, 
        initialValues, 
        scores,
        othersTab,
        _setActiveVoidPeriod } = props;
    if(!isFetchingGameResultPeriods && !isFetchingGameResultMarketTypes && !_.isEmpty(initialValues)){

        let first = _.findLast(_.reverse(initialValues.scores));
        let lastTab = _.last(gameResultMarketFilters.defaultFilters);
        let lasTabIndex = _.findLastIndex(gameResultMarketFilters.defaultFilters, {
          fullDescriptionOther: 'Others'
        });
        // if(lastTab.fullDescriptionOther !== "Others") {
        //     gameResultMarketFilters.defaultFilters.push(othersTab);
        //     // prevOtherTab = othersTab;
        //     // others = true;
        // }
        if(lastTab.fullDescriptionOther === "Others") {
            gameResultMarketFilters.defaultFilters[lasTabIndex] = othersTab;
            // prevOtherTab = othersTab;
            // others = true;
        }
        else 
            gameResultMarketFilters.defaultFilters.push(othersTab);

        // else 
        //     others = false;
        // 
        let opponentADetails = getOpponentDetails(eventDetails.opponentAId, event.opponents);
        let opponentBDetails = getOpponentDetails(eventDetails.opponentBId, event.opponents);
        let EventResultsContentTab = gameResultMarketFilters.defaultFilters ? gameResultMarketFilters.defaultFilters.map((f, fi) => {
            // lastTab = fi++;
            let individualTitleA = (!f.hasOwnProperty('fullDescriptionOther') && initialValues.scores[f.id].hasOwnProperty('descriptionA')) ? initialValues.scores[f.id].descriptionA : first.descriptionA;
            let individualTitleB = (!f.hasOwnProperty('fullDescriptionOther') && initialValues.scores[f.id].hasOwnProperty('descriptionB')) ? initialValues.scores[f.id].descriptionB : first.descriptionB;
            let isInputDisabled = (!f.hasOwnProperty('fullDescriptionOther') && initialValues.scores[f.id].hasOwnProperty('voidEnabled') && initialValues.scores[f.id].voidEnabled);
            let isInputScoreDisabled = (!f.hasOwnProperty('fullDescriptionOther') && initialValues.scores[f.id].hasOwnProperty('voidEnabled') && initialValues.voidPeriod[f.id].voidYN); 
             // !f.hasOwnProperty('fullDescriptionOther') && initialValues.voidPeriod[f.id].voidYN ? true : false;
            return {
                title : f.hasOwnProperty('fullDescriptionOther') ? f.fullDescriptionOther : f.fullDescription,
                content : <div>
                    <div className="row">
                        <div className={f.hasOwnProperty('fullDescriptionOther') ? "desktop-three-quarter" : "desktop-full"}>
                            <div className="form-wrapper">
                                <h6>{(f.hasOwnProperty('fullDescriptionOther') && !f.fullDescription)? f.fullDescriptionOther : (f.index ? `Live ${f.fullDescription}` : f.fullDescription) } Result</h6>
                                <div className="tcenter ">
                                    <Field name={`scores.['${f.id}'].eventId`} component={({ input, label, type, isRequired, disabled, className, meta: { touched, error, warning } }) => {
                                                      return <input type="hidden" {...input}/>;
                                                    }} />
                                    <Field name={`scores.['${f.id}'].periodId`} component={({ input, label, type, isRequired, disabled, className, meta: { touched, error, warning } }) => {
                                                      return <input type="hidden" {...input}/>;
                                                    }} />
                                    <Field name={`scores.['${f.id}'].opponentAId`} component={({ input, label, type, isRequired, disabled, className, meta: { touched, error, warning } }) => {
                                                      return <input type="hidden" {...input}/>;
                                                    }} />
                                    <Field name={`scores.['${f.id}'].opponentBId`} component={({ input, label, type, isRequired, disabled, className, meta: { touched, error, warning } }) => {
                                                      return <input type="hidden" {...input} />;
                                                    }} />
                                    <div className="match-result tcenter">
                                        <label className="tright">{opponentADetails.description}</label>
                                        <Field
                                            name={`scores.['${f.id}'].valueA`}
                                            component={InputScore} type="text" label="" isInputDisabled={!isInputDisabled || !isInputScoreDisabled}/>
                                        <label className="tcenter">V</label>
                                        <Field
                                            actionIds={[permissionsCode.MARKET_EDITOR_ENTER_RESULTS, permissionsCode.MARKET_EDITOR_UPDATE_RESULTS]}
                                            name={`scores.['${f.id}'].valueB`}
                                            component={InputScore} type="text" label="" isInputDisabled={!isInputDisabled || !isInputScoreDisabled}/>
                                        <label className="">{opponentBDetails.description}</label>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {
                            f.hasOwnProperty('fullDescriptionOther') ?  <div className="desktop-quarter">
                                    <div className="form-wrapper">
                                        <h6>Period Selection</h6>
                                        <div className="tcenter">
                                            <button type="button" onClick={(e)=>props.openModal('gameResultsMorePeriod')}>More periods...</button>
                                        </div>
                                    </div>
                            </div> : null
                        }
                    </div>
                    <TabComponent
                    className="results-stats"
                    onSelect={(tabs)=> {
                      }}
                    items={[{
                            title: 'Both',
                            content: <div>
                                <div className="row">
                                    <div className="desktop-full">
                                        <div className="form-wrapper">
                                            <h6>Match Statistics</h6>
                                            <div></div>
                                        </div>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="desktop-full">
                                        <div className="form-wrapper">
                                            <h6>Goal Scorer and Disciplinary</h6>
                                            <div></div>
                                        </div>  
                                    </div>
                                </div>
                            </div>
                        },{
                            title: 'Individual',
                            content: <div>
                                <div className="row">
                                    <div className="desktop-full">
                                        <div className="desktop-half">
                                            <div className="form-wrapper">
                                                <h6>{individualTitleA} Statistics</h6>
                                                <div></div>
                                            </div>
                                        </div>
                                        <div className="desktop-half">
                                            <div className="form-wrapper">
                                                <h6>{individualTitleB} Statistics</h6>
                                                <div></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="desktop-full">
                                        <div className="desktop-half">
                                            <div className="form-wrapper">
                                                <h6>{individualTitleA} Goal Scorer and Disciplinary</h6>
                                                <div></div>
                                            </div>
                                        </div>
                                        <div className="desktop-half">
                                            <div className="form-wrapper">
                                                <h6>{individualTitleB} Goal Scorer and Disciplinary</h6>
                                                <div></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        }]}/>

                        <div className="row footer-form">
                            <div className="desktop-half">
                                <div className="form-group-control">
                                    <div className="row">
                                            <div className="form-group clearfix">
                                            <Field name={`voidPeriod.['${f.id}'].periodId`} component={({ input, label, type, isRequired, disabled, className, meta: { touched, error, warning } }) => {
                                                      return <input type="hidden" {...input}/>;
                                                    }} />
                                            <PermittedField actionIds={[permissionsCode.MARKET_EDITOR_ENTER_RESULTS, permissionsCode.MARKET_EDITOR_UPDATE_RESULTS]}  name={`voidPeriod.['${f.id}'].voidYN`}  type="checkbox" {...InputCheckbox} disabled={!isInputDisabled}/>
                                                <span className="checkbox-label" >
                                                    <label> Void Period</label>
                                                </span>
                                            </div>
                                           <button type="button" onClick={props.reset}>Clear All Period Values</button>
                                    </div>
                                </div>
                            </div>
                            <div className="desktop-half">
                                <div className="form-group clearfix period-status tcenter">
                                    <label> Period results {(!f.hasOwnProperty('fullDescriptionOther') && initialValues.scores[f.id].hasOwnProperty('complete') && initialValues.scores[f.id].complete) ? "completed" : "incomplete"}.</label>
                                </div>
                            </div>
                        </div>
                </div>
            }
        }) : [];
  
        return (
            <Form onSubmit={handleSubmit(_handleSubmit)} className="border-box">
                <TabComponent
                  className="inner-tab"
                  onSelect={(tabs)=> {
                    selectedLastTab = tabs;
                  }}
                  items={EventResultsContentTab} selectedIndex={selectedLastTab}/>
                <div className="footer-form">
                    <div className="form-group-control">
                        <div className="form-group clearfix">
                            <Field name="event.id" component={({ input, label, type, isRequired, disabled, className, meta: { touched, error, warning } }) => {
                                  return <input type="hidden" {...input}/>;
                                }} />
                            <PermittedField actionIds={[permissionsCode.AUTO_SETTLEMENT]}  name="event.autoSettle"  type="checkbox" {...InputCheckbox} />
                            <span className="checkbox-label">
                                  <label> Auto Settle Event</label>
                            </span>
                        </div>
                    </div>
                </div>
          </Form>
        );
    }
    else return null;
  
}


EventResultForm = reduxForm({
  form: 'EventResultForm' ,
  enableReinitialize: true,
})(EventResultForm);

function mapStateToProps(state) {
    return {
        event: state.eventCreatorEvent,
        eventDetails: state.eventCreatorEvent.event,
        marketStateDetails: state.marketStateDetails,
        event: state.eventCreatorEvent,
        gameResults: state.gameResults,
        gameResultMarketFilters: state.eventCreatorEventMarkets.gameResultMarketFilters,
        isFetchingGameResultPeriods: state.eventCreatorEventMarkets.isFetchingGameResultPeriods,
        isFetchingGameResultMarketTypes: state.eventCreatorEventMarkets.isFetchingGameResultMarketTypes,

    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({ 
        reset,
        closeModal, 
        openModal, 
    }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(EventResultForm);
