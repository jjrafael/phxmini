import React, { PropTypes } from "react";
import filterTypes from '../../constants/filterTypes';
import riskDataConfig from '../../configs/riskDataConfig';
import { formatDateTimeString, objectToArray } from '../../utils';
import { connect } from 'react-redux';

class Header extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            resizingColumnDragStart: null,
            newColumnWidthOffset: null,
        }
    }

    shouldComponentUpdate(nextProps, nextState) {
        return false;
    }

    componentDidUpdate(prevProps, prevSDragtate) {
    }

    _renderResizeHandle(columnIndex) {
        const column = riskDataConfig.columns[columnIndex];
        return (
            <a draggable={true}
                className={`${column.desc} column-resizer`}
                onDragStart={(e)=> {
                    this.setState({
                        resizingColumnDragStart: e.pageX
                    });
                }}
                onDrag={(e)=> {
                    if(e.pageX !== 0 && e.pageX !== this.state.resizingColumnDragStart) {
                        this.setState({
                            newColumnWidthOffset: e.pageX - this.state.resizingColumnDragStart
                        });
                    }
                }}
                onDragEnd={(e)=> {
                    const columnWidth = typeof column.width === 'undefined' ? riskDataConfig.defaultColumnWidth : column.width;
                    riskDataConfig.setColumnWidth(column.desc, (parseInt(columnWidth) + this.state.newColumnWidthOffset) + 'px');
                    this.setState({
                        resizingColumnDragStart: null,
                        newColumnWidthOffset: null,
                    })
                    this.forceUpdate();
                    this.props.onColumnResize();
                }}/>
        )
    }

    _renderColumns() {
        const { widthToBeDistributed } = this.props;
        return this.props.columns.map((column, index)=> {
            let width = column.width || riskDataConfig.defaultColumnWidth;
            const isResizable = typeof column.resizable !== 'undefined' ? column.resizable : riskDataConfig.defaultResizableSetting;
            const title = column.desc;
            if(index !== 0 && widthToBeDistributed > 0) {
                width = parseInt(width) + widthToBeDistributed + 'px';
            }
            if(column.desc.toLowerCase() === 'liability indicator') {
                return (
                    <div key={index} className="column header" style={{minWidth: width, maxWidth: width}}>
                        <i className="phxico phx-exclamation" title={title}></i>
                    </div>
                )
            }else if(column.desc.toLowerCase() === 'actions') {
                return (
                    <div key={index} className="column header column-actions" style={{minWidth: width, maxWidth: width}}>&nbsp;</div>
                )
            }
            return (
                <div title={title} key={index} className="column header" style={{minWidth: width, maxWidth: width}}>
                    {column.desc}
                    {isResizable && this._renderResizeHandle(index)}
                </div>
            )
        });
    }

    render() {
        const { style, className} = this.props;
        return (
            <div className="row header-row">
                {this._renderColumns()}
            </div>
        )
    }
}

const mapStateToProps = (state, ownProps) => {
    return {
        
    };
};

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        
    };
};

export default connect(null, null)(Header);