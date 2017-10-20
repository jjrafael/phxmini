import React from "react";
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { toggleExpand, toggleActive, toggleMarketsType } from '../../actions';

const mapStateToProps = (state) => {
  return {
    filter: state.instantAction.betFilters.markets
  }
}

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({
    toggleExpand,
    toggleActive,
    toggleMarketsType
  }, dispatch);
};

class MarketsFilter extends React.Component {
  render() {
    const { filter, toggleExpand, toggleActive, toggleMarketsType } = this.props;
    return (
      <div className="markets-filter">
        <div className="toggle-header">
          <label>
            <input type="checkbox" checked={filter.active} onChange={() => toggleActive('markets')} />
            <span className="header-text">Markets from </span>
          </label>
          <i
            className={filter.expanded ? "toggle-button phxico phx-minus-box-outline" : "toggle-button phxico phx-plus-box-outline"}
            onClick={() => toggleExpand('markets')}
          >
          </i>
        </div>

        {filter.expanded &&
          <div className={filter.active ? "body" : "body disabled-body"}>
            <div className="mainbook-field">
              <label>
                <input
                  type="checkbox"
                  checked={filter.mainbook}
                  onChange={() => toggleMarketsType('mainbook')}
                />
                <span>Mainbook</span>
              </label>
            </div>

            <div>
              <label>
                <input
                  type="checkbox"
                  checked={filter.live}
                  onChange={() => toggleMarketsType('live')}
                />
                <span>Live</span>
              </label>
            </div>
          </div>}
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(MarketsFilter);