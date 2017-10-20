import React from "react";

class SportItem extends React.Component {
  render() {
    const { title, name, checked, onChange } = this.props;
    return (
      <div className="sport-item">
        <input type="checkbox" name={name} checked={checked} onChange={onChange} />
        <label>{title}</label>
      </div>
    )
  }
}

export default SportItem;


