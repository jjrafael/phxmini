import React, { PureComponent } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import Link from './Link';
import Count from './Count';
import ToggleContainer from './ToggleContainer';
import Icon from './Icon';
import Description from './Description';
import Checkbox from './Checkbox';
import { updatePath, fetchEventMarkets } from '../actions';

const pathSelector = (state, id) => state.sportsTree.pathsMap[id];
const countsSelector = createSelector([pathSelector], (path) => {
    if (path) {
        return { count: path.count || 0, eventCount: path.eventCount || 0 }
    } else {
        return {};
    }
})
// count and eventCount are needed just to re-render Path if count and eventCount changes
const mapStateToProps = (state, ownProps) => {
    let path = pathSelector(state, ownProps.id);
    return {
        path,
        config: state.sportsTree.config,
        isSorted: state.sportsTree.isSorted,
        isFiltered: state.sportsTree.isFiltered,
        searchStr: state.sportsTree.searchStr,
        parameters: state.sportsTree.parameters,
        ...countsSelector(state, ownProps.id)
    };
};

const mapDispatchToProps = (dispatch) => {
    return bindActionCreators({
        updatePath, fetchEventMarkets
    }, dispatch);
};

class Path extends PureComponent {
    render () {
        // console.log('render')
        let { sport, updatePath, isSorted, isFiltered, searchStr, fetchEventMarkets, parameters, config, onPathClick } = this.props;
        let path = sport || this.props.path;
        if (!path) { return null }
        // console.log('render: ', path.description)
        let children = isSorted ?
            [...path.sortedEventPaths, ...path.sortedEvents, ...path.childMarkets] :
            [...path.eventPaths, ...path.events, ...path.childMarkets];
        if (path.level !== 0 && isFiltered) {
            if (config.useCount) { // set useCount to true when paths have no eventCount props (ie in Risk Manager)
                if (path.type === 'path' && !path.count) {
                    return null;
                }
            } else {
                if ((path.type === 'path' && !path.eventCount) || (path.type === 'event' && !path.marketCount)) {
                    return null;
                }
            }
        }
        if (path.level !== 0 && searchStr && path.type !== 'market') {
            if (!path.directMatch && !path.hasChildWithMatch && !path.hasDirectMatchOnParent) {
                return null;
            }
        }
        // added padding-left style here so that we don't manually declare all values for all possible levels in css
        // TODO: if it affects performance, move it to css
        let paddingLeft = path.level > 1 ? `${path.level * 15 - 15}px` : '0px';
        let anchorClassName = path.directMatch ? 'path-anchor path-anchor--matched' : 'path-anchor';
        if (config.displayCheckbox && path.level === 0) {
            anchorClassName += ' path-anchor--nopointer'
        }
        return (
            <div className={`path-container level-${path.level}`}>
                <Link
                    className={anchorClassName}
                    style={{paddingLeft}}
                    active={path.isActive}
                    url={path.url}
                    enableClickWhileActive={true}
                    onClick={() => {onPathClick(path)}}
                >
                    <ToggleContainer
                        path={path}
                        onClick={() => {
                            if (path.eventType && !!!path.isExpanded) {
                                fetchEventMarkets(path.id, parameters)
                            }
                            updatePath(path.id, {isExpanded: !!!path.isExpanded})
                        }}
                    />
                    <Checkbox
                        path={path}
                        displayCheckbox={config.displayCheckbox}
                    />
                    <div className="path-name">
                        <Icon path={path} config={config} />
                        <Description path={path} />
                    </div>
                    <Count path={path} isSearching={!!searchStr} config={config} />
                </Link>
                {children.length > 0 && !!path.isExpanded &&
                    <div className="path-children">{
                        children.map(id => <Enhanced key={id} id={id} onPathClick={onPathClick} />)
                    }</div>
                }
            </div>
        );
    }
}

const Enhanced = connect(mapStateToProps, mapDispatchToProps)(Path);
export default Enhanced;