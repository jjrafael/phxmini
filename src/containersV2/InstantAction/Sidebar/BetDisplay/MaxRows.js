import React from "react";
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { changeMaxRows } from '../../actions';

const mapStateToProps = (state) => {
  return {
    value: state.instantAction.betDisplay.maxRows
  }
}

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({
    changeMaxRows
  }, dispatch);
};

class MaxRows extends React.Component {
  _handleKeyPress(e) {
    if (!(e.charCode >= 48 && e.charCode <= 57)) {
      e.preventDefault();
    }
  }

  render() {
    const { value, changeMaxRows } = this.props;
    return (
      <div className="max-rows input-wrapper">
        <label htmlFor="maxRows">MAX TABLE ROWS</label>
        <div className="field">
          <input
            type="number"
            id="maxRows"
            value={value}
            onKeyPress={this._handleKeyPress}
            onChange={(e) => changeMaxRows(e.target.value)}
          />
        </div>
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(MaxRows);


