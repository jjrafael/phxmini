import React from 'react';
import { Field, reduxForm, Form, Fields } from 'redux-form';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import _ from 'lodash';
import checkPermission from 'componentsV2/checkPermission/index';
import { permissionsCode } from 'containersV2/EventCreator/App/constants';
import { InputField, DatePickerField, DatePickerFieldDisableAfterDates, ErrorDisplayField } from 'components/formInput';
import { required, time24, selectionRequired } from 'validations';
import { renderField } from 'eventCreatorUtils/reduxFormFieldUtils';
import { getOpponentDetails } from 'utils';

const Input = ({input, type, disabled}) => (
    <input {...input} type={type} disabled={disabled}/>
)

const PermittedInput = checkPermission(Input);
const PermittedField = checkPermission(Field);

const _pushContentToDOM = (domArr, data, className="", initialValues) => {
    const isInputDisabled = (_.has(initialValues.scores, data.id) && initialValues.scores[data.id].hasOwnProperty('voidEnabled') && initialValues.scores[data.id].voidEnabled);
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
        <PermittedField actionIds={[permissionsCode.MARKET_EDITOR_ENTER_RESULTS, permissionsCode.MARKET_EDITOR_UPDATE_RESULTS]} name={`scores.['${data.id}'].valueA`} component={Input} classOverride="game_event_form_field game_event_form_field--no_label" type="text" disabled={!isInputDisabled}/></td>
        <td></td>
        <td><PermittedField actionIds={[permissionsCode.MARKET_EDITOR_ENTER_RESULTS, permissionsCode.MARKET_EDITOR_UPDATE_RESULTS]} name={`scores.['${data.id}'].valueB`} component={Input} classOverride="game_event_form_field game_event_form_field--no_label" type="text" disabled={!isInputDisabled}/></td>
    </tr>);
}

let EventScoreForm = props => {
  const { handleSubmit, pristine, reset, submitting, dirty, eventDetails, event, gameResults, periodData, _handleSubmit, initialValues } = props
  let {isFetchingGameResultsPeriodPoints} = gameResults;
  let opponentADetails = getOpponentDetails(eventDetails.opponentAId, event.opponents);
  let opponentBDetails = getOpponentDetails(eventDetails.opponentBId, event.opponents);
  if(!isFetchingGameResultsPeriodPoints && periodData) {
    let dom = [];
    periodData.forEach((t, ti) => {
      if(ti == 0) {
        _pushContentToDOM(dom, t, "", initialValues);
        if(t.hasOwnProperty('children') && t.children) {
            let firstChildLoop =  t.children;
            firstChildLoop.forEach((c, ci) => {
              _pushContentToDOM(dom, c, "first", initialValues);
              if(c.hasOwnProperty('children') && c.children) {
                  let secondChildLoop =  c.children;
                  secondChildLoop.forEach((cc, cci) => {
                    _pushContentToDOM(dom, cc, "second", initialValues);
                    if(cc.hasOwnProperty('children') && cc.children) {
                        let thirdChildLoop =  cc.children;
                        thirdChildLoop.forEach((ccc, ccci) => {
                          _pushContentToDOM(dom, ccc, "third", initialValues);
                        })
                    }
                  })
              }
            })
        }
      }
    })
    return (
        <Form onSubmit={handleSubmit(_handleSubmit)} className="border-box">
          <table className="event-score">
              <thead className="tcenter">
                  <tr>
                      <td></td>
                      <td>{opponentADetails.description}</td>
                      <td>v</td>
                      <td>{opponentBDetails.description}</td>
                  </tr>
              </thead>         
              <tbody>
                {dom.length ?  dom : null}
              </tbody>
          </table>
      </Form>
    );
  }
  else return null
  
}


EventScoreForm = reduxForm({
  form: 'EventScoreForm' ,
  enableReinitialize: true,
})(EventScoreForm)

function mapStateToProps(state) {
    return {
        event: state.eventCreatorEvent,
        eventDetails: state.eventCreatorEvent.event,
        marketStateDetails: state.marketStateDetails,
        event: state.eventCreatorEvent,
        gameResults: state.gameResults,
    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({ 
    }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(EventScoreForm);
