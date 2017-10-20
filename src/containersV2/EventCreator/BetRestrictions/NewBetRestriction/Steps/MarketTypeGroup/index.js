import React, { Component } from 'react';

class MarketTypeGroup extends Component {
    constructor (props) {
        super(props);
        this.state = {
            isExpanded: false
        }
    }
    render () {
        let { description, data, onItemClick, isActive, items, group, marketTypeId, marketTypeGroupId } = this.props;
        let { isExpanded } = this.state;
        let listItemClassName = isActive ? 'list-item-name active' : 'list-item-name';
        let dir = isExpanded ? 'down' : 'right';
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
                    {description}
                </div>
                {items && isExpanded && 
                    <ul className="market-types">{items.map(item => {
                        return <MarketTypeGroup
                            key={item.id}
                            description={item.description}
                            isActive={marketTypeId === item.id && marketTypeGroupId === group.id}
                            data={{
                                marketTypeGroupDesc: item.description,
                                marketTypeId: item.id,
                                marketTypeGroupId: group.id,
                            }}
                            onItemClick={data => onItemClick(data)}
                        />
                    })}</ul>
                }
            </li>
        );
    }
}

export default MarketTypeGroup;