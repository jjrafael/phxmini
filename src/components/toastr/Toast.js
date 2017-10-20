import React, { Component } from 'react';

class Toast extends Component {
    constructor (props) {
        super(props);
        this.timer = null;
    }
    componentDidMount () {
        let { toast, onRemoveToast } = this.props;
        if (typeof toast.autoClose === 'number') {
            this.timer = setTimeout(e => {
                onRemoveToast(toast.id);
            }, toast.autoClose);
        }
    }
    componentWillUnmount () {
        clearTimeout(this.timer);
    }
    render () {
        let {
            toast
        } = this.props;
        let type = toast.type.toLowerCase();
        let className = `toast toast-${type}`;
        return (
            <div className={className}>
                <div className="toast-icon-container">
                    <i className={`phxico phx-${type}`}></i>
                </div>
                <div className="toast-message-container">{toast.message}</div>
                { toast.hasCloseButton &&
                    <div className="toast-close" onClick={e => {
                        clearTimeout(this.timer);
                        this.props.onRemoveToast(toast.id);
                    }}>&times;</div>
                }
            </div>
        );
    }
}

export default Toast;