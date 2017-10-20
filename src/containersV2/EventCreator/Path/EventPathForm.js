'use strict';
import React, { PropTypes } from "react";
import { Field, reduxForm, Form } from 'redux-form';
import checkPermission, { mapPermissionsToProps } from 'componentsV2/checkPermission/index';
import { permissionsCode } from 'containersV2/EventCreator/App/constants';
import { renderField, renderSelectField } from 'eventCreatorUtils/reduxFormFieldUtils';
import * as validate from 'phxValidations';
import GridModule from 'phxComponents/Grid/GridModule';
import RowModule from 'phxComponents/Grid/RowModule';
import ColModule from 'phxComponents/Grid/ColModule';

const PermittedField = checkPermission(Field);

class EventPathForm extends React.Component {

    render() {
        const { initialValues, isFieldsLocked, handleSubmit, eventPathFormSubmitHandler, tags, disabledInput, permissions } = this.props;
        return (
          <Form onSubmit={handleSubmit(eventPathFormSubmitHandler)} >
            <div className="form-wrapper form-wrapper--no-border">
              <div className="form-inner">
                <GridModule>

                  <RowModule>
                    <ColModule xs={12} sm={12} md={6} lg={6}>
                      <Field
                        name={'description'}
                        component={renderField}
                        type={'text'}
                        label={'Description *'}
                        fieldLook={""}
                        disabled={disabledInput}
                        validate={[validate.required]}
                        hidePlaceHolder={true}/>
                    </ColModule>
                    <ColModule xs={12} sm={12} md={6} lg={6}>
                      <Field
                        name={'tagId'}
                        component={renderSelectField}
                        type={'select'}
                        label={'Tag'}
                        valueKey={'id'}
                        lists={tags}
                        disabled={disabledInput}
                        fieldLook={""}
                        hidePlaceHolder={true}/>
                    </ColModule>
                  </RowModule>

                  <RowModule>
                    <ColModule xs={12} sm={12} md={12} lg={12}>
                      <Field
                        name={'feedCode'}
                        component={renderField}
                        type={'text'}
                        disabled={disabledInput}
                        label={'Feed Code'}
                        fieldLook={""}
                        hidePlaceHolder={true}/>
                    </ColModule>
                  </RowModule>

                  <RowModule>
                    <ColModule xs={12} sm={12} md={6} lg={6}>
                      <Field
                        name={'publishSort'}
                        component={renderField}
                        type={'text'}
                        label={'Publish Sort'}
                        fieldLook={""}
                        validate={[validate.number, validate.maxLength(9), validate.positivenumberonly]}
                        hidePlaceHolder={true}/>
                    </ColModule>
                    <ColModule xs={12} sm={12} md={6} lg={6}>
                      <Field
                        name={'eventPathCode'}
                        component={renderField}
                        type={'text'}
                        label={'Event Path Code'}
                        fieldLook={""}
                        disabled={disabledInput}
                        validate={[validate.maxLength(5)]}
                        hidePlaceHolder={true}/>
                    </ColModule>
                  </RowModule>
                  {permissions.includes(permissionsCode.VIEW_EVENT_PATH_AND_OPPONENT_RATINGS) &&
                    <RowModule>
                      <ColModule xs={12} sm={12} md={6} lg={6}>
                        <PermittedField
                          actionIds={[permissionsCode.EDIT_EVENT_PATH_AND_OPPONENT_RATINGS]}
                          name={'grade'}
                          component={renderField}
                          type={'text'}
                          label={'Grade'}
                          fieldLook={""}
                          validate={[validate.number, validate.maxLength(3), validate.positivenumberonly]}
                          hidePlaceHolder={true}/>
                      </ColModule>
                    </RowModule>
                  }
                  

                  <RowModule>
                    <ColModule xs={12} sm={12} md={12} lg={12}>
                      <Field
                        name={'comments'}
                        component={renderField}
                        type={'text'}
                        label={'Comments'}
                        fieldLook={""}
                        hidePlaceHolder={true}/>
                    </ColModule>
                  </RowModule>

                  <RowModule>
                    <ColModule xs={12} sm={12} md={6} lg={6}>
                      <Field
                        name={'suppressP2P'}
                        component={renderField}
                        type={'checkbox'}
                        label={'Suppress P2P'}
                        defaultChecked={initialValues.suppressP2P}
                        fieldLook={""}
                        hidePlaceHolder={true}/>
                    </ColModule>
                  </RowModule>

                </GridModule>
              </div>
            </div>
          </Form>
        );
    }

};


EventPathForm.propTypes = {
    isFieldsLocked: PropTypes.bool,
    eventPathFormSubmitHandler: PropTypes.func,
    initialValues: PropTypes.shape({
        description: PropTypes.string,
        tagId: PropTypes.number,
        tagList: PropTypes.arrayOf(
            PropTypes.shape({
                id: PropTypes.number,
                description: PropTypes.string
            })),
        feedCode: PropTypes.string,
        publishSort: PropTypes.number,
        eventPathCode: PropTypes.string,
        grade: PropTypes.number,
        comments: PropTypes.string,
        suppressP2P: PropTypes.bool
    })
}


EventPathForm.defaultProps = {
    isFieldsLocked: true,
    initialValues: {
        description: '',
        tagId: -1,
        tagList: [{id:-1, description: ''}],
        feedCode: '',
        publishSort: '',
        eventPathCode: '',
        grade: 1,
        comments: '',
        suppressP2P: false
    }
}

EventPathForm = reduxForm({
    form: 'EventPathForm',
    enableReinitialize: true,
})(EventPathForm)


export default mapPermissionsToProps(EventPathForm);
