import React, { PropTypes } from "react";
import Modal from 'react-modal';

export default class ModalWindow extends React.Component {
    constructor(props) {
        super(props);
        this._handleCloseClick = this._handleCloseClick.bind(this);
    }

    _handleCloseClick(e) {
      e.preventDefault();
      if(this.props.onClose) {
        this.props.onClose();
      }
    }

    render() {
        const { isVisibleOn, className, onOpen, onClose, title, shouldCloseOnOverlayClick, closeButton } = this.props;
        const modalContainerClassName = this.props.modalContainerClassName ? this.props.modalContainerClassName : '';
        return(
            <Modal
              isOpen={this.props.isVisibleOn}
              onAfterOpen={onOpen}
              onRequestClose={onClose}
              className={className}
              contentLabel={title}
              ariaHideApp={true}
              parentSelector={() => document.body}
              shouldCloseOnOverlayClick={typeof shouldCloseOnOverlayClick === 'undefined' ? false : shouldCloseOnOverlayClick}
              style={styles}
            >
                <div className={`modal-container ${modalContainerClassName}`}>
                    {closeButton &&
                    <a  className="close-button" onClick={onClose}>
                      <i className="phxico phx-close"></i>
                    </a>
                    }
                    <div className="modal-body">
                        {this.props.children}
                    </div>
                </div>
            </Modal>
        )
    }
}

// prop checks
ModalWindow.propTypes = {
    isVisibleOn: PropTypes.bool,
    className: PropTypes.string,
    title: PropTypes.string,
}

const styles = {
    overlay: {
        backgroundColor   : 'rgba(0, 0, 0, 0.1)',
    },
    content: {
        border: 'none',
        background: 'transparent'
    },
}