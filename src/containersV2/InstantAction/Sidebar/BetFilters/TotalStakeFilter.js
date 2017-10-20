import React from "react";
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { toggleActive, changeTotalStakeType, changeTotalStakeValue } from '../../actions';

const mapStateToProps = (state) => {
  return {
    filter: state.instantAction.betFilters.totalStake
  }
}

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({
    toggleActive,
    changeTotalStakeType,
    changeTotalStakeValue
  }, dispatch);
};

class TotalStakeFilter extends React.Component {
  render() {
    const { filter, toggleActive, changeTotalStakeType, changeTotalStakeValue } = this.props;
    return (
      <div className="total-stake-filter">
        <div>
          <label>
            <input type="checkbox" checked={filter.active} onChange={() => toggleActive('totalStake')} />
            <span>Total Stake Amount</span>
          </label>
        </div>

        <div className={filter.active ? "select-fields" : "select-fields disabled-body"}>
          <select value={filter.type} onChange={(e) => changeTotalStakeType(e.target.value)}>
            <option value="atLeast">At least</option>
            <option value="lessThan">Less than</option>
          </select>
          <select value={filter.amount || 500} onChange={(e) => changeTotalStakeValue(e.target.value)}>
            <option value={25000}>&#8369;25000</option>
            <option value={10000}>&#8369;10000</option>
            <option value={5000}>&#8369;5000</option>
            <option value={1000}>&#8369;1000</option>
            <option value={500}>&#8369;500</option>
            <option value={250}>&#8369;250</option>
            <option value={200}>&#8369;200</option>
            <option value={100}>&#8369;100</option>
            <option value={50}>&#8369;50</option>
            <option value={25}>&#8369;25</option>
            <option value={20}>&#8369;20</option>
            <option value={15}>&#8369;15</option>
            <option value={10}>&#8369;10</option>
            <option value={5}>&#8369;5</option>
          </select>
        </div>
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(TotalStakeFilter);