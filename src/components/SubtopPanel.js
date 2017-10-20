import React, { Component } from 'react';

class SubtopPanel extends Component {
    
    constructor(props) {
        super(props);
    };

    render () {
        let { children, title } = this.props;
        return (
            <div className={`subtop-container`}>
                <div className="app-name">
                    <span>{title}</span>
                </div>
                <div className="subtop-content">
                    {children}
                </div>
            </div>
        )
    }
}

export default SubtopPanel;