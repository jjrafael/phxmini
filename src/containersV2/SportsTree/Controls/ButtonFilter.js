import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { updateFilterState } from '../actions';
import { push } from 'react-router-redux';
import { DUMMY_ID } from '../constants';

const mapStateToProps = (state, ownProps) => {
    return {
        isFiltered: state.sportsTree.isFiltered,
        activePathAncestors: state.sportsTree.activePathAncestors,
        activeSportId: state.sportsTree.activeSportId,
        pathsMap: state.sportsTree.pathsMap,
        isCreatingNewPath: !!state.sportsTree.pathsMap[DUMMY_ID]
    };
};
const mapDispatchToProps = (dispatch, ownProps) => {
    return bindActionCreators({updateFilterState, push}, dispatch);
};

const ButtonFilter = ({updateFilterState, isFiltered, activePathAncestors, pathsMap, activeSportId, push, isCreatingNewPath}) => {
    let className = 'button btn-box';
    let title = "Filter"
    if (isFiltered) {
        className += ' active';
        title = 'Remove filter';
    }
    return <button className={className}
        title={title}
        disabled={isCreatingNewPath}
        onClick={e => {
            updateFilterState(!isFiltered)
            if (!isFiltered) {
                let firstPathIdFound, firstPathFound;
                for (let i = 0, length = activePathAncestors.length; i < length; i++) {
                    firstPathIdFound = activePathAncestors[i];
                    let path = pathsMap[firstPathIdFound];
                    if (path) {
                        if ((path.type === 'path' && path.eventCount) || (path.type === 'event' && path.marketCount)) {
                            firstPathFound = path;
                            break;
                        }
                    }
                }
                if (firstPathFound) {
                    push(firstPathFound.url)
                } else {
                    push(pathsMap[activeSportId].url)
                }
            }
        }}
    ><i className="phxico phx-hide-empty icon-medium"></i>
    </button>
}

export default connect(mapStateToProps, mapDispatchToProps)(ButtonFilter);