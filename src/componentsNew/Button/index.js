'use strict';
import React, {
  PropTypes
} from "react";
import cx from 'classnames';

class Button extends React.Component {
  constructor(props) {
    super(props);

    this._onClick = this._onClick.bind(this);
  }

  _onClick(e) {
    const { onClick, id, title, disabled} = this.props;

    if (onClick && !disabled) {
      onClick(id, title);
    }
  }

  render() {
    const {
      type,
      title,
      onClick,
      iconName,
      disabled,
      active
    } = this.props;

    //let btnClass = cx('btn', {
    let btnClass = cx('btn-componentized' /*change this to btn when ready to componentize*/, {
      'active': active,
      'disabled': disabled,
      'btn-primary': type === 'primary',
      'btn-icon': type === 'icon'
    });
    let iconClass = cx('phxico', `phx-${iconName}`);

    return (
      <div className={btnClass} onClick={this._onClick} data-icon={iconName ? 'true' : 'false'} title={title} >
        {
          iconName &&
            <i className={iconClass}></i>
        }
        {
          type !== 'icon' ? title : null
        }
      </div>
    );
  }
}


Button.propTypes = {
  type: PropTypes.oneOf(['default', 'primary', 'icon']),
  id: PropTypes.string,
  title: PropTypes.string,
  onClick: PropTypes.func,
  iconName: PropTypes.string,
  disabled: PropTypes.bool,
  active: PropTypes.bool,
};


Button.defaultProps = {
  type: 'default',
  id: '',
  title: 'alert-box',
  onClick: null,
  iconName: '',
  disabled: false,
  active: false,
}


export default Button;
