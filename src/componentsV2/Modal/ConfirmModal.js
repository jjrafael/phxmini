import React from 'react';
import YesNoModal from 'components/modalYesNo';
import { func, string, bool, oneOfType, element } from 'prop-types';

function DefaultMessage () {
    return <div>
        <p>Your unsaved changes will be discarded when you leave this page.</p>
        <p>Are you sure you want to proceed?</p>
    </div>
}

function ConfirmModal ({isVisible, onConfirm, onCancel, title, message, yesButtonLabel, noButtonLabel  }) {
    return <YesNoModal
        title={title}
        message={message}
        isVisibleOn={isVisible}
        yesButtonLabel={yesButtonLabel}
        onYesButtonClickHandler={() => { onConfirm() }}
        noButtonLabel={noButtonLabel}
        onNoButtonClickedHandler={() => { onCancel() }}
    />
}

ConfirmModal.defaultProps = {
    title: 'Warning',
    message: <DefaultMessage/>,
    yesButtonLabel: 'Yes',
    noButtonLabel: 'No'
}

ConfirmModal.propTypes = {
    isVisible: bool.isRequired,
    onConfirm: func.isRequired,
    onCancel: func.isRequired,
    title: oneOfType([string, element]),
    message: oneOfType([string, element]),
    yesButtonLabel: oneOfType([string, element]),
    noButtonLabel: oneOfType([string, element]),
}

export default ConfirmModal