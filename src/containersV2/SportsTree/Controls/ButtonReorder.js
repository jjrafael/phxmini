import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { updatePaths, setNewPathsOrder } from '../actions';
import { DUMMY_ID } from '../constants';

const mapStateToProps = (state, ownProps) => {
    return {
        isFetchingEPT: state.sportsTree.isFetchingEPT,
        activePathId: state.sportsTree.activePathId,
        isCreatingNewPath: !!state.sportsTree.pathsMap[DUMMY_ID],
        pathsMap: state.sportsTree.pathsMap,
    };
};
const mapDispatchToProps = (dispatch, ownProps) => {
    return bindActionCreators({updatePaths, setNewPathsOrder}, dispatch);
};

const ButtonReorder = ({pathsMap, updatePaths, setNewPathsOrder, activePathId, isFetchingEPT, isCreatingNewPath, title, icon, direction}) => {
    let path = pathsMap[activePathId] || {};
    return <button
        className="button btn-box"
        disabled={isFetchingEPT || isCreatingNewPath || (path && (path.type !== 'path' || !path.level))}
        title={title}
        onClick={e => {
            let parentPath = pathsMap[path.parentId];
            if (parentPath) {
                let eventPaths = [...parentPath.eventPaths];
                let currentIndex = eventPaths.findIndex(id => id === activePathId);
                let targetIndex, targetId, targetPath;
                if (direction === 'up' || direction === 'down') {
                    if (direction === 'up') {
                        targetIndex = currentIndex - 1;
                    } else if (direction === 'down') {
                        targetIndex = currentIndex + 1;
                    }
                    targetId = eventPaths[targetIndex];
                    targetPath = pathsMap[targetId];
                    if (currentIndex !== targetIndex && targetPath) {
                        eventPaths[currentIndex] = targetId;
                        eventPaths[targetIndex] = path.id;
                        let currentPrintOrder = path.printOrder;
                        let targetPrintOrder = targetPath.printOrder;
                        let newPathsOrder = {
                            [path.id]: targetPrintOrder,
                            [targetPath.id]: currentPrintOrder
                        };
                        updatePaths([
                            {id: parentPath.id, data: {eventPaths}},
                            {id: path.id, data: {printOrder: targetPrintOrder}},
                            {id: targetPath.id, data: {printOrder: currentPrintOrder}},
                        ])
                        setNewPathsOrder(newPathsOrder);
                    }
                }
                if (direction === 'top' || direction === 'bottom') {
                    targetId = eventPaths[0];
                    targetPath = pathsMap[targetId];
                    let baseOrder = targetPath.printOrder;
                    if (direction === 'top') {
                        targetIndex = 0;
                        eventPaths = [path.id, ...eventPaths.slice(0, currentIndex), ...eventPaths.slice(currentIndex + 1)]
                    } else if (direction === 'bottom') {
                        targetIndex = eventPaths.length - 1;
                        eventPaths = [...eventPaths.slice(0, currentIndex), ...eventPaths.slice(currentIndex + 1), path.id]
                    }
                    if (currentIndex !== targetIndex) {
                        let {newPathsOrder, paths} = eventPaths.reduce((accu, id) => {
                            accu.newPathsOrder[id] = baseOrder;
                            accu.paths.push({id, data: {printOrder: baseOrder}})
                            baseOrder++;
                            return accu;
                        }, {paths: [], newPathsOrder: {}});
                        updatePaths([{id: parentPath.id, data: {eventPaths}}, ...paths]);
                        setNewPathsOrder(newPathsOrder);
                    }
                }

            }

        }}
    ><i className={`phxico ${icon}`}></i>
    </button>
}

export default connect(mapStateToProps, mapDispatchToProps)(ButtonReorder);