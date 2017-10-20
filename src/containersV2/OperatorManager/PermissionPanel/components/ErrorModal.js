import React from "react";
import ModalWindow from 'components/modal';
import { closeModal, openModal } from 'actions/modal';

const ErrorModal = (props) => {
	return (
        <ModalWindow
            className="xsmall"
            title={"Error"}
            name="errorModal"
            isVisibleOn={props.modals.errorModal}
            shouldCloseOnOverlayClick={false}>
            <div className="modal-content">
            	<h4>Error</h4>
            	<div className=" padding-medium desktop-full">
	            	<p>
	            		There are assigned Permission(s) which belong to the Application to be remove. <br />
	            		Please unassign the Permission(s) first.
	            	</p>
	            	<div className="tcenter">
	            		<button onClick={() => {
	            			props.closeModal('errorModal')
	            		}}>OK</button>
	            	</div>
            	</div>
            </div>
        </ModalWindow>
    );
}

export default ErrorModal;