import React from "react";
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { toggleExpand, toggleActive, changeBetType } from '../../actions';

const mapStateToProps = (state) => {
  return {
    filter: state.instantAction.betFilters.betType
  }
}

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({
    toggleExpand,
    toggleActive,
    changeBetType,
  }, dispatch);
};

class BetTypeFilter extends React.Component {
  render() {
    const { filter, toggleExpand, toggleActive, changeBetType } = this.props;
    return (
      <div className="bet-type-filter">
        <div className="toggle-header">
          <label>
            <input type="checkbox" checked={filter.active} onChange={() => toggleActive('betType')} />
            <span className="header-text">Bet type</span>
          </label>
          <i
            className={filter.expanded ? "toggle-button phxico phx-minus-box-outline" : "toggle-button phxico phx-plus-box-outline"}
            onClick={() => toggleExpand('betType')}
          >
          </i>
        </div>

        {filter.expanded &&
          <div className={filter.active ? "body" : "body disabled-body"}>
            <div className="single-bets-field">
              <label>
                <input
                  type="radio"
                  value="single"
                  checked={filter.value === 'single'}
                  onChange={(e) => changeBetType(e.target.value)}
                />
                <span>Single Bets</span>
              </label>
            </div>

            <div>
              <label>
                <input
                  type="radio"
                  value="multiple"
                  checked={filter.value === 'multiple'}
                  onChange={(e) => changeBetType(e.target.value)}
                />
                <span>Multiple/Accumulator Bets</span>
              </label>
            </div>
          </div>}
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(BetTypeFilter);