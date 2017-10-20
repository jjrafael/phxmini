import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import ScrollTable from 'phxV2Components/ScrollTable/';
// import Popover from 'phxV2Components/Popover/';
import ModalWindow from 'components/modal';
import { closeModal, openModal } from 'actions/modal';
import _ from 'lodash';



let FeedTable = (props) => {
	let {feedHistory, onRowClick, feedDetails} = props;
	let {feedItemTotal, feedItems, queueTypeCounts, isFetchingFeedHistoryFeeds} = feedHistory.feeds;
   
    let TableConfig = [{
            title : "",
            data : null,
            width: "2%",
            class:"tcenter",
            render : (data) => {
                return data.queueItemType === "PROCESSED" ? <i className="phxico phx-check text-success" /> : data.queueItemType === "ERROR" ? <i className="phxico phx-alert-circle text-error" /> : data.queueItemType === "WARNING" ? <i className="phxico phx-alert text-yellow" /> : data.queueItemType === "INCOMING" ? <i className="phxico phx-rss text-warning" /> : data.queueItemType === "SYNC" ? <i className="phxico phx-sync text-success" /> : null;
            }
        }, {
            title : "Created",
            data : "dateCreated",
            width: "10%"
        }, {
            title : "Processed",
            data : "dateProcessed",
            width: "10%"
        }, {
            title : "File ID",
            data : "fileId",
            width: "48%"
        }, {
            title : "Imported By",
            data : "importer",
            width: "30%"
        }
    ];

    if(feedHistory.feeds.hasOwnProperty('hasExtra') && feedHistory.feeds.hasExtra === true) {
        TableConfig = [{
            title : "",
            data : null,
            width: "3%",
            class:"tcenter",
            render : (data) => {
                return data.queueItemType === "PROCESSED" ? <i className="phxico phx-check text-success" /> : data.queueItemType === "ERROR" ? <i className="phxico phx-alert-circle text-error" /> : data.queueItemType === "WARNING" ? <i className="phxico phx-alert text-yellow" /> : data.queueItemType === "INCOMING" ? <i className="phxico phx-rss text-warning" /> : data.queueItemType === "SYNC" ? <i className="phxico phx-sync text-success" /> : null;
            }
        }, {
            title : "Created",
            data : "dateCreated",
            width: "8%"
        }, {
            title : "Processed",
            data : "dateProcessed",
            width: "8%"
        }, {
            title : "File ID",
            data : "fileId",
            width: "25%"
        }, {
            title : "Imported By",
            data : "importer",
            width: "9%"
        },
        {
            title : "#",
            data : null,
            class:"tcenter",
            width: "3%",
            render : (data) => {
                return typeof data.feedItemSummaryResponse !== "undefined" && data.feedItemSummaryResponse.hasOwnProperty('messageNumber') ? data.feedItemSummaryResponse.messageNumber : null;
            }
        }, {
            title : "Type",
            data : "feedItemSummaryResponse",
            class:"tcenter",
            width: "10%",
            render : (data) => {
                let {feedMarketDetailsSummaryResponse, feedItemSummaryResponse} = data;
                return <span >
                    {
                        (_.has(data, "feedItemSummaryResponse") && _.has(feedMarketDetailsSummaryResponse, "marketCounts")) ? <a onClick={(_.has(feedMarketDetailsSummaryResponse, "feedPeriodMarketDetails") && !_.isEmpty(feedMarketDetailsSummaryResponse.feedPeriodMarketDetails) ) ? () => { props.handleSummaryDetail(data) } : null}>
                            {_.has(data, "feedItemSummaryResponse") ? feedItemSummaryResponse.status : "" } &nbsp;&nbsp; 
                            <div className="exponential-div"> 
                                {
                                    _.has(feedMarketDetailsSummaryResponse, "marketCounts") && !_.isEmpty(feedMarketDetailsSummaryResponse.marketCounts)  ? _.map(feedMarketDetailsSummaryResponse.marketCounts, (count, market) => {
                                       return <span>
                                        {count}<span className={`phx-icon phx-${market.toLowerCase()}`} /> 
                                    </span> 
                                    }) : null
                                }
                            </div>
                        </a> : null
                    }
                </span>;
            }
        }, {
            title : "Time",
            data : null,
            class:"tcenter",
            width: "5%",
            render : (data) => {
                return typeof data.feedItemSummaryResponse !== "undefined" && data.feedItemSummaryResponse.hasOwnProperty('time') ? data.feedItemSummaryResponse.time : null;
            }
        }, {
            title : "Score",
            data : null,
            class:"tcenter",
            width: "5%",
            render : (data) => {
                return typeof data.feedItemSummaryResponse !== "undefined" && data.feedItemSummaryResponse.hasOwnProperty('score') ? data.feedItemSummaryResponse.score : null;
            }
        }, {
            title : "Period",
            data : null,
            width: "15%",
            render : (data) => {
                let clockStatus = typeof data.feedItemSummaryResponse !== "undefined" && data.feedItemSummaryResponse.hasOwnProperty('clockStatus') ? data.feedItemSummaryResponse.clockStatus : "";
                return typeof data.feedItemSummaryResponse !== "undefined" && data.feedItemSummaryResponse.hasOwnProperty('period') ? <span><span  className={`phx-ico phx-${clockStatus === "NOT_STARTED" ? "clock-alert" : clockStatus === "STARTED" ? "clock-start" : clockStatus === "PAUSED" ? "pause" : clockStatus === "END_OF_PERIOD" ? "clock-out" :clockStatus === "END_OF_EVENT" ? "clock-end" : "" }`} />{data.feedItemSummaryResponse.period}</span> : null;
            }
        }, {
            title : "",
            data : null,
            class:"tcenter",
            width: "3%",
            headerRender : (data) => {
                return <span className="phx-ico phx-cash text-success"/>
            },
            render : (data) => {
                return typeof data.feedItemSummaryResponse !== "undefined" && data.feedItemSummaryResponse.hasOwnProperty('bettingStatus') && data.feedItemSummaryResponse.bettingStatus ? <span className="phx-ico phx-check text-success ico-circle" /> : <span className="phx-ico phx-minus-circle text-error" />;
            }
        }];
    }


	return <div className="row">
        	<div className="desktop-full feed-list">
                <ScrollTable headers={TableConfig} data={feedItems.length ? feedItems : []} onRowClick={onRowClick} selectedRow={feedDetails} selectRow={true} isLoading={isFetchingFeedHistoryFeeds}/>
                    <table className="feed-table">
                        <tfoot> 
                            <tr>
                                <td colSpan={4}>
                                    <ul>
                                        <li className="total">{feedItemTotal}</li>
                                        <li>Files</li>
                                    </ul>
                                </td>
                                <td colSpan={8}>
                                    <ul className="fright">
                                        <li>
                                            <ul>
                                                <li>Incoming:</li>
                                                <li className={`${queueTypeCounts.hasOwnProperty('INCOMING') && queueTypeCounts.INCOMING ? "queue queue-incoming" : ""}`}>{queueTypeCounts.hasOwnProperty('INCOMING') ? queueTypeCounts.INCOMING : 0}</li>
                                            </ul>
                                        </li>
                                        <li>
                                            <ul>
                                                <li>processed:</li>
                                                <li className={`${queueTypeCounts.hasOwnProperty('PROCESSED') && queueTypeCounts.PROCESSED ? "queue queue-processed" : ""}`}>{queueTypeCounts.hasOwnProperty('PROCESSED') ? queueTypeCounts.PROCESSED : 0}</li>
                                            </ul>
                                        </li>
                                        <li>
                                            <ul>
                                                <li>warning:</li>
                                                <li className={`${queueTypeCounts.hasOwnProperty('WARNING') && queueTypeCounts.WARNING ? "queue queue-warning" : ""}`}>{queueTypeCounts.hasOwnProperty('WARNING') ? queueTypeCounts.WARNING : 0}</li>
                                            </ul>
                                        </li>
                                        <li>
                                            <ul>
                                                <li>error:</li>
                                                <li className={`${queueTypeCounts.hasOwnProperty('ERROR') && queueTypeCounts.ERROR ? "queue queue-error" : ""}`}>{queueTypeCounts.hasOwnProperty('ERROR') ? queueTypeCounts.ERROR : 0}</li>
                                            </ul>
                                        </li>
                                    </ul>
                                </td>
                            </tr>
                        </tfoot>
                    </table>
        	</div>
        </div>
}

function mapStateToProps(state) {
    return {
        event: state.eventCreatorEvent,
        feedHistory : state.feedHistory,
        modals: state.modals,
    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({ 
     closeModal, openModal
    }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(FeedTable);