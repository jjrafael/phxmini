'use strict';
import React, {
  PropTypes
} from "react";
import cx from 'classnames';
import ReactTable from 'react-table';
import CustomPagination from './customPagination';

class Table extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <ReactTable
        PaginationComponent={CustomPagination}
        {...this.props}
      />
    )
  }
}

export default Table;
