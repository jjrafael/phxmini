import React from 'react';
import ModalWindow from 'components/modal';
import _ from 'lodash';
import {formatNumber} from 'utils';
const chunkArray = (arr,n) => {
     var chunkLength = Math.max(arr.length/n ,1);
     var chunks = [];
     for (var i = 0; i < n; i++) {
     	 if(i == 0 ){
         	chunks.push(arr.slice( 0, (chunkLength % 1 !== 0 ? chunkLength+1 : chunkLength)));
     	 }
     	 else {
         	chunks.push(arr.slice( ((chunkLength % 1 !== 0 ? chunkLength+1 : chunkLength))*i, chunkLength*n));
     	 }
         // if(chunkLength*n <= arr.length) { // first chunk will always be greater in
         // 	chunks.push(arr.slice( (chunkLength+1)*i, chunkLength*n));
         // }
         // if(chunkLength*(i+1) === arr.length) {
         // 	chunks.push(arr.slice( chunkLength*i, chunkLength*(i+1)));
         // }
     }
     return chunks; 
 }
const ModalMarketDetailSummary = (props) => {
	if(!_.isEmpty(props.data)) {
	    const {data} = props;
	    const {feedPeriodMarketDetails, opponentDesc1, opponentDesc2, score1, score2} = data.feedMarketDetailsSummaryResponse
	    return <ModalWindow className="large feed-history-modal"
	      key={`feedPopup`}
	      title={`${opponentDesc1} ${score1} - ${score2} ${opponentDesc2}`}
	      closeButton={true}
	      name={`feedPopup`}
	      isVisibleOn={props.modals['feedPopup']}
	      onClose={()=>{ 
	      		props.closeModal('feedPopup')
	  	  }}>
	      <div>
	        <div className="form-wrapper no-border">
	          <h4 className="modal-title">
	              {`${opponentDesc1} ${score1} - ${score2} ${opponentDesc2}`}
	          </h4>
	          <div className="row">
	            <div className="desktop-full feed-list modal-content">
	                <div className="desktop-full">
	                    <div className="padding-medium">
	                      {
	                        !_.isEmpty(feedPeriodMarketDetails) ? _.map(feedPeriodMarketDetails/*_.sortBy(feedPeriodMarketDetails, "periodDescription")*/, (periodMarketDetail) => {
	                            return <fieldset>
	                                <legend>{periodMarketDetail.periodDescription}</legend>
	                                <div className="desktop-full">
	                                 {
	                                    _.has(periodMarketDetail, 'feedLiveMarketDetails') && !_.isEmpty(periodMarketDetail.feedLiveMarketDetails) ? chunkArray(periodMarketDetail.feedLiveMarketDetails, 2).map(liveMarkets => {
	                                        return <div className="desktop-half"> 
	                                            <table className="no-border">
	                                                <tbody>
	                                                {
	                                                    liveMarkets.map((liveMarket)=>{
	                                                    // if(_.has(liveMarket, 'feedOutcomeDetails') && !_.isEmpty(liveMarket.feedOutcomeDetails) ) {
	                                                        const under = {...liveMarket.feedOutcomeDetails[0]};
	                                                        const over = {...liveMarket.feedOutcomeDetails[1]};
	                                                    // }
	                                                        return _.has(liveMarket, 'feedOutcomeDetails') && !_.isEmpty(liveMarket.feedOutcomeDetails) ?  <tr className={liveMarket.marketStatus.toLowerCase()}>
	                                                            <td style={{width:"230px",maxWidth:230}} title={`${liveMarket.marketDescription}`}><span className={`phx-icon phx-${liveMarket.marketStatus.toLowerCase()} text-${liveMarket.marketStatus.toLowerCase()}`} /> <span className="strong">{liveMarket.marketDescription}</span></td>
	                                                            <td style={{width:"100px",maxWidth:100}}>{`${liveMarket.marginPercent}`}</td>
	                                                            <td style={{width:"50px",maxWidth:50}} title={`${under.price} ${under.description}`}><span className={under.price > over.price ? "greater" : under.price < over.price ? "lower" : ""}>{under.price.toFixed(2)}</span></td>
	                                                            <td style={{width:"150px",maxWidth:150}}>{`${under.description}`}</td>
	                                                            <td style={{width:"50px",maxWidth:50}} title={`${over.price} ${over.description}`}><span className={over.price > under.price ? "greater" : over.price < under.price ? "lower" : ""}>{over.price.toFixed(2)}</span></td>
	                                                            <td style={{width:"150px",maxWidth:150}}>{`${over.description}`}</td>
	                                                        </tr> : <tr className={liveMarket.marketStatus.toLowerCase()}>
	                                                            <td style={{width:"230px",maxWidth:230}}><span className={`phx-icon phx-${liveMarket.marketStatus.toLowerCase()} text-${liveMarket.marketStatus.toLowerCase()}`} /> <span className="strong">{liveMarket.marketDescription}</span></td>
	                                                            <td style={{width:"100px",maxWidth:100}}>{`${liveMarket.margin ? liveMarket.margin : ''}`}</td>
	                                                            <td style={{width:"50px",maxWidth:50}}></td>
	                                                            <td style={{width:"150px",maxWidth:150}}></td>
	                                                            <td style={{width:"50px",maxWidth:50}}></td>
	                                                            <td style={{width:"150px",maxWidth:150}}></td>
	                                                        </tr>
	                                                    }) 
	                                                }
	                                                </tbody>
	                                            </table>
	                                        </div>
	                                    }) : null
	                                 }
	                                </div>
	                              </fieldset>
	                        } ) : null
	                      }
	                    </div>
	                </div>
	            </div>
	          </div>
	        </div>
	      </div>
	    </ModalWindow>
	}
	else {
		return <ModalWindow className="large feed-history-modal"
	      key={`feedPopup`}
	      title={"Feed Summary Details"}
	      closeButton={true}
	      name={`feedPopup`}
	      isVisibleOn={props.modals['feedPopup']}
	      onClose={()=>{ props.closeModal('feedPopup')}}>
	      <div>
	        <div className="form-wrapper no-border">
	          <h4 className="modal-title">
	          &nbsp;
	          </h4>
	          <div className="row">
	            <div className="desktop-full feed-list modal-content">
	                <div className="desktop-full">
	                   - No Data -
	                </div>
	            </div>
	          </div>
	        </div>
	      </div>
	    </ModalWindow>
	}
}

export default ModalMarketDetailSummary;