import React, { PropTypes } from "react";

export default class Summary extends React.Component {
    constructor(props) {
        super(props);
    }

    _getSummaryStatusClass() {
        const { data } = this.props;
        if(data.eventStatus === 'Open') {
            return 'open'
        } else if(data.eventStatus === 'Suspended') {
            return 'suspended'
        } else {
            return 'closed'
        }
    }

    _renderOutcomeTable() {
        const { data } = this.props;
        return (
            <div className="form-wrapper">
                <h4 className="tcenter">{data.outcomeDescription}</h4>
                <div className="form-inner tcenter">
                    <table>
                        <thead>
                            <tr>
                                <th className={`colored-cell ${this._getSummaryStatusClass()}`}>

                                </th>
                                <th>
                                    Number of Bets
                                </th>
                                <th>
                                    Stakes at Risk
                                </th>
                                <th>
                                    Outcome Liability
                                </th>
                                <th>
                                    Running On(Last Leg)
                                </th>
                                <th>
                                    Running Up Money
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td className={`colored-cell ${this._getSummaryStatusClass()}`}>
                                    WIN:
                                </td>
                                <td>
                                    {data.outcomeNumberOfBets}
                                </td>
                                <td>
                                    {data.outcomeStakesAtRisk}
                                </td>
                                <td>
                                    <span className={Number(data.outcomeLiability) < 0 ? 'text-error' : ''}>{data.outcomeLiability}</span>
                                </td>
                                <td>
                                    {data.outcomeLastLeg}
                                </td>
                                <td>
                                    {data.outcomeRunningOn}
                                </td>
                            </tr>
                            { typeof data.placeRowNumberOfBets !== 'undefined' &&
                            <tr>
                                <td className={`colored-cell ${this._getSummaryStatusClass()}`}>
                                    PLACE:
                                </td>
                                <td>
                                    {data.placeRowNumberOfBets}
                                </td>
                                <td>
                                    {data.placeRowStakesAtRisk}
                                </td>
                                <td>
                                    {data.placeRowLiability}
                                </td>
                                <td>
                                    {data.placeRowLastLeg}
                                </td>
                                <td>
                                    {data.placeRowRunningOn}
                                </td>
                            </tr>
                            }
                        </tbody>
                    </table>
                </div>
            </div>
        )
    }

    render() {
        const { data } = this.props;
        return (
            <div className="summary-container padding-small">
                <div className="form-wrapper">
                    <h4 className="tcenter">{data.eventDescription}</h4>
                    <div className="form-inner tcenter">
                        <table>
                            <thead>
                                <tr>
                                    <th className={`colored-cell ${this._getSummaryStatusClass()}`}>

                                    </th>
                                    <th>
                                        Number of Bets
                                    </th>
                                    <th>
                                        Stakes at Risk
                                    </th>
                                    <th>
                                        Max Outcome Liability
                                    </th>
                                    <th>
                                        Runner
                                    </th>
                                    <th>
                                        Event Status
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td className={`colored-cell ${this._getSummaryStatusClass()}`}>
                                        WIN:
                                    </td>
                                    <td>
                                        {data.eventTotalNumberOfWinBets}
                                    </td>
                                    <td>
                                        {data.eventStakesAtRisk}
                                    </td>
                                    <td>
                                        <span className={Number(data.eventWorstLiability) < 0 ? 'text-error' : ''}>{data.eventWorstLiability}</span>
                                    </td>
                                    <td>
                                        {data.eventWorstOutcomeLiabilityDescription}
                                    </td>
                                    <td>
                                        {data.eventStatus}
                                    </td>
                                </tr>
                                {typeof data.totalNumberOfPlaceBets !== 'undefined' &&
                                    <tr>
                                        <td className={`colored-cell ${this._getSummaryStatusClass()}`}>
                                            PLACE:
                                        </td>
                                        <td>
                                            {data.totalNumberOfPlaceBets}
                                        </td>
                                        <td>
                                            {data.placeBetsStakesAtRisk}
                                        </td>
                                        <td>
                                            {data.placeBetsWorstLiability}
                                        </td>
                                        <td>
                                            {data.placeBetsWorstOutcomeLiabilityDescription}
                                        </td>
                                        <td>
                                            {data.eventStatus}
                                        </td>
                                    </tr>
                                }
                            </tbody>
                        </table>
                    </div>
                </div>
                {data.outcomeDescription && this._renderOutcomeTable()}
            </div>
        )
    }
}