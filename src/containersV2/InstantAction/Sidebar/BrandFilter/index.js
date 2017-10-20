import React from "react";
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { changeBrandValue } from '../../actions';

const mapStateToProps = (state) => {
  return {
    value: state.instantAction.brandFilter
  }
}

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({
    changeBrandValue
  }, dispatch);
};

class BrandFilter extends React.Component {
  render() {
    const { value, changeBrandValue } = this.props;
    return (
      <div className="brand-filter">
        <div>
          <span>Brand</span>
        </div>

        <div className="select-field">
          <select value={value} onChange={(e) => changeBrandValue(e.target.value)}>
            <option value="All">All</option>
            <option value="MSW">MSW</option>
            <option value="Kenya">Kenya</option>
          </select>
        </div>
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(BrandFilter);