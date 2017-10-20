'use strict';
import React, { PropTypes } from "react";
import { Field, reduxForm, Form } from 'redux-form';
import { renderField, renderSelectField, renderColorPicker } from 'eventCreatorUtils/reduxFormFieldUtils';
import * as validate from 'phxValidations';

class KitsForm extends React.Component {
    constructor(props) {
        super(props)
    }

    render() {
        const { handleSubmit, kitPatternList, initialValues, kitFormSubmitHandler, okHandler, cancelHandler, invalid } = this.props;

        return (
            <Form onSubmit={handleSubmit(kitFormSubmitHandler)} className="form-new-kit">
                <div className="form-wrapper">
                    <Field
                        name={'description'}
                        component={renderField}
                        type={'text'}
                        label={'Kit Label * '}
                        disabled={false}
                        fieldLook={""}
                        autoFocus={true}
                        validate={[validate.required]}
                        hidePlaceHolder={true}/>
                    <Field
                        name={'backgroundColor'}
                        component={renderColorPicker}
                        type={'text'}
                        label={'Background Colour'}
                        disabled={false}
                        fieldLook={""}
                        hidePlaceHolder={true}/>
                    <Field
                        name={'shortColor'}
                        component={renderColorPicker}
                        type={'text'}
                        label={'Short Colour'}
                        disabled={false}
                        fieldLook={""}
                        hidePlaceHolder={true}/>
                    <Field
                        name={'patternColor'}
                        component={renderColorPicker}
                        type={'text'}
                        label={'Pattern Colour'}
                        disabled={false}
                        fieldLook={""}
                        hidePlaceHolder={true}/>
                    <Field
                        name={'kitPatternId'}
                        component={renderSelectField}
                        type={'select'}
                        label={'Pattern * '}
                        valueKey={'id'}
                        lists={kitPatternList}
                        disabled={false}
                        fieldLook={""}
                        validate={[validate.selectionRequired]}
                        hidePlaceHolder={true}/>
                    <Field
                        name={'defaultKit'}
                        component={renderField}
                        type={'checkbox'}
                        label={'Default'}
                        defaultChecked={initialValues.defaultKit}
                        disabled={false}
                        fieldLook={""}
                        parse={(value) => {return !!value}}
                        hidePlaceHolder={true}/>
                </div>

                <div className="button-group tcenter">
                  <button
                      type="button"
                      onClick={cancelHandler}
                      disabled={false}>
                      Cancel
                  </button>
                  <button
                      type="button"
                      onClick={okHandler}
                      disabled={invalid}>
                      Save
                  </button>

                </div>
            </Form>
        );
    }
};


KitsForm.propTypes = {
    kitPatternList: PropTypes.arrayOf( PropTypes.shape( {
        id: PropTypes.number,
        description: PropTypes.string
    } ) ).isRequired,
    initialValues: PropTypes.shape( {
        label: PropTypes.string,
        kitPatternId: PropTypes.number,
        backgroundColor: PropTypes.string,
        shortColor: PropTypes.string,
        patternColor: PropTypes.string,
        defaultKit: PropTypes.bool
    } ),
    kitFormSubmitHandler: PropTypes.func,
    okHandler: PropTypes.func,
    cancelHandler: PropTypes.func,
};


KitsForm.defaultProps = {
    kitPatternList: [ {
        id: -1,
        description: ''
    } ],
    initialValues: {
        label: '',
        kitPatternId: -1,
        backgroundColor: 'FFFFFF',
        shortColor: 'FFFFFF',
        patternColor: 'FFFFFF',
        defaultKit: false
    },
    kitFormSubmitHandler: null,
};


KitsForm = reduxForm( {
    form: 'KitsForm',
    enableReinitialize: true,
} )( KitsForm );



export default KitsForm;
