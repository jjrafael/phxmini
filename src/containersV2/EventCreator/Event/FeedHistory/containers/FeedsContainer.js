import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import moment from 'moment';
import {fetchFeedHistoryFeeds, fetchFeedHistoryFeedXML} from '../actions';

import Search from './Search';
import { closeModal, openModal } from 'actions/modal';
import FeedTable from '../components/FeedTable';
import FeedDetails from '../components/FeedDetails';
import FeedErrorConditions from '../components/FeedErrorConditions';
import FeedContentViewer from '../components/FeedContentViewer';
import _ from 'underscore';
import ModalLoader from 'phxV2Components/ModalLoader/';
import MarketDetailSummaryModal from '../components/MarketDetailSummaryModal';


class FeedsContainer extends React.Component {
  constructor(props) {
    super(props);
    this._handleSelectRow = this._handleSelectRow.bind(this);
    this._fetchFeedHistoryFeeds = this._fetchFeedHistoryFeeds.bind(this);
    this._handleSummaryDetail = this._handleSummaryDetail.bind(this);
    this._resetState = this._resetState.bind(this);
    this.state = {
        feedDetails : {},
        feedXMLData : {}
    }
  }

  componentWillMount(){
    let {event} = this.props;
    this.props.fetchFeedHistoryFeeds(event.event.id);
  }

  componentWillUnMount(){
      this.setState({
          feedDetails : {},
          feedXMLData : {},
          summaryDetails : {}
      })
  }

  componentWillReceiveProps(nextProps, nextState){
    let {feedXML, feeds} = this.props.feedHistory;

    if(this.props.isFetchingFeedHistoryFeedXML === false && feedXML !== null){
        this.setState({feedXMLData : feedXML})
    }
  }
  componentDidUpdate(prevProps, prevState){
    let {feedXML, feeds} = this.props.feedHistory;

    if(prevProps.isFetchingFeedHistoryFeedFeeds && this.props.isFetchingFeedHistoryFeedFeeds === false){
        this.setState({feedDetails : feeds})
    }

    if(prevProps.isFetchingFeedHistoryFeedXML && this.props.isFetchingFeedHistoryFeedXML === false){
        this.setState({feedXMLData : feedXML})
    }
  }

  componentDidMount(){
    this._resetState();
  }
  _resetState() {
      this.setState({
          feedDetails : {},
          feedXMLData : {},
          summaryDetails : {}
      })
  }
  _handleSelectRow(feedData){
      this.setState({feedDetails : feedData})
      this.props.fetchFeedHistoryFeedXML(feedData.id)
  }


  _fetchFeedHistoryFeeds() {
    let {event} = this.props;
    this.props.fetchFeedHistoryFeeds(event.event.id);
  }

  _handleSummaryDetail(data){
    this.setState({summaryDetails : data});
    this.props.openModal('feedPopup');
  }

  render() {
    let {closeModal, openModal, lineup, feedHistory, event, isFetchingFeedHistoryFeeds} = this.props;
    let eventDetails = event.event;
    let startDate = moment(eventDetails.startDateTime).format('L');
    let startTime = moment(eventDetails.startDateTime).format('HH:mm');

    if(Object.keys(eventDetails).length) {
        return (
          <div className="form-wrapper">
            <h4 className="modal-title">
                {eventDetails.description} - {startDate} - {startTime}
            </h4>
            <div className="main-content">
              <div className="inner">
                <div className="block">
                  <div className="row">
                      <div className="desktop-full feed-title">
                          <div className="desktop-half">
                                  <h5>{eventDetails.description}</h5>
                                  <h3>Feed History</h3>       
                          </div>
                          <div className="desktop-half ai-center">
                              <div className="button-group fright">
                                  <button onClick={this._fetchFeedHistoryFeeds}>
                                      <i className="phxicon phx-refresh" /> Refresh
                                  </button>
                                  <button className="" onClick={() => {
                                      closeModal('feedHistory')
                                  }}>
                                      Close
                                  </button>
                              </div>
                              <div className="fright">
                                  <label className="search-filter">Show only files containing &nbsp;<Search/></label>
                              </div>
                          </div>
                      </div>
                  </div>
                  {
                    isFetchingFeedHistoryFeeds === false ?  <FeedTable onRowClick={this._handleSelectRow} feedDetails={this.state.feedDetails} handleSummaryDetail={this._handleSummaryDetail}/> :  <div className="row">
                        <div className="desktop-full feed-list">
                            <div className="loading tcenter">
                              <i className="phxico phx-spinner phx-spin"></i>
                            </div>
                          </div>
                      </div>
                  }
                      <FeedDetails feedDetails={this.state.feedDetails}/>
                      <div className="row">
                          <FeedErrorConditions feedDetails={this.state.feedDetails} />
                          <FeedContentViewer feedXMLData={this.state.feedXMLData} feedDetails={this.state.feedDetails}/>
                      </div>
                      <MarketDetailSummaryModal data={this.state.summaryDetails} {...this.props}/>
                </div>
              </div>
          </div>
        </div>
        );
    }
    else return null;
    
  }
}

function mapStateToProps(state) {
    return {
        event: state.eventCreatorEvent,
        feedHistory : state.feedHistory,
        modals: state.modals,
        isFetchingFeedHistoryFeeds : state.feedHistory.isFetchingFeedHistoryFeeds,
        isFetchingFeedHistoryFeedXML : state.feedHistory.isFetchingFeedHistoryFeedXML,

    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({ 
      closeModal, 
      openModal,
      fetchFeedHistoryFeeds,
      fetchFeedHistoryFeedXML
    }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(FeedsContainer);
