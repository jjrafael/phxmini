import React from "react";
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { toggleActive, changeRiskAmountType, changeRiskAmountValue } from '../../actions';

const mapStateToProps = (state) => {
  return {
    filter: state.instantAction.betFilters.riskAmount
  }
}

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({
    toggleActive,
    changeRiskAmountType,
    changeRiskAmountValue
  }, dispatch);
};

class RiskAmountFilter extends React.Component {
  render() {
    const { filter, toggleActive, changeRiskAmountType, changeRiskAmountValue } = this.props;
    return (
      <div className="risk-amount-filter">
        <div>
          <label>
            <input type="checkbox" checked={filter.active} onChange={() => this.props.toggleActive('riskAmount')} />
            <span>Risk Amount</span>
          </label>
        </div>

        <div className={filter.active ? "select-fields" : "select-fields disabled-body"}>
          <select value={filter.type} onChange={(e) => changeRiskAmountType(e.target.value)}>
            <option value="atLeast">At least</option>
            <option value="lessThan">Less than</option>
          </select>
          <select value={filter.amount} onChange={(e) => changeRiskAmountValue(e.target.value)}>
            <option value={500}>&#8369;500</option>
            <option value={1000}>&#8369;1000</option>
          </select>
        </div>
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(RiskAmountFilter);