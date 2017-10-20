import React, { Component } from 'react';
import Report from '../containers/Report';

class ReportListBox extends Component {
    render () {
        let {isLoading, reportsList, group} = this.props;
        return (
            <div className="rdl-listbox rdl-available">
                <div className="rdl-control-container">
                    {!!isLoading
                        ? <div  className="list-box">
                            <div className="loading tcenter">
                                <i className="phxico phx-spinner phx-spin"></i>
                            </div>
                        </div>
                        : <ul className="list-box">{
                            reportsList.map(key => {
                                return <Report key={key} group={group} reportKey={key} />
                            })
                        }</ul>
                    }
                </div>
            </div>
        );
    }
}

export default ReportListBox;