import React from "react";
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { manualSettleRiskTransaction } from '../actions/riskTransaction';
import { openModal, closeModal } from '../actions/modal';
import { formatISODateString } from '../utils';
import SelectBox from '../components/selectBox';
import ModalConfirm from '../components/modalConfirm';
import "../stylesheets/main.scss";

function mapStateToProps(state) {
    return {
        riskTransaction: state.riskTransaction,
        apiConstants: state.apiConstants
    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        manualSettleRiskTransaction,
        openModal,
        closeModal
    }, dispatch);
}

class RiskTransactionDetails extends React.Component {
    constructor(props) {
        super(props);
        this._filteredVoidReasons = this.props.apiConstants.values.voidReasons.filter((voidReason) => voidReason.enabled);
        this.state = {
            credit: 0,
            isVoid: true,
            voidReasonId: -1,
            showVoidConfirmModal: false,
        }
    }

    componentDidUpdate(prevProps, prevState) {
        if(prevProps.riskTransaction.isFetchingRiskTransactionDetails && !this.props.riskTransaction.isFetchingRiskTransactionDetails && !this.props.fetchingRiskTransactionDetailsFailed) {
            this._initializeState();
        }
        if(prevProps.riskTransaction.isFetchingRiskTransactionDetails.isSettlingRiskTransaction && !this.props.riskTransaction.isSettlingRiskTransaction && !this.props.settlingRiskTransactionFailed) {
            this._initializeState();
        }
    }

    _initializeState() {
        this.setState({
            credit: this.props.riskTransaction.transactionDetails.credit === 0 ? '' : this.props.riskTransaction.transactionDetails.credit,
            isVoid: this.props.riskTransaction.transactionDetails.voidyn === 1,
            voidReasonId: this.props.riskTransaction.transactionDetails.voidReasonId
        });
    }

    _renderLoadingIndicator() {
        return(
            <div className="loading-container tcenter">
                <i className="phxico phx-spinner phx-spin"/>
            </div>
        )
    }

    _renderSavingIndicator() {
        return(
            <div className="saving-container tcenter">
                <i className="phxico phx-spinner phx-spin"/>
            </div>
        )
    }

    render() {
        const { credit, isVoid, voidReasonId } = this.state;
        const { isFetchingRiskTransactionDetails, fetchingRiskTransactionDetailsFailed, transactionDetails, isSettlingRiskTransaction, settlingRiskTransactionFailed } = this.props.riskTransaction;
        const disableVoidReasonSelect = !isVoid;
        return (
            <div className="risk-transaction-details-container padding-medium">
                {isFetchingRiskTransactionDetails && this._renderLoadingIndicator()}
                {isSettlingRiskTransaction && this._renderSavingIndicator()}
                {!isFetchingRiskTransactionDetails && !fetchingRiskTransactionDetailsFailed && 
                    <div className="form-inner">
                        <div className="form-wrapper half fleft">
                            <div className="form-group field-plain">
                                <label className="form-group-label">
                                    Created: 
                                </label>
                                <div className="form-group-control disabled">
                                    {formatISODateString(transactionDetails.createdDate)}
                                </div>
                            </div>
                            <div className="form-group field-plain">
                                <label className="form-group-label">
                                    Created by: 
                                </label>
                                <div className="form-group-control disabled">
                                    {transactionDetails.createdByUsername}
                                </div>
                            </div>
                            <div className="form-group field-plain">
                                <label className="form-group-label">
                                    Extension: 
                                </label>
                                <div className="form-group-control disabled">
                                    Sample
                                </div>
                            </div>
                            <div className="form-group field-plain">
                                <label className="form-group-label">
                                    IP Address: 
                                </label>
                                <div className="form-group-control disabled">
                                    {transactionDetails.ipAddress}
                                </div>
                            </div>
                        </div>
                        <div className="form-wrapper half fleft">
                            <div className="form-group field-plain">
                                <label className="form-group-label">
                                    Last Modified: 
                                </label>
                                <div className="form-group-control disabled">
                                    {formatISODateString(transactionDetails.lastModifiedDate)}
                                </div>
                            </div>
                            <div className="form-group field-plain">
                                <label className="form-group-label">
                                    Last Modified by: 
                                </label>
                                <div className="form-group-control disabled">
                                    {transactionDetails.lastModifiedBy}
                                </div>
                            </div>
                            <div className="form-group field-plain">
                                <label className="form-group-label">
                                    Origin: 
                                </label>
                                <div className="form-group-control disabled">
                                    {transactionDetails.originDescription}
                                </div>
                            </div>
                        </div>
                        <div>
                            <div className="form-wrapper">
                                <div className="form-group field-plain">
                                    <label className="form-group-label">
                                        Reference: 
                                    </label>
                                    <div className="form-group-control disabled">
                                        {transactionDetails.betSlipReference}
                                    </div>
                                </div>
                                <div className="form-group field-plain">
                                    <label className="form-group-label">
                                        Account: 
                                    </label>
                                    <div className="form-group-control disabled">
                                        {transactionDetails.accountDescription}
                                    </div>
                                </div>
                                <div className="form-group field-plain">
                                    <label className="form-group-label">
                                        Transaction ID: 
                                    </label>
                                    <div className="form-group-control disabled">
                                        {transactionDetails.id}
                                    </div>
                                </div>
                                <div className="form-group field-plain">
                                    <label className="form-group-label">
                                        Description: 
                                    </label>
                                    <div className="form-group-control disabled">
                                        {transactionDetails.description}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="form-wrapper clearfix">
                            <div className="form-group field-plain half fleft">
                                <label className="form-group-label">
                                    Settled: 
                                </label>
                                <div className="form-group-control disabled">
                                    {transactionDetails.settled ? 'YES' : 'NO'}
                                </div>
                            </div>
                            <div className="form-group field-plain half fleft">
                                <label className="form-group-label">
                                    Exp Settlement Date: 
                                </label>
                                <div className="form-group-control disabled">
                                    {transactionDetails.settledDate && !!transactionDetails.settledDate.length && formatISODateString(transactionDetails.settledDate)}
                                </div>
                            </div>
                        </div>
                        <div className="form-wrapper clearfix">
                            <div className="form-group field-plain half fleft">
                                <label className="form-group-label">
                                    Debit/Stake: 
                                </label>
                                <div className="form-group-control disabled">
                                    {transactionDetails.debit}
                                </div>
                            </div>
                        </div>
                        <div className="form-wrapper clearfix">
                            <div className="form-group field-plain half fleft">
                                <label className="form-group-label">
                                    Credit Returns: 
                                </label>
                                <div className="form-group-control">
                                    <input type="number" value={credit}
                                        readOnly={isVoid}
                                        onChange={(e)=> {
                                            this.setState({
                                                credit: Number(e.target.value),
                                                isVoid: false,
                                                voidReasonId: -1
                                            })
                                        }}/>
                                </div>
                            </div>
                            <div className="form-group field-plain half fleft">
                                <label className="form-group-label">
                                    Manual Void: 
                                </label>
                                <div className="form-group-control">
                                    <SelectBox
                                        className="void-reason block-input"
                                        valueKey={'id'}
                                        onChange={(e)=> {
                                            this.setState({
                                                voidReasonId: Number(e.target.value)
                                            })
                                        }}
                                        descKey={'description'}
                                        disabled={disableVoidReasonSelect}
                                        value={isVoid ? voidReasonId : ''}
                                        name="void-reason"
                                        options={disableVoidReasonSelect ? [] : this._filteredVoidReasons}/>
                                </div>
                            </div>
                            <div className="form-group field-plain half fleft">
                                <label className="form-group-label">
                                    Void: 
                                </label>
                                <div className="form-group-control">
                                    <input type="checkbox" checked={isVoid}
                                        onChange={(e)=> {
                                            let voidReasonId = e.target.checked && this.state.voidReasonId < 0 ? this._filteredVoidReasons[0].id : this.state.voidReasonId;
                                            this.setState({
                                                isVoid: e.target.checked,
                                                credit: e.target.checked ? transactionDetails.unitStake : transactionDetails.credit,
                                                voidReasonId: voidReasonId
                                            })
                                        }}/>
                                </div>
                            </div>
                        </div>
                        <div>
                            <button
                                disabled={isSettlingRiskTransaction}
                                onClick={(e)=> {
                                    if(this.state.isVoid && transactionDetails.voidyn !== 1) {
                                        this.setState({
                                            showVoidConfirmModal: true
                                        })
                                    } else {
                                        const credit = this.state.isVoid ? null : this.state.credit;
                                        const isVoid = this.state.isVoid;
                                        const voidReasonId = this.state.voidReasonId;
                                        this.props.manualSettleRiskTransaction(transactionDetails.id, isVoid, credit, voidReasonId);
                                    }
                                }}>
                                Save
                            </button>
                            <button
                                disabled={isSettlingRiskTransaction}
                                    onClick={(e)=> {
                                    if(isSettlingRiskTransaction) {
                                        return
                                    }
                                    this.props.changeHandler('transactionIdSelected', null);
                                    this.props.closeModal('riskTransactionDetails');
                                }}>
                                Close
                            </button>                            
                            {this.state.showVoidConfirmModal &&
                              <ModalConfirm
                                isVisibleOn={this.state.showVoidConfirmModal}
                                title="Void Transaction"
                                message={'Are you sure you want to void this transaction?'}
                                onConfirm={()=> {
                                    this.setState({
                                        showVoidConfirmModal: false
                                    })
                                    const credit = this.state.isVoid ? null : this.state.credit;
                                    const isVoid = this.state.isVoid;
                                    const voidReasonId = this.state.voidReasonId;
                                    this.props.manualSettleRiskTransaction(transactionDetails.id, isVoid, credit, voidReasonId);
                                }}
                                onCancel={(e)=> {
                                    this.setState({
                                        showVoidConfirmModal: false
                                    })
                                }}
                              />
                            }
                        </div>
                    </div>
                }
            </div>
        )
    }

}


export default connect(mapStateToProps, mapDispatchToProps)(RiskTransactionDetails);
