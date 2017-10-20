import React from "react";
import { Field, Fields, reduxForm, Form } from 'redux-form';
import checkPermission, { mapPermissionsToProps } from 'componentsV2/checkPermission/index';
import { permissionsCode } from 'containersV2/EventCreator/App/constants';
import { InputField, SelectField, DatePickerField, DatePickerFieldDisableAfterDates, ErrorDisplayField, CheckBoxField } from 'components/formInput';
import { required, time24, selectionRequired } from 'validations';
import { renderField, renderSelectField } from 'eventCreatorUtils/reduxFormFieldUtils';
import filterTypes from '../../../../constants/filterTypes';
import { openTimeMustNotAfterCutOffTime, cutOffTimeMustNotBeforeAutoOpenTime } from '../marketValidations';

let PermittedField = checkPermission(Field);

const { OPEN, CLOSED, SUSPENDED, SETTLED, RESULTED } = filterTypes.STANDARD_MARKET_STATUSES;

const MarketForm = (props) => {
    const { handleSubmit, pristine, reset, submitting, error, initialValues } = props;
    const { onFormSubmit, permissions } = props;
    let statusRadioButtons = [SUSPENDED, OPEN, CLOSED];
    let statusId = initialValues.statusId ? initialValues.statusId.toString() : null;
    let isStatusDisabled = false;
    if (statusId) {
        if (![SUSPENDED.value, OPEN.value, CLOSED.value].includes(statusId)) {
            isStatusDisabled = true;
            statusRadioButtons = [[SETTLED, RESULTED].find(status => status.value === statusId)];
        }
    }

    if (!permissions.includes(permissionsCode.ALLOW_CLOSED_MARKET_REOPENING) && CLOSED.value === statusId) {
        isStatusDisabled = true;
    }

    return (
        <Form onSubmit={handleSubmit(onFormSubmit)} className="form-details">
            <div className="form-wrapper">
                <div className="header panel-header">
                    <div className="panel-header-title">Details</div>
                </div>
                <div className="desktop-full panel-content">
                    <div className="row">
                        <div className="desktop-half">
                            <Field name="id" label="Market ID" component={renderField} disabled={true} type="text"/>
                        </div>
                        <div className="desktop-half">
                            <Field name="eventId" label="Event ID" component={renderField} disabled={true} type="text"/>
                        </div>
                    </div>
                    <Field component={InputField} type="text" name="period" label="Period" disabled={true} />
                    <Field component={InputField} type="text" name="description" label="Description *" validate={[required]}/>
                    <div className="form-group clearfix">
                        <label className="form-group-label">Cut-off Time *</label>
                        <div className="form-group-control">
                            <div className="row">
                                <div className="desktop-half">
                                    <PermittedField actionIds={[permissionsCode.CHANGE_GAME_EVENT_DATE_TIME]} name="formCutoffDate" component={DatePickerField} type="text"/>
                                </div>
                                <div className="desktop-half">
                                    <PermittedField actionIds={[permissionsCode.CHANGE_GAME_EVENT_DATE_TIME]} name="formCutoffTime" component={renderField} classOverride="time-field" validate={[required, time24]} disabled={false} type="text"  />
                                </div>
                            </div>
                            <div className="row">
                              <Field name="formCutoffDate"
                                component={ErrorDisplayField}
                                validate={[cutOffTimeMustNotBeforeAutoOpenTime]} />
                            </div>
                        </div>
                    </div>
                    <div className="form-group clearfix">
                        <label className="form-group-label">Auto Open Time</label>
                        <div className="form-group-control">
                            <div className="row">
                                <div className="desktop-half">
                                    {/*<Field name="formAutoOpenDate" component={DatePickerField} type="text"/>*/}
                                    <Fields
                                      names={["formAutoOpenDate", "formCutoffDate"]}
                                      component={DatePickerFieldDisableAfterDates}
                                      valueFieldName={"formAutoOpenDate"}
                                      disabledDaysAfterFieldName={"formCutoffDate"}
                                      type="text"/>
                                </div>
                                <div className="desktop-half">
                                    <Field name="formAutoOpenTime" component={renderField} classOverride="time-field" validate={[time24]} disabled={false} type="text"  />
                                </div>
                            </div>
                            <div className="row">
                              <Field name="formAutoOpenDate"
                                component={ErrorDisplayField}
                                validate={[openTimeMustNotAfterCutOffTime]} />
                            </div>
                        </div>
                    </div>
                    <div className="form-group clearfix">
                        <label className="form-group-label">Status</label>
                        <div className="clearfix">
                            {statusRadioButtons.map(status => {
                                let value = status.desc.toLowerCase();
                                return (
                                    <div key={status.desc} className="status-radio-container">
                                        <Field
                                            component="input"
                                            type="radio"
                                            name="status"
                                            value={value}
                                            id={`status-${value}`}
                                            disabled={isStatusDisabled}
                                        />
                                        <label htmlFor={`status-${value}`}><i className={`phxico phx-${value}`}></i>{status.desc}</label>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                    <Field component={InputField} type="text" name="lookupCode" label="Lookup Code" disabled={true} />
                    <Field component={InputField} type="text" name="grade" label="Grade" disabled={true} />
                    <div className="form-group clearfix">
                        <label className="form-group-label">&nbsp;</label>
                        <div className="row">
                            <div className="desktop-full">
                                <PermittedField
                                    actionIds={[permissionsCode.AUTO_SETTLEMENT]}
                                    disabledClassName="disabled form-group clearfix"
                                    component={CheckBoxField}
                                    className="form-group clearfix"
                                    type="checkbox"
                                    name="autoSettle"
                                    label="Auto Settle Event"
                                />
                                <Field component={CheckBoxField} className="form-group clearfix" type="checkbox" name="formPrint" label="Exclude from prices sheet" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Form>
    )
};

export default reduxForm({
    form: 'MarketForm',
    enableReinitialize: true,
    validate: values => {
        const errors = {};
        return errors;
    }
})(mapPermissionsToProps(MarketForm));
