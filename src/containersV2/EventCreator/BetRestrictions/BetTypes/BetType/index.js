import React, { Component } from 'react';
import { connect } from 'react-redux';
import { makeIterable } from 'phxUtils';
import ModalWindow from 'components/modal';

const mapStateToProps = (state, ownProps) => {
    let key = `${ownProps.ownBetRestrictionTypeId}-${ownProps.type.betTypeGroupId}-${ownProps.type.transSubTypeId}`;
    return {
        dataCache: state.betRestrictions.matrixDataCache[key] || {}
    };
};

class BetType extends Component {
    constructor (props) {
        super(props);
        this.state = {
            isExpanded: false
        }
    }
    render () {
        let { description, data, onItemClick, isActive, items, betRestrictionTypeId, ownBetRestrictionTypeId, betTypeGroupId, transSubTypeId, dataCache, type } = this.props;
        let { isExpanded } = this.state;
        let listItemClassName = isActive ? 'list-item-name active' : 'list-item-name';
        let dir = isExpanded ? 'down' : 'right';
        let deletedRestrictions = [...makeIterable(dataCache.deletedRestrictionsMap || {})];
        let updatedCellsArray = dataCache.updatedCellsArray || [];
        let hasChanges = !!updatedCellsArray.length || !!deletedRestrictions.length;
        let finalDescription = description;
        if (hasChanges) {
            finalDescription = `${description} *`;
        }
        return (
            <li className="list-item">
                <div className={listItemClassName} onClick={ e => onItemClick(data)}>
                    <span className="list-item-toggle" onClick={e => {
                        if (items) {
                            e.stopPropagation();
                            this.setState({isExpanded: !isExpanded});
                        }
                    }}>{items &&
                        <i className={`phxico phx-chevron-${dir}`}></i>
                    }</span>
                    <span className="list-item-desc">{finalDescription}</span>
                    {type.allSubTypes && !!type.allSubTypes.length &&
                        <span className="list-item-subtypes"
                            onClick={e => {
                                e.preventDefault();
                                e.stopPropagation();
                                this.setState({showAllSubTypes: true})}
                            }
                            title="Display all sub-types">
                            <b>?</b>
                            <ModalWindow
                                isVisibleOn={this.state.showAllSubTypes}
                                title={`${description} Sub-types`}
                                onClose={ e => { this.setState({showAllSubTypes: false}) }}
                                className="medium new-bet-restriction-modal"
                                closeButton={true}>
                                <h4>{`${description} Sub-Types`}</h4>
                                <div className="new-bet-restriction-container">
                                    <div className="modal-main-content">
                                        <div className="sub-types-modal">{type.allSubTypes.map(subtype => {
                                            return <div className="subtype-pill">{subtype}</div>
                                        })}</div>
                                    </div>
                                    <div className="modal-controls">
                                        <button type="button" onClick={e => { this.setState({showAllSubTypes: false}) }}>Close</button>
                                    </div>
                                </div>
                                
                            </ModalWindow>
                        </span>
                    }
                </div>
                {items && isExpanded && 
                    <ul className="bet-types">{items.map(type => {
                        return <ConnectedBetType
                            key={`${type.betTypeGroupId}-${type.transSubTypeId}`}
                            description={type.keyDesc}
                            isActive={
                                betTypeGroupId === type.betTypeGroupId &&
                                transSubTypeId === type.transSubTypeId &&
                                betRestrictionTypeId === ownBetRestrictionTypeId
                            }
                            data={{
                                betRestrictionTypeId: ownBetRestrictionTypeId,
                                betTypeGroupId: type.betTypeGroupId,
                                transSubTypeId: type.transSubTypeId,
                                eventTypeId: type.eventTypeId
                            }}
                            betRestrictionTypeId={betRestrictionTypeId}
                            ownBetRestrictionTypeId={ownBetRestrictionTypeId}
                            type={type}
                            betTypeGroupId={betTypeGroupId}
                            transSubTypeId={transSubTypeId}
                            items={type.subTypes.length ? type.subTypes : null}
                            onItemClick={data => onItemClick(data)}
                        />
                    })}</ul>
                }
            </li>
        );
    }
}

const ConnectedBetType = connect(mapStateToProps)(BetType);

export default ConnectedBetType;