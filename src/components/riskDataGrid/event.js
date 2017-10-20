import React, { PropTypes } from "react";
import { formatDateTimeString } from '../../utils'

export default class Event extends React.Component {
    constructor(props) {
        super(props);
    }

    _renderHighlightedDesc(desc, filter) {
        var indices = [];
        var match;
        filter = filter.toLowerCase();
        var filterRegExp = new RegExp(filter,"g");
        while (match = filterRegExp.exec(desc.toLowerCase())) {
            indices.push(match.index);
        }
        return indices.map((element, i) => {
            var pre = '';
            var match = desc.substr(element, filter.length);
            var post = '';
            if(i === 0 && element !== 0) { //not first letter
                pre = desc.substring(0, element);
            }
            if(typeof indices[i + 1] === 'undefined' && (element + filter.length) < desc.length) { // last item in indices and there are words after
                post = desc.substring(element+filter.length, desc.length);
            } else if(typeof indices[i + 1] !== 'undefined') {
                post = desc.substring(element+filter.length, indices[i + 1]);
            }
            return [
                <span>{pre}</span>,
                <span className="search-matching">{match}</span>,
                <span>{post}</span>
            ];
        });
    }

    render() {
        const { data, columns, isCollapsed, onCollapseToggle, eventFilter } = this.props;
        const markets = data.children.map((market) => {
            return market.period;
        });
        return (
            <tr>
                <td colSpan={columns.length}>
                    <h4>
                    <a
                        onClick={(eventId)=> onCollapseToggle(data.key, isCollapsed)}
                        
                        className="collapse-icon push-right">
                        {isCollapsed && <i className="phxico phx-chevron-right icon-small"></i>}
                        {!isCollapsed && <i className="phxico phx-chevron-down phx-icon-small"></i>}
                    </a>
                    {!eventFilter.length && data.desc}
                    {!!eventFilter.length && this._renderHighlightedDesc(data.desc, eventFilter)}
                    </h4>
                    <p>{formatDateTimeString(data.start)}</p>
                </td>
            </tr>
        )
    }
}