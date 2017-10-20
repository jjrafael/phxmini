import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { createSelector } from 'reselect';
import { makeIterable } from 'phxUtils';
import { generateCriteriaKey } from '../helpers';
import ConfirmModal from 'components/modalYesNo';
import { deleteBetRestrictionsTemporarily } from '../actions';

const mapStateToProps = (state, ownProps) => {
    return {
        activeAppId: state.apps.activeAppId,
        activeBetTypeKey: state.betRestrictions.activeBetTypeKey,
        matrixDataCache: state.betRestrictions.matrixDataCache,
    };
};

const mapDispatchToProps = (dispatch, ownProps) => {
    return bindActionCreators({
        deleteBetRestrictionsTemporarily
    }, dispatch);
};


class NewBetRestriction extends Component {
    constructor (props) {
        super(props);
        this.state = {showDeleteConfirmationModal: false, deleteMatrix: false, selections: {}};
    }
    componentWillMount () {
    }

    render () {
        let { activeAppId, onClose, activeBetTypeKey, matrixDataCache, deleteBetRestrictionsTemporarily } = this.props;
        let { deleteMatrix, selections } = this.state;
        let { matrixHeaders=[], matrixData, deletedRestrictionsMap } = matrixDataCache[activeBetTypeKey];
        return (
            <div className="new-bet-restriction-container">
                <div className="modal-main-content">
                    <div className="form-wrapper">
                        <div className="header panel-header">
                            <div className="panel-header-title">Select Bet Restrictions to delete</div>
                        </div>
                        <div className="panel-content">
                            <p>What would you like to delete?</p>
                            <div className="form-group">
                                <label><input type="radio" checked={deleteMatrix} onChange={e => {
                                    this.setState({deleteMatrix: true, selections: {}})
                                }}/> Delete entire Matrix</label>
                            </div>
                            <div className="form-group">
                                <label><input type="radio" checked={!deleteMatrix} onChange={e => {
                                    this.setState({
                                        deleteMatrix: false,
                                        selections: {},
                                    })
                                }}/> Delete Restriction from Matrix</label>
                            </div>
                            <div className="list-container">
                                <ul>{matrixHeaders.map(header => {
                                    let listItemClassName = selections[header.key] ? 'list-item-name active' : 'list-item-name';
                                    return <li key={header.key} className="list-item">
                                        <div className={listItemClassName} onClick={ e => {
                                            let newSelections = {...selections};
                                            let _deleteMatrix = deleteMatrix;
                                            if (selections[header.key]) {
                                                delete newSelections[header.key];
                                            } else {
                                                newSelections[header.key] = header;
                                                _deleteMatrix = false;
                                            }
                                            this.setState({selections: newSelections, deleteMatrix: _deleteMatrix});
                                        }}><label className="no-pointer-events">
                                            <input type="checkbox" checked={!!selections[header.key]}/>{header.desc}
                                        </label></div>
                                    </li>
                                })}</ul>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="button-group modal-controls">
                    <button type="button" onClick={e => { onClose() }}>Cancel</button>
                    <button type="button" disabled={!Object.keys(selections).length && !deleteMatrix} onClick={e => { 
                        this.setState({showDeleteConfirmationModal: true});
                    }}>OK</button>
                </div>
                <ConfirmModal
                    title={'Warning'}
                    message={<p>Do you really want to delete these Bet Restrictions?</p>}
                    isVisibleOn={this.state.showDeleteConfirmationModal}
                    yesButtonLabel={'Yes'}
                    onYesButtonClickHandler={e => {
                        
                        let finalSelections = {...selections};
                        if (deleteMatrix) {
                            finalSelections = matrixHeaders.reduce((accu, val) => {
                                accu[val.key] = {...val};
                                return accu;
                            }, {})
                        }
                        let selectedKeys = [...makeIterable(finalSelections, true)].map(selection => selection.key);
                        let filteredMatrixData = matrixData.filter(cell => {
                            let retain = true;
                            for (let i = 0, l = cell.criterias.length; i < l ; i++) {
                                let criteria = cell.criterias[i];
                                let key = generateCriteriaKey(criteria);
                                if (selectedKeys.includes(key)) {
                                    retain = false; break;
                                }
                            }
                            return retain;
                        })
                        deleteBetRestrictionsTemporarily({...deletedRestrictionsMap, ...finalSelections}, filteredMatrixData);
                        this.setState({showDeleteConfirmationModal: false});
                        onClose();
                    }}
                    noButtonLabel={'No'}
                    onNoButtonClickedHandler={e => {
                        this.setState({showDeleteConfirmationModal: false})
                    }}
                />
            </div>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(NewBetRestriction);