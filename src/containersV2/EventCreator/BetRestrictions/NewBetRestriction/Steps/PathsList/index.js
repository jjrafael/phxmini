import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import SportsTree from 'containersV2/SportsTree/index';
import { fetchRestrictionEPT, updateActivePathId } from 'containersV2/SportsTree/actions';
import { updateNewMatrixData } from 'containersV2/EventCreator/BetRestrictions/actions';

const mapStateToProps = (state) => {
    return {
        allSports: state.apiConstants.values.riskSports,
        activeSportCode: state.sportsTree.activeSportCode,
        isSportsTreeLoaded: state.sportsTree.isLoaded,
    };
};

const mapDispatchToProps = (dispatch) => {
    return bindActionCreators({
        fetchRestrictionEPT, updateActivePathId, updateNewMatrixData
    }, dispatch);
};

class PathsList extends Component {
    constructor (props) {
        super(props);
        this._onSportsTreeMount = this._onSportsTreeMount.bind(this);
        this._onWillUpdate = this._onWillUpdate.bind(this);
        this._onPathClick = this._onPathClick.bind(this);
    }

    componentWillUpdate (nextProps) {
        const {activeSportCode, fetchRestrictionEPT } = nextProps;
        if (activeSportCode !== this.props.activeSportCode) {
            fetchRestrictionEPT(activeSportCode)
        }
    }
    _onSportsTreeMount () {
        const { fetchRestrictionEPT, activeSportCode, isSportsTreeLoaded } = this.props;
        if (!isSportsTreeLoaded) {
            fetchRestrictionEPT(activeSportCode);
        }
    }
    _onPathClick (path) {
        const { updateNewMatrixData, updateActivePathId } = this.props;
        updateActivePathId(path.id);
        updateNewMatrixData({
            eventPathId: path.id,
            eventPath: path.path,
            eventPathDescription: path.description
        })
    }
    _onWillUpdate () {
        // do nothing
    }
    render () {
        let { } = this.props;
        return (
            <div className="list-container list-container-sports">
                <SportsTree
                    onPathClick={this._onPathClick}
                    onMount={this._onSportsTreeMount}
                    onWillUpdate={this._onWillUpdate}
                    error={''}
                />
            </div>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(PathsList);