import React from "react";
import moment from 'moment';

class EventPathTreeUtils extends React.Component {
    constructor(props) {
        super(props);
        this._handleAlphabeticalClick = this._handleAlphabeticalClick.bind(this);
        this._handleExpandAllClick = this._handleExpandAllClick.bind(this);
        this._handleCollapseAllClick = this._handleCollapseAllClick.bind(this);
    }

    _handleAlphabeticalClick(e) {
        e.preventDefault();
        const { isOrderedAlphabetically, onAlphabeticalIconClick } = this.props;
        if(onAlphabeticalIconClick) {
            onAlphabeticalIconClick(!isOrderedAlphabetically);
        }
    }

    _handleManualSortClick(e, direction, disabled) {
        e.preventDefault();
        if(disabled) return
        if(this.props.onReorderPathClick) {
            this.props.onReorderPathClick(direction);
        }
    }

    _renderManualSortButtons() {
        const { isOrderedAlphabetically, hasSelectedPath } = this.props;
        const disabled = isOrderedAlphabetically || !hasSelectedPath;
        return [
            <a key="first" title="Move on top" className={`${disabled ? 'disabled' : ''}`} onClick={(e)=> this._handleManualSortClick(e, 'first', disabled) }>
                <span className="icon-medium phxico phx-move-top"></span>
            </a>,
            <a key="up" title="Move up" className={`${disabled ? 'disabled' : ''}`} onClick={(e)=> this._handleManualSortClick(e, 'up', disabled) }>
                <span className="icon-medium phxico phx-move-up"></span>
            </a>,
            <a key="down" title="Move down" className={`${disabled ? 'disabled' : ''}`} onClick={(e)=> this._handleManualSortClick(e, 'down', disabled) }>
                <span className="icon-medium phxico phx-move-down"></span>
            </a>,
            <a key="last" title="Move at the bottom" className={`${disabled ? 'disabled' : ''}`} onClick={(e)=> this._handleManualSortClick(e, 'last', disabled) }>
                <span className="icon-medium phxico phx-move-bottom"></span>
            </a>
        ]
    }

    _renderHideEmptyEventPathsIcon() {
        const { areEmptyEventPathsHidden } = this.props;
        return (
            <a className={`${areEmptyEventPathsHidden ? 'checked' : ''}`} title="Hide empty branches" onClick={(e)=> this.props.onHideEmptyEventPathsClick() }>
                <span className="icon-large phxico phx-hide-empty"></span>
            </a>
        )
    }

    _handleExpandAllClick(e) {
        e.preventDefault();
        if(this.props.onExpandAllClick) {
            this.props.onExpandAllClick()
        }
    }

    _handleCollapseAllClick(e) {
        e.preventDefault();
        if(this.props.onCollapseAllClick) {
            this.props.onCollapseAllClick()
        }
    }


    render(){
        const { isOrderedAlphabetically, areEmptyEventPathsHidden, isExpandedAll, isCollapsedAll, disableSave, onSaveButtonClick } = this.props;
        return (
            <div className="event-path-tree-utils-container">
                <a className={disableSave ? 'disabled' : ''} onClick={(e)=> {
                    e.preventDefault();
                    if(!disableSave) {
                        onSaveButtonClick();
                    }
                }}>
                    <i className="icon icon-medium phxico phx-save"></i>
                </a>
                <a className={isOrderedAlphabetically ? 'alphabetical-sort checked' : 'alphabetical-sort'}
                    onClick={this._handleAlphabeticalClick}>
                    <i className="icon icon-medium phxico phx-sort-alpha-asc"></i>
                </a>
                {this._renderManualSortButtons()}
                <a className={`{isExpandedAll ? 'checked' : ''}`}
                    onClick={this._handleExpandAllClick}>
                    <i className="icon icon-medium phxico phx-expand-tree"></i>
                </a>
                <a className={`{isCollapsedAll ? 'checked' : ''}`}
                    onClick={this._handleCollapseAllClick}>
                    <i className="icon icon-medium phxico phx-unexpand-tree"></i>
                </a>
                {this._renderHideEmptyEventPathsIcon()}
            </div>
        )
    }
}

export default EventPathTreeUtils;