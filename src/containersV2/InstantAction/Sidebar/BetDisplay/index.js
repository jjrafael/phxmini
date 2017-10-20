import React from "react";
import MaxRows from './MaxRows';
import FormattingList from './FormattingList';
import BetsFormatting from './BetsFormatting';

class BetDisplay extends React.Component {
  render() {
    return (
      <div className="bet-display">
        <MaxRows />
        <FormattingList />
        <BetsFormatting />
      </div>
    )
  }
}

export default BetDisplay;


