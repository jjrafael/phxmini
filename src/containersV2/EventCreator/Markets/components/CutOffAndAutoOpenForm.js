import React from 'react';
import { Field, reduxForm, Form, Fields } from 'redux-form';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { InputField, DatePickerField, DatePickerFieldDisableAfterDates, ErrorDisplayField } from 'components/formInput';
import { required, time24, selectionRequired } from 'validations';
import { renderField } from 'eventCreatorUtils/reduxFormFieldUtils';
import { openTimeMustNotAfterStartTime, startTimeMustNotBeforeOpenTime } from '../../Event/eventValidations';
import {objectToArray} from 'utils';

let CutOffAndAutoOpenForm = props => {
  const { handleSubmit, pristine, reset, submitting, dirty, periods, event, marketModal } = props
  const eventDetails = event.event;
  let marketPeriods = objectToArray(periods);
  let periodsValues = props.initialValues.periods;
  return (
    <Form onSubmit={handleSubmit(props._handleSubmit)} className="border-box">
        <div className="tcenter top"><h4>{marketModal == "CUTOFF" ? "Period Cut-Off" : "Auto Open Time"}</h4></div>
        <div className="content-details padding-small body">
          <div className="inner">
            {
              marketModal == "CUTOFF" ?  <div className="form-group clearfix">
                <label className="form-group-label">Event Start Date</label>
                <div className="form-group-control">
                  <div className="row">
                    <div className="desktop-half">
                        <Field name="event.id" component={(input) => {
                          return <input type="hidden" />;
                        }} />
                        <Field name="event.date" component={DatePickerField} classOverride="game_event_form_field game_event_form_field--no_label" type="text" label=""/>
                    </div>
                    <div className="desktop-half">
                        <Field name="event.time" component={renderField} placeholder="00:00" classOverride="game_event_form_field game_event_form_field--no_label" validate={[time24]} disabled={false} type="text"  />
                    </div>
                  </div>
                  <div className="row">
                    <Field name="formCutoffDate"
                      component={ErrorDisplayField}
                      validate={[startTimeMustNotBeforeOpenTime]} />
                  </div>
                </div>
              </div> :  <div className="form-group clearfix">
                  <label className="form-group-label">Event Auto Open Time</label>
                  <div className="form-group-control">
                    <div className="row">
                      <div className="desktop-half">
                          <Field  component={(input) => {
                            return <input type="hidden" />;
                          }} />
                          <Field name="event.date" component={InputField} classOverride="auto-open game_event_form_field game_event_form_field--no_label" type="text" disabled={true}/>
                      </div>
                      <div className="desktop-half">
                          <Field name="event.time" component={InputField} placeholder="00:00" classOverride="auto-open game_event_form_field game_event_form_field--no_label" type="text" disabled={true}/>
                      </div>
                    </div>
                    <div className="row">
                      <Field name="formCutoffDate"
                        component={ErrorDisplayField}
                        validate={[startTimeMustNotBeforeOpenTime]} />
                    </div>
                  </div>
              </div>
            }
            {
              marketPeriods.map((p,i) => {

                return <div className="form-group clearfix">
                    <label className="form-group-label">{p.desc}</label>
                    <div className="form-group-control">
                      <Field name={`periods.['${p.desc}'].ids`} component={(input) => {
                          return <input type="hidden" />;
                        }} />
                        {
                          marketModal == "CUTOFF" ? <div className="row">
                              <div className="desktop-half">
                                  <Field name={`periods.['${p.desc}'].cutoffDate`} component={DatePickerField} classOverride="game_event_form_field game_event_form_field--no_label" type="text" label=""/>
                              </div>
                              <div className="desktop-half">
                                  <Field name={`periods.['${p.desc}'].cutoffTime`} component={renderField} placeholder="00:00" classOverride="game_event_form_field game_event_form_field--no_label" validate={[time24]} disabled={false} type="text"  />
                              </div>
                            </div> : <div className="row">
                              <div className="desktop-half">
                                  <Field name={`periods.['${p.desc}'].autoOpenDate`} component={DatePickerField} classOverride="game_event_form_field game_event_form_field--no_label" type="text" label=""/>
                              </div>
                              <div className="desktop-half">
                                  <Field name={`periods.['${p.desc}'].autoOpenTime`} component={renderField} placeholder="00:00" classOverride="game_event_form_field game_event_form_field--no_label" validate={[time24]} disabled={false} type="text"  />
                              </div>
                            </div>
                        }
                      
                      <div className="row">
                        <Field name="startDateTime"
                          component={ErrorDisplayField}
                          validate={[startTimeMustNotBeforeOpenTime]} />
                      </div>
                    </div>
                </div>
              })
            }
          </div>
        </div>
        <div className="modal-controls">
          <div className="bottom button-group">
              <button type="button" onClick={(e)=> {
                  props.closeModal('cutOffAndAutoOpenMarket');
              }}>Cancel</button>
              <button type="submit" disabled={!dirty && submitting}>
                  Save
              </button>
          </div>
        </div>
    </Form>
  );
}

CutOffAndAutoOpenForm = reduxForm({
  form: 'CutOffAndAutoOpenForm' ,
  enableReinitialize: true,
})(CutOffAndAutoOpenForm)

export default CutOffAndAutoOpenForm;
