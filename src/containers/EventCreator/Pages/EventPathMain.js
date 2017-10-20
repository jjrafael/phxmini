import React from "react";
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { push } from 'react-router-redux';
import { setEventCreatorPage } from 'eventCreatorActions/eventCreatorPages';

import RoutesTab from 'eventCreatorComponents/RoutesTab';
import mainTabList from 'eventCreatorConfigs/mainTabList';

const mapStateToProps = (state) => {
    return {
        currentPage: state.eventCreatorPages.currentEventCreatorPage,
    }
}

const mapDispatchToProps = (dispatch) => {
    return bindActionCreators({
        push,
        setEventCreatorPage
    }, dispatch)
}

class EventPathMain extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedPageIndex: 0
        }
    }

    componentDidMount() {
        this.setState({
            selectedPageIndex: this._getSelectedPageIndex()
        })
    }

    componentDidUpdate(prevProps, prevState) {
        if(prevProps.currentPage !== this.props.currentPage) {
            this.setState({
                selectedPageIndex: this._getSelectedPageIndex()
            })
        }
    }

    _getSelectedPageIndex() {
        const { currentPage } = this.props;
        const index = mainTabList.findIndex(page => page.pageName === currentPage);
        return index;
    }

    _onTabSelected(selectedPagename, selectedRoutePath) {
        this.props.push(selectedRoutePath);
        this.props.setEventCreatorPage(selectedPagename);
    }

    render() {
        const { selectedPageIndex } = this.state;
        return (
            <RoutesTab
                selectedIndex={selectedPageIndex}
                items={mainTabList}
                onSelect={this._onTabSelected.bind(this)}
                className="tabular"
            />
        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(EventPathMain);