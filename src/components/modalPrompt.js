import React, { PropTypes } from 'react';
import ModalWindow from './modal';
import FormInfo from './formInfo';
import { reduxForm } from 'redux-form';

class ModalPrompt extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        if(!this.props.isVisibleOn) {
            return null
        }
        const { className, title, name, isVisibleOn, message, buttons, onConfirm, onCancel, data, defaultDisabled, size, errorMessage, fieldLook, loading, loadingText } = this.props;
        const { handleSubmit, pristine, reset, submitting, load } = this.props;
        return(
            <ModalWindow className={!!size ? size : 'medium'} title={title} name={name} isVisibleOn={isVisibleOn} shouldCloseOnOverlayClick={true} closeButton={false}>
                <h4>{title}</h4>
                {message}
                <form onSubmit={handleSubmit(onConfirm)}>
                        {errorMessage && (
                            <div className="info-message error" style={{marginTop: '0'}}>
                                {errorMessage}
                            </div>
                        )}
                        <FormInfo formInfo={data} fieldLook={fieldLook ? fieldLook : 'field-plain'}/>
                        <div className="button-group">
                            <button className="btn btn-action" onClick={onCancel}>Cancel</button>
                            <button className="btn btn-action btn-primary" disabled={!!defaultDisabled ? defaultDisabled : (pristine || submitting)}>{loading ?  <i className="phxico phx-spinner phx-spin" title={loadingText}></i> : 'Save Changes'}</button>
                        </div>
                </form>
            </ModalWindow>
        )
    }
};

ModalPrompt = reduxForm({
  form: 'ModalPromptForm'
})(ModalPrompt)

export default ModalPrompt;

