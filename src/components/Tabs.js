import React, { PropTypes } from "react";
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import ModalConfirm from 'components/modalConfirm';

export default class TabComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
           selectedIndex: this.props.selectedIndex || 0,
           showModalConfirmation: false,
           pendingSelectedIndex: null
        };
    }

    _renderTabHeaders() {
        return this.props.items.map((item, index)=> {
            return <Tab key={index}><span className="tab-header">{item.title}</span></Tab>
        });
    }

    _renderTabPanels() {
        return this.props.items.map((item, index)=> {
            return (
                <TabPanel key={index}>
                    <div className="tab-content">
                        {item.content}
                    </div>
                </TabPanel>
            )
        });
    }

    _onSelect(e) {
        if(this.props.showModal) {
            this.setState({showModalConfirmation: true, pendingSelectedIndex: e});
        } else {
            if(this.props.onSelect) {
                this.props.onSelect(e, () => {
                    this.setState({selectedIndex: e});
                });
            } else {
                this.setState({selectedIndex: e});
            }
        }
    }

    _renderModalConfirmation() {

        const setModalStates = () => {
            this.setState({
                selectedIndex: this.state.pendingSelectedIndex, 
                showModalConfirmation: false, 
                pendingSelectedIndex: null
            });
        }

        const onConfirm = () => {
            if(this.props.onSelect) {
                const { pendingSelectedIndex } = this.state;
                this.props.onSelect(pendingSelectedIndex, () => {
                    this.setState({selectedIndex: pendingSelectedIndex})
                });
            }
            setTimeout(function() {
                setModalStates();
            }, 300);
        };

        if(this.state.showModalConfirmation) {
            return (
                <ModalConfirm
                    isVisibleOn={this.state.showModalConfirmation}
                    title="Confirm unsaved changes"
                    className={"warn-text"}
                    onConfirm={onConfirm}
                    onCancel={setModalStates}
                    message="You are about to leave this tab but you have unsaved changes. Do you want to save your changes?"/>
            )
        }
    }

    componentWillUpdate (nextProps, nextState) {
        if (this.props.selectedIndex !== nextProps.selectedIndex) {
            this.setState({selectedIndex: nextProps.selectedIndex})
        }
    }

    render() {
        const { selectedIndex } = this.state;
        return(
            <div className={this.props.className}>
                <Tabs onSelect={this._onSelect.bind(this)} selectedIndex={selectedIndex}>
                    <TabList>
                        {this._renderTabHeaders()}
                    </TabList>
                    {this._renderTabPanels()}
                </Tabs>
                {this._renderModalConfirmation()}
            </div>
        )
    }
}

Tabs.setUseDefaultStyles(false);

// prop checks
TabComponent.propTypes = {
    items: PropTypes.array
}