import React, { Component } from 'react';
import BetType from './BetType/index';

class Types extends Component {
    constructor (props) {
        super(props);
        this.state = {
            isExpanded: true
        }
    }
    render () {
        let { types, betRestrictionTypeId, betTypeGroupId, transSubTypeId, onItemClick, ownBetRestrictionTypeId } = this.props;
        let dir = this.state.isExpanded ? 'down' : 'right';
        return (
            <div className="bet-types">
                <div className="bet-types-name">
                    <div className="bet-types-toggle" onClick={e => {
                        this.setState({isExpanded: !this.state.isExpanded});
                    }}>
                        <i className={`phxico phx-chevron-${dir}`}></i>
                    </div>
                    <div className="bet-types-description">{types.betRestrictionTypeDesc}</div>
                </div>
                { this.state.isExpanded &&
                    <ul>{types.keys.map(type => {
                        return <BetType
                            key={`${type.betTypeGroupId}-${type.transSubTypeId}`}
                            description={type.keyDesc}
                            isActive={
                                betTypeGroupId === type.betTypeGroupId &&
                                transSubTypeId === type.transSubTypeId &&
                                betRestrictionTypeId === types.betRestrictionTypeId
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
            </div>
        );
    }
}

export default Types;