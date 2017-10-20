import React from "react";
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { getUniqueId } from '../../helpers';
import {
  changeLowerLimit,
  changeUpperLimit,
  changeFontColor,
  changeBackgroundColor,
  addFormatterItem
} from '../../actions';

const mapStateToProps = (state) => {
  return {
    betDisplay: state.instantAction.betDisplay
  }
}

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({
    changeLowerLimit,
    changeUpperLimit,
    changeFontColor,
    changeBackgroundColor,
    addFormatterItem
  }, dispatch);
};

class BetsFormatting extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      lowerLimitWarning: false,
      upperLimitWarning: false
    }
    this._changeLowerLimit = this._changeLowerLimit.bind(this);
    this._changeUpperLimit = this._changeUpperLimit.bind(this);
    this._addFormatter = this._addFormatter.bind(this);
  }

  _handleKeyPress(e) {
    if (!(e.charCode >= 48 && e.charCode <= 57)) {
      e.preventDefault();
    }
  }

  _changeLowerLimit(e) {
    this.props.changeLowerLimit(e.target.value);
    this.setState(() => ({ lowerLimitWarning: false }))
  }

  _changeUpperLimit(e) {
    this.props.changeUpperLimit(e.target.value);
    this.setState(() => ({ upperLimitWarning: false }))
  }

  _addFormatter() {
    const { lowerLimit, upperLimit, fontColor, backgroundColor } = this.props.betDisplay;
    if (!lowerLimit) {
      this.setState(() => ({ lowerLimitWarning: true }))
    }

    if (!upperLimit) {
      this.setState(() => ({ upperLimitWarning: true }))
    }

    if (lowerLimit && upperLimit) {
      if (Number(lowerLimit) > Number(upperLimit)) {
        this.setState(() => ({ lowerLimitWarning: true, upperLimitWarning: true }))
      } else {
        this.props.addFormatterItem({
          id: getUniqueId(),
          lowerLimit,
          upperLimit,
          fontColor,
          backgroundColor
        });
      }
    }
  }

  render() {
    const { lowerLimit, upperLimit, fontColor, backgroundColor } = this.props.betDisplay;
    const { changeLowerLimit, changeUpperLimit, changeFontColor, changeBackgroundColor } = this.props;
    return (
      <div className="profileformat-wrapper">
        <div className="form-head">
          <div className="form-head-txt">NEW PROFILE FORMAT</div>
          <button className="btn-newformat" onClick={this._addFormatter}>
            <i className="phxico phx-plus"></i>
          </button>
        </div>
        <div className="lower-limit input-wrapper">
          <div><label htmlFor="lowerLimit">LOWER LIMIT</label></div>
          <div className="field">
            <input
              type="number"
              id="lowerLimit"
              value={lowerLimit}
              onKeyPress={this._handleKeyPress}
              onChange={this._changeLowerLimit}
              className={this.state.lowerLimitWarning ? "error" : ""}
            />
          </div>
        </div>
        <div className="upper-limit input-wrapper">
          <div><label htmlFor="upperLimit">UPPER LIMIT</label></div>
          <div className="field">
            <input
              type="number"
              id="upperLimit"
              value={upperLimit}
              onKeyPress={this._handleKeyPress}
              onChange={this._changeUpperLimit}
              className={this.state.upperLimitWarning ? "error" : ""}
            />
          </div>
        </div>
        <div className="colorpicker-wrap">
          <div className="input-wrapper">
            <div>FONT COLOR</div>
            <div className="field">
              <input
                type="color"
                value={fontColor}
                onChange={(e) => changeFontColor(e.target.value)}
              />
            </div>
          </div>
          <div className="input-wrapper">
            <div>BACKGROUND</div>
            <div className="field">
              <input
                type="color"
                value={backgroundColor}
                onChange={(e) => changeBackgroundColor(e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(BetsFormatting);