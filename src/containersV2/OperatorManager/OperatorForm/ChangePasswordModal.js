import React from "react";
import ModalWindow from 'components/modal';
import { connect } from 'react-redux'
import { closeModal, openModal } from 'actions/modal';
import { Field, reduxForm, Form, Fields, reset, formValueSelector } from 'redux-form';
import { required, minLength } from 'validations';

const selector = formValueSelector('ChangePasswordModal');

const renderPasswordInput = ({ input, label, type,  disabled, meta: { touched, error, warning } }) => {
    return <div className="form-group">
        <label className="form-group-label">{label}</label>
        <div className="form-group-control">
          <input {...input} type={type}/>
          { touched && error && <span className="field-err">{error}</span> }
        </div>
    </div> ;
}

let ChangePasswordModal = (props) => {
    const { handleSubmit, 
        pristine, 
        reset,
        valid, 
        dirty, 
        invalid,
        values,
        _handleSubmit, 
        initialValues,
        password, 
        confirmPassword,
        isValid
       } = props;
	return (
        <ModalWindow
            className="xsmall change-password-modal"
            title={"Change Password"}
            name="changePasswordModal"
            isVisibleOn={props.modals.changePasswordModal}
            shouldCloseOnOverlayClick={false}>
                <h4>Change Password</h4>
                <Form onSubmit={handleSubmit(_handleSubmit)} className="border-box">
                      <div className="form-inner">
                        <div className="form-wrapper">
                            <div className=" padding-medium desktop-full">
                                <Field name="accountId" component={({ input, label, type, isRequired, disabled, className, meta: { touched, error, warning } }) => {
                                        return <input {...input} type="hidden"/>
                                    }} />
                                <Field name="password" type="password" label="New Password" component={renderPasswordInput} validate={[minLength(6)]}/>
                                <Field name="confirmPassword" type="password" label="Confirm" component={renderPasswordInput} validate={[minLength(6)]}/>
                            </div>
                        </div>
                      </div>
                      <div className="button-group modal-controls">
                        <button className="btn btn-action" type="button" onClick={() => {
                            props.closeModal('changePasswordModal')
                            reset('ChangePasswordModal')
                        }}>Cancel</button>
                        <button className="btn btn-action" type="submit" disabled={!isValid}>Save</button>
                      </div>
                </Form>
        </ModalWindow>
    );
}

ChangePasswordModal = reduxForm({
  form: 'ChangePasswordModal' ,
  enableReinitialize: true,
})(ChangePasswordModal);


export default connect(
  state => {
    const { password, confirmPassword } = selector(state, 'password', 'confirmPassword')
    return {
      password, 
      confirmPassword,
      isValid : ( (password && password.length >= 6) && (confirmPassword && confirmPassword.length >= 6) ) ? true : false
    }
  }
)(ChangePasswordModal);