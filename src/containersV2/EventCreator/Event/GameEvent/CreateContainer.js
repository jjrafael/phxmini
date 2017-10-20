import React from "react";
import { hashHistory } from "react-router";
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { createSelector } from 'reselect';
import moment from 'moment';
import qs from 'query-string';
import { combineDateTime, selectValidProps } from 'phxUtils';
import FormComponent from './FormComponent';
import { fetchOpponents, createEvent, fetchPlayersOfOpponentA, fetchPlayersOfOpponentB, clearPlayersOfOpponentsAB } from '../actions';
import { setEventPathMode } from '../../Path/actions';
import { enableHeaderButtons } from '../../App/actions';
import { paths } from '../../App/constants';
import { modes } from '../../Path/constants';
import { validGameEventProps } from '../constants';
import ConfirmModal from 'componentsV2/Modal/ConfirmModal';
import { formValueSelector } from 'redux-form';
import ModalWindow from 'components/modal';
import LoadingIndicator from 'phxComponents/loadingIndicator';
import _ from 'underscore';

const initialValues = {
    autoSettle: true,
    inRunningDelay: 5000,
    type: 'Game',
    startDateTime: moment().set({hour:0,minute:0,second:0,millisecond:0}).format('L'),
    startTime: '00:00',
    opponentAId: null,
    opponentBId: null,
}

const gameFormSelector = formValueSelector('GameEventForm');
const sportsSelector = state => state.apiConstants.values.riskSports;
const activeSportCodeSelector = state => state.sportsTree.activeSportCode;
const isAmericanSportSelector = createSelector(
  [sportsSelector, activeSportCodeSelector],
  (sports, sportCode) => {
    let isAmericanSport = false;
    const sport = sports.find(sport => sport.code === sportCode);
    if (sport) {
      isAmericanSport = sport.americanSport;
    }
    return isAmericanSport;
  }
)
const mapStateToProps = (state) => {
    return {
        opponents: state.eventCreatorEvent.opponents,
        countries: state.apiConstants.values.countries,
        templates: state.apiConstants.values.templates,
        sportCode: activeSportCodeSelector(state),
        isAmericanSport: isAmericanSportSelector(state),
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
        fetchOpponents,
        createEvent,
        setEventPathMode,
        enableHeaderButtons,
        fetchPlayersOfOpponentA,
        fetchPlayersOfOpponentB,
        clearPlayersOfOpponentsAB
    }
    return bindActionCreators(actions, dispatch);
};

class CreateGameEvent extends React.Component {
    constructor(props) {
      super(props);

      this.state = {
        showWarningDlg: false,
        warningMsg: null,
        formData: null,
        parentPathId: Number(qs.parse(this.props.location.search).parentPathId)
      };

      this._onPreFormSubmit = this._onPreFormSubmit.bind(this);
      this._onFormSubmit = this._onFormSubmit.bind(this);
      this._onWarningDlgClose = this._onWarningDlgClose.bind(this);
      this._onWarningYesButtonClicked = this._onWarningYesButtonClicked.bind(this);
    }

    componentDidMount() {
        this.props.fetchOpponents(this.state.parentPathId);
        this.props.enableHeaderButtons(paths.LEAGUE_NEWGAME);
        this.props.setEventPathMode(modes.CREATE);
    };

    componentWillUnmount () {
        this.props.setEventPathMode(modes.VIEW);
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
        const { sportCode } = this.props;
        const { opponentAId, opponentBId } = data
        if(data.americanFormat){
          data.opponentAId =  opponentBId 
          data.opponentBId =  opponentAId 
        }
        let payload = selectValidProps([data], validGameEventProps)[0];
        payload.startDateTime = combineDateTime(data.startDateTime, data.startTime);

        payload.print = !data.formPrint;
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

        this.props.createEvent(this.state.parentPathId, {
            sportCode,
            ...payload
        });
    };

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

        //constants
        const { opponents, countries, templates, sportCode, sportOtherOptions, isFetchingPlayersA, isFetchingPlayersB, playersA, playersB, eventPathMode } = this.props;
        //
        const { activeSportId } = this.props;
        let eventPathTemplates = templates.filter( template => template.eventPathId === this.state.parentPathId );
        if (eventPathTemplates.length === 0) {
          eventPathTemplates = templates.filter( template => template.eventPathId === activeSportId );
        }
        const { showWarningDlg, warningMsg } = this.state;

        return (
            <div>
              <FormComponent
                  opponents={opponents}
                  countries={countries}
                  initialValues={{...initialValues, bestOfSets: sportOtherOptions[0]}}
                  templates={eventPathTemplates}
                  onFormSubmit={this._onPreFormSubmit}
                  sportCode={sportCode}
                  sportOtherOptions={sportOtherOptions}
                  playersA={playersA}
                  playersB={playersB}
                  eventPathMode={eventPathMode}
                  opponentAId={this.props.opponentAId}
                  opponentBId={this.props.opponentBId}
                  americanFormat={this.props.americanFormat}
                  isAmericanSport={this.props.isAmericanSport}
              />
              {
                showWarningDlg &&
                <ConfirmModal
                  title={'Create Game Event'}
                  message={warningMsg}
                  isVisible={showWarningDlg}
                  onConfirm={this._onWarningYesButtonClicked}
                  onCancel={this._onWarningDlgClose} />
              }
              {
                (isFetchingPlayersA || isFetchingPlayersB) && this._renderLoadingIndicator()
              }
            </div>
        );
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(CreateGameEvent);
