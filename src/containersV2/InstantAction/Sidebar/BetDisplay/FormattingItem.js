import React from "react";

class FormattingItem extends React.Component {
  render() {
    const { id, lowerLimit, upperLimit, fontColor, backgroundColor, removeFormatterItem } = this.props;
    return (
      <div className="formatting-item">
        <div className="header">
          <div style={{ cursor: 'default' }}>Bets with stake between</div>
          <div className="remove-button" onClick={() => this.props.removeFormatterItem(id)}>&times;</div>
        </div>
        <div className="body" style={{ backgroundColor, color: fontColor }}>
          {`P${lowerLimit} and P${upperLimit}`}
        </div>
      </div>
    )
  }
}

export default FormattingItem;


