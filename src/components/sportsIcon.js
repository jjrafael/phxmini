import React, { PropTypes } from "react";

export default class SportsIcon extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        let { className, sportCode } = this.props;
        sportCode = sportCode.toUpperCase();
        return(
            <i className={`${className ? className : ''} sports-ico-${sportCode}`}></i>
        )
    }
}