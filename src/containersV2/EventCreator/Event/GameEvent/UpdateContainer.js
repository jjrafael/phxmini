import React from "react";
import { hashHistory } from "react-router";
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { fetchEvent, updateEvent, fetchPlayersOfOpponentA, fetchPlayersOfOpponentB, clearPlayersOfOpponentsAB } from '../actions';
import { enableHeaderButtons } from '../../App/actions';
import { paths } from '../../App/constants';
import { modes } from '../../Path/constants';
import { validGameEventProps } from '../constants';
import moment from 'moment';
import { combineDateTime, selectValidProps } from 'phxUtils';
import _ from 'underscore';
import ConfirmModal from 'componentsV2/Modal/ConfirmModal';

import FormComponent from './FormComponent';

import { formValueSelector } from 'redux-form';
import ModalWindow from 'components/modal';
import LoadingIndicator from 'phxComponents/loadingIndicator';


const gameFormSelector = formValueSelector('GameEventForm');

const mapStateToProps = (state) => {
    return {
        event: state.eventCreatorEvent.event,
        opponents: state.eventCreatorEvent.opponents,
        countries: state.apiConstants.values.countries,
        templates: state.apiConstants.values.templates,
        sportCode: state.sportsTree.activeSportCode,
        activeSportId: state.sportsTree.activeSportId,
        sportOtherOptions: state.eventCreatorApp.sportOtherOptions.bestOfSetsOptions,
        opponentAId: gameFormSelector(state, 'opponentAId'),
        opponentBId: gameFormSelector(state, 'opponentBId'),
        americanFormat: gameFormSelector(state, 'americanFormat'),
        playersA: state.eventCreatorEvent.playersA,
        playersB: state.eventCreatorEvent.playersB,
        isFetchingPlayersA: state.eventCreatorEvent.isFetchingPlayersA,
        isFetchingPlayersB: state.eventCreatorEvent.isFetchingPlayersB,
        eventPathMode: state.eventCreatorEventPath.eventPathMode
    }
};

const mapDispatchToProps = (dispatch) => {
    const actions = {
        fetchEvent,
        updateEvent,
        enableHeaderButtons,
        fetchPlayersOfOpponentA,
        fetchPlayersOfOpponentB,
        clearPlayersOfOpponentsAB
    }
    return bindActionCreators(actions, dispatch);
};

class UpdateGameEvent extends React.Component {
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
        this.props.enableHeaderButtons(paths.GAME_EVENT);
    }

    componentDidUpdate(prevProps, prevState) {
      if (this.props.sportCode === 'BASE') {
        if (prevProps.opponentAId !== this.props.opponentAId && this.props.opponentAId && this.props.opponentAId > -1) {
          this.props.fetchPlayersOfOpponentA(this.props.opponentAId);
        }

        if (prevProps.opponentBId !== this.props.opponentBId && this.props.opponentBId && this.props.opponentBId > -1) {
          this.props.fetchPlayersOfOpponentB(this.props.opponentBId);
        }
      } else {
        if (!_.isEmpty(this.props.playersA) || !_.isEmpty(this.props.playersB)) {
          this.props.clearPlayersOfOpponentsAB();
        }
      }
    }

    _onFormSubmit(data) {
        let { opponents, sportCode }  = this.props;
        let opponentA = opponents.find(opp => opp.id ===  Number(data.opponentAId));
        let opponentB = opponents.find(opp => opp.id ===  Number(data.opponentBId));
        let description = `${opponentA.description} ${data.americanFormat ? '@' : 'vs'} ${opponentB.description}`;
        let payload = selectValidProps([data], validGameEventProps)[0];
        if (payload.countryId && payload.countryId < 0) {
            delete payload.countryId;
        }
        if (payload.eventTemplateId && payload.eventTemplateId < 0) {
            delete payload.eventTemplateId;
        }
        payload.startDateTime = combineDateTime(data.startDateTime, data.startTime);

        payload.print = !data.formPrint;
        payload.ignoreFeed = !data.formIgnoreFeed;
        payload.ignoreFeedLiveBook = !data.formIgnoreFeedLiveBook;
        payload.description = description;
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

        if (sportCode === 'BASE') {
          payload.pitcherAId = data.pitcherAId !== -1 ? data.pitcherAId : null;
          payload.pitcherBId = data.pitcherBId !== -1 ? data.pitcherBId : null;

          const pitcherA = _.findWhere(this.props.playersA, {id: data.pitcherAId});
          payload.pitcherAName = pitcherA ? pitcherA.description : null;

          const pitcherB = _.findWhere(this.props.playersB, {id: data.pitcherBId});
          payload.pitcherBName = pitcherB ? pitcherB.description : null;
        }
        
        this.props.updateEvent(this.props.event.id, payload);
    }

    _formatInitialValues() {
        const { event } = this.props;
        if (event) {
            return {
                ...event,
                startDateTime: event.startDateTime ? moment(event.startDateTime).format('L') : null,
                startTime: event.startDateTime ? moment(event.startDateTime).format('HH:mm') : null,
                defaultAutoOpenTime: event.defaultAutoOpenTime ? moment(event.defaultAutoOpenTime).format('L') : null,
                defaultStartTime: event.defaultAutoOpenTime ? moment(event.defaultAutoOpenTime).format('HH:mm') : null,
                originalStartDateTime: event.originalStartDateTime ? moment(event.originalStartDateTime).format('L') : null,
                originalStartTime: event.originalStartDateTime ? moment(event.originalStartDateTime).format('HH:mm') : null,
                formPrint: !event.print,
                formIgnoreFeed: !event.ignoreFeed,
                formIgnoreFeedLiveBook: !event.ignoreFeedLiveBook,
                neutralGround: event.eventInfo ? event.eventInfo.neutralGround : null
            }
        }
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

    _renderLoadingIndicator() {
        return (
          <ModalWindow
              key="loading-modal"
              className="small-box"
              title="Loading"
              name="error"
              isVisibleOn={true}
              shouldCloseOnOverlayClick={false}
              closeButton={false}>
              <div>
                <LoadingIndicator />
              </div>
          </ModalWindow>
        )
    }

    render() {
        const { event, opponents, countries, templates, sportCode, sportOtherOptions, isFetchingPlayersA, isFetchingPlayersB, playersA, playersB, eventPathMode, activeSportId  } = this.props;
        if(!event) { return null; }
        const { showWarningDlg, warningMsg } = this.state;
        let lastIndex = event.eventPaths.length - 1;
        let parentPathId = event.eventPaths[lastIndex].id;
        let eventPathTemplates = templates.filter( template => template.eventPathId === parentPathId);
        if (eventPathTemplates.length === 0) {
          eventPathTemplates = templates.filter( template => template.eventPathId === activeSportId);
        }
        return (
          <div>
            <FormComponent
                initialValues={this._formatInitialValues()}
                opponents={opponents}
                countries={countries}
                templates={eventPathTemplates}
                onFormSubmit={this._onPreFormSubmit}
                isOnUpdateMode={true}
                sportCode={sportCode}
                sportOtherOptions={sportOtherOptions}
                playersA={playersA}
                playersB={playersB}
                eventPathMode={eventPathMode}
                hasOpenMarket={event.hasOpenMarket}
                americanFormat={this.props.americanFormat}
            />
            {
              showWarningDlg &&
              <ConfirmModal
                title={'Update Game Event'}
                message={warningMsg}
                isVisible={showWarningDlg}
                onConfirm={this._onWarningYesButtonClicked}
                onCancel={this._onWarningDlgClose} />
            }
            {
              (isFetchingPlayersA || isFetchingPlayersB) && this._renderLoadingIndicator()
            }
          </div>
        )
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(UpdateGameEvent);
