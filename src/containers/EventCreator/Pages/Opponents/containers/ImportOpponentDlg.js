import React from "react";
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';

//actions
import { fetchEventPathAncestralOpponents, assignMultipleOpponentsToEventPath } from "eventCreatorOpponentsActions/opponentsAction";

//components
import ImportOpponents from 'eventCreatorOpponentsComponents/ImportOpponents';
import ModalWindow from 'components/modal';

const mapStateToProps = (state) => {
    return {
        isOpponentActing: state.opponentsReducers.isPerformingAction,
        ancestralOpponentsList: state.opponentsReducers.eventPathAncestralOpponentsList,
    }
}

const mapDispatchToProps = (dispatch) => {
    return bindActionCreators({
        fetchEventPathAncestralOpponents,
        assignMultipleOpponentsToEventPath
    }, dispatch)
}

class ImportOpponentDlg extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            selected: []
        }
    };

    componentDidMount() {
        const { pathId, fetchEventPathAncestralOpponents } = this.props;
        fetchEventPathAncestralOpponents(pathId);
    };

    componentWillUpdate(nextProps) {
        if(this.props.ancestralOpponentsList !== nextProps.ancestralOpponentsList) {
            const selected = this._constructList(nextProps.ancestralOpponentsList, true);
            this.setState({selected});
        }
    }

    _constructList(list, isSelected) {
        return list.map(item => {
            return {...item, selected: isSelected}
        });
    }

    _toggleSelect(id) {
        const list = [...this.state.selected];
        const index = list.findIndex(item=> item.id === id);
        let data = list.find(item=> item.id === id);
        data.selected = !data.selected;
        const updatedList = [...list.slice(0,index),data, ...list.slice(index+1)];
        this.setState({selected: updatedList});
    }

    _toggleAll() {
        const list = this.state.selected;
        const status = !this._isSelectedAll();
        const toggleList = this._constructList(list, status);
        this.setState({selected: toggleList});
    }

    _isSelectedAll() {
        return !this.state.selected.find(item=> !item.selected);
    }

    _onClickImport() {
        const { assignMultipleOpponentsToEventPath, pathId } = this.props;
        const selectedIds = this.state.selected.filter(item => item.selected).map(item=> item.id);
        assignMultipleOpponentsToEventPath(pathId, selectedIds);
    }

    render() {
        const { isOpponentActing, ancestralOpponentsList } = this.props;
        return (
            <ImportOpponents 
                loading={isOpponentActing} 
                lists={this.state.selected} 
                toggleSelect={this._toggleSelect.bind(this)} 
                selectedAll={this._isSelectedAll()} 
                toggleAll={this._toggleAll.bind(this)}
                onClickImport={this._onClickImport.bind(this)}
            />
        )
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(ImportOpponentDlg);