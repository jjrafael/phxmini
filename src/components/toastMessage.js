import React, { Component } from 'react';

class ToastMessage extends Component {
    
    constructor(props) {
        super(props);
    };

    render () {
        let {message, className} = this.props;
        return (
            <div className={`toast-container ${className}`}>
                <div className={`toast-message ${className}`}>
                    <i className={`phxico ${className === 'success' ? 'phx-check' : 'phx-alert'}`}></i>
                    <span>{message}</span>
                </div>
            </div>
        )
    }
}

export default ToastMessage;
