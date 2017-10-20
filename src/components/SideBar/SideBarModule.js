import React, { Component } from 'react';

class SideBarModule extends Component {
    
    constructor(props) {
        super(props);
    };

    render () {
        let { children, title, showSidebar } = this.props;
        return (
            <div className={`sidebar-container ${showSidebar}`}>
                <div className="app-name">
                    <span>{title}</span>
                </div>
                <div className="sidebar-content">
                    {children}
                </div>
            </div>
        )
    }
}

export default SideBarModule;