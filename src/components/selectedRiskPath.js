import React, { PropTypes } from "react";

export default class SelectedRiskPath extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        const {pathId, pathDesc, sportDesc, sportId} = this.props;
        if(!pathId || !pathDesc) {
            return null
        }
        return(
            <div className="text-medium">
                <span className="push-left">{sportDesc} [{sportId}] - {pathDesc} [{pathId && pathId.substr(1,pathId.length)}]</span>
            </div>
        )
    }
}