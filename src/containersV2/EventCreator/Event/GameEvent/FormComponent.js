import React from "react";
import { Field, reduxForm, Form, Fields } from 'redux-form';
import checkPermission, { mapPermissionsToProps } from 'componentsV2/checkPermission/index';
import { permissionsCode } from 'containersV2/EventCreator/App/constants';
import { InputField, SelectField, DatePickerField, DatePickerFieldDisableAfterDates, ErrorDisplayField, CheckBoxField } from 'components/formInput';
import ReactTable from 'react-table';
import { required, number, time24, selectionRequired } from 'validations';
import { renderField, renderSelectField } from 'eventCreatorUtils/reduxFormFieldUtils';
import _ from 'underscore';
import cx from 'classnames';
import update from 'immutability-helper';
import { openTimeMustNotAfterStartTime, startTimeMustNotBeforeOpenTime } from '../eventValidations';
import OtherOptions from './OtherOptions';

const styleOpp1 = {width: '45%', float: 'left', boxSizing: 'border-box'};
const styleOpp2 = {width: '10%', float: 'left', boxSizing: 'border-box'};
const styleOppInput1 = {width: 'calc(100% - 50px)', float: 'left', boxSizing: 'border-box'};
const styleOppInput2 = {width: '50px', float: 'left', boxSizing: 'border-box'};

let commonCheckboxProps = {component: CheckBoxField, type: 'checkbox', parse: (value) => {return !!value}};
let PermittedField = checkPermission(Field);

const GameEventForm = (props) => {
    const { handleSubmit, pristine, reset, submitting, error, sportCode, initialValues, sportOtherOptions, playersA, playersB, eventPathMode, hasOpenMarket, permissions } = props;
    const { opponents, countries, templates } = props;
    const { onFormSubmit, isOnUpdateMode=false, isAmericanSport } = props;
    const sportFormatSymbol = props.americanFormat ? '@' : 'V';
    const isAmericanFormatDisabled = eventPathMode === 'VIEW' ? true : (isAmericanSport ? false : true);
    const americanFormatClassName = cx('form-group clearfix', {'disabled': isAmericanFormatDisabled});
    let oppList = _.map(opponents, (opp) => {
      return {'id': opp.id, 'description': opp.description};
    });
    let opponentsList = update(oppList, {
      $unshift: [
        {
          id: -1,
          description: ''
        }
      ]
    });
    let feedCode = initialValues.feedCode;
    let hasValidFeedCode = feedCode && (feedCode.indexOf('BR:') >= 0 || feedCode.indexOf('XL:') >= 0);
    let bestOfSets = sportOtherOptions ? sportOtherOptions.length : 0;

    let playersAList = null;
    let playersBList = null;
    if (sportCode === 'BASE') {
      let pAList = _.map(playersA, (player) => {
        return {'id': player.id, 'description': player.description};
      });
      playersAList = update(pAList, {
        $unshift: [
          {
            id: -1,
            description: ''
          }
        ]
      });

      let pBList = _.map(playersB, (player) => {
        return {'id': player.id, 'description': player.description};
      });
      playersBList = update(pBList, {
        $unshift: [
          {
            id: -1,
            description: ''
          }
        ]
      });
    }

    let isOpponentDropdownDisabled = false;
    if (isOnUpdateMode) {
        if (!permissions.includes(permissionsCode.CHANGE_OPPONENTS_WITH_OPEN_MARKETS)) {
            if (hasOpenMarket) {
                isOpponentDropdownDisabled = true;
            } else {
                if (!permissions.includes(permissionsCode.CHANGE_OPPONENTS_WITH_NO_OPEN_MARKETS)) {
                    isOpponentDropdownDisabled = true;
                }
            }
        }
    }
    
    return (
        <Form onSubmit={handleSubmit(onFormSubmit)} className="border-box game-event-form">
            <div className="padding-medium">
                <div className="form-wrapper">
                    <h4>Opponents</h4>
                    <div className="game_event_form_opponents_section">
                      <Field
                        name="opponentAId"
                        component={renderSelectField}
                        type={'select'}
                        label=""
                        valueKey={'id'}
                        lists={opponentsList}
                        disabled={isOpponentDropdownDisabled}
                        fieldLook={""}
                        validate={[selectionRequired]}
                        hidePlaceHolder={true}
                        style={styleOppInput1}
                        autoFocus={!isOnUpdateMode}
                        classOverride="game_event_form_field--no_label opponentsSelection"/>
                    {(sportCode === 'BASE') &&
                      <Field
                        className="rotationNumberInput"
                        component="input"
                        type="text"
                        name="opponentARotationNumber" />
                    }

                      <div className="tcenter" style={styleOpp2}>
                        <span>{sportFormatSymbol}</span>
                      </div>

                      <Field
                        name="opponentBId"
                        component={renderSelectField}
                        type={'select'}
                        label=""
                        valueKey={'id'}
                        lists={opponentsList}
                        disabled={isOpponentDropdownDisabled}
                        fieldLook={""}
                        validate={[selectionRequired]}
                        hidePlaceHolder={true}
                        style={styleOppInput1}
                        classOverride="game_event_form_field--no_label opponentsSelection"/>
                    {(sportCode === 'BASE') &&
                        <Field
                          className="rotationNumberInput"
                          component="input"
                          type="text"
                          name="opponentBRotationNumber" />
                    }

                    </div>

                {
                  (sportCode === 'BASE') &&
                    <div className="game_event_form_opponents_section">

                      <Field
                        name="pitcherAId"
                        component={renderSelectField}
                        type={'select'}
                        label=""
                        valueKey={'id'}
                        lists={playersAList}
                        disabled={false}
                        fieldLook={""}
                        hidePlaceHolder={true}
                        style={styleOppInput1}
                        autoFocus={!isOnUpdateMode}
                        parse={(value) => parseInt(value)}
                        classOverride="game_event_form_field--no_label opponentsSelection"/>

                      <div className="tcenter" style={styleOpp2}>
                        <span>pitcher</span>
                      </div>

                      <Field
                        name="pitcherBId"
                        component={renderSelectField}
                        type={'select'}
                        label=""
                        valueKey={'id'}
                        lists={playersBList}
                        disabled={false}
                        fieldLook={""}
                        hidePlaceHolder={true}
                        style={styleOppInput1}
                        parse={(value) => parseInt(value)}
                        classOverride="game_event_form_field--no_label opponentsSelection"/>

                    </div>
                }
                </div>

                <div className="form-wrapper">
                    <h4>Details</h4>
                    <div className="clearfix">
                        <div className="desktop-full">
                            <div className="row">
                                <div className="desktop-half">
                                    {/*<Field component={InputField} type="text" name="startDateTime" label="Start Time" />*/}
                                    <Field component={InputField} type="text" name="id" label="Event ID" disabled={true} />
                                    <div className="form-group clearfix">
                                        <label className="form-group-label">Start Time *</label>
                                        <div className="form-group-control" style={{marginBottom: '5px'}}>
                                            <div className="row">
                                                <div className="desktop-half">
                                                    <PermittedField actionIds={isOnUpdateMode ? [permissionsCode.CHANGE_GAME_EVENT_DATE_TIME] : null} name="startDateTime" component={DatePickerField} type="text"/>
                                                </div>
                                                <div className="desktop-half">
                                                    <PermittedField actionIds={isOnUpdateMode ? [permissionsCode.CHANGE_GAME_EVENT_DATE_TIME] : null} name="startTime" component={renderField} classOverride="game_event_form_field game_event_form_field--no_label" validate={[required, time24]} disabled={false} type="text"  />
                                                </div>
                                            </div>
                                            <div className="row">
                                              <Field name="startDateTime"
                                                component={ErrorDisplayField}
                                                validate={[startTimeMustNotBeforeOpenTime]} />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="form-group clearfix">
                                        <label className="form-group-label">Auto Open Time</label>
                                        <div className="form-group-control" style={{marginBottom: '7px'}}>
                                            <div className="row">
                                                <div className="desktop-half">
                                                    {/*<Field name="defaultAutoOpenTime" component={DatePickerField} type="text"/>*/}
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
                                    <Field component={InputField} type="number" name="inRunningDelay" label="In-running delay (milliseconds)" validate={[number]} />
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
                                        <div>
                                            <Field component={InputField} type="text" name="" disabled={true} label="Standard Base Delay" />
                                            <Field component={InputField} type="text" name="" disabled={true} label="Mobile Offset" />
                                            <div className="padding-small">
                                                <ReactTable data={[]} showPageSizeOptions={false} showPagination={false} defaultPageSize={7} columns={[{header: 'Feed'}, {header: 'Offset'}]} />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                    <div className="desktop-full">
                                        <div className="form-wrapper">
                                            <h4>Event Information</h4>
                                            <Field component="textarea" name="eventInformation" style={{width: '100%', height: '40px', border: 'none'}} />
                                        </div>
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
                                    <Field {...commonCheckboxProps} name="formPrint" label="Exclude from prices sheet" />
                                    <Field {...commonCheckboxProps} name="calendarEvent" label="In Running Calendar" />
                                    <Field {...commonCheckboxProps} name="americanFormat" label="American Format"
                                        disabled={isAmericanFormatDisabled}
                                        className={americanFormatClassName}
                                        onChange={() => {
                                            const { opponentAId, opponentBId, change } = props;
                                            if (opponentAId !== opponentBId) {
                                                change('opponentAId', opponentBId && opponentBId !== '-1' ? opponentBId : null);
                                                change('opponentBId', opponentAId && opponentAId !== '-1' ? opponentAId : null);
                                            }
                                        }}
                                    />
                                    <Field {...commonCheckboxProps} name="neutralGround" label="Neutral Ground" />
                                    {hasValidFeedCode &&
                                        <Field {...commonCheckboxProps} name="formIgnoreFeed" label="Allow Feed to control Main Book" />
                                    }
                                    {hasValidFeedCode &&
                                        <Field {...commonCheckboxProps} name="formIgnoreFeedLiveBook" label="Allow Feed to control In Running" />
                                    }
                                    {!!bestOfSets && <OtherOptions sportOtherOptions={sportOtherOptions} sportCode={sportCode} />}
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
                        </div>
                    </div>
                </div>
            </div>
        </Form>
    )
};

export default reduxForm({
    form: 'GameEventForm',
    enableReinitialize: true,
    validate: values => {
        const errors = {};
        if(values.opponentAId === values.opponentBId) {
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
})(mapPermissionsToProps(GameEventForm));
