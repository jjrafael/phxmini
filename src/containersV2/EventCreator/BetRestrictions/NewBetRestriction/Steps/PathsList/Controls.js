import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import ButtonExpandAll from 'containersV2/SportsTree/Controls/ButtonExpandAll';
import ButtonCollapseAll from 'containersV2/SportsTree/Controls/ButtonCollapseAll';
import ButtonSort from 'containersV2/SportsTree/Controls/ButtonSort';
import ButtonRefresh from 'containersV2/SportsTree/Controls/ButtonRefresh';
import SportsDropdown from 'containersV2/SportsTree/Controls/SportsDropdown';
import Search from 'containersV2/SportsTree/Controls/Search';
import { updateActiveSportCodeAndId, fetchRestrictionEPT } from 'containersV2/SportsTree/actions';
import { updateNewMatrixData } from 'containersV2/EventCreator/BetRestrictions/actions';

const mapStateToProps = (state) => {
    return {
        allSports: state.apiConstants.values.riskSports,
        activeSportCode: state.sportsTree.activeSportCode,
    };
};

const mapDispatchToProps = (dispatch) => {
    return bindActionCreators({
        updateActiveSportCodeAndId, fetchRestrictionEPT, updateNewMatrixData
    }, dispatch);
};

class ControlsContainer extends Component {
    render () {
        let { allSports, updateActiveSportCodeAndId, activeSportCode, fetchRestrictionEPT, updateNewMatrixData } = this.props;
        return (
            <div className="sports-tree-controls">
                <div className="controls-group">
                    <div>
                        <SportsDropdown
                            onSportChange={id => {
                                let sport = allSports.find(sport => sport.defaultEventPathId === id);
                                updateActiveSportCodeAndId(sport.defaultEventPathId, sport.code);
                                updateNewMatrixData({
                                    eventPathId: sport.defaultEventPathId,
                                    eventPath: sport.path,
                                    eventPathDescription: sport.description
                                })
                            }}
                            sports={allSports}
                        />
                    </div>
                    <div>
                        <Search />
                    </div>
                    <div>
                        <ButtonExpandAll />
                        <ButtonCollapseAll />
                        <ButtonSort />
                        <ButtonRefresh onClick={() => fetchRestrictionEPT(activeSportCode)} />
                    </div>
                </div>
            </div>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ControlsContainer);
