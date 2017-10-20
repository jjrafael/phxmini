import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import qs from 'query-string';
import Paths from './Paths';
import { getParentPaths } from './helpers';
import { parsePathName } from 'phxUtils';
import LoadingIndicator from 'components/loadingIndicator';
import { fetchEPT, fetchEventMarkets, updateActivePathId, updateActiveSportCodeAndId, updatePaths, updateActivePathAncestors, setAsFirstLoad, setDatesFilter } from './actions';

const defaultSportCode = 'bask'; // TODO: store this in a config
const defaultSportId = 227;  // TODO: store this in a config
const mapStateToProps = (state, ownProps) => {
    let activeSportId = state.sportsTree.activeSportId;
    let pathsMap = state.sportsTree.pathsMap;
    return {
        activeSport: pathsMap[activeSportId],
        parameters: state.sportsTree.parameters,
        baseUrl: state.sportsTree.baseUrl,
        isFetchingEPT: state.sportsTree.isFetchingEPT,
        isFetchingEPTFailed: state.sportsTree.isFetchingEPTFailed,
        isFirstLoad: state.sportsTree.isFirstLoad,
        activePathId: state.sportsTree.activePathId,
        pathsMap,
        activeSportId,
    };
};

const mapDispatchToProps = (dispatch, ownProps) => {
    return bindActionCreators({
        fetchEPT,
        fetchEventMarkets,
        updateActivePathId,
        updateActivePathAncestors,
        updateActiveSportCodeAndId,
        updatePaths,
        setAsFirstLoad,
        setDatesFilter,
    }, dispatch);
};

class SportsTree extends Component {
    componentDidMount () {
        if (this.props.onMount) {
            this.props.onMount();
            return;
        }
        let { fetchEPT, sports, location, updateActiveSportCodeAndId, updateActivePathId, parameters, baseUrl, onRedirect } = this.props;
        let { sportCode, path } = parsePathName(location.pathname);
        let url = `${baseUrl}/${defaultSportCode}/p${defaultSportId}`;
        if (sportCode) {
            let sport = sports.find(sport => sport.code === sportCode.toUpperCase());
            if (sport) {
                let sportId = sport.defaultEventPathId;
                if (path) {
                    let pathId = Number(path.substr(1));
                    updateActiveSportCodeAndId(sportId, sport.code)
                    if (sportId !== pathId) { // set activeSportId and activePathId separately
                        updateActivePathId(pathId);
                    }
                    let dateFilterParam = qs.parse(location.search).dateFilter;
                    if (dateFilterParam) {
                        console.log('dateFilterParam: ', dateFilterParam)
                        this.props.setDatesFilter(decodeURI(dateFilterParam));
                        fetchEPT(sportId, parameters, {location: location});
                    } else {
                        fetchEPT(sportId, parameters);
                    }
                } else {
                    // redirect to default sport code and path id
                    onRedirect(`${baseUrl}/${sport.code.toLowerCase()}/p${sportId}`)
                    fetchEPT(sportId, parameters);
                }
            } else {
                // invalid sport code
                // TODO: should we redirect or display not found page?
                onRedirect(url)
            }
        } else {
            // redirect to default sport code and path id
            onRedirect(url)
        }
    }
    componentWillUpdate (nextProps) {
        if (this.props.onWillUpdate) {
            this.props.onWillUpdate(nextProps, this.props);
            return;
        }
        let {
            fetchEPT,
            sports,
            updateActivePathId,
            updateActivePathAncestors,
            updateActiveSportCodeAndId,
            updatePaths,
            parameters,
            baseUrl,
            isFirstLoad,
            onRedirect,
            setAsFirstLoad,
            setDatesFilter
        } = this.props;
        let url = `${baseUrl}/${defaultSportCode}/p${defaultSportId}`;
        if (this.props.location !== nextProps.location) {
            let { path='', sportCode } = parsePathName(nextProps.location.pathname);
            let { path:prevPath, sportCode:prevSportCode } = parsePathName(this.props.location.pathname);
            let pathId = Number(path.substr(1));
            let pathPrefix = path.substr(0,1);
            if (sportCode !== prevSportCode && path !== prevPath) { // sport code changes
                let sport = sports.find(sport => sport.code === sportCode.toUpperCase());
                if (sport) {
                    let sportId = sport.defaultEventPathId;
                    if (sportId !== pathId) {
                        let dateFilterParam = qs.parse(nextProps.location.search).dateFilter;
                        if (dateFilterParam) {
                            setDatesFilter(decodeURI(dateFilterParam));
                        }
                        setAsFirstLoad(true);
                        if (pathId) {
                            updateActiveSportCodeAndId(sportId, sport.code)
                            if (sportId !== pathId) { // set activeSportId and activePathId separately
                                updateActivePathId(pathId);
                            }
                            fetchEPT(sportId, parameters, {location: nextProps.location});
                        } else {
                            // redirect to default sport code and path id
                            onRedirect(`${baseUrl}/${sport.code.toLowerCase()}/p${sportId}`)
                            fetchEPT(sportId, parameters);
                        }
                    } else {
                        fetchEPT(pathId, parameters, {location: nextProps.location});
                        updateActiveSportCodeAndId(pathId, sportCode.toUpperCase());
                    }
                } else {
                    // invalid sport code
                    // TODO: should we redirect or display not found page?
                    onRedirect(url)
                }
            } else if (path !== prevPath) {
                updateActivePathId(pathId);
                let sport = sports.find(sport => sport.code === sportCode.toUpperCase());
                if (sport) {
                    let sportId = sport.defaultEventPathId;
                    let dateFilterParam = qs.parse(nextProps.location.search).dateFilter;
                    if (dateFilterParam) {
                        setAsFirstLoad(true);
                        setDatesFilter(decodeURI(dateFilterParam));
                        fetchEPT(sportId, parameters, {location: nextProps.location});
                    }
                } else {
                    onRedirect(url)
                }
            }
        } else if (this.props.parameters !== nextProps.parameters) {
            fetchEPT(nextProps.activeSportId, nextProps.parameters, {location: nextProps.location});
        }
        if (isFirstLoad && !nextProps.isFirstLoad) {
            // auto open parent paths
            let eventId = Number(qs.parse(nextProps.location.search).eventId);
            if (nextProps.activeSportId !== nextProps.activePathId) {
                let path = nextProps.pathsMap[nextProps.activePathId];
                if (path) {
                    let parentPaths = getParentPaths(nextProps.pathsMap[path.parentId], nextProps.pathsMap, []);
                    if (parentPaths.length) {
                        updatePaths(parentPaths);
                        updateActivePathAncestors([path.id, ...parentPaths.map(path => path.id)]);
                    }
                } else {
                    if (eventId) {
                        let path = nextProps.pathsMap[eventId];
                        if (path) {
                            let parentPaths = getParentPaths(nextProps.pathsMap[eventId], nextProps.pathsMap, []);
                            if (parentPaths.length) {
                                updatePaths(parentPaths);
                                updateActivePathAncestors([
                                    path.id,
                                    ...parentPaths.map(path => path.id)
                                ]);
                            }
                            this.props.fetchEventMarkets(eventId, parameters, {autoOpenParentPaths: true})
                        } else {
                            let { sportCode } = parsePathName(nextProps.location.pathname);
                            if (sportCode) {
                                let sport = sports.find(sport => sport.code === sportCode.toUpperCase());
                                if (sport) {
                                    onRedirect(`${baseUrl}/${sport.code.toLowerCase()}/p${sport.defaultEventPathId}`);
                                }
                            }
                        }
                    }
                }
                
            }
        }
    }
    render () {
        let {
            activeSport,
            isFetchingEPT,
            isFetchingEPTFailed,
            onPathClick,
            error,
        } = this.props;
        if (error) {
            return <div>{error}</div>
        } else if (activeSport && !isFetchingEPT && !isFetchingEPTFailed) {
            return <Paths onPathClick={onPathClick} />
        } else if (isFetchingEPTFailed) {
            // TODO: add retry button
            return <div>Error</div>
        } else {
            return <LoadingIndicator />
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(SportsTree);