import React, { PropTypes } from "react";
import { formatISODateString } from "../utils";
import EventPathTreeUtils from './eventPathTreeUtils';
import SportsIcon from '../components/sportsIcon';
import { AutoSizer, List } from 'react-virtualized';

export default class EventPathTree extends React.Component {
    constructor(props) {
        super(props);
        this._handleReorderClick = this._handleReorderClick.bind(this);
        this._updatedActiveEventPathTrace = null;
        this._eventPathIdsWithCount = [];
        this.state = { 
            expandedEventPathIds: [],
            overrideSearchMathes: [],
            sortAlphabetically: false,
            tree: this.props.tree || [],
            activeEventPathTrace: null,
            shouldUpdateActiveEventPathTrace: null,
            hideEmptyEventPaths: false,
            expandAll: null,
            collapseAll: null,
        }
    }

    componentWillUpdate(nextProps, nextState) {
        if(this.props.filter.searchString !== nextProps.filter.searchString) {
            this.setState({overrideSearchMathes: [], expandedEventPathIds: []});
        }
    }

    shouldComponentUpdate(nextProps, nextState) {
        return (
            this.props.showLoadingOn !== nextProps.showLoadingOn ||
            this.props.activeCode !== nextProps.activeCode ||
            this.state.expandAll !== nextState.expandAll || 
            this.state.collapseAll !== nextState.collapseAll || 
            this.state.expandedEventPathIds.length !== nextState.expandedEventPathIds.length ||
            this.state.sortAlphabetically !== nextState.sortAlphabetically ||
            (this.props.selectedSport && this.props.selectedSport.code !== nextProps.selectedSport.code ) ||
            (this.props.selectedSport && this.props.selectedSport.sportCode !== nextProps.selectedSport.sportCode) || 
            this.state.hideEmptyEventPaths !== nextState.hideEmptyEventPaths || 
            (this.props.deletedEventPathKeys && this.props.deletedEventPathKeys.length !== nextProps.deletedEventPathKeys.length) ||
            this.props.forceUpdate ||
            (!!nextProps.editedPathValue !== !!this.props.editedPathValue) ||
            (!!nextProps.newPath !== !!this.props.newPath) ||
            (nextProps.disableSave !== this.props.disableSave) || 
            false
        )
    }

    componentDidUpdate(prevProps, prevState) {
        if(prevProps.showLoadingOn && !this.props.showLoadingOn) {
            this.setState({
                tree: [...this.props.tree],
            });
            this.forceUpdate();
        }
        if(!prevProps.showLoadingOn && this.props.showLoadingOn) {
            this._eventPathIdsWithCount = [];
            this.setState({
                tree: [],
                expandedEventPathIds: this.state.collapseAll ? [] : this.state.expandedEventPathIds
            });
        }
        if(prevProps.activeCode && !this.props.activeCode) {
            this.setState({
                activeEventPathTrace: null
            });
            this.forceUpdate();
        }
        if(this.state.shouldUpdateActiveEventPathTrace && this._updatedActiveEventPathTrace) {
            this.setState({
                activeEventPathTrace: this._updatedActiveEventPathTrace,
                shouldUpdateActiveEventPathTrace: false
            });
            this.forceUpdate();
            this._updatedActiveEventPathTrace = null;
        }
        if(!prevState.expandAll && this.state.expandAll) {
            this.setState({
                expandedEventPathIds: this._eventPathIdsWithCount
            });
            this.forceUpdate();
        }
        if(prevProps.showLoadingOn && this.props.showLoadingOn === false && this.state.expandAll) {
            this.setState({
                expandedEventPathIds: this._eventPathIdsWithCount
            })
        }
        if(!prevState.collapseAll && this.state.collapseAll) {
            this.setState({
                expandedEventPathIds: []
            });
            this.forceUpdate();
        }
        if(this.props.filter.searchString.length !== prevProps.filter.searchString.length) {
            this.setState({
                tree: [...this.props.tree]
            });
        }
        if(this.props.editedPathValue) {
            this._updateEditedEventPath();
        }
        if(this.props.newPath) {
            this._addNewPath();
        }
    }

    _sortAlphabetically(items, sortBy) {
        return [ ...items.sort(function(a, b){
            if(a[sortBy].toLowerCase() < b[sortBy].toLowerCase()) return -1;
            if(a[sortBy].toLowerCase() > b[sortBy].toLowerCase()) return 1;
            return 0;
        }) ]
    }

    _sortByProperty(items, sortBy) {
        return [ ...items.sort(function(a, b){
            if(a[sortBy] < b[sortBy]) return -1;
            if(a[sortBy] > b[sortBy]) return 1;
            return 0;
        }) ]
    }

    _filterChildPaths(eventPaths) {
        const deletedEventPathKeys = this.props.deletedEventPathKeys || [];
        if(!eventPaths) {
            return []
        }
        return eventPaths.filter((eventPath)=> {
            return deletedEventPathKeys.indexOf(`p${eventPath.id}`) === -1 &&
            (!this.state.hideEmptyEventPaths || this.state.hideEmptyEventPaths && eventPath[this.props.eventPathCountKey || 'count'])
        });
    }

    _filterChildEvents(events) {
        const deletedEventPathKeys = this.props.deletedEventPathKeys || [];
        if(!events) {
            return []
        }
        return events.filter((event)=> {
            return deletedEventPathKeys.indexOf(`e${event.id}`) === -1
        });
    }

    _reorderEventPaths(eventPaths, currentPrintOrder, nextPrintOrder, direction) {
        for(var i = 0; i < eventPaths.length; i++) {
            const eventPath = eventPaths[i];
            if(eventPath.printOrder === currentPrintOrder) {
                eventPath.printOrder = nextPrintOrder;
            } else if(direction === 'last') {
                eventPath.printOrder = eventPath.printOrder - 1;
            } else if(direction === 'first') {
                eventPath.printOrder = eventPath.printOrder + 1;
            }
        }
    }

    _handleReorderClick(direction) {
        const { activeEventPathTrace, tree } = this.state;
        const parentTrace = activeEventPathTrace.filter((item, idx)=> idx !== activeEventPathTrace.length - 1);
        const selectedPathIndex = activeEventPathTrace[activeEventPathTrace.length - 1];
        const newState = this._filterChildPaths(tree);
        let pathToReorder = newState;
        for(var i = 0; i < parentTrace.length; i++) {
            pathToReorder[parentTrace[i]].eventPaths = this._filterChildPaths(pathToReorder[parentTrace[i]].eventPaths);
            pathToReorder = pathToReorder[parentTrace[i]].eventPaths;
        };
        const newIndex = this._getNewIndex(direction, selectedPathIndex, pathToReorder);
        if(direction === 'up' || direction === 'down') {
            pathToReorder.swap(selectedPathIndex, newIndex);
        } else {
            const nextPrintOrder = direction === 'first' ? pathToReorder[0].printOrder : pathToReorder[pathToReorder.length - 1].printOrder;
            this._reorderEventPaths(pathToReorder, pathToReorder[selectedPathIndex].printOrder, nextPrintOrder, direction);
            pathToReorder.move(selectedPathIndex, newIndex);
        }
        if(this.props.onEventPathReorder) {
            this.props.onEventPathReorder(pathToReorder);
        }
        this.setState({
            tree: [...newState],
            shouldUpdateActiveEventPathTrace: true
        });
        this.forceUpdate();
    }

    _updateEditedEventPath() {
        const { activeEventPathTrace, tree } = this.state;
        const newState = this._filterChildPaths(tree);
        let pathToEdit;
        for(var i = 0; i < activeEventPathTrace.length; i++) {
            if(!pathToEdit) {
                pathToEdit = newState[activeEventPathTrace[i]];
            } else {
                pathToEdit = pathToEdit.eventPaths[activeEventPathTrace[i]] || [];
            }
        };
        for(var key in this.props.editedPathValue) {
            pathToEdit[key] = this.props.editedPathValue[key];
        }
        this.setState({
            tree: [ ...newState ]
        });
        this.forceUpdate();
    }

    _addNewPath() {
        const { activeEventPathTrace, tree } = this.state;
        const newState = this._filterChildPaths(tree);
        const { newPath } = this.props;
        let pathToEdit;
        let prefix = newPath.isEventPath ? 'e' : 'p';
        newPath.key = `${prefix}${newPath.id}`;
        if(activeEventPathTrace === null) {
            newPath.parentTrace = [ newState.length ];
            newState.push(newPath);
        } else {
            for(var i = 0; i < activeEventPathTrace.length; i++) {
                if(!pathToEdit) {
                    pathToEdit = newState[activeEventPathTrace[i]];
                } else {
                    pathToEdit = pathToEdit.eventPaths[activeEventPathTrace[i]];
                }
            };
            newPath.parentTrace = [ ...activeEventPathTrace, (pathToEdit.eventPaths && pathToEdit.eventPaths.length) || 0 ];
            if (newPath.isEventPath) {
                pathToEdit.events = pathToEdit.events ? [ ...pathToEdit.events, this.props.newPath] : [ this.props.newPath ];
            } else {
                pathToEdit.eventPaths = pathToEdit.eventPaths ? [ ...pathToEdit.eventPaths, this.props.newPath] : [ this.props.newPath ];
            }
            this._toggleEventPath(pathToEdit, true);
        }
        this.setState({
            tree: [ ...newState ]
        });
        this._onClickEventPath(newPath);
    }

    _addIdToEventPathIdsWithCount(id) {
        if(this._eventPathIdsWithCount.indexOf(id) === -1) {
            this._eventPathIdsWithCount.push(id);
        }
    }

    _removeIdFromEventPathIdsWithCount(id) {
        const index = this._eventPathIdsWithCount.indexOf(id);
        if(index > -1) {
            this._eventPathIdsWithCount = [
                ...this._eventPathIdsWithCount.slice(0, index),
                ...this._eventPathIdsWithCount.slice(index + 1),
            ]
        }

    }

    _getNewIndex(direction, index, array) {
        switch (direction) {
            case 'first':
                return 0;
            case 'last':
                return array.length - 1;
            case 'up':
                return index - 1 < 0 ? 0 : index - 1;
            case 'down':
                return index + 1 > array.length - 1 ? array.length - 1 : index + 1;
            default:
                return null;
        }
    }

    _getSearchMatchClassName(hasMatched) {
        if(hasMatched) {
            return 'search-matching';
        } else {
            return 'search-non-matching';
        }
    }

    _renderDescriptionIcon(icon) {
        switch (icon) {
            case 'eventPath':
                return <span title="Event Path" className="event-path-desc-icon event-path">EP</span>
            case 'rankEvent':
                return <span title="Rank Event" className="event-path-desc-icon event">RE</span>
            case 'gameEvent':
                return <span title="Game Event" className="event-path-desc-icon event">GE</span>
            default:
                return null;
        }
    }

    _renderMarkets(eventId) {
        const { activeCode } = this.props;
        let markets = this.props.markets[eventId];
        let sortedMarkets;
        if(this.state.sortAlphabetically) {
            sortedMarkets = this._sortAlphabetically([...markets], 'description');
        }
        const marketsToRender = this.state.sortAlphabetically ? sortedMarkets : markets;
        if(marketsToRender && marketsToRender.length) {
            return marketsToRender.map((market)=> {
                market.key = `m${market.id}`;
                let className = 'event-path-tree-item market';
                const isActive = market.key === activeCode;
                if(isActive) {
                    className = className + ' active';
                }
                return (
                    <div key={market.id} className={className}>
                        <a className="pathtree-desc" title={market.description} onClick={ (e)=> { e.preventDefault(); this._onClickEventPath(market) } }>
                            <div>
                                {market.description} - {market.periodDesc} - {formatISODateString(market.cutOffTime, 'MM/DD, HH:mm a')}
                            </div>
                        </a>
                    </div>
                )
            })
        } else {
            return null
        }
    }

    _renderMarketLoadingIndicator() {
        return (
            <div className="loading tcenter">
                <i className="phxico phx-spinner phx-spin"></i>
            </div>
        )
    }

    _renderEvents(events) {
        const { filter, activeCode, descriptionIcon, markets, eventIdsFetchingMarkets, showEventTime, deletedEventPathKeys } = this.props;
        let sortedEvents = [ ...events ];
        if(this.state.sortAlphabetically) {
            sortedEvents = this._sortAlphabetically([...events], 'description');
        }
        const eventsToRender = this.state.sortAlphabetically ? sortedEvents : events;
        return eventsToRender.map((element, index, array) => {
            element.key = `e${element.id}`;
            if(deletedEventPathKeys && deletedEventPathKeys.indexOf(element.key) > -1) {
                return null
            }
            const isActive = `e${element.id}` === activeCode;
            const eventType = element.eventType === 1 ? 'gameEvent' : 'rankEvent';
            const shouldRenderChildPaths = this.state.expandedEventPathIds.indexOf(element.id) > -1;
            const toggleIconClass = shouldRenderChildPaths ? 'phxico phx-chevron-down' : 'phxico phx-chevron-right';
            const hasMarkets = typeof element.marketCount !== 'undefined' && element.marketCount > 0;
            const isLoadingMarkets = eventIdsFetchingMarkets && eventIdsFetchingMarkets.indexOf(element.id) > -1
            let className = `event-path-tree-item event ${this._getSearchMatchClassName(element.matchedSearchString)}`;
            if(isActive) {
                className = className + ' active';
            }
            return (
                <div key={element.id}>
                    <div className={className}>
                        {hasMarkets &&
                        <a onClick={(e)=> { e.preventDefault(); this._toggleEventPath(element)}} className="expand-toggle">
                            <i className={toggleIconClass}></i>
                        </a>
                        }
                        {descriptionIcon && this._renderDescriptionIcon(eventType)}
                        <a className="pathtree-desc" title={element.description} onClick={ (e)=> { e.preventDefault(); this._onClickEventPath(element) } }>
                            <div>
                                {!descriptionIcon && '-'} {element.description} {showEventTime && formatISODateString(element.startTime, 'MM/DD, HH:mm a')}
                            </div>
                        </a>
                        {typeof element.marketCount !== 'undefined' && 
                        <div className="pathtree-count">{element.marketCount}</div>
                        }
                    </div>
                    {shouldRenderChildPaths && isLoadingMarkets &&
                    <div className="event-path-tree">
                        {this._renderMarketLoadingIndicator()}
                    </div>
                    }
                    {shouldRenderChildPaths && !isLoadingMarkets && markets[element.id] &&
                    <div className="event-path-tree">
                        {this._renderMarkets(element.id)}
                    </div>
                    }
                </div>
            )
        });
    }

    _renderFilteredEvents(events) {
        let sortedEvents;
        if(this.state.sortAlphabetically) {
            sortedEvents = this._sortAlphabetically([...events], 'description');
        }
        const eventsToRender = this.state.sortAlphabetically ? sortedEvents : events;
        return events.map((element, index, array) => {
            element.key = `e${element.id}`;
            if(this.props.deletedEventPathKeys && this.props.deletedEventPathKeys.indexOf(element.key) > -1) {
                return null
            }
            const eventType = element.eventType === 1 ? 'gameEvent' : 'rankEvent';
            const shouldRenderChildPaths = this.state.expandedEventPathIds.indexOf(element.id) > -1;
            const toggleIconClass = shouldRenderChildPaths ? 'phxico phx-chevron-down' : 'phxico phx-chevron-right';
            const hasMarkets = typeof element.marketCount !== 'undefined' && element.marketCount > 0;
            if(element.matchedSearchString) {
                return (
                    <div key={element.id} className={element.matchedSearchString ? 'event search-matching' : 'event search-non-matching'}>                    
                        {hasMarkets &&
                        <a onClick={(e)=> { e.preventDefault(); this._toggleEventPath(element)}} className="expand-toggle">
                            <i className={toggleIconClass}></i>
                        </a>
                        }
                        {this.props.descriptionIcon && this._renderDescriptionIcon(eventType)}
                        <a className="pathtree-desc" title={element.description} onClick={ (e)=> { e.preventDefault(); this._onClickEventPath(element) } }>
                            <div>
                                {!this.props.descriptionIcon && '-'} {element.description}
                            </div>
                        </a>
                        {typeof element.marketCount !== 'undefined' && 
                        <div className="pathtree-count">{element.marketCount}</div>
                        }
                    </div>
                )
            } else {
                return null
            }
        });
    }

    _onClickEventPath(path) {
        this.setState({
            activeEventPathTrace: path.parentTrace || null
        });
        this.props.onClickEventPath(path);
    }

    _toggleEventPath(path, expand, collapse) {
        const index = this.state.expandedEventPathIds.indexOf(path.id);
        const overrideIndex = this.state.overrideSearchMathes.indexOf(path.id);
        if(overrideIndex === -1) {
            this.setState({
                overrideSearchMathes: [ ...this.state.overrideSearchMathes, path.id]
            });
        }
        if((index === -1 || expand) && !collapse) {
            this.setState({
                expandedEventPathIds: [...this.state.expandedEventPathIds, path.id]
            });
        } else if(index > -1 || collapse){
            this.setState({
                expandedEventPathIds: [
                    ...this.state.expandedEventPathIds.slice(0, index),
                    ...this.state.expandedEventPathIds.slice(index + 1)
                ]
            });
        }
        const isExpanded = ((index === -1 || expand) || overrideIndex === -1) && !collapse;  
        if(typeof this.props.onExpandEvent === 'function' && isExpanded && path.key.charAt(0) === 'e') {
            this.props.onExpandEvent(path);
        }
    }

    _renderEventPaths(eventPaths, parentIndexTrace) {
        const { filter, activeCode, descriptionIcon, defaultSort } = this.props;
        let sortedEventPaths = [ ...eventPaths ];
        if(this.state.sortAlphabetically) {
            sortedEventPaths = this._sortAlphabetically([...eventPaths], 'description');
        } else if(defaultSort) {
            sortedEventPaths = this._sortByProperty([...eventPaths], defaultSort);
        }
        let eventPathsToRender = this._filterChildPaths(sortedEventPaths);
        if(eventPathsToRender && eventPathsToRender.length) {
            return eventPathsToRender.map((element, index, array) => {
                element.key = `p${element.id}`;
                if(element[this.props.eventPathCountKey || 'count']) {
                    this._addIdToEventPathIdsWithCount(element.id)
                } else {
                    this._removeIdFromEventPathIdsWithCount(element.id);
                    if(this.state.hideEmptyEventPaths) {
                        return null
                    }
                }

                element.parentTrace = [ ...parentIndexTrace, index ]; // this is used so that we can easily find selected paths inside the nested path tree array
                const isActive = `p${element.id}` === activeCode;
                if(this.state.shouldUpdateActiveEventPathTrace && isActive) {
                    this._updatedActiveEventPathTrace = element.parentTrace
                }
                const shouldRenderChildPaths = this.state.expandedEventPathIds.indexOf(element.id) > -1;
                const toggleIconClass = shouldRenderChildPaths ? 'phxico phx-chevron-down' : 'phxico phx-chevron-right';
                const childPaths = this._filterChildPaths(element.eventPaths);
                const childEvents = this._filterChildEvents(element.events);
                const hasChildPaths = !!(childPaths.length || childEvents.length);
                let className = `event-path-tree-item ${this._getSearchMatchClassName(element.matchedSearchString)} ${hasChildPaths ? 'has-children' : 'no-children'}`;
                if(isActive) {
                    className = className + ' active';
                }
                return (
                    <div key={element.id}>
                        <div className={className}>
                            {hasChildPaths &&
                            <a onClick={(e)=> { e.preventDefault(); this._toggleEventPath(element)}} className="expand-toggle">
                                <i className={toggleIconClass}></i>
                            </a>
                            }
                            {descriptionIcon && this._renderDescriptionIcon('eventPath')}
                            <a className="pathtree-desc" title={element.description}  onClick={ (e)=> { e.preventDefault(); this._onClickEventPath(element) } }>
                                <div>{element.description}</div>
                            </a>
                            {!!element[this.props.eventPathCountKey || 'count'] && <div className="pathtree-count">{element[this.props.eventPathCountKey || 'count']}</div>}
                        </div>
                        {!!childPaths.length &&
                        <div className="event-path-tree">
                            {shouldRenderChildPaths && this._renderEventPaths(childPaths, element.parentTrace)}
                        </div>
                        }
                        {!!childEvents.length &&
                            <div className="events">
                                {shouldRenderChildPaths && this._renderEvents(childEvents)}
                            </div>
                        }
                    </div>
                )
            });
        } else {
            return null;
        }
    }

    _renderFilteredEventPaths(eventPaths, parentIndexTrace) {
        const { defaultSort, descriptionIcon, activeCode } = this.props;
        let sortedEventPaths = eventPaths;
        if(this.state.sortAlphabetically) {
            sortedEventPaths = this._sortAlphabetically([...eventPaths], 'description');
        } else if(defaultSort) {
            sortedEventPaths = this._sortByProperty([...eventPaths], defaultSort);
        }
        const eventPathsToRender = sortedEventPaths;
        if(eventPathsToRender && eventPathsToRender.length) {
            return eventPathsToRender.map((element, index, array) => {
                element.key = `p${element.id}`;
                if(element[this.props.eventPathCountKey || 'count']) {
                    this._addIdToEventPathIdsWithCount(element.id)
                } else if(!element[this.props.eventPathCountKey || 'count']) {
                    this._removeIdFromEventPathIdsWithCount(element.id);
                    if(this.state.hideEmptyEventPaths) {
                        return null
                    }
                }
                element.parentTrace = [ ...parentIndexTrace, index ];
                const isActive = `p${element.id}` === activeCode;
                if(this.state.shouldUpdateActiveEventPathTrace && isActive) {
                    this._updatedActiveEventPathTrace = element.parentTrace
                }
                const childPaths = this._filterChildPaths(element.eventPaths);
                const childEvents = this._filterChildEvents(element.events);
                const hasChildPaths = !!(childPaths.length || childEvents.length);
                let className = `event-path-tree-item search-matching ${hasChildPaths ? 'has-children' : 'no-children'}`;
                const isExpanded = this.state.expandedEventPathIds.indexOf(element.id) > -1;
                const isInTest = this.state.overrideSearchMathes.indexOf(element.id) > -1;
                if(element.matchedSearchString) {
                    const shouldRenderChildPaths = isExpanded || (element.hasChildThatMatchedSearchString && !isInTest);
                    const toggleIconClass = shouldRenderChildPaths ? 'phxico phx-chevron-down' : 'phxico phx-chevron-right';
                    return (
                        <div key={element.id}>
                            <div className="event-path-tree-item search-matching">
                                {hasChildPaths &&
                                <a onClick={(e)=> {
                                    e.preventDefault();
                                    if(element.hasChildThatMatchedSearchString && !isInTest) {
                                        this._toggleEventPath(element, false, true)
                                    } else {
                                        this._toggleEventPath(element)
                                    }
                                }} className="expand-toggle">
                                    <i className={toggleIconClass}></i>
                                </a>
                                }
                                {descriptionIcon && this._renderDescriptionIcon('eventPath')}
                                <a className="pathtree-desc" title={element.description} onClick={ (e)=> { e.preventDefault(); this._onClickEventPath(element) } }>
                                    <div>{element.description}</div>
                                </a>
                                {!!element[this.props.eventPathCountKey || 'count'] && <div className="pathtree-count">{element[this.props.eventPathCountKey || 'count']}</div>}
                                {!!childPaths.length && shouldRenderChildPaths && 
                                <div className="event-path-tree">
                                    {this._renderEventPaths(childPaths, element.parentTrace)}
                                </div>
                                }
                                {!!childEvents.length && shouldRenderChildPaths &&
                                    <div className="events">
                                        {this._renderEvents(childEvents)}
                                    </div>
                                }
                            </div>
                        </div>
                    )
                } else if(element.hasChildThatMatchedSearchString) {
                    const shouldRenderChildPaths = isExpanded || (element.hasChildThatMatchedSearchString && !isInTest);
                    const toggleIconClass = shouldRenderChildPaths ? 'phxico phx-chevron-down' : 'phxico phx-chevron-right';
                    return (
                        <div key={element.id}>
                            <div className={`event-path-tree-item ${this._getSearchMatchClassName(element.matchedSearchString)}`}>
                                {hasChildPaths &&
                                <a  onClick={(e)=> {
                                    e.preventDefault();
                                    if(element.hasChildThatMatchedSearchString && !isInTest) {
                                        this._toggleEventPath(element, false, true)
                                    } else {
                                        this._toggleEventPath(element)
                                    }
                                }} className="expand-toggle">
                                    <i className={toggleIconClass}></i>
                                </a>
                                }
                                {descriptionIcon && this._renderDescriptionIcon('eventPath')}
                                <a className="pathtree-desc" title={element.description} onClick={ (e)=> { e.preventDefault(); this._onClickEventPath(element) } }>
                                    <div>{element.description}</div>
                                </a>
                                {!!element[this.props.eventPathCountKey || 'count'] && <div className="pathtree-count">{element[this.props.eventPathCountKey || 'count']}</div>}
                                {!!element.eventPaths.length && shouldRenderChildPaths && 
                                <div className="event-path-tree">
                                    {this._renderFilteredEventPaths(element.eventPaths, element.parentTrace)}
                                </div>
                                }
                                {!!element.events.length && shouldRenderChildPaths &&
                                    <div className="events">
                                        {this._renderFilteredEvents(element.events)}
                                    </div>
                                }
                            </div>
                        </div>
                    )
                }
                
            });
        }
    }

    _renderUtils() {
        const { activeEventPathTrace, sortAlphabetically, expandAll, collapseAll } = this.state;
        return <EventPathTreeUtils
            onSaveButtonClick={this.props.onSaveButtonClick}
            hasSelectedPath={!!this.props.activeCode}
            areEmptyEventPathsHidden={this.state.hideEmptyEventPaths}
            activeEventPathTrace={activeEventPathTrace}
            isOrderedAlphabetically={sortAlphabetically}
            isExpandedAll={expandAll}
            isCollapsedAll={collapseAll}
            disableSave={this.props.disableSave}
            onAlphabeticalIconClick={(isChecked)=> this.setState({ sortAlphabetically: isChecked })}
            onReorderPathClick={this._handleReorderClick}
            onExpandAllClick={(e)=> this.setState({ expandAll: true, collapseAll: false })}
            onCollapseAllClick={(e)=> this.setState({ collapseAll: true, expandAll: false })}
            onHideEmptyEventPathsClick={(e)=> this.setState({ hideEmptyEventPaths: !this.state.hideEmptyEventPaths })}/>
    }

    render() {
        const { filter, showLoadingOn, descriptionIcon, markets, eventIdsFetchingMarkets, showUtils, selectedSport, onSelectedSportClick, activeCode, editedPathValue } = this.props;
        const { tree } = this.state;
        const containerClassName = `event-path-tree text-medium ${descriptionIcon ? 'has-description-icon' : ''}`;
        if(showLoadingOn) {
            return (
                <div className="loading tcenter">
                    <i className="phxico phx-spinner phx-spin"></i>
                </div>
            )
        } else {
            return(
                <div className={containerClassName}>
                    {showUtils && this._renderUtils()}
                    <div className="event-path-tree-body">
                        {selectedSport && 
                        <h4 className={activeCode ? '' : 'none-selected'} onClick={(e)=>{
                            if(onSelectedSportClick) {
                                onSelectedSportClick();
                            }
                        }}>
                            <SportsIcon className="icon-medium push-right sports-icon" sportCode={selectedSport.code || selectedSport.sportCode}/>{selectedSport.description}
                        </h4>
                        }
                        {filter.searchString.length < 2 && this._renderEventPaths(tree, [])}
                        {filter.searchString.length >= 2 && 
                        <div className="filtered-results">
                            {this._renderFilteredEventPaths(tree, [])}
                        </div>}
                    </div>
                </div>
            )
        }
    }
}