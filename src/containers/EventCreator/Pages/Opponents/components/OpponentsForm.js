'use strict';
import React, { PropTypes } from "react";
import { Field, reduxForm, Form } from 'redux-form';
import checkPermission, { mapPermissionsToProps } from 'componentsV2/checkPermission/index';
import { permissionsCode } from 'containersV2/EventCreator/App/constants';
import { renderField, renderSelectField } from 'eventCreatorUtils/reduxFormFieldUtils';
import MODE from 'eventCreatorOpponentsConstants/modeConst';
import * as validate from 'phxValidations';

const PermittedField = checkPermission(Field);

class OpponentsForm extends React.Component {
    constructor(props) {
        super(props)
    }

    render() {
        const { handleSubmit, opponentType, initialValues, opponentsFormSubmitHandler, permissions } = this.props;
        return (
            <Form onSubmit={handleSubmit(opponentsFormSubmitHandler)} className="form-new-player-team">
                <div className="form-wrapper">
                    <Field
                        name={'description'}
                        component={renderField}
                        type={'text'}
                        label={'Description *'}
                        disabled={false}
                        fieldLook={""}
                        autoFocus={true}
                        validate={[validate.required,(value)=> value.trim().length > 0 ? undefined : 'Cannot be empty']}
                        hidePlaceHolder={true}
                        onBlur={()=>{}}/>
                    <Field
                        name={'nickname'}
                        component={renderField}
                        type={'text'}
                        label={'Nickname'}
                        disabled={false}
                        fieldLook={""}
                        hidePlaceHolder={true}/>
                    <Field
                        name={'abbreviation'}
                        component={renderField}
                        type={'text'}
                        label={'Abbreviation'}
                        disabled={false}
                        fieldLook={""}
                        hidePlaceHolder={true}/>
                    <Field
                        name={'feedCode'}
                        component={renderField}
                        type={'text'}
                        label={'External Feed Code'}
                        disabled={false}
                        fieldLook={""}
                        hidePlaceHolder={true}/>

                    {
                        (opponentType.description && opponentType.description.toLowerCase() === 'team') && permissions.includes(permissionsCode.VIEW_EVENT_PATH_AND_OPPONENT_RATINGS) &&
                        <PermittedField
                            actionIds={[permissionsCode.EDIT_EVENT_PATH_AND_OPPONENT_RATINGS]}
                            name={'grade'}
                            component={renderField}
                            type={'text'}
                            label={'Grade'}
                            format={value => value < 0 ? '' : value}
                            placeholder="1"
                            disabled={false}
                            fieldLook={""}
                            validate={[validate.number, validate.maxLength(3), validate.positivenumberonly]}
                            hidePlaceHolder={false}
                        />
                    }
                </div>
            </Form>
        );
    }
};


OpponentsForm.propTypes = {
    mode: PropTypes.oneOf( [ MODE.ADD, MODE.EDIT ] ).isRequired,
    opponentId: PropTypes.number.isRequired,
    opponentType: PropTypes.shape( {
        id: PropTypes.number,
        description: PropTypes.description
    } ).isRequired,
    initialValues: PropTypes.object,
    opponentsFormSubmitHandler: PropTypes.func,
};


OpponentsForm.defaultProps = {
    mode: MODE.ADD,
    opponentId: -1,
    opponentType: {
        id: 1,
        description: 'Team'
    },
    initialValues: {
        id: -1,
        description: null,
        typeId: 1,
        abbreviation: null,
        nickname: null,
        sportCode: null,
        feedCode: null,
        grade: 1,
    },
    opponentsFormSubmitHandler: null,
};


OpponentsForm = reduxForm( {
    form: 'OpponentsForm',
    enableReinitialize: true,
} )( OpponentsForm );


export default mapPermissionsToProps(OpponentsForm);
