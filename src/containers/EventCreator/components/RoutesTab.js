import React, { PropTypes } from "react";
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';

class RoutesTab extends React.Component {
    constructor(props) {
        super(props);
    }

    _renderTabHeaders() {
        return this.props.items.map((item, index) => {
            return (
                <Tab key={index}>
                    <span className="tab-header">{item.title}</span>
                </Tab>
            );
        });
    }

    _renderDummyTabPanels() {
        // required by react-tabs, will not function properly w/o it
        return this.props.items.map((item, index) => {
            return (<TabPanel key={index}/>)
        });
    }

    render() {
        return(
            <div className={this.props.className}>
                <Tabs
                    selectedIndex={this.props.selectedIndex || 0}
                    onSelect={(selectedIndex, lastSelectedIndex) => {
                        if (this.props.onSelect) {
                            const routePath = this.props.items[selectedIndex].routePath;
                            const pageName = this.props.items[selectedIndex].pageName;
                            this.props.onSelect(pageName, routePath);
                        }
                    }}>
                    <TabList>
                        { this._renderTabHeaders() }
                    </TabList>
                    { this._renderDummyTabPanels() }
                </Tabs>
            </div>
        );
    }

}

Tabs.setUseDefaultStyles(false);

RoutesTab.propTypes = {
    items: PropTypes.arrayOf(
        PropTypes.shape(
            {
                title: PropTypes.string.isRequired,
                pageName: PropTypes.string.isRequired,
                routePath: PropTypes.string.isRequired
            }
        )),
    onSelect: PropTypes.func // onSelect(pageName, selectedRoutePath)
}

export default RoutesTab;
