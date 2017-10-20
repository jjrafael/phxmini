import React from "react";
import { hashHistory } from "react-router";
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import moment from 'moment';
import qs from 'query-string';
import { combineDateTime, selectValidProps } from 'phxUtils';
import RankEventForm from './FormComponent';
import { fetchOpponents, createEvent } from '../actions';
import { setEventPathMode } from '../../Path/actions';
import { enableHeaderButtons } from '../../App/actions';
import { setNewSelectedOpponents } from '../actions';
import { paths } from '../../App/constants';
import { modes } from '../../Path/constants';
import { validOutcomeProps, validRankEventProps } from '../constants';
import ModalWindow from 'components/modal';
import ImportOpponents from '../../Opponents/ImportOpponents';
import ConfirmModal from 'componentsV2/Modal/ConfirmModal';

const mapStateToProps = (state) => {
    return {
        newSelectedOpponents: state.eventCreatorEvent.newSelectedOpponents,
        countries: state.apiConstants.values.countries,
        templates: state.apiConstants.values.templates,
        sportCode: state.sportsTree.activeSportCode,
        sportId: state.sportsTree.activeSportId,
    }
};

const mapDispatchToProps = (dispatch) => {
    const actions = {
        fetchOpponents,
        createEvent,
        setEventPathMode,
        enableHeaderButtons,
        setNewSelectedOpponents
    }
    return bindActionCreators(actions, dispatch);
};

class CreateRankEvent extends React.Component {
    constructor (props) {
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
        this.props.enableHeaderButtons(paths.LEAGUE_NEWRANK);
        this.props.setEventPathMode(modes.CREATE);
    };

    _onFormSubmit(data) {
        const { sportCode, templates } = this.props;
        let payload = {
            ...selectValidProps([data], validRankEventProps)[0],
            startDateTime: combineDateTime(data.startDateTime, data.startTime),
            outcomes: selectValidProps(this.props.newSelectedOpponents, validOutcomeProps).map((opponent, i) => {
                return {...opponent, retailIndex: i+1, ordinalPosition: i}
            }),
            sportCode,
        };
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

        this.props.createEvent(this.state.parentPathId, payload);
    };

    _formatInitialValues () {
        return {
            autoSettle: true,
            inRunningDelay: 5000,
            type: 'Rank',
            startDateTime: moment().set({hour:0,minute:0,second:0,millisecond:0}).format('L'),
            rankEventDefaultMarketType: 'OUTRIGHT',
            startTime: '00:00',
            formIgnoreFeed: true,
            formIgnoreFeedLiveBook: true,
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

    render() {
         //constants
        const { countries, templates } = this.props;
        //
        const { sportId } = this.props;
        let eventPathTemplates = templates.filter( template => template.eventPathId === this.state.parentPathId );
        if (eventPathTemplates.length === 0) {
          eventPathTemplates = templates.filter( template => template.eventPathId === sportId );
        }
        const { showWarningDlg, warningMsg } = this.state;

        return (
          <div>
            <RankEventForm
                countries={countries}
                initialValues={this._formatInitialValues()}
                onFormSubmit={this._onPreFormSubmit}
                templates={eventPathTemplates}
            />
            {
              showWarningDlg &&
                <ConfirmModal
                  title={'Create Rank Event'}
                  message={warningMsg}
                  isVisible={showWarningDlg}
                  onConfirm={this._onWarningYesButtonClicked}
                  onCancel={this._onWarningDlgClose} />
              }
          </div>
        );
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(CreateRankEvent);