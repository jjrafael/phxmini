import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import moment from 'moment';
import { history } from "../../../../../store.js";

import ModalWindow from 'components/modal';
import _ from 'underscore';
import {fetchFeedHistoryFeeds} from '../actions';

import FeedsContainer from './FeedsContainer';
import ScrollTable from 'phxV2Components/ScrollTable/';
import { closeModal, openModal } from 'actions/modal';
import { parseFeedHistoryFeedImportXML, processFeedHistoryFeedImportXML } from '../actions';
import ModalLoader from 'phxV2Components/ModalLoader/';
import ViewXMLModalContainer from './ViewXMLModalContainer';

class ImportFeedsModalContainer extends React.Component {
  constructor(props) {
    super(props);
    this._handleSelectRow = this._handleSelectRow.bind(this);
    this._handleProcessImportXML = this._handleProcessImportXML.bind(this);
    this._handleProcessImportXML = this._handleProcessImportXML.bind(this);
    this._handleCheckAll = this._handleCheckAll.bind(this);
    this._handleCheck = this._handleCheck.bind(this);

    this.state = {
        feedDetails : {},
        isDisabledCheckAllC : true,
        isDisabledCheckAllU : true,
        isDisabledCheckAllD : true,
        isCheckAllC : false,
        isCheckAllU : false,
        isCheckAllD : false,
        selectedForImport : [],
    }
  }

  _handleSelectRow(feedData){
      this.setState({feedDetails : feedData, selectedForImport: feedData})
      
  }

  _handleProcessImportXML(data) {
      let {processFeedHistoryFeedImportXML} = this.props;
      processFeedHistoryFeedImportXML(data);
  }

  _handleViewEvent(event) {

      const date = moment(event.eventTime).format("MM/DD/YYYY");
      const customDate = `${date} - ${date}`;
      this.props.closeModal('importFeedHistory');
      history.push(`event-creator/${event.sportCode.toLowerCase()}/e${event.eventId}?dateFilter=${encodeURI(customDate)}`);
  }

  _handleCheckAll(e, checkboxes) {
      let { parsedFeedXMLData } = this.props
      let cbs = document.querySelectorAll(checkboxes);
      let selectedForImport = [];
      if(e.target.checked)
      {
        cbs.forEach(cb => {
          cb.checked = true; 
          selectedForImport.push(parsedFeedXMLData.contents[_.findLastIndex(parsedFeedXMLData.contents, {fileId : cb.getAttribute("data-fileid")})])
        })
      }
      else  {
        cbs.forEach(cb => {
            cb.checked = false
            selectedForImport.pop(selectedForImport[_.findLastIndex(selectedForImport, {fileId : cb.getAttribute("data-fileid")})])
         })        
      }

      this.setState({selectedForImport : selectedForImport})
  }

  _handleCheck(e) {
      let { parsedFeedXMLData } = this.props;
      let selectedForImport = [];
      let el = e.target;
      if(e.target.checked)
      {
        selectedForImport.push(parsedFeedXMLData.contents[_.findLastIndex(parsedFeedXMLData.contents, {fileId : e.target.getAttribute("data-fileid")})])
      }
      else  {
        selectedForImport.pop(selectedForImport[_.findLastIndex(selectedForImport, {fileId : e.target.getAttribute("data-fileid")})])
      }

      this.setState({selectedForImport : selectedForImport})
  }

  componentDidUpdate(prevProps, prevState){
    let { parsedFeedXMLData } = this.props;
    let selectedForImport = [];
    if((prevProps.isProcessingFeedHistoryFeedXML && this.props.isProcessingFeedHistoryFeedXML === false) || (prevProps.isParsingFeedHistoryFeedXML && this.props.isParsingFeedHistoryFeedXML === false)){
      if(!_.isEmpty(parsedFeedXMLData)){
        let parsedData = parsedFeedXMLData.contents.length ? parsedFeedXMLData.contents[0] : {};

        if(parsedFeedXMLData.contents.length) {
          parsedFeedXMLData.contents.forEach(data => {
            setTimeout(() => {
              if(parsedData.eventId <= 0 && parsedData.processResult === "OK") {
                document.querySelectorAll('#checkAllC')[0].checked = true;
                this.setState({isDisabledCheckAllC : false});
                selectedForImport.push(data)
              }
              else {
                document.querySelectorAll('#checkAllC')[0].checked = false;
                this.setState({isDisabledCheckAllC : true});
              }

              if(parsedData.eventId >= 1) {
                document.querySelectorAll('#checkAllU')[0].checked = true;
                this.setState({isDisabledCheckAllU : false});
                selectedForImport.push(data)
              }
              else {
                document.querySelectorAll('#checkAllU')[0].checked = false;
                this.setState({isDisabledCheckAllU : true});
              }

              if(parsedData.eventId < 1 && parsedData.processResult === "EVENT_DELETED") {
                // document.querySelectorAll('#checkAllD')[0].checked = true;
                this.setState({isDisabledCheckAllD : false})
              }
              else {
                document.querySelectorAll('#checkAllD')[0].checked = false;
                this.setState({isDisabledCheckAllU : true});
              }
            })
          })
          this.setState({selectedForImport : selectedForImport})
        }
      } 
     
    }
   
  }

  render() {
        let {closeModal, openModal, parsedFileDetails, parsedFeedXMLData, fileToProcess,  isParsingFeedHistoryFeedXML, isProcessingFeedHistoryFeedXML} = this.props;
        let parsedData = {};
        let processedData = {};
        let disableViewEventBtn =  true;
        let feedData = {
          contents : []
        };

        let TableConfig = [{
            data : null,
            width: "5%",
            headerRender : (data) => {
                return <label><input type="checkbox" disabled={this.state.isDisabledCheckAllC} onChange={(e)=> this._handleCheckAll(e, ".checkC")} id="checkAllC"/> C</label>
            },
            render : (data) => {
                return (data.eventId < 1 && data.processResult === "OK") ? <label><input type="checkbox" className="checkC" data-fileId={data.fileId} defaultChecked={true} onChange={this._handleCheck}/> </label> : <label>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</label>;
            }
        }, {
            data : "null",
            width: "5%",
            headerRender : (data) => {
                return <label><input type="checkbox" disabled={this.state.isDisabledCheckAllU} onChange={(e)=> this._handleCheckAll(e, ".checkU")} id="checkAllU"/> U</label>
            },
            render : (data) => {
                return (data.eventId > 1 && data.processResult === "OK") ? <label><input type="checkbox" className="checkU" data-fileId={data.fileId} defaultChecked={true}  onChange={this._handleCheck}/> </label> : <label>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</label>;
            }
        }, {
            data : "null",
            width: "5%",
            headerRender : (data) => {
                return <label><input type="checkbox" disabled={this.state.isDisabledCheckAllD} onChange={(e)=> this._handleCheckAll(e, ".checkD")} id="checkAllD"/> D</label>
            },
            render : (data) => {
            
                return (data.eventId < 1 && data.processResult === "EVENT_DELETED") ? <label>{data.queueType === "ERROR" ? <span className="phx-ico phx-close" />: null}<input type="checkbox" className="checkD" data-fileId={data.fileId} defaultChecked={false} onChange={this._handleCheck}/> </label> : <label>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</label>;
            }
        }, {
            title : "Event",
            data : "eventDescription",
            width: "30%",
            render : (data) => {
                return <span><span className={`path-icon--event phxico phx-${data.eventTypeId === 1 ? 'game-event':'rank-event' }`} style={{color:'#FFF', fontSize:12, padding:2}}/> {data.eventDescription}</span>
            }
        }, {
            title : "Event Start",
            data : "eventTime",
            width: "15%"
        }, {
            title : "Feed Code",
            data : "feedCode",
            width: "10%"
        }, {
            title : "Event Path",
            data : "parentEventPathDescription",
            width: "15%"
        }, {
            title : "Sport",
            data : "sportCode",
            width: "10%",
            render : (data) => {
              return <span><span className={`sports-ico-${data.sportCode}`} /> {data.sportDescription}</span>
            }
        }
      ];

      if(!_.isEmpty(parsedFeedXMLData) && isParsingFeedHistoryFeedXML === false){
        parsedData = parsedFeedXMLData.contents.length ? parsedFeedXMLData.contents[0] : {};
        feedData = parsedFeedXMLData;
        if(!parsedData.hasOwnProperty('eventId') || parsedData.eventId < 1)
          disableViewEventBtn = true;
        else 
          disableViewEventBtn = false;
      }

      // if(!_.isEmpty(processedFeedXMLData) && isProcessingFeedHistoryFeedXML === false){
      //   processedData = processedFeedXMLData.contents.length ? processedFeedXMLData.contents[0] : {};
      //   feedData = processedFeedXMLData;
      //   if(!processedData.hasOwnProperty('eventId') || processedData.eventId < 1)
      //     disableViewEventBtn = true;
      //   else 
      //     disableViewEventBtn = false;
      // }

      if(!_.isEmpty(feedData) && ( isParsingFeedHistoryFeedXML === false || isProcessingFeedHistoryFeedXML === false))
      {
        let queueType = feedData.contents.length ? feedData.contents[0].queueType : {};
        if((queueType === "ERROR" || queueType === "PROCESSED")){
          if(!_.isEmpty(queueType)) {
            TableConfig.unshift({
              data : null,
              class : "tcenter",
              width: "5%",
              render : (data) => {
                  return <label style={{margin:0}}>{data.queueType === "ERROR" ? <span className="phx-ico phx-alert-circle text-warning" /> : data.queueType === "PROCESSED" ? <span className="phx-ico phx-check text-success" /> : null} </label>;
              }
            });
          }else {
             TableConfig.shift();
          }
        }
        // if(feedData.contents.length){
        //       TableConfig.unshift({
        //         data : null,
        //         width: "5%",
        //         render : (data) => {
        //             return <label>{data.queueType === "ERROR" ? <span className="phx-ico phx-alert-circle text-warning" /> : data.queueType === "PROCESSED" ? <span className="phx-ico phx-check text-success" /> : null} </label>;
        //         }
        //       });
        // }else{
        //     TableConfig.shift();
        // }
      }

      return (
          <ModalWindow
              className="large feed-history-modal"
              key={'importFeedHistory'}
              title="Feed History"
              closeButton={false}
              name="importFeedHistory"
              isVisibleOn={this.props.modals.importFeedHistory}
              shouldCloseOnOverlayClick={false}>
              <div>
                <div className="form-wrapper no-border">
                  <h4 className="modal-title">
                      {parsedFileDetails.name}
                  </h4>
                  <div className="row">
                      <div className="desktop-full feed-title">
                          <div className="desktop-half">
                                  <h5>{parsedFileDetails.name}</h5>
                                  <h3>Manual Import</h3>       
                          </div>
                          <div className="desktop-half">
                              <div className="fright">
                                  <button  disabled={!this.state.selectedForImport.length} onClick={(e) => {this._handleProcessImportXML(fileToProcess)}}>
                                      Import {this.state.selectedForImport.length ? this.state.selectedForImport.length : null} Event
                                  </button>
                              </div>
                          </div>
                      </div>
                  </div>
                  <div className="row">
                    <div className="desktop-full feed-list modal-content">
                      {
                        isParsingFeedHistoryFeedXML === false ? <ScrollTable headers={TableConfig} data={feedData.contents} onRowClick={this._handleSelectRow} selectedRow={this.state.feedDetails} selectRow={true} isLoading={isProcessingFeedHistoryFeedXML || isParsingFeedHistoryFeedXML}/> : <div className="loading tcenter">
                              <i className="phxico phx-spinner phx-spin"></i>
                            </div>
                      }
                      {
                        isProcessingFeedHistoryFeedXML ? <ModalLoader /> : null
                      }
                      <ViewXMLModalContainer feedDetails={this.state.feedDetails}/>
                    </div>
                  </div>
                </div>
                <div className="button-group modal-controls">
                  <button type="button" disabled={!this.state.selectedForImport.length} onClick={() => {
                      openModal('importViewXML')
                  }}>View XML</button>
                  <button type="button" disabled={disableViewEventBtn} onClick={()=> {
                    let event = !_.isEmpty(processedData) ? processedData : parsedData;
                    this._handleViewEvent(event);
                  }}>View Event</button>
                  <button type="button" onClick={(e)=> {
                    document.getElementById('importXML').click();
                  }}>Select File</button>
                  <button className="" onClick={() => {
                      document.getElementById('importXML').value= null;
                      closeModal('importFeedHistory')
                  }}>
                      Close
                  </button>
                </div>
              </div>
          </ModalWindow>
      );
  }
}



function mapStateToProps(state) {
    const {
      parseFeedHistoryFeedImportXML,
      isParsingFeedHistoryFeedXML,
      isProcessingFeedHistoryFeedXML,
      parsedFeedXMLData
    } = state.feedHistory;
    return {
        event: state.eventCreatorEvent,
        feedHistory : state.feedHistory,
        modals: state.modals,
        parseFeedHistoryFeedImportXML,
        isParsingFeedHistoryFeedXML,
        parsedFeedXMLData,
        isProcessingFeedHistoryFeedXML
    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({ 
      closeModal, 
      openModal, 
      processFeedHistoryFeedImportXML,
    }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(ImportFeedsModalContainer);