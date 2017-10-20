import React, { PropTypes } from "react";
import { formatDateTimeString } from '../../utils'
import { connect } from 'react-redux';

class Event extends React.Component {
    constructor(props) {
        super(props);
    }

    shouldComponentUpdate(nextProps, nextState) {
        if (this.props.rowHeight !== nextProps.rowHeight ||
            this.props.filterPeriod !== nextProps.filterPeriod ||
            this.props.filterMarket !== nextProps.filterMarket ||
            this.props.treeLength !== nextProps.treeLength
        ) {
            return true;
        } else {
            return false;
        }
    }

    render() {
        const { data, style, totalColumnWidth } = this.props;
        return (
            <div className="row event-row" style={{...style, width: totalColumnWidth+'px'}}>
                <p>
                    {formatDateTimeString(data.start)}
                    <span className="event-ids">ID: <b>{data.key.substr(1)}</b></span>
                    {data.brMatchId && <span className="event-ids">Feed: <b>{data.brMatchId}</b></span>}
                </p>
            </div>
        )
    }
}

const mapStateToProps = (state, ownProps) => {
    return {
        rowHeight: state.riskParameters.rowHeight,
        filterPeriod: state.riskParameters.period,
        filterMarket: state.riskParameters.market,
    };
};

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        
    };
};

export default connect(mapStateToProps, null)(Event);