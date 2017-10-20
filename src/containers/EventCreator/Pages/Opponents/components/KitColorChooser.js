'use strict';
import React, { PropTypes } from "react";
import { SketchPicker } from 'react-color';
import ModalWindow from 'phxComponents/modal';


class KitColorChooser extends React.Component {

  constructor(props) {
      super(props);

      this.state = {
        displayColorPicker: false,
        color: props.initialColor,
      };

      this.handleClick = this.handleClick.bind(this);
      this.handleClose = this.handleClose.bind(this);
      this.handleChange = this.handleChange.bind(this);
  }

  handleClick() {
    this.setState({ displayColorPicker: !this.state.displayColorPicker });
  }

  handleClose() {
    this.setState({ displayColorPicker: false });
  }

  handleChange( color ) {
    const {
      onColorChange
    } = this.props;

    this.setState( {
      color: color.hex
    }, () => {
      if ( onColorChange ) {
        onColorChange( color );
      }
    } );
  }

  render() {
    const { displayColorPicker, color } = this.state;

    let hexColor = color.substr(0, 1) !== '#' ? `#${color}` : color;

    return (
      <div>
        <div style={{ padding: '5px', background: '#fff', borderRadius: '1px', boxShadow: '0 0 0 1px rgba(0,0,0,.1)', display: 'inline-block', cursor: 'pointer'}} onClick={this.handleClick} >
          <div style={{ width: '250px', height: '15px', borderRadius: '2px', background: hexColor}} />
        </div>

        { displayColorPicker ?
          <div style={{ position: 'fixed', zIndex: '2' }}>
            <div style={{ position: 'fixed', top: '0px', right: '0px', bottom: '0px', left: '0px' }} onClick={this.handleClose}/>
            <SketchPicker color={hexColor} onChange={this.handleChange}/>
          </div>

          :

          null
        }
      </div>
    );
  }

};


KitColorChooser.propTypes = {
  initialColor: PropTypes.string,
  onColorChange: PropTypes.func,
};


KitColorChooser.defaultProps = {
  initialColor: '#FFFFFFFF',
  onColorChange: null,
};


export default KitColorChooser;
