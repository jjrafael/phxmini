import React from "react";
import { hashHistory } from "react-router";
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import moment from 'moment';
import isEqual from 'lodash.isequal';
import { fetchEvent, updateEvent } from '../actions';
import { setEventPathMode } from '../../Path/actions';
import { enableHeaderButtons } from '../../App/actions';
import { paths } from '../../App/constants';
import { modes } from '../../Path/constants';
import { validOutcomeProps, validRankEventProps } from '../constants';
import RankEventForm from './FormComponent';
import { combineDateTime, selectValidProps } from 'phxUtils';
import ConfirmModal from 'componentsV2/Modal/ConfirmModal';

const mapStateToProps = (state) => {
    return {
        event: state.eventCreatorEvent.event,
        activeSportId: state.sportsTree.activeSportId,
        defaultMarketId: state.eventCreatorEvent.defaultMarketId,
        newSelectedOpponents: state.eventCreatorEvent.newSelectedOpponents,
        countries: state.apiConstants.values.countries,
        templates: state.apiConstants.values.templates,
    }
};

const mapDispatchToProps = (dispatch) => {
    const actions = {
        fetchEvent,
        updateEvent,
        enableHeaderButtons,
    }
    return bindActionCreators(actions, dispatch);
};

class UpdateRankEvent extends React.Component {
    constructor(props) {
      super(props);

      this.state = {
        showWarningDlg: false,
        warningMsg: null,
        formData: null,
      };

      this._onPreFormSubmit = this._onPreFormSubmit.bind(this);
      this._onFormSubmit = this._onFormSubmit.bind(this);
      this._onWarningDlgClose = this._onWarningDlgClose.bind(this);
      this._onWarningYesButtonClicked = this._onWarningYesButtonClicked.bind(this);
    }

    componentDidMount() {
        this.props.enableHeaderButtons(paths.RANK_EVENT);
    }

    _onFormSubmit(data) {
        let payload = validRankEventProps.reduce((accu, prop) => {
            if (data[prop] !== undefined && data[prop] !== null) {
                if (['countryId', 'eventTemplateId', 'opponentAId', 'opponentBId'].includes(prop)) {
                    if (data[prop] >= 0) {
                        accu[prop] = data[prop];
                    }
                } else {
                    accu[prop] = data[prop];
                }
            }
            return accu;
        }, {});
        const { sportCode, templates } = this.props;
        payload.outcomes = selectValidProps(this.props.newSelectedOpponents, validOutcomeProps).map((opponent, i) => {
            return {...opponent, retailIndex: i+1, ordinalPosition: i}
        });
        payload.ignoreFeed = !data.formIgnoreFeed;
        payload.ignoreFeedLiveBook = !data.formIgnoreFeedLiveBook;
        if (payload.defaultAutoOpenTime) {
            let combinedDateTime = combineDateTime(data.defaultAutoOpenTime, data.defaultStartTime);
            if (combinedDateTime) {
                payload.defaultAutoOpenTime = combinedDateTime;
            } else {
                delete payload.defaultAutoOpenTime;
            }
        }
        if (payload.originalStartDateTime) {
            let combinedDateTime = combineDateTime(data.originalStartDateTime, data.originalStartTime);
            if (combinedDateTime) {
                payload.originalStartDateTime = combinedDateTime;
            } else {
                delete payload.originalStartDateTime;
            }
        }
        payload.updateOutcomes = true;
        payload.startDateTime = combineDateTime(data.startDateTime, data.startTime);

        this.props.updateEvent(this.props.event.id, payload);
    }

    _formatInitialValues() {
        const { event } = this.props;
        let initialValue = { ...event };
        if (event) {
            initialValue.startDateTime = moment(event.startDateTime).format('L');
            initialValue.startTime = moment(event.startDateTime).format('HH:mm');
            if (event.defaultAutoOpenTime) {
                initialValue.defaultAutoOpenTime = moment(event.defaultAutoOpenTime).format('L');
                initialValue.defaultStartTime = moment(event.defaultAutoOpenTime).format('HH:mm');
            }
            initialValue.neutralGround = event.eventInfo ? event.eventInfo.neutralGround : null;
            initialValue.formIgnoreFeed = !event.ignoreFeed;
            initialValue.formIgnoreFeedLiveBook = !event.ignoreFeedLiveBook;
        }
        return initialValue;
    }

    _onPreFormSubmit(data) {
      const startDateTime = combineDateTime(data.startDateTime, data.startTime);

      let currentMoment = moment();
      let startDateMoment = moment(startDateTime);
      if (startDateMoment.isBefore(currentMoment)) {
        this.setState({
          showWarningDlg: true,
          warningMsg: <div><p>The start time is earlier than current time.</p><p>Do you wish to proceed?</p></div>,
          formData: data,
        });

      } else {
        this._onFormSubmit(data);
      }
    }

    _onWarningDlgClose() {
      this.setState({
        showWarningDlg: false,
        warningMsg: null,
        formData: null
      });
    }

    _onWarningYesButtonClicked() {
      const {onFormSubmit} = this.props;
      const {formData} = this.state;

      const data = Object.assign({}, formData);

      this.setState({
        showWarningDlg: false,
        warningMsg: null,
        formData: null
      }, () => {
        this._onFormSubmit(data)
      });
    }

    render() {
        const { event, selectedOpponents, countries, templates, activeSportId } = this.props;
        if(!event) { return null; }

        const { showWarningDlg, warningMsg } = this.state;
        let lastIndex = event.eventPaths.length - 1;
        let parentPathId = event.eventPaths[lastIndex].id;
        let eventPathTemplates = templates.filter( template => template.eventPathId === parentPathId);
        if (eventPathTemplates.length === 0) {
          eventPathTemplates = templates.filter( template => template.eventPathId === activeSportId);
        }
        return (
            <div className="rank-event-form">
                <RankEventForm
                    initialValues={this._formatInitialValues()}
                    countries={countries}
                    templates={eventPathTemplates}
                    onFormSubmit={this._onPreFormSubmit}
                    isOnUpdateMode={true}
                />
                {
                  showWarningDlg &&
                  <ConfirmModal
                    title={'Update Rank Event'}
                    message={warningMsg}
                    isVisible={showWarningDlg}
                    onConfirm={this._onWarningYesButtonClicked}
                    onCancel={this._onWarningDlgClose} />
                }
            </div>
        )
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(UpdateRankEvent);