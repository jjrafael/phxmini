import React, { PropTypes } from "react";

export default class LoadingIndicator extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return(
            <div className="loading tcenter">
                <i className="phxico phx-spinner phx-spin"></i>
            </div>
        )
    }
}