import React from "react";
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import ReactTable from 'react-table';
import { getFailedBetsColumns, getFilteredFailedBets } from '../helpers';
import LoadingIndicator from 'components/loadingIndicator';
import { fetchInitialData, fetchSubsequentData, removeScrollTop } from '../actions';

const mapStateToProps = (state) => {
  return {
    failedBets: state.instantAction.tablesData.failedBets,
    locked: state.instantAction.locks.failedBets,
    headersPreferences: state.instantAction.headersPreferences.failedBets,
    lastKey: state.instantAction.lastKeys.failedBets,
    brandFilter: state.instantAction.brandFilter,
    scrollTop: state.instantAction.scrollTop
  }
}

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({
    fetchInitialData,
    fetchSubsequentData,
    removeScrollTop
  }, dispatch);
};

class FailedBets extends React.Component {
  constructor(props) {
    super(props);
    this._fetchSubsequentData = this._fetchSubsequentData.bind(this);
  }

  componentWillMount() {
    const { failedBets, brandFilter, fetchInitialData, fetchSubsequentData } = this.props;
    fetchInitialData('failedBets');
    this.timer = setInterval(() => {
      this._fetchSubsequentData();
    }, 3000);

    if (failedBets) {
      this.filteredFailedBets = getFilteredFailedBets(failedBets, brandFilter);
    }
  }

  componentWillReceiveProps(nextProps) {
    const { failedBets, brandFilter, fetchInitialData, fetchSubsequentData, scrollTop, removeScrollTop } = nextProps;
    if (!this.timer) {
      fetchInitialData('failedBets');
      this.timer = setInterval(() => {
        this._fetchSubsequentData();
      }, 3000);
    }

    if (failedBets) {
      this.filteredFailedBets = getFilteredFailedBets(failedBets, brandFilter);
    }

    if (scrollTop) {
      if (failedBets.length > this.props.failedBets.length) {
        const tableBody = document.querySelector('.failed-bets-table .rt-tbody');
        tableBody.scrollTop = 0;
        removeScrollTop();
      }
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.locked) {
      if (this.props.failedBets && prevProps.failedBets) {
        if (this.props.failedBets.length !== prevProps.failedBets.length) {
          const tableBody = document.querySelector('.failed-bets-table .rt-tbody');
          tableBody.scrollTop = tableBody.scrollTop + (this.props.failedBets.length - prevProps.failedBets.length) * 60;
        }
      }
    }
  }

  componentWillUnmount() {
    clearInterval(this.timer);
    delete this.timer;
  }

  _fetchSubsequentData() {
    const { lastKey, fetchSubsequentData } = this.props;
    if (lastKey) fetchSubsequentData('failedBets', lastKey);
  }

  render() {
    const failedBets = this.filteredFailedBets && [...this.filteredFailedBets].reverse();
    return (
      <div>
        {!failedBets && <LoadingIndicator />}
        {failedBets &&
          <ReactTable
            className="table failed-bets-table"
            defaultPageSize={20}
            pageSizeOptions={[10, 20, 25, 50, 100]}
            data={failedBets}
            columns={getFailedBetsColumns(this.props.headersPreferences)}
            showPageSizeOptions={true}
            showPagination={true}
            minRows={0}
            noDataText="There are no failed bets"
          />}
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(FailedBets);