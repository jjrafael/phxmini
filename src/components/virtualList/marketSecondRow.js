import React, { PropTypes } from "react";
import { getMarketStatusFromFlags } from '../../utils'
import { connect } from 'react-redux';
import couponModel from '../../models/couponModel';

class Market extends React.Component {
    constructor(props) {
        super(props);
        this.DATA = this.props.data;
        this.columnHasUpdated = false;
    }

    shouldComponentUpdate(nextProps, nextState) {
        // console.log('this.props: ', this.props);
        // console.log('nextProps: ', nextProps);
        let { key } = this.props.data;
        if (this.props.marketState.marketKeysChangingStatus.includes(key) !== nextProps.marketState.marketKeysChangingStatus.includes(key) ||
            this.props.rowHeight !== nextProps.rowHeight ||
            this.props.openModalsCount !== nextProps.openModalsCount || // update everytime a modal is closed
            this.props.hasUpdate !== nextProps.hasUpdate ||
            this.props.filterPeriod !== nextProps.filterPeriod ||
            this.props.filterMarket !== nextProps.filterMarket ||
            this.props.treeLength !== nextProps.treeLength
        ) {
            this.DATA = { ...this.DATA, ...nextProps.dataFromModel };
            if (this._getStatus(this.props.data.flags) !== this._getStatus(this.DATA.flags)) {
                this.columnHasUpdated = true;
            } else {
                this.columnHasUpdated = false;
            }
            return true;
        } else {
            this.columnHasUpdated = false;
            return false;
        }
    }

    _getStatus(flags) {
        return getMarketStatusFromFlags(flags)
    }

    render() {
        const { style, totalColumnWidth } = this.props;
        const data = { ...this.DATA };
        const { flags } = data;
        const isChangingStatus = this.props.isChangingStatus || data.isChangingStatus;
        const status = this._getStatus(flags);
        
        let classNames = ['row', 'market-row', 'variable-spread-row', 'second-row', status.toLowerCase()];
        if (this.columnHasUpdated) {
            classNames.push('updated');
        }
        
        let className = classNames.join(' ');
        return (
            <div className={className} style={{...style, width: totalColumnWidth+'px'}}>
                <div className="column market">
                </div>
            </div>
        )
    }
}

const mapStateToProps = (state, ownProps) => {
    let { key } = ownProps.data;
    let dataFromModel = couponModel.getChunk(key);
    return {
        marketState: state.market,
        dataFromModel: dataFromModel ? dataFromModel : {},
        rowHeight: state.riskParameters.rowHeight,
        openModalsCount: state.modals.openModalsCount,
        hasUpdate: couponModel.tree.updatedIds.includes(key),
        filterPeriod: state.riskParameters.period,
        filterMarket: state.riskParameters.market,
    };
};

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        
    };
};

export default connect(mapStateToProps, null)(Market);