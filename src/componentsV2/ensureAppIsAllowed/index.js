import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { replace } from 'react-router-redux';
import appNames, { appNamesAlias } from '../../constants/appNames';
import { toastr } from 'phxComponents/toastr/index';

const mapStateToProps = (state) => {
    return {
        allowedAppIds: state.apps.allowedAppIds,
        activeAppId: state.apps.activeAppId,
        apps: state.startup.apps,
        isAppListLoaded: state.apps.isAppListLoaded,
    };
};

const mapDispatchToProps = (dispatch) => {
    return bindActionCreators({replace}, dispatch)
}

export default function (params) {
    return WrappedComponent => {
        class Wrapper extends Component {
            constructor (props) {
                super(props);
                this._checkIfAllowed = this._checkIfAllowed.bind(this);
            }
            componentWillUpdate (nextProps) {
                const appDesc = appNames[params.appKey]
                const app = this.props.apps[appDesc];
                const nextApp = nextProps.apps[appDesc];
                const isAppListLoaded = nextProps.isAppListLoaded;

                if (!app && nextApp && !nextApp.isStartingUp && isAppListLoaded) {
                    this._checkIfAllowed(nextProps);
                } else if (app && nextApp && isAppListLoaded) {
                    if (app.isStartingUp && !nextApp.isStartingUp && !nextApp.startupFailed) {
                        this._checkIfAllowed(nextProps);
                    }
                } else if (isAppListLoaded && !this.props.isAppListLoaded) {
                    if (!nextApp.isStartingUp && !nextApp.startupFailed) {
                        this._checkIfAllowed(nextProps);
                    }
                }
            }
            _checkIfAllowed (props) {
                const { activeAppId, allowedAppIds, replace } = props;
                if (!allowedAppIds.includes(activeAppId)) {
                    let appDesc = appNames[params.appKey];
                    if (appNamesAlias[appDesc]) {
                        appDesc = appNamesAlias[appDesc];
                    }
                    replace('/');
                    toastr.add({message: `You are not allowed to access ${appDesc} app`, type: 'ERROR'});
                }
            }
            render () {
                return <WrappedComponent {...this.props}/>
            }
        }
        return connect(mapStateToProps, mapDispatchToProps)(Wrapper)
    }
};