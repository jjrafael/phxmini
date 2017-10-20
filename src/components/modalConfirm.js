import React, { PropTypes } from 'react';
import ModalWindow from './modal';

class ModalConfirm extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        if(!this.props.isVisibleOn) {
            return null
        }
        let { className, title, name, isVisibleOn, message, buttons, onConfirm, onCancel, customConfirmText, removeCancel, loading, loadingText } = this.props;
        if(!className) {
            className = '';
        }
        return(
            <ModalWindow className={`${className} xsmall confirm`} title={title} name={name} isVisibleOn={isVisibleOn} shouldCloseOnOverlayClick={true} closeButton={false}>
                <h4>{title}</h4>
                <div className="form-group">
                    {message}
                </div>
                <div className="button-group list-reset">
                    {!removeCancel && <button className="btn btn-action" onClick={onCancel}>No</button>}
                    <button className="btn btn-action btn-primary" onClick={onConfirm}>
                    {loading ? <i className="phxico phx-spinner phx-spin" title={loadingText}></i> : (!!customConfirmText ? customConfirmText : 'Yes')}</button>
                </div>
            </ModalWindow>
        )
    }
};

export default ModalConfirm;