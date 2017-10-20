'use strict';
import React, { PropTypes } from "react";
import cx from 'classnames';

class Checkbox extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      checked: !!props.checked,
    }

    this._onChange = this._onChange.bind(this);
  }

  _onChange() {
    const {disabled, onChange, index } = this.props;

    if (disabled) return; // do nothing

    let {
      checked
    } = this.state;

    this.setState({
      checked: !checked
    }, ()=>{
      if (onChange) {
        onChange(!checked, index);
      }
    });
  }

  componentWillReceiveProps(nextProps) {
    const { checked } = nextProps;

    this.setState({ checked });
  }

  render() {
    const {
      label,
      disabled,
      onChange
    } = this.props;

    const { checked } = this.state;

    let checkboxClass = cx('checkbox', {'-disabled': disabled});
    let checkboxIconClass = cx('checkboxIcon', 'phxico', {
      'phx-checkbox-blank-outline': !checked,
      'phx-checkbox-marked': checked,
      '-checked': checked,
      '-disabled': disabled,
    });

    return(
      <div className={checkboxClass} onClick={this._onChange}>
        <div className='checkboxIconContainer'><i className={checkboxIconClass}></i></div>
        {label}
      </div>
    );
  }
};


Checkbox.propTypes = {
  label: PropTypes.string,
  checked: PropTypes.bool,
  disabled: PropTypes.bool,
  onChange: PropTypes.func,
};


Checkbox.defaultProps = {
  label: null,
  checked: false,
  disabled: false,
  onChange: null,
};

export default Checkbox;
