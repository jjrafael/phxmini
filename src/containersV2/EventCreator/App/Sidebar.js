import React from "react";
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { push, replace } from 'react-router-redux';
import { saveReorder, setEventPathMode } from '../Path/actions';
import { betRestrictionHasChanges } from '../BetRestrictions/helpers';
import { modes } from '../Path/constants';
import { DUMMY_ID, availableDates } from 'containersV2/SportsTree/constants';
import { fetchEPT, deletePath, addToPathSelections, removeFromPathSelections, reset } from 'containersV2/SportsTree/actions';
import SportsTree from 'containersV2/SportsTree/index';
import SportsDropdown from 'containersV2/SportsTree/Controls/SportsDropdown';
import DatesDropdown from 'containersV2/SportsTree/Controls/DatesDropdown';
import MarketStatusDropdown from 'containersV2/SportsTree/Controls/MarketStatusDropdown';
import Search from 'containersV2/SportsTree/Controls/Search';
import ButtonExpandAll from 'containersV2/SportsTree/Controls/ButtonExpandAll';
import ButtonCollapseAll from 'containersV2/SportsTree/Controls/ButtonCollapseAll';
import ButtonSort from 'containersV2/SportsTree/Controls/ButtonSort';
import ButtonFilter from 'containersV2/SportsTree/Controls/ButtonFilter';
import ButtonRefresh from 'containersV2/SportsTree/Controls/ButtonRefresh';
import ButtonReorder from 'containersV2/SportsTree/Controls/ButtonReorder';
import ButtonSave from 'containersV2/SportsTree/Controls/ButtonSave';
import ConfirmModal from 'componentsV2/Modal/ConfirmModal';

function mapStateToProps(state) {
    return {
        apiConstants: state.apiConstants,
        isSaveButtonDisabled: state.eventCreatorApp.isSaveButtonDisabled,
        isBulkUpdateActive: state.eventCreatorApp.isBulkUpdateActive,
        activeSportId: state.sportsTree.activeSportId,
        parameters: state.sportsTree.parameters,
        pathSelectionsMap: state.sportsTree.pathSelectionsMap,
        baseUrl: state.sportsTree.baseUrl,
        isCreatingNewPath: !!state.sportsTree.pathsMap[DUMMY_ID],
        matrixDataCache: state.betRestrictions.matrixDataCache,
    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        reset,
        saveReorder,
        push,
        replace,
        setEventPathMode,
        fetchEPT,
        deletePath,
        addToPathSelections,
        removeFromPathSelections,
    }, dispatch);
}

class Sidebar extends React.Component {
    constructor(props) {
        super(props);
        this._onPathClick = this._onPathClick.bind(this);
        this.state = {
            showConfirmationModal: false,
            nextUrl: ''
        };
    }

    componentWillUnmount() {
        this.props.reset();
    }

    _onPathClick (path) {
        if (this.props.isBulkUpdateActive) {
            if (path.level !== 0) {
                if (!!this.props.pathSelectionsMap[path.id]) {
                    this.props.removeFromPathSelections(path);
                } else {
                    this.props.addToPathSelections(path);
                }
            }
        } else {
            let brHasChanges = betRestrictionHasChanges(this.props.matrixDataCache);
            if (this.props.isCreatingNewPath || !this.props.isSaveButtonDisabled || brHasChanges) {
                this.setState({showConfirmationModal: true, nextUrl: path.url});
            } else {
                this.props.push(path.url)
            }
        }
    }


    render() {
        const { deletePath } = this.props;
        let allSports = this.props.apiConstants.values.riskSports;
        let baseUrl = this.props.baseUrl;
        return <div className="event-creator-sidebar">       
            <div className="sidebar-header">
                <SportsDropdown
                    onSportChange={id => {
                        let sport = allSports.find(sport => sport.defaultEventPathId === id);
                        let url = `${baseUrl}/${sport.code.toLowerCase()}/p${sport.defaultEventPathId}`;
                        this.props.push(url);
                    }}
                    sports={allSports}
                />
                <DatesDropdown availableDates={availableDates}/>
                <MarketStatusDropdown />
                <Search />
                <div className="sports-tree-controls">
                    <div className="controls-group">
                        <ButtonExpandAll />
                        <ButtonCollapseAll />
                        <ButtonSort />
                        <ButtonFilter />
                    </div>
                    <div className="controls-group flex--grow flex--justify-center">
                        <ButtonReorder title="Move to top" icon="phx-move-top" direction="top" />
                        <ButtonReorder title="Move up" icon="phx-move-up" direction="up" />
                        <ButtonReorder title="Move down" icon="phx-move-down" direction="down" />
                        <ButtonReorder title="Move to bottom" icon="phx-move-bottom" direction="bottom" />
                    </div>
                    <div className="controls-group">
                        <ButtonRefresh />
                        <ButtonSave />
                    </div>
                </div>
            </div>
            <div className="sidebar-body">
                <SportsTree
                    onPathClick={this._onPathClick}
                    onRedirect={url => {
                        this.props.replace(url);
                    }}
                    location={this.props.location}
                    sports={allSports}
                />
                <ConfirmModal
                    isVisible={this.state.showConfirmationModal}
                    onConfirm={() => {
                        this.props.setEventPathMode(modes.VIEW);
                        this.setState({showConfirmationModal: false});
                        if (this.props.isCreatingNewPath) {
                            this.props.replace(this.state.nextUrl);
                            deletePath(DUMMY_ID);
                        } else {
                            this.props.push(this.state.nextUrl);
                        }
                    }}
                    onCancel={() => {
                        this.setState({showConfirmationModal: false})
                    }}
                />
            </div>
        </div>
    }
}


export default connect(mapStateToProps, mapDispatchToProps)(Sidebar);
