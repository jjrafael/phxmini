import React from "react";
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Tabs from '../Tabs';
import BetFilters from './BetFilters';
import BetDisplay from './BetDisplay';
import BrandFilter from './BrandFilter';

const mapStateToProps = (state) => {
    let {isSideBarOpen} = state.apps;
    return {
        isSideBarOpen
    }
};

const mapDispatchToProps = (dispatch) => {
    return {
        ...bindActionCreators({

        }, dispatch)
    } 
};

class Sidebar extends React.Component {
  render() {
    const { isSideBarOpen } = this.props;
    return (
      <div className={`sidebar-container ${isSideBarOpen ? 'open' : 'hide'}`}>
        <Tabs
          className="setting-tabs"
          items={[
            { title: 'BET FILTERS', component: <BetFilters /> },
            { title: 'BET DISPLAY', component: <BetDisplay /> },
            { title: 'BRAND FILTER', component: <BrandFilter /> }
          ]}
        />
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Sidebar);