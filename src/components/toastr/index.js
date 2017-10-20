import React, { Component } from 'react';
import { CSSTransitionGroup } from 'react-transition-group'
import uniqueId from 'lodash.uniqueid';
import Toast from './Toast';

const AUTO_CLOSE = 5000;
const TYPES = ['SUCCESS', 'ERROR', 'INFO', 'WARNING'];
class Pubsub {
    constructor (props) {
        this.onAddCallback = () => {};
        this.onRemoveCallback = () => {};
    }
    onAdd (callback) {
        this.onAddCallback = callback;
    }
    onRemove (callback) {
        this.onRemoveCallback = callback;
    }
    add (toast) {
        this.onAddCallback(toast)
    }
    remove (toastId) {
        this.onRemoveCallback(toastId)
    }
}

const pubsub = new Pubsub();

export default class ToastContainer extends Component {
    constructor (props) {
        super(props);
        this._onAddToast = this._onAddToast.bind(this);
        this._onRemoveToast = this._onRemoveToast.bind(this);
        this.state = {
            toasts: []
        }
    }
    _onAddToast (toast) {
        let index = this.state.toasts.findIndex(t => t.id === toast.id);
        let newToasts;
        if (index >= 0) { // if id already exists, remove it and add the new one with updated autoClose time
            newToasts = [
                ...this.state.toasts.slice(0, index),
                ...this.state.toasts.slice(index+1),
                toast
            ]
        } else {
            newToasts = [...this.state.toasts, toast];
        }
        this.setState({
            toasts: newToasts
        });
    }
    _onRemoveToast (toastId) {
        let index = this.state.toasts.findIndex(toast => toast.id === toastId);
        if (index >= 0) {
            this.setState({
                toasts: [...this.state.toasts.slice(0, index), ...this.state.toasts.slice(index+1)]
            })
        }
    }
    componentDidMount () {
        pubsub.onAdd(this._onAddToast)
        pubsub.onRemove(this._onRemoveToast)
    }
    render () {
        let {
            className
        } = this.props;
        return (
            <div>
                <div className="svg-container">
                    <svg style={{display: 'none'}}>
                    <symbol id="icon-toast-success" viewBox="0 0 24 24"><title>toast-success</title><path d="M20.706 5.294c-0.387-0.387-1.025-0.387-1.413 0l-10.294 10.294-4.294-4.294c-0.387-0.387-1.025-0.387-1.413 0s-0.387 1.025 0 1.413l5 5c0.194 0.194 0.45 0.294 0.706 0.294s0.513-0.1 0.706-0.294l11-11c0.394-0.387 0.394-1.025 0-1.413z"></path></symbol>
                    <symbol id="icon-toast-warning" viewBox="0 0 24 24"><title>toast-warning</title><path d="M23.037 17.487c0 0-0.006-0.006-0.006-0.006l-8.463-14.138c0-0.006-0.006-0.006-0.006-0.012-0.556-0.9-1.512-1.437-2.562-1.437s-2.006 0.537-2.556 1.431c-0.006 0.006-0.012 0.012-0.012 0.025l-8.469 14.138c0 0 0 0.006-0.006 0.006-0.262 0.45-0.406 0.975-0.406 1.506 0 1.638 1.331 2.981 2.963 3 0.006 0 0.006 0 0.012 0h16.944c0.006 0 0.006 0 0.012 0 1.638-0.019 2.969-1.362 2.969-3 0-0.531-0.144-1.056-0.412-1.512zM20.463 20h-16.925c-0.544-0.006-0.981-0.456-0.981-1 0-0.175 0.044-0.344 0.131-0.494l8.463-14.131c0 0 0.006-0.006 0.006-0.006 0.188-0.294 0.5-0.469 0.85-0.469s0.669 0.181 0.856 0.481l8.45 14.119c0.087 0.15 0.131 0.325 0.131 0.5 0.006 0.544-0.438 0.994-0.981 1z"></path><path d="M12 8c-0.55 0-1 0.45-1 1v4c0 0.55 0.45 1 1 1s1-0.45 1-1v-4c0-0.55-0.45-1-1-1z"></path><path d="M12 16c-0.262 0-0.519 0.106-0.706 0.294s-0.294 0.444-0.294 0.706 0.106 0.519 0.294 0.706c0.188 0.188 0.444 0.294 0.706 0.294s0.519-0.106 0.706-0.294c0.188-0.188 0.294-0.444 0.294-0.706s-0.106-0.519-0.294-0.706c-0.188-0.188-0.444-0.294-0.706-0.294z"></path></symbol>
                    <symbol id="icon-toast-error" viewBox="0 0 24 24"><title>toast-error</title><path d="M13.413 12l5.294-5.294c0.387-0.387 0.387-1.025 0-1.413s-1.025-0.387-1.413 0l-5.294 5.294-5.294-5.294c-0.387-0.387-1.025-0.387-1.413 0s-0.387 1.025 0 1.413l5.294 5.294-5.294 5.294c-0.387 0.387-0.387 1.025 0 1.413 0.194 0.194 0.45 0.294 0.706 0.294s0.513-0.1 0.706-0.294l5.294-5.294 5.294 5.294c0.194 0.194 0.45 0.294 0.706 0.294s0.513-0.1 0.706-0.294c0.387-0.387 0.387-1.025 0-1.413l-5.294-5.294z"></path></symbol>
                    <symbol id="icon-toast-info" viewBox="0 0 24 24"><title>toast-info</title><path d="M12 1c-6.063 0-11 4.938-11 11s4.938 11 11 11 11-4.938 11-11-4.938-11-11-11zM12 21c-4.962 0-9-4.038-9-9s4.038-9 9-9c4.962 0 9 4.038 9 9s-4.038 9-9 9z"></path><path d="M12 11c-0.55 0-1 0.45-1 1v4c0 0.55 0.45 1 1 1s1-0.45 1-1v-4c0-0.55-0.45-1-1-1z"></path><path d="M12 7c-0.262 0-0.519 0.106-0.706 0.294s-0.294 0.444-0.294 0.706 0.106 0.519 0.294 0.706c0.188 0.188 0.444 0.294 0.706 0.294s0.519-0.106 0.706-0.294c0.188-0.188 0.294-0.444 0.294-0.706s-0.106-0.519-0.294-0.706c-0.188-0.188-0.444-0.294-0.706-0.294z"></path></symbol>
                    </svg>
                </div>
                <CSSTransitionGroup
                    component="div"
                    className="toastr-container"
                    transitionName="toast"
                    transitionEnterTimeout={400}
                    transitionLeaveTimeout={400}
                >
                    {this.state.toasts.map(toast => {
                        return <Toast key={toast.key} toast={toast} onRemoveToast={this._onRemoveToast}/>
                    })}
                </CSSTransitionGroup>
            </div>
        );
    }
}

export const toastr = (function () {
    return {
        add (_toast) {
            let toast = {..._toast};
            let { id, type, autoClose, hasCloseButton } = toast;
            toast.id = id ? id : uniqueId('toast-');
            toast.key = uniqueId('key-');
            if (autoClose === undefined || typeof autoClose !== 'number') {
                toast.autoClose = AUTO_CLOSE;
            } else {
                if (autoClose === false) {
                    toast.hasCloseButton = true;
                }
            }
            if (!type || !TYPES.includes(type)) {
                toast.type = TYPES[0];
            }
            if (hasCloseButton === undefined || typeof hasCloseButton !== 'boolean') {
                toast.hasCloseButton = true;
            }
            pubsub.add(toast);
            return id;
        },
        remove (id) {
            pubsub.remove(id);
        }
    }
})();