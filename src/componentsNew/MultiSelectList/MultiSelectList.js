'use strict';
import React, {
  PropTypes
} from "react";
import cx from 'classnames';
import _ from 'underscore';
import Checkbox from '../Fields/Checkbox';

class MultiSelectList extends React.Component {
  constructor(props) {
    super(props);

    // init selectedItems mapping
    let selectedItems = {};
    let listSize = _.size(props.listItems);
    let i;
    for (i = 0; i < listSize; i++) {
      selectedItems[i] = false;
    };

    //zero-based
    _.each(props.initialCheckedItems, (checkedIdx) => {
      if (checkedIdx < listSize) {
        selectedItems[checkedIdx] = true;
      }
    });

    this.state = {
      selectedItemsMap: selectedItems,
      allSelected: !_.contains(_.values(selectedItems), false),
    };

    this._onSelectionChange = this._onSelectionChange.bind(this);
    this._onSelectAllChange = this._onSelectAllChange.bind(this);
  }

  _onSelectionChange(selected, index) {
    const {
      disabled,
      onSelectionChange
    } = this.props;

    if (disabled) return;

    let {
      selectedItemsMap
    } = this.state;

    selectedItemsMap[index] = selected;

    this.setState({
      selectedItemsMap,
      allSelected: !_.contains(_.values(selectedItemsMap), false)
    }, () => {
      if (onSelectionChange) {
        onSelectionChange(selectedItemsMap)
      }
    });

  }

  _onSelectAllChange() {
    const {
      disabled,
      onSelectionChange
    } = this.props;

    if (disabled) return;

    let {
      selectedItemsMap,
      allSelected
    } = this.state;

    allSelected = !allSelected;
    let indexKeys = _.keys(selectedItemsMap);
    _.each(indexKeys, (key) => {
      selectedItemsMap[key] = allSelected;
    });

    this.setState({
      selectedItemsMap,
      allSelected
    }, () => {
      if (onSelectionChange) {
        onSelectionChange(selectedItemsMap)
      }
    });
  }

  _renderListTitle() {
    const { listTitle, disabled } = this.props;
    const { allSelected } = this.state;

    let checkboxClass = cx('checkbox', 'multi-select-list-title-text', {'-disabled': disabled});
    let checkboxIconClass = cx('checkboxIcon', 'multi-select-list-title-icon', 'phxico', {
      'phx-checkbox-blank-outline': !allSelected,
      'phx-checkbox-marked': allSelected,
      '-checked': allSelected,
      '-disabled': disabled,
    });

    return(
      <div className={checkboxClass} onClick={this._onSelectAllChange}>
        <div className='checkboxIconContainer'><i className={checkboxIconClass}></i></div>
        {listTitle}
      </div>
    );
  }

  _renderListItems() {
    const {
      listItems,
      disabled
    } = this.props;
    const {
      selectedItemsMap
    } = this.state;

    return _.map(listItems, (item, idx) => {
      return (
        <Checkbox
          key={idx}
          index={idx}
          label={item}
          checked={selectedItemsMap[idx]}
          disabled={disabled}
          onChange={this._onSelectionChange}
          />
      );
    });

  }

  render() {
    const {
      disabled,
      listTitle
    } = this.props;

    const {
      allSelected
    } = this.state;

    let multiSelectListClass = cx("multi-select-list", {
      "-disabled": disabled
    });
    let multiSelectListContainerClass = cx("multi-select-list-title-container", {
      "-disabled": disabled
    });


    return (
      <div className={multiSelectListClass}>
        <div className={multiSelectListContainerClass}>
          {
            this._renderListTitle()
          }
        </div>
        <ul>
          {
            this._renderListItems()
          }
        </ul>
      </div>
    );
  }
}


MultiSelectList.propTypes = {
  listTitle: PropTypes.string,
  listItems: PropTypes.arrayOf(PropTypes.string), // array of string
  initialCheckedItems: PropTypes.arrayOf(PropTypes.number), // array of checked item's index
  disabled: PropTypes.bool,
  onSelectionChange: PropTypes.func, // returns a mapping of checked/unchecked indices {index:true/false}
};


MultiSelectList.defaultProps = {
  listItems: [],
  initialCheckedItems: [],
  disabled: false,
  onSelectionChange: null,
};


export default MultiSelectList;
