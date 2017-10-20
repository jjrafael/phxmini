import React, { PropTypes } from "react";
import { hashHistory } from "react-router";

export default class RouterLink extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        const link = this.props.href;
        return(
            <span onClick={(e)=> {
                e.preventDefault();
                if(typeof this.props.beforeUrlTransfer === 'function') {
                    this.props.beforeUrlTransfer();
                }
                hashHistory.replace(link);
            }}>
                {this.props.children}
            </span>
        )
    }
}