import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Cell from './Cell';

const mapStateToProps = (state, ownProps) => {
    return {
        activeBetType: state.betRestrictions.activeBetType,
        activeBetTypeKey: state.betRestrictions.activeBetTypeKey,
        matrixDataCache: state.betRestrictions.matrixDataCache,
    };
};

const mapDispatchToProps = (dispatch, ownProps) => {
    return bindActionCreators({
        
    }, dispatch);
};


const CELL_SIZE = 80;
class Matrix extends Component {
    constructor (props) {
        super(props);
        this.state = {
            scrollLeft: 0,
            scrollTop: 0,
        }
    }
    componentWillUpdate (nextProps) {
        if (nextProps.activeBetTypeKey !== this.props.activeBetTypeKey) {
            this.setState({scrollLeft: 0, scrollTop: 0});
            if (this._matrixCells) {
                this._matrixCells.scrollLeft = 0;
                this._matrixCells.scrollTop = 0;
            }
        }
    }

    render () {
        let { scrollLeft, scrollTop } = this.state;
        let { matrixDataCache, activeBetType, activeBetTypeKey } = this.props;
        if (!matrixDataCache[activeBetTypeKey]) { return null }
        let { matrixArray, matrixHeaders, matrixMap } = matrixDataCache[activeBetTypeKey];
        let isSelectOutcome = activeBetType.betRestrictionTypeId === 1;
        let rowWidth = matrixArray.length * CELL_SIZE;
        return (
            <div className="matrix-container">
                { !isSelectOutcome &&
                    <div className="matrix-column-headers" style={{top: '0px', left: `${CELL_SIZE}px`}}>
                        <div className="column-inner-scroll" style={{left: `${scrollLeft}px`}}>
                            {matrixHeaders.map(header => {
                                return <Cell
                                    key={header.key}
                                    data={{desc: header.desc, className: 'cell-header', descExpanded: header.descExpanded}}
                                    cellSize={CELL_SIZE}
                                    restrictionKey={header.key}
                                    hasTitle={true}
                                />
                            })}
                        </div>
                    </div>
                }
                <div className="matrix-row-headers" style={{left: '0px', top: isSelectOutcome ? `0` : `${CELL_SIZE}px`}}>
                    <div className="row-inner-scroll" style={{top: `${scrollTop}px`}}>
                        {matrixHeaders.map(header => {
                            return <Cell
                                key={header.key}
                                data={{desc: header.desc, className: 'cell-header', descExpanded: header.descExpanded}}
                                cellSize={CELL_SIZE}
                                restrictionKey={header.key}
                                hasTitle={true}
                            />
                        })}
                    </div>
                </div>
                <div className="matrix-cells"
                    ref={el => this._matrixCells = el}
                    style={{
                        top: isSelectOutcome ? `0` : `${CELL_SIZE}px`,
                        left: `${CELL_SIZE}px`,
                        width: `calc( 100% - ${CELL_SIZE}px )`,
                        maxHeight: isSelectOutcome ? `100%` : `calc( 100% - ${CELL_SIZE}px )`,
                        height: `${rowWidth}px`,
                    }}
                    onScroll={e => {
                        this.setState({
                            scrollLeft: 0 - e.target.scrollLeft,
                            scrollTop: 0 - e.target.scrollTop,
                        })
                    }}
                >
                    {matrixArray.map((row, i) => {
                        return <div
                            key={i}
                            className="cell-row"
                            style={{width: isSelectOutcome ? `${CELL_SIZE}px` : `${rowWidth}px`}}
                        >
                            {row.map((key, i) => {
                                return <Cell
                                    key={`${key}-${i}`}
                                    data={matrixMap[key]}
                                    cellSize={CELL_SIZE}
                                    restrictionKey={matrixMap[key].key}
                                />
                            })}
                        </div>
                    })}
                </div>
            </div>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Matrix);