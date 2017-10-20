import React, { PropTypes } from "react";

export default class RiskDataGridHead extends React.Component {
    constructor(props) {
        super(props);
    }

    _renderHeaderCells() {
        const { columns } = this.props;
        return columns.map((element, index, array)=> {
            return(
                <th key={index}>{element.desc}</th>
            )
        });
    }

    render() {
        return(
            <thead className="risk-data-grid-head">
                <tr>{this._renderHeaderCells()}</tr>
            </thead>
        )
    }
}