import React from "react";
import { connect } from 'react-redux';
import { Field, reduxForm, Form, Fields } from 'redux-form';
import { bindActionCreators } from 'redux';
import { setNewSelectedOpponents, clearNewSelectedOpponents } from '../actions';
import checkPermission from 'componentsV2/checkPermission/index';
import { permissionsCode } from 'containersV2/EventCreator/App/constants';
import { InputField, SelectField, DatePickerField, DatePickerFieldDisableAfterDates, ErrorDisplayField, CheckBoxField } from 'components/formInput';
import { renderField } from 'eventCreatorUtils/reduxFormFieldUtils';
import ReactTable from 'react-table';
import { required, time24, selectionRequired, number } from 'validations';
import OpponentsTable from '../../Opponents/index';
import { paths } from '../../App/constants';
import { openTimeMustNotAfterStartTime, startTimeMustNotBeforeOpenTime } from '../eventValidations';

let PermittedField = checkPermission(Field);

const RankEventForm = (props) => {
    const { handleSubmit, pristine, reset, submitting, error, initialValues } = props;
    const { opponents, countries, templates, isFetchingSelectedOpponents } = props;
    const { onFormSubmit, openModalOpponents, isOnUpdateMode=false, activeCode } = props;

    const styleOpp1 = {width: '45%', float: 'left', boxSizing: 'border-box'};
    const styleOpp2 = {width: '10%', float: 'left', boxSizing: 'border-box'};
    const styleOppInput1 = {width: 'calc(100% - 50px)', float: 'left', boxSizing: 'border-box'};
    const styleOppInput2 = {width: '50px', float: 'left', boxSizing: 'border-box'};

    let commonCheckboxProps = {component: CheckBoxField, type: 'checkbox', parse: (value) => {return !!value}};
    let otherCheckboxesDisabled = !['GREY', 'HORS'].includes(activeCode);

    return (
        <Form onSubmit={handleSubmit(onFormSubmit)} className="border-box rank-event-form">
            <div className="padding-medium">
                <div className="form-wrapper">
                    <h4>Details</h4>
                    <div className="clearfix padding-small">
                        <div className="desktop-full">
                                <div className="desktop-half">
                                    <Field component={InputField} type="text" name="id" label="Event ID" disabled={true} />
                                    <Field component={renderField} type="text" autoFocus={true} name="description" label="Description *" />

                                    <div className={`form-group clearfix`}>
                                        <label className="form-group-label">Start Time *</label>
                                        <div className="form-group-control" style={{marginBottom: '5px'}}>
                                          <div className="row">
                                            <div className="desktop-half">
                                                <PermittedField actionIds={isOnUpdateMode ? [permissionsCode.CHANGE_GAME_EVENT_DATE_TIME] : false} name="startDateTime" component={DatePickerField} type="text" label="Start Time"/>
                                            </div>
                                            <div className="desktop-half">
                                                <PermittedField actionIds={isOnUpdateMode ? [permissionsCode.CHANGE_GAME_EVENT_DATE_TIME] : false} name="startTime" component={renderField} placeholder="00:00" classOverride="game_event_form_field game_event_form_field--no_label" validate={[time24]} disabled={false} type="text"  />
                                            </div>
                                          </div>
                                          <div className="row">
                                            <Field name="startDateTime"
                                              component={ErrorDisplayField}
                                              validate={[startTimeMustNotBeforeOpenTime]} />
                                          </div>
                                        </div>
                                    </div>

                                   <div className={`form-group clearfix`}>
                                        <label className="form-group-label">Auto Open Time</label>
                                        <div className="form-group-control" style={{marginBottom: '7px'}}>
                                          <div className="row">
                                            <div className="desktop-half">
                                                {/*<Field name="defaultAutoOpenTime" component={DatePickerField} type="text" label="Start Time"/>*/}
                                                <Fields
                                                  names={["defaultAutoOpenTime", "startDateTime"]}
                                                  component={DatePickerFieldDisableAfterDates}
                                                  valueFieldName={"defaultAutoOpenTime"}
                                                  disabledDaysAfterFieldName={"startDateTime"}
                                                  type="text"/>
                                            </div>
                                            <div className="desktop-half">
                                                <Field name="defaultStartTime" component={renderField} placeholder="00:00" classOverride="game_event_form_field game_event_form_field--no_label" validate={[time24]} disabled={false} type="text"  />
                                            </div>
                                          </div>
                                          <div className="row">
                                            <Field name="defaultAutoOpenTime"
                                              component={ErrorDisplayField}
                                              validate={[openTimeMustNotAfterStartTime]} />
                                          </div>
                                        </div>
                                    </div>

                                    {/*<Field component={InputField} type="text" name="defaultAutoOpenTime" label="Auto Open Time" />*/}
                                    <div className="form-group clearfix">
                                        <label className="form-group-label">Country</label>
                                        <div className="form-group-control">
                                            <Field component="select" name="countryId">
                                                <option value=""></option>
                                                {countries.map( country =>
                                                    <option key={country.id} id={country.id} value={country.id}>{country.description}</option>
                                                )}
                                            </Field>
                                        </div>
                                    </div>
                                    <Field component={InputField} type="text" name="lookupCode" label="Lookup Code" disabled={true} />
                                    <Field component={InputField} type="text" name="feedCode" label="Feed Code" disabled={isOnUpdateMode} />
                                    <Field component={InputField} type="number" name="inRunningDelay" label="In-running delay (milliseconds)" validate={[number]}/>
                                    <Field component={InputField} type="text" name="raceNumber" label="Race Number" />
                                    <Field component={InputField} type="text" name="groupNumber" label="Group Number" />
                                    <Field component={InputField} type="text" name="grade" label="Grade" disabled={true} />
                                    <div className="form-group clearfix">
                                        <label className="form-group-label">Original Start Time</label>
                                        <div className="form-group-control">
                                            <div className="row">
                                                <div className="desktop-half">
                                                    <Field name="originalStartDateTime" component={DatePickerField} type="text"/>
                                                </div>
                                                <div className="desktop-half">
                                                    <Field name="originalStartTime" component={renderField} classOverride="game_event_form_field game_event_form_field--no_label" validate={[time24]} type="text"  />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="desktop-half">
                                    <div className="form-wrapper">
                                        <h4>In Play Delay</h4>
                                        <Field component={InputField} type="text" name="" disabled={true} label="Standard Base Delay" />
                                        <Field component={InputField} type="text" name="" disabled={true} label="Mobile Offset" />
                                        <div className="padding-small">
                                        <ReactTable data={[]} showPageSizeOptions={false} showPagination={false} defaultPageSize={9} columns={[{header: 'Feed'}, {header: 'Offset'}]} />
                                        </div>
                                    </div>
                                </div>
                                <div className="desktop-full">
                                    <div className="form-wrapper" style={{width: '100%'}}>
                                        <h4>Event Information</h4>
                                        <Field component="textarea" name="eventInformation" style={{width: '100%', height: '40px', border: 'none'}} />
                                    </div>
                                </div>
                                <div className="desktop-full clearfix checkboxes">
                                    <PermittedField
                                        actionIds={[permissionsCode.AUTO_SETTLEMENT]}
                                        disabledClassName="disabled form-group clearfix"
                                        className="form-group clearfix"
                                        {...commonCheckboxProps}
                                        name="autoSettle"
                                        label="Auto Settle Event"
                                    />
                                    <Field {...commonCheckboxProps} name="calendarEvent" label="In Running Calendar" />
                                    <Field {...commonCheckboxProps} name="neutralGround" label="Neutral Ground" />
                                    <Field {...commonCheckboxProps} disabled={otherCheckboxesDisabled} className={otherCheckboxesDisabled ? 'disabled form-group clearfix' : 'form-group clearfix'} name="handicapped" label="Handicap Race" />
                                    <Field {...commonCheckboxProps} disabled={otherCheckboxesDisabled} className={otherCheckboxesDisabled ? 'disabled form-group clearfix' : 'form-group clearfix'} name="forecast" label="Forecasts" />
                                    <Field {...commonCheckboxProps} disabled={otherCheckboxesDisabled} className={otherCheckboxesDisabled ? 'disabled form-group clearfix' : 'form-group clearfix'} name="tricast" label="Tricasts" />
                                    <Field {...commonCheckboxProps} disabled={otherCheckboxesDisabled} className={otherCheckboxesDisabled ? 'disabled form-group clearfix' : 'form-group clearfix'} name="bestOddsGuarantee" label="Best Odds Guarantee" />
                                    <Field {...commonCheckboxProps} name="formIgnoreFeed" label="Allow Feed to control Main Book" />
                                    <Field {...commonCheckboxProps} name="formIgnoreFeedLiveBook" label="Allow Feed to control In Running" />
                                </div>

                                <div className="desktop-full">
                                    <div className="padding-medium clearfix tcenter" style={{marginTop: '10px', borderTop: '1px solid #a5a5a5'}}>
                                        <div style={{width:'33%', float: 'left'}}>
                                            <Field component="input" type="radio" disabled={isOnUpdateMode}name="rankEventDefaultMarketType" value="OUTRIGHT" /> Outright
                                        </div>
                                        <div style={{width:'33%', float: 'left'}}>
                                            <Field component="input" type="radio" disabled={isOnUpdateMode}name="rankEventDefaultMarketType" value="FUTURE" /> Future
                                        </div>
                                        <div style={{width:'33%', float: 'left'}}>
                                            <Field component="input" type="radio" disabled={isOnUpdateMode}name="rankEventDefaultMarketType" value="PROPOSITION" /> Proposition
                                        </div>
                                    </div>
                                </div>

                                <div className="desktop-full">

                                    <div className="form-wrapper">
                                        <h4>Templates</h4>
                                        <div className="form-group clearfix">
                                            <label className="form-group-label">Use the following Template</label>
                                            <div className="form-group-control">
                                                <Field component="select" name="eventTemplateId">
                                                    <option value="">No Template</option>
                                                    {templates.map( template =>
                                                        <option key={template.id} value={template.id}>{template.description}</option>
                                                    )}
                                                </Field>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="desktop-full">
                                    <OpponentsTable
                                        selectedOpponents={props.selectedOpponents}
                                        availableOpponents={props.availableOpponents}
                                        newSelectedOpponents={props.newSelectedOpponents}
                                        isCreatingNewOpponents={paths.LEAGUE_NEWRANK === props.activePage}
                                        defaultMarketId={props.defaultMarketId}
                                        eventPathMode={props.eventPathMode}
                                        setNewSelectedOpponents={props.setNewSelectedOpponents}
                                        clearNewSelectedOpponents={props.clearNewSelectedOpponents}
                                        hasImportButton={true}
                                        activeCode={activeCode}
                                        isGameEvent={false}
                                        isLoadingOpponents={isFetchingSelectedOpponents}
                                    />
                                </div>
                        </div>
                    </div>
                </div>
            </div>
        </Form>
    )
};

const RankEventFormRedux = reduxForm({
    form: 'RankEventForm',
    enableReinitialize: true,
    validate: values => {
        const errors = {};
        if (values.opponentAId === values.opponentBId) {
            errors.opponentBId = 'Team 1 and team 2 cannot be the same';
        }
        if (values.defaultAutoOpenTime && !values.defaultStartTime) {
            errors.defaultStartTime = 'Required';
        }
        if (values.originalStartDateTime && !values.originalStartTime) {
            errors.originalStartTime = 'Required';
        }
        return errors;
    }
})(RankEventForm);

const mapStateToProps = (state, ownProps) => {
    return {
        selectedOpponents: state.eventCreatorEvent.selectedOpponents,
        availableOpponents: state.eventCreatorEvent.opponents,
        newSelectedOpponents: state.eventCreatorEvent.newSelectedOpponents,
        activePage: state.eventCreatorApp.activePage,
        defaultMarketId: state.eventCreatorEvent.defaultMarketId,
        eventPathMode: state.eventCreatorEventPath.eventPathMode,
        activeCode: state.sportsTree.activeSportCode,
        isFetchingSelectedOpponents: state.eventCreatorEvent.isFetchingSelectedOpponents
    };
};

const mapDispatchToProps = (dispatch, ownProps) => {
    return bindActionCreators({
        setNewSelectedOpponents,
        clearNewSelectedOpponents
    }, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(RankEventFormRedux);
