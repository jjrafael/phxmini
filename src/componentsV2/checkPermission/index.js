import React, { Component } from 'react';
import { connect } from 'react-redux';

const mapStateToProps = (state) => {
    return {
        permissions: state.apps.permissions
    };
};

export default function (WrappedComponent) {
    class Wrapper extends Component {
        constructor (props) {
            super(props);
            const { permissions, actionIds, actionIdFilter } = this.props;
            let hasPermission = true;
            if (actionIds) {
                if (actionIds.length > 1) {
                    if (actionIdFilter === 'ANY') {
                        hasPermission = actionIds.some(id => permissions.includes(id))
                    } else {
                        hasPermission = actionIds.every(id => permissions.includes(id))
                    }
                } else {
                    hasPermission = permissions.includes(actionIds[0]);
                }
            }
            this.state = { hasPermission };
        }
        render () {
            let newProps = {};
            const { actionIds, override } = this.props;
            if(override){
                return <WrappedComponent {...this.props}/>
            }
            if (actionIds && !this.state.hasPermission) {
                newProps.disabled = true;
                newProps.onClick = (e) => { e.preventDefault(); e.stopPropagation() }
                if (this.props.disabledClassName) {
                    newProps.className = this.props.disabledClassName;
                }
                if (this.props.onChange) {
                    newProps.onChange = (e) => { e.preventDefault(); e.stopPropagation() }
                }
            }
            return (
                <WrappedComponent {...this.props} {...newProps} />
            );
        }
    }
    return connect(mapStateToProps)(Wrapper)
};

export const mapPermissionsToProps = function (WrappedComponent) {
    class Wrapper extends Component {
        render () {
            let { permissions } = this.props;
            return (
                <WrappedComponent {...this.props} permissions={permissions} />
            );
        }
    }
    return connect(mapStateToProps)(Wrapper)
};