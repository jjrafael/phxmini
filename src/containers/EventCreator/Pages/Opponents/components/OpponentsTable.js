'use strict';
import React, { PropTypes } from "react";
import ReactDom from "react-dom";
// import ReactTable from 'react-table';
import { mapPermissionsToProps } from 'componentsV2/checkPermission/index';
import { permissionsCode } from 'containersV2/EventCreator/App/constants';
import Table from 'phxNewComponents/Table'
import * as TableColumns from 'eventCreatorOpponentsConstants/opponentsTableColumns';

class OpponentsTable extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            pageSize: null
        }
    }

    componentDidMount() {
        const tableContainerNode = ReactDom.findDOMNode(this._tableContainerNode);
        this._computeRowToDisplayFromContainerHeight();
    }

    componentDidUpdate(prevProps, prevState) {
        if(prevProps.rowDataList.length !== this.props.rowDataList.length) {
            this._computeRowToDisplayFromContainerHeight();
        }
    }

    _computeRowToDisplayFromContainerHeight() {
        const tableContainerNode = ReactDom.findDOMNode(this._tableContainerNode);
        this.setState({
            pageSize: (tableContainerNode.offsetHeight - 76) / 23
        });
    }

    render() {
        const { tag, rowDataList, onRowClickHandler, selectedRowId, noDataText, permissions } = this.props;
        return (
            <div
                className="opponents-table componentized"
                ref={node => {
                    if (node !== null) {
                      this._tableContainerNode = node;
                    }
                }}>
                <Table
                    className="-highlight -striped"
                    showPageSizeOptions={false}
                    data={rowDataList}
                    pageSize={this.state.pageSize}
                    defaultPageSize={this.state.pageSize}
                    columns={permissions.includes(permissionsCode.VIEW_EVENT_PATH_AND_OPPONENT_RATINGS)
                        ? TableColumns.opponentsTableColumns
                        : TableColumns.opponentsTableColumns.filter(column => column.header !== 'Grade' )}
                    noDataText={noDataText}
                    getTrProps={(state, rowInfo, column) => {
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
                                    onRowClickHandler(tag, rowInfo.row);
                                }
                            }
                        }
                    }}
                    />
            </div>
        );
    }
};

OpponentsTable.propTypes = {
    tag: PropTypes.string,
    rowDataList: PropTypes.array,
    onRowClickHandler: PropTypes.func,
};

OpponentsTable.defaultProps = {
    tag: 'oppTable',
    rowDataList: [],
    onRowClickHandler: null,
};

export default mapPermissionsToProps(OpponentsTable);
