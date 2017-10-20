import React from "react";
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import ReactTable from 'react-table';
import { getAccountsColumns, getFilteredAccounts } from '../helpers';
import LoadingIndicator from 'components/loadingIndicator';
import { fetchInitialData, fetchSubsequentData, removeScrollTop } from '../actions';

const mapStateToProps = (state) => {
  return {
    accounts: state.instantAction.tablesData.accounts,
    locked: state.instantAction.locks.accounts,
    headersPreferences: state.instantAction.headersPreferences.accounts,
    origins: state.instantAction.origins,
    channels: state.instantAction.channels,
    lastKey: state.instantAction.lastKeys.accounts,
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

class Accounts extends React.Component {
  constructor(props) {
    super(props);
    this._fetchSubsequentData = this._fetchSubsequentData.bind(this);
  }

  componentWillMount() {
    const { accounts, brandFilter, origins, channels, fetchInitialData, fetchSubsequentData } = this.props;
    if (origins[0] && channels[0]) {
      fetchInitialData('accounts');
      this.timer = setInterval(() => {
        this._fetchSubsequentData();
      }, 3000);
    }

    if (accounts) {
      this.filteredAccounts = getFilteredAccounts(accounts, brandFilter);
    }
  }

  componentWillReceiveProps(nextProps) {
    const { accounts, brandFilter, origins, channels, fetchInitialData, fetchSubsequentData, scrollTop, removeScrollTop } = nextProps;
    if (!this.timer) {
      if (origins[0] && channels[0]) {
        fetchInitialData('accounts');
        this.timer = setInterval(() => {
          this._fetchSubsequentData();
        }, 3000);
      }
    }

    if (accounts) {
      this.filteredAccounts = getFilteredAccounts(accounts, brandFilter);
    }

    if (scrollTop) {
      if (accounts.length > this.props.accounts.length) {
        const tableBody = document.querySelector('.accounts-table .rt-tbody');
        tableBody.scrollTop = 0;
        removeScrollTop();
      }
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.locked) {
      if (this.props.accounts && prevProps.accounts) {
        if (this.props.accounts.length !== prevProps.accounts.length) {
          const tableBody = document.querySelector('.accounts-table .rt-tbody');
          tableBody.scrollTop = tableBody.scrollTop + (this.props.accounts.length - prevProps.accounts.length) * 60;
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
    if (lastKey) fetchSubsequentData('accounts', lastKey);
  }

  render() {
    const accounts = this.filteredAccounts && [...this.filteredAccounts].reverse();
    return (
      <div>
        {!accounts && <LoadingIndicator />}
        {accounts &&
          <ReactTable
            className="table accounts-table"
            defaultPageSize={20}
            pageSizeOptions={[10, 20, 25, 50, 100]}
            data={accounts}
            columns={getAccountsColumns(this.props.headersPreferences)}
            showPageSizeOptions={true}
            showPagination={true}
            minRows={0}
            noDataText="There are no accounts"
          />}
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Accounts);