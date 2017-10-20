import React, { Component } from 'react';
import { generateRiskUrl } from '../helpers';

class ModalContent extends Component {
    componentDidMount () {
        const defaultValue = generateRiskUrl({rowInfo: this.props.rowInfo, event: this.props.rowInfo.events[0]})
        this.props.onChange(defaultValue)
    }
    render () {
        let {
            rowInfo,
            onChange,
            activeUrl,
        } = this.props;
        return (
            <div className="instant-action-modal-content">
                <p>Please select an event you want to view in Risk Manager.</p>
                <div className="instant-action-bet-events">
                    {rowInfo.events.map(event => {
                        let value = generateRiskUrl({rowInfo, event})
                        return <label key={event.id}>
                            <input
                                type="radio"
                                name="event-group"
                                checked={activeUrl === value}
                                value={value}
                                onChange={e => {
                                    onChange(e.target.value);
                                }}
                            />
                            <span>{` [${event.id}] - ${event.description}`}</span>
                        </label>
                    })}
                </div>
            </div>
        );
    }
}

export default ModalContent;