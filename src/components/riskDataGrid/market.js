import React, { PropTypes } from "react";
import filterTypes from '../../constants/filterTypes'
import { formatDateTimeString, objectToArray } from '../../utils'

export default class Market extends React.Component {
    constructor(props) {
        super(props);
    }

    _getStatus(flags) {
        const statusTypes = objectToArray(filterTypes.STATUS);
        if(!flags) {
            return 'Open';
        }
        const matchingStatus = statusTypes.filter((status)=> {
            return flags.indexOf(status.desc.toLowerCase()) > -1;
        })
        return matchingStatus[0] && matchingStatus[0].desc ? matchingStatus[0].desc : 'Open';
    }

    render() {
        const { data, columns } = this.props;
        const { desc, flags, period } = data;
        const status = this._getStatus(flags);
        return (
            <tr className="market-row" key={data.key}>
                <td colSpan={columns.length}>
                    {data.desc}{` - ${status}`}{` - ${period}`}
                </td>
            </tr>
        )
    }
}