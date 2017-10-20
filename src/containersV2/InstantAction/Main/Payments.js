import React from "react";
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import ReactTable from 'react-table';
import { getPaymentColumns, getFilteredPayments } from '../helpers';
import LoadingIndicator from 'components/loadingIndicator';
import { fetchInitialData, fetchSubsequentData, removeScrollTop } from '../actions';

const mapStateToProps = (state) => {
  return {
    payments: state.instantAction.tablesData.payments,
    locked: state.instantAction.locks.payment,
    headersPreferences: state.instantAction.headersPreferences.payments,
    lastKey: state.instantAction.lastKeys.payments,
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

class Payments extends React.Component {
  constructor(props) {
    super(props);
    this._fetchSubsequentData = this._fetchSubsequentData.bind(this);
  }

  componentWillMount() {
    const { payments, brandFilter, fetchInitialData, fetchSubsequentData } = this.props;
    fetchInitialData('payments');
    this.timer = setInterval(() => {
      this._fetchSubsequentData();
    }, 3000);

    if (payments) {
      this.filteredPayments = getFilteredPayments(payments, brandFilter);
    }
  }

  componentWillReceiveProps(nextProps) {
    const { payments, brandFilter, fetchInitialData, fetchSubsequentData, removeScrollTop, scrollTop } = nextProps;
    if (!this.timer) {
      fetchInitialData('payments');
      this.timer = setInterval(() => {
        this._fetchSubsequentData();
      }, 3000);
    }

    if (payments) {
      this.filteredPayments = getFilteredPayments(payments, brandFilter);
    }

    if (scrollTop) {
      if (payments.length > this.props.payments.length) {
        const tableBody = document.querySelector('.payments-table .rt-tbody');
        tableBody.scrollTop = 0;
        removeScrollTop();
      }
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.locked) {
      if (this.props.payments && prevProps.payments) {
        if (this.props.payments.length !== prevProps.payments.length) {
          const tableBody = document.querySelector('.payments-table .rt-tbody');
          tableBody.scrollTop = tableBody.scrollTop + (this.props.payments.length - prevProps.payments.length) * 60;
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
    if (lastKey) fetchSubsequentData('payments', lastKey);
  }

  render() {
    const payments = this.filteredPayments && [...this.filteredPayments].reverse();
    return (
      <div>
        {!payments && <LoadingIndicator />}
        {payments &&
          <ReactTable
            className="table payments-table"
            defaultPageSize={20}
            pageSizeOptions={[10, 20, 25, 50, 100]}
            data={payments}
            columns={getPaymentColumns(this.props.headersPreferences)}
            showPageSizeOptions={true}
            showPagination={true}
            minRows={0}
            noDataText="There are no payments"
          />}
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Payments);