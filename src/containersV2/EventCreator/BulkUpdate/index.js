import React from "react";
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { toggleBulkUpdate } from '../App/actions';
import DeleteEventsPanel from './Panels/DeleteEvents';
import DeletePathsPanel from './Panels/DeletePaths';
import UpdateEventsPanel from './Panels/UpdateEvents';

const mapDispatchToProps = (dispatch) => {
    return bindActionCreators({
        toggleBulkUpdate,
    }, dispatch);
};

class BulkUpdates extends React.Component {
    componentWillMount () {
        this.props.toggleBulkUpdate(true);
    }
    componentWillUnmount () {
        this.props.toggleBulkUpdate(false);
    }
    render() {
        return (
            <div className="bulk-update-container flex padding-medium">
                <div className="panels-container">
                    <DeleteEventsPanel />
                    <DeletePathsPanel />
                    <UpdateEventsPanel />
                </div>
            </div>
        )
    }
};

export default connect(null, mapDispatchToProps)(BulkUpdates);