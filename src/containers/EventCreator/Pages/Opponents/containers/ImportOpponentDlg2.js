import React from "react";
import {
  connect
} from 'react-redux';
import {
  bindActionCreators
} from 'redux';
import _ from "underscore";
import MultiSelectList from "phxNewComponents/MultiSelectList/MultiSelectList";
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';

//actions
import {
  fetchEventPathAncestralOpponents,
  assignMultipleOpponentsToEventPath
} from "eventCreatorOpponentsActions/opponentsAction";

//components
import ModalWindow from 'components/modal';
import { toastr } from 'phxComponents/toastr/index';
import LoadingIndicator from 'phxComponents/loadingIndicator';


const mapStateToProps = (state) => {
  return {
    isOpponentActing: state.opponentsReducers.isFetchEventPathAncestralOpponentsPerforming,
    ancestralOpponentsList: state.opponentsReducers.eventPathAncestralOpponentsList,
    isAssigningMultipleActing: state.opponentsReducers.isAssignMultipleOpponentsToEventPathPerforming,
    actionFailed: state.opponentsReducers.actionFailed,
    errorMessage: state.opponentsReducers.errorMessage,
  }
}

const mapDispatchToProps = (dispatch) => {
    return bindActionCreators({
        fetchEventPathAncestralOpponents,
        assignMultipleOpponentsToEventPath
    }, dispatch)
}

class ImportOpponentDlg2 extends React.Component {
  constructor(props) {
    super(props);

    const { selectedOpponentType } = props;
    const tabIndexSelected = selectedOpponentType ? selectedOpponentType.id - 1 : 0;

    this.state = {
      teamSelected: [],
      filteredTeamItems: [],
      teamDescList: [],

      playerSelected: [],
      filteredPlayerItems: [],
      playerDescList: [],

      horseSelected: [],
      filteredHorseItems: [],
      horseDescList: [],

      tabIndexSelected,

      importButtonDisabled: false,
    }

    this._onTabSelect = this._onTabSelect.bind(this);
    this._onSelectionChange = this._onSelectionChange.bind(this);
    this._onClickImport = this._onClickImport.bind(this);
  };

  componentDidMount() {
    const {
      pathId,
      fetchEventPathAncestralOpponents
    } = this.props;
    fetchEventPathAncestralOpponents(pathId);
  };

  componentWillUpdate(nextProps) {

    const {
      ancestralOpponentsList: prevList,
      selectedOpponentType
    } = this.props;

    const {
      ancestralOpponentsList: newList
    } = nextProps;

    if (prevList != newList) {
      // split the list into three types, team(1), player(2) and horse(3)

      // extract team first
      let tempList = _.partition(newList, (item) => {
        return item.typeId === 1;
      });

      let teamList = Object.assign([], tempList[0]);

      // partition player and horse
      let tempList2 = _.partition(tempList[1], (item) => {
        return item.typeId === 2;
      });

      let playerList = Object.assign([], tempList2[0]);
      let horseList = Object.assign([], tempList2[1]);

      // all selected by default
      let teamSelected = _.range(_.size(teamList));
      let playerSelected = _.range(_.size(playerList));
      let horseSelected = _.range(_.size(horseList));

      // extract description only
      let teamDescList = _.pluck(teamList, 'description');
      let playerDescList = _.pluck(playerList, 'description');
      let horseDescList = _.pluck(horseList, 'description');

      // enablement of import button
      const { tabIndexSelected } = this.state;

      let selectedList;

      switch(tabIndexSelected) {
        case 0:
          selectedList = teamSelected;
        break;

        case 1:
          selectedList = playerSelected;
        break;

        case 2:
          selectedList = horseSelected;
        break;

      };

      this.setState({
        teamSelected,
        filteredTeamItems: teamList,
        teamDescList,

        playerSelected,
        filteredPlayerItems: playerList,
        playerDescList,

        horseSelected,
        filteredHorseItems: horseList,
        horseDescList,

        importButtonDisabled: _.isEmpty(selectedList),
      })
    }
  };

  componentDidUpdate(prevProps, prevState) {
    const prevAssigningMultiple = prevProps.isAssigningMultipleActing;
    const {isAssigningMultipleActing: assigningMultiple, actionFailed, errorMessage, onImportSuccess} = this.props;

    if (prevAssigningMultiple && !assigningMultiple) {
      if (!actionFailed) {
        toastr.add({message: 'Importing Opponents Successful!', type: 'SUCCESS'});
        onImportSuccess();
      } else {
        toastr.add({message: errorMessage, type: 'ERROR'});
      }
    }
  };

  _onTabSelect(selectedIndex, lastSelectedIndex) {

    const {
      teamSelected,
      playerSelected,
      horseSelected,
    } = this.state;

    let selectedList;

    switch(selectedIndex) {
      case 0:
        selectedList = teamSelected;
      break;

      case 1:
        selectedList = playerSelected;
      break;

      case 2:
        selectedList = horseSelected;
      break;

    };

    this.setState({
      tabIndexSelected: selectedIndex,
      importButtonDisabled: _.isEmpty(selectedList),
    });
  }

  _onSelectionChange(selected) {
    const {
      tabIndexSelected
    } = this.state;

    let selectedIndicesString = _.keys(_.pick(selected, (value, key, object) => {
      return value === true;
    }));

    let selectedIndices = _.map(selectedIndicesString, (idxStr) => {
      return parseInt(idxStr)
    });

    let selectedList;
    switch(tabIndexSelected) {
      case 0:
        this.setState({teamSelected: selectedIndices, importButtonDisabled: _.isEmpty(selectedIndices)});
      break;

      case 1:
        this.setState({playerSelected: selectedIndices, importButtonDisabled: _.isEmpty(selectedIndices)});
      break;

      case 2:
        this.setState({horseSelected: selectedIndices, importButtonDisabled: _.isEmpty(selectedIndices)});
      break;

    };

  }

  _onClickImport() {
    const {
      assignMultipleOpponentsToEventPath,
      pathId
    } = this.props;

    const {
      tabIndexSelected,
      teamSelected,
      filteredTeamItems,
      playerSelected,
      filteredPlayerItems,
      horseSelected,
      filteredHorseItems,
    } = this.state;

    let filteredItems;
    let selectedList;

    switch(tabIndexSelected) {
      case 0:
        filteredItems = filteredTeamItems;
        selectedList = teamSelected;
      break;

      case 1:
        filteredItems = filteredPlayerItems;
        selectedList = playerSelected;
      break;

      case 2:
        filteredItems = filteredHorseItems;
        selectedList = horseSelected;
      break;

    };

    let selectedItems = _.filter(filteredItems, (item, index) => {
      return _.indexOf(selectedList, index) !== -1;
    });
    let selectedIds = _.pluck(selectedItems, 'id');

    assignMultipleOpponentsToEventPath(pathId, selectedIds);
  }

  _renderListDisplay() {
    const {
      isOpponentActing,
      selectedOpponentType,
      opponentTypes,
      selectableTypes
    } = this.props;

    const {
      tabIndexSelected,
      teamSelected,
      filteredTeamItems,
      teamDescList,
      playerSelected,
      filteredPlayerItems,
      playerDescList,
      horseSelected,
      filteredHorseItems,
      horseDescList
    } = this.state;

    const typeDescription = selectedOpponentType ? selectedOpponentType.description.toUpperCase() : '';
    const selectedType = selectedOpponentType ? selectedOpponentType.id : 1;

    if (selectableTypes) {
      return (
        <Tabs
            selectedIndex={tabIndexSelected}
            onSelect={this._onTabSelect}>

            <TabList>
              <Tab key={0}>
                  <span className="tab-header">Team</span>
              </Tab>
              <Tab key={1}>
                  <span className="tab-header">Player</span>
              </Tab>
              <Tab key={2}>
                  <span className="tab-header">Horse</span>
              </Tab>
            </TabList>

            <TabPanel key={0}>
              {
                _.isEmpty(filteredTeamItems) ?
                <div className='importOpponentDlgTextContent'>
                  {`No Team Opponents Found`}
                </div>
                :
                <MultiSelectList
                  listTitle={selectedOpponentType ? `All ${typeDescription}` : 'All'}
                  listItems={teamDescList}
                  initialCheckedItems={teamSelected}
                  onSelectionChange={this._onSelectionChange}
                  />
              }
            </TabPanel>
            <TabPanel key={1}>
              {
                _.isEmpty(filteredPlayerItems) ?
                <div className='importOpponentDlgTextContent'>
                  {'No Player Opponents Found'}
                </div>
                :
                <MultiSelectList
                  listTitle={selectedOpponentType ? `All ${typeDescription}` : 'All'}
                  listItems={playerDescList}
                  initialCheckedItems={playerSelected}
                  onSelectionChange={this._onSelectionChange}
                  />
              }
            </TabPanel>
            <TabPanel key={2}>
              {
                _.isEmpty(filteredPlayerItems) ?
                <div className='importOpponentDlgTextContent'>
                  {'No Horse Opponents Found'}
                </div>
                :
                <MultiSelectList
                  listTitle={selectedOpponentType ? `All ${typeDescription}` : 'All'}
                  listItems={horseDescList}
                  initialCheckedItems={horseSelected}
                  onSelectionChange={this._onSelectionChange}
                  />
              }
            </TabPanel>

        </Tabs>
      );

    } else {


      let itemList;
      let selectedList;
      let listIsEmpty = false;

      switch(tabIndexSelected) {
        case 0:
          itemList = teamDescList;
          selectedList = teamSelected;
          listIsEmpty = _.isEmpty(filteredTeamItems);
        break;

        case 1:
          itemList = playerDescList;
          selectedList = playerSelected;
          listIsEmpty = _.isEmpty(filteredPlayerItems);
        break;

        case 2:
          itemList = horseDescList;
          selectedList = horseSelected;
          listIsEmpty = _.isEmpty(filteredHorseItems);
        break;

      };

      if (listIsEmpty) {
        return (
          <div className='importOpponentDlgTextContent'>
            {`No ${typeDescription} Opponents Found`}
          </div>);

      } else {
        return (
          <MultiSelectList
            listTitle={selectedOpponentType ? `All ${typeDescription}` : 'All'}
            listItems={itemList}
            initialCheckedItems={selectedList}
            onSelectionChange={this._onSelectionChange}
            />
        )
      }
    }

  }

  _renderLoadingIndicator() {
      return (
        <ModalWindow
            key="loading-modal"
            className="small-box"
            title="Loading"
            name="error"
            isVisibleOn={true}
            shouldCloseOnOverlayClick={false}
            closeButton={false}>
            <div>
              <LoadingIndicator />
            </div>
        </ModalWindow>
      )
  }

  render() {
    const {isOpponentActing, isAssigningMultipleActing, selectedOpponentType, opponentTypes, selectableTypes} = this.props;
    const { tabIndexSelected, filteredTeamItems, filteredPlayerItems, filteredHorseItems, importButtonDisabled } = this.state;

    const typeDescription = selectedOpponentType
      ? selectedOpponentType.description.toUpperCase()
      : '';

    const loadingLabel = selectableTypes
      ? 'Loading Opponents...'
      : `Loading ${typeDescription} Opponents...`;

    if (isOpponentActing) {
      return (
        <div className='importOpponentDlgTextContent'>
          {loadingLabel}
        </div>);

    } else {

      return (
        <div>
          <div className='importOpponentDlg'>
            {this._renderListDisplay()}
          </div>
          <div className="importOpponentDlgBottomBar">
            <button
              className='importButton'
              disabled={importButtonDisabled}
              onClick={this._onClickImport}>Import</button>
          </div>

          {
            isAssigningMultipleActing && this._renderLoadingIndicator()
          }
        </div>
      );

    }

  }
};

export default connect(mapStateToProps, mapDispatchToProps)(ImportOpponentDlg2);
