import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import _ from 'underscore';
import { mapPermissionsToProps } from 'componentsV2/checkPermission/index';
import { permissionsCode } from 'containersV2/EventCreator/App/constants';
import EventPathForm from './EventPathForm';
import EventPathBottomBar from './EventPathBottomBar';
import { fetchEventPathDetails, editEventPath, addEventPath } from './actions';
import { modes } from './constants';
import { paths } from '../App/constants';

const mapStateToProps = (state, ownProps) => {
    let activePathId = state.sportsTree.activePathId;
    return {
        tags: state.apiConstants.values.tags || [],
        activePage: state.eventCreatorApp.activePage,
        eventPathMode: state.eventCreatorEventPath.eventPathMode,
        eventPathDetails: state.eventCreatorEventPath.eventPathDetails,
        activePathId,
    };
};

const mapDispatchToProps = (dispatch, ownProps) => {
    return bindActionCreators({fetchEventPathDetails, editEventPath, addEventPath}, dispatch);
};

class EventPathTab extends Component {
    constructor (props) {
        super(props);
        this._submit = this._submit.bind(this);
    }

    componentWillMount () {
        let { pathId, fetchEventPathDetails } = this.props;
        fetchEventPathDetails(pathId);
    }
    componentWillUpdate (nextProps) {
        let { pathId, fetchEventPathDetails } = this.props;
        if (nextProps.pathId !== pathId && nextProps.pathId >= 0) {
            fetchEventPathDetails(nextProps.pathId);
        }
    }

    _submit(data) {
        const { activePathId, editEventPath, addEventPath, tags, permissions } = this.props;
        const formattedData = {
            ..._.pick(data, 'parentId', 'tag', 'description', 'feedCode', 'publishSort', 'eventPathCode', 'grade', 'comments', 'suppressP2p', 'published'),
            tag: tags.find(tag => tag.id === Number(data.tagId)).description
        };
        if (!permissions.includes(permissionsCode.VIEW_EVENT_PATH_AND_OPPONENT_RATINGS) || !permissions.includes(permissionsCode.EDIT_EVENT_PATH_AND_OPPONENT_RATINGS)) {
            delete formattedData.grade;
        }
        if (this.props.eventPathMode === modes.CREATE) {
            addEventPath(formattedData);
        } else {
            editEventPath(activePathId, formattedData);
        }
    };

    render () {
        let {
            eventPathMode, eventPathDetails, tags, activePage
        } = this.props;
        let isOnCreateMode = eventPathMode === modes.CREATE;
        let tagId = 5;
        let tag = '';
        if (isOnCreateMode) {
            if (activePage === paths.COUNTRY) {
                tagId = 2;
            }
            let target = tags.find(tag => tag.id === tagId);
            tag = target ? target.description : tag;
        }
        return (
            <div className="form-wrapper">
                <EventPathForm
                    eventPathFormSubmitHandler={this._submit}
                    initialValues={
                        (!isOnCreateMode ? eventPathDetails : {
                            parentId: eventPathDetails.id,
                            grade: 1,
                            suppressP2p: false,
                            published: true,
                            tag,
                            tagId,
                        })
                    }
                    disabledInput={(activePage === paths.SPORT && eventPathMode === modes.VIEW)}
                    tags={tags.filter(item => item.id !== 1).sort((a, b) => {
                        if (a.description > b.description) return 1;
                        if (a.description < b.description) return -1;
                        return 0;
                    })}
                />
                { !isOnCreateMode && (activePage !== paths.SPORT) &&
                    <EventPathBottomBar />
                }
            </div>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(mapPermissionsToProps(EventPathTab));