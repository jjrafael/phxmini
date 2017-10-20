import React from "react";
import Sessions from './Sessions';
import Queue from './Queue';

class Sidebar extends React.Component {
  render() {
    return (
      <div className="sidebar-container">
        <Queue />
        <Sessions />
      </div>
    )
  }
}

export default Sidebar;