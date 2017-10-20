import React, { PropTypes } from "react";

export default class ModalOverlay extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        if(!this.props.isVisibleOn) {
            return null
        }
        const { className } = this.props;
        return(
            <div className="modal-overlay"></div>
        )
    }
}

// prop checks
ModalOverlay.PropTypes = {
    isVisibleOn: PropTypes.boolean,
    className: PropTypes.string
}