import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import Path from './Path/index';

const mapStateToProps = (state, ownProps) => {
    let activeSportId = state.sportsTree.activeSportId;
    let pathsMap = state.sportsTree.pathsMap;
    let activeSport = pathsMap[activeSportId];
    return {
        activeSport: pathsMap[activeSportId],
        sportCount: activeSport ? activeSport.count : 0,
        sportEventCount: activeSport ? activeSport.eventCount : 0,
    };
    // sportCount and sportEventCount are needed just to re-render Path if count and eventCount changes
};

class Paths extends PureComponent {
    render () {
        let { activeSport, config, onPathClick, sportCount, sportEventCount } = this.props;
        return (
            <Path sport={activeSport} onPathClick={onPathClick} config={config} sportCount={sportCount} sportEventCount={sportEventCount} />
        );
    }
}

export default connect(mapStateToProps)(Paths);