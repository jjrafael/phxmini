'use strict';
import React, { PropTypes } from "react";
// import ReactTable from 'react-table';
import Table from 'phxNewComponents/Table'
import * as TableColumns from 'eventCreatorOpponentsConstants/kitsTableColumns';

class KitsTable extends React.Component  {
    constructor(props) {
        super(props);
    }

    render() {
        const { rowDataList, onRowClickHandler, selectedRowId } = this.props;

        return (
          <div className="componentized">
            <Table
                className="-highlight -striped"
                showPageSizeOptions={false}
                showPagination={false}
                data={rowDataList}
                defaultPageSize={0}
                columns={TableColumns.kitsTableColumns}
                getTrProps={(state, rowInfo, column, instance) => {
                    let className = '';
                    if(rowInfo) {
                        className += ' clickable-rows';
                    }
                    if(selectedRowId && rowInfo && rowInfo.row.id === selectedRowId) {
                        className += ' selected-row-color';
                    }
                    return {
                        className,
                        onClick: e => {
                            if (onRowClickHandler && rowInfo) {
                                onRowClickHandler(rowInfo.row);
                            }
                        }
                    }
                }}/>
              </div>
        );
    }
};


KitsTable.propTypes = {
    rowDataList: PropTypes.array,
    onRowClickHandler: PropTypes.func,
    onAddButtonClickedHandler: PropTypes.func,
    onEditButtonClickedHandler: PropTypes.func,
    onDeleteButtonClickedHandler: PropTypes.func,
};


KitsTable.defaultProps = {
    rowDataList: [],
    onRowClickHandler: null,
    onAddButtonClickedHandler: null,
    onEditButtonClickedHandler: null,
    onDeleteButtonClickedHandler: null,
};


export default KitsTable;
