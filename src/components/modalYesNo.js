import React, { PropTypes } from 'react';
import ModalWindow from './modal';

class ModalYesNo extends React.Component {
  constructor(props) {
    super(props);

    this._onYesBtnHandler = this._onYesBtnHandler.bind(this);
    this._onNoBtnHandler = this._onNoBtnHandler.bind(this);
  }

  _onYesBtnHandler() {
    const {onYesButtonClickHandler} = this.props;

    if (onYesButtonClickHandler) {
      onYesButtonClickHandler();
    }
  }

  _onNoBtnHandler() {
    const {onNoButtonClickedHandler} = this.props;

    if (onNoButtonClickedHandler) {
      onNoButtonClickedHandler();
    }
  }

  render() {
    const {
      title,
      message,
      isVisibleOn,
      yesButtonLabel,
      onYesButtonClickHandler,
      noButtonLabel,
      onNoButtonClickedHandler
    } = this.props;

    if (!isVisibleOn) {
      return null;
    }

    return (
      <ModalWindow
        className={'confirm'}
        title={title}
        name={'modalYesNo'}
        isVisibleOn={isVisibleOn}
        shouldCloseOnOverlayClick={false}
        closeButton={false}>

        <h4>
          {title}
        </h4>

        <div className="modal-main-content">
          {message}
        </div>

        <div className="button-group modal-controls">
          <button
            className="btn btn-action"
            onClick={onNoButtonClickedHandler}>
            {noButtonLabel}
          </button>
          <button
            className="btn btn-action btn-primary"
            onClick={onYesButtonClickHandler}>
            {yesButtonLabel}
          </button>
        </div>

      </ModalWindow>
    )
  }

};

ModalYesNo.propTypes = {
  title: PropTypes.string,
  message: PropTypes.string,
  isVisibleOn: PropTypes.boolean,
  yesButtonLabel: PropTypes.string,
  onYesButtonClickHandler: PropTypes.func,
  noButtonLabel: PropTypes.string,
  onNoButtonClickedHandler: PropTypes.func,
};

ModalYesNo.defaultProps = {
  title: '',
  message: '',
  isVisibleOn: false,
  yesButtonLabel: 'Yes',
  onYesButtonClickHandler: null,
  noButtonLabel: 'No',
  onNoButtonClickedHandler: null,
};

export default ModalYesNo;
