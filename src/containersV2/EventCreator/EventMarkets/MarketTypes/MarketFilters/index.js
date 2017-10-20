import React, { Component } from 'react';
import ModalWindow from 'components/modal';
import MorePeriods from './MorePeriods';
import DefaultFilters from './DefaultFilters';
import Search from './Search';
import HideOutcomes from './HideOutcomes';

class MarketFilters extends Component {
    constructor (props) {
        super(props);
        this.state = {
            showMorePeriods: false
        }
    }
    render () {
        return (
            <div className="market-filters modal-header">
                <DefaultFilters />
                <div className="advance-filters">
                    <HideOutcomes />
                    <button className="button btn-box" onClick={e => {
                        this.setState({showMorePeriods: true})
                    }}><i className="phxico phx-filter"></i></button>
                    <Search />
                </div>
                {this.state.showMorePeriods &&
                    <ModalWindow
                        isVisibleOn={true}
                        title="More Periods"
                        onClose={()=>{this.setState({showMorePeriods: false})}}
                        className="medium more-periods-modal"
                        closeButton={true}>
                        <h4>More Periods</h4>
                        <div className="modal-content">
                            <MorePeriods />
                            <div className="modal-controls">
                                <button type="button" onClick={()=>{this.setState({showMorePeriods: false})}}>Close</button>
                            </div>
                        </div>
                    </ModalWindow>
                }
            </div>
        );
    }
}

export default MarketFilters;