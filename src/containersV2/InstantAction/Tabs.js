import React from "react";
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import { changeActiveTabIndex } from './actions';

const mapStateToProps = (state) => {
  return {}
}

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({
    changeActiveTabIndex
  }, dispatch);
};

class SettingTabs extends React.Component {
  _renderTabHeaders() {
    return this.props.items.map((item, index) => {
      return (
        <Tab key={index}>
          <span className="tab-header">{item.title}</span>
        </Tab>
      );
    });
  }

  _renderTabPanels() {
    return this.props.items.map((item, index) => {
      return (<TabPanel key={index}>{item.component}</TabPanel>)
    });
  }

  render() {
    return (
      <div className={this.props.className}>
        <Tabs onSelect={tabIndex => this.props.changeActiveTabIndex(tabIndex)}>
          <TabList>
            {this._renderTabHeaders()}
          </TabList>
          {this._renderTabPanels()}
        </Tabs>
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(SettingTabs);