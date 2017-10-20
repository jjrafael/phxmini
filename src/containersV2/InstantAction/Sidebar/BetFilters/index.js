import React from "react";
import BetTypeFilter from './BetTypeFilter';
import MarketsFilter from './MarketsFilter';
import TotalStakeFilter from './TotalStakeFilter';
import RiskAmountFilter from './RiskAmountFilter';
import SportsFilter from './SportsFilter';

class BetFilters extends React.Component {
  render() {
    return (
      <div className="bet-filters">
        <BetTypeFilter />
        <MarketsFilter />
        <TotalStakeFilter />
        <RiskAmountFilter />
        <SportsFilter />
      </div>
    )
  }
}

export default BetFilters;


