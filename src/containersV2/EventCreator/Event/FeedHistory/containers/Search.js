import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { updateSearchStr } from '../actions';
import { DUMMY_ID } from '../constants';
import {fetchFeedHistoryFeeds, fetchFeedHistoryFeedXML} from '../actions';

const mapStateToProps = (state, ownProps) => {
    return {
        isFetchingEPT: state.sportsTree.isFetchingEPT,
        searchStr: state.sportsTree.searchStr,
        isCreatingNewPath: !!state.sportsTree.pathsMap[DUMMY_ID],
        event: state.eventCreatorEvent.event,
        isFetchingFeedHistoryFeeds : state.feedHistory.isFetchingFeedHistoryFeeds,
    };
};

const mapDispatchToProps = (dispatch, ownProps) => {
    return bindActionCreators({fetchFeedHistoryFeeds}, dispatch);
};

class Search extends React.Component {
    constructor (props) {
        super(props);
        this._onClear = this._onClear.bind(this);
        this.state = {value: ''}
    }
    _onClear () {
        let {event, isFetchingFeedHistoryFeeds} = this.props;
        this.setState({value: ''});
        if (this.props.searchStr) {
            this.props.fetchFeedHistoryFeeds(event.id, this.props.searchStr)
        }
        else
            this.props.fetchFeedHistoryFeeds(event.id)
            
        this.searchInput.focus();
    }
    render () {
        let { isFetchingFeedHistoryFeeds, searchStr, fetchFeedHistoryFeeds, isCreatingNewPath } = this.props;
        let { value } = this.state;
        let {event} = this.props;
        return <div className="path-search-container">
            <input
                type="text"
                disabled={false}
                placeholder="Search..."
                value={value}
                ref={e => this.searchInput = e}
                onChange={e => {
                    let value = e.target.value;
                    this.setState({value})
                    if (value.trim().length >= 2) {
                        fetchFeedHistoryFeeds(event.id, value)
                    }
                }}
            />
            <i onClick={this._onClear} className="phxico phx-close icon-xsmall icon"></i>
        </div>
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Search);