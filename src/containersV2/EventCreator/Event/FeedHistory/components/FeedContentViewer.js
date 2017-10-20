import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import SyntaxHighlighter from 'react-syntax-highlighter';
import { vs } from 'react-syntax-highlighter/dist/styles';
import beautify from 'xml-formatter';
import _ from 'underscore';

let FeedContentViewer = (props) => {
  let {feedXMLData, feedDetails, isFetchingFeedHistoryFeedXML} = props
	return <div className="desktop-half">
        <div className="form-wrapper feed-content">
            <h4 className="">Content <button onClick={()=> {
                const url = `/rest/events/feeds/${feedDetails.feedId}/download?token=${localStorage.MIFY_U_TOKEN}`;
                window.open(url, '_blank')
            }} className="dl-button fright" disabled={_.isEmpty(feedXMLData)}>Download</button></h4>
            <div className="clearfix">
                {!_.isEmpty(feedXMLData) ? <SyntaxHighlighter language='xml' style={vs}>{ beautify(feedXMLData.content, {indentation: '  '}) }</SyntaxHighlighter> : null }
            </div>
        </div>
    </div>
}


function mapStateToProps(state) {
    return {
        isFetchingFeedHistoryFeedXML : state.feedHistory.isFetchingFeedHistoryFeedXML,
    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({ 
    }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(FeedContentViewer);
