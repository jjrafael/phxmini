'use strict';
import React, { PropTypes } from "react";
import _ from 'underscore';
import checkPermission from 'componentsV2/checkPermission/index';

const Button = ({className, title, type, disabled, onClick, children}) => {
    return (
        <button
            className={className}
            title={title}
            type={type}
            disabled={disabled}
            onClick={onClick}>
            {children}
        </button>
    )
}
const PermittedButton = checkPermission(Button);

class OpponentsTableActionBar extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            selectedTypeId: this.props.initialTypeSelectedId,
        }

        this._onTypesSelectChangeHandler = this._onTypesSelectChangeHandler.bind(this);
        this._onAddButtonClickedHandler = this._onAddButtonClickedHandler.bind(this);
        this._onEditButtonClickedHandler = this._onEditButtonClickedHandler.bind(this);
        this._onRemoveButtonClickedHandler = this._onRemoveButtonClickedHandler.bind(this);
        this._onRemoveAllButtonClickedHandler = this._onRemoveAllButtonClickedHandler.bind(this);
        this._onClickImportOponnets = this.props.onClickImportOponnets.bind(this);
    }

    componentWillReceiveProps(nextProps) {
      const prevIinitialTypeSelectedId = this.props.initialTypeSelectedId;
      const nextInitialTypeSelectedId = nextProps.initialTypeSelectedId;
      const currentInitialTypeSelectedId = this.state.selectedTypeId;

        if (currentInitialTypeSelectedId !== nextInitialTypeSelectedId) {
          this.setState({
            selectedTypeId: nextInitialTypeSelectedId,
          })
        }
    }

    _onTypesSelectChangeHandler(event) {
        const {tag, onTypesSelectChangeHandler, opponentTypes} = this.props;
        const typeSelected = _.findWhere(opponentTypes, {id: parseInt(event.target.value)});

        this.setState({
            selectedTypeId: typeSelected.id
        }, () => {
            if (onTypesSelectChangeHandler) {

                onTypesSelectChangeHandler(tag, typeSelected );
            }
        });
    }

    _onAddButtonClickedHandler() {
        const { tag, onAddButtonClickedHandler } = this.props;

        if (onAddButtonClickedHandler) {
            onAddButtonClickedHandler(tag);
        }
    }

    _onEditButtonClickedHandler() {
        const { tag, onEditButtonClickedHandler } = this.props;

        if (onEditButtonClickedHandler) {
            onEditButtonClickedHandler(tag);
        }
    }

    _onRemoveButtonClickedHandler() {
        const { tag, onRemoveButtonClickedHandler } = this.props;

        if (onRemoveButtonClickedHandler) {
            onRemoveButtonClickedHandler(tag);
        }
    }

    _onRemoveAllButtonClickedHandler() {
        const { tag, onRemoveAllButtonClickedHandler } = this.props;

        if (onRemoveAllButtonClickedHandler) {
            onRemoveAllButtonClickedHandler(tag);
        }

    }

    _getTypeIdValue() {
        const { selectedTypeId } = this.state;
        const { initialTypeSelectedId, opponentTypes } = this.props;
        if(selectedTypeId !== -1) {
            return selectedTypeId;
        } else if(!!opponentTypes.length) {
            return opponentTypes[0].id
        } else {
            return '';
        }
    }

    _renderOpponentTypesSelectField() {
        const { opponentTypes, typesSelectorDisabled, initialTypeSelectedId, isChildTable, hasSelectedParent } = this.props;
        if (typesSelectorDisabled && (!isChildTable || hasSelectedParent)) {
            let value = this._getTypeIdValue();
            if (opponentTypes.length && typeof Number(value) === 'number') {
                let target = opponentTypes.find(type => type.id === Number(value));
                if (target && target.description) {
                    return target.description.substr(0,1).toUpperCase() + target.description.substr(1);
                }
            }
        }
        return (
            <div style={{width: '100px', margin: '0 10px 0 0', display: 'inline-block'}}>
                <select
                    value={this._getTypeIdValue()}
                    onChange={this._onTypesSelectChangeHandler}
                    disabled={typesSelectorDisabled}
                    style={{width: '100%'}}>

                    { _.map(opponentTypes, (type) => {
                        return (
                            <option key={type.id} value={type.id}>
                                {type.description}
                            </option>
                        )
                    }) }

                </select>
            </div>
        );
        return null;
    }


    render() {
        const {
            opponentTypes,
            addButtonDisabled,
            editButtonDisabled,
            removeButtonDisabled,
            removeAllButtonDisabled,
            onTypesSelectChangeHandler,
            onAddButtonClickedHandler,
            onEditButtonClickedHandler,
            onRemoveButtonClickedHandler,
            onRemoveAllButtonClickedHandler,
            hideImportButton,
            importButtonDisabled,
            actionIdMap
        } = this.props;

        return (
            <div className="header panel-header">
                <div className="panel-header-title">
                    {this._renderOpponentTypesSelectField()}
                </div>
                <div className="panel-header-actions">
                    <PermittedButton
                        actionIds={[actionIdMap.ADD]}
                        className={`button btn-box${addButtonDisabled ? ' disabled' : ''}`}
                        title="Add"
                        type="button"
                        disabled={addButtonDisabled}
                        onClick={this._onAddButtonClickedHandler}>
                        <i className="phxico phx-plus" />
                    </PermittedButton>
                    <PermittedButton
                        actionIds={[actionIdMap.EDIT]}
                        className={`button btn-box${editButtonDisabled ? ' disabled' : ''}`}
                        title="Edit"
                        type="button"
                        disabled={editButtonDisabled}
                        onClick={this._onEditButtonClickedHandler}>
                        <i className="phxico phx-pencil" />
                    </PermittedButton>
                    <PermittedButton
                        actionIds={[actionIdMap.REMOVE]}
                        className={`button btn-box${removeButtonDisabled ? ' disabled' : ''}`}
                        title="Remove"
                        type="button"
                        disabled={removeButtonDisabled}
                        onClick={this._onRemoveButtonClickedHandler}>
                        <i className="phxico phx-delete" />
                    </PermittedButton>
                    <PermittedButton
                        actionIds={[actionIdMap.REMOVE_ALL]}
                        className={`button btn-box${removeAllButtonDisabled ? ' disabled' : ''}`}
                        title="Remove All"
                        type="button"
                        disabled={removeAllButtonDisabled}
                        onClick={this._onRemoveAllButtonClickedHandler}>
                        <i className="phxico phx-delete-all" />
                    </PermittedButton>
                    { (!hideImportButton) &&
                        <PermittedButton
                            actionIds={[actionIdMap.ADD]}
                            className={`button btn-box${importButtonDisabled ? ' disabled' : ''}`}
                            title="Import Opponent"
                            type="button"
                            disabled={importButtonDisabled}
                            onClick={this._onClickImportOponnets}>
                            <i className="phxico phx-import" />
                        </PermittedButton>
                    }
                </div>
            </div>
        );
    }
};

OpponentsTableActionBar.PropTypes = {
    tag: PropTypes.string,
    opponentTypes: PropTypes.array,
    initialTypeSelectedId: PropTypes.number,
    typesSelectorDisabled: PropTypes.bool,
    addButtonDisabled: PropTypes.bool,
    editButtonDisabled: PropTypes.bool,
    removeButtonDisabled: PropTypes.bool,
    removeAllButtonDisabled: PropTypes.bool,
    onTypesSelectChangeHandler: PropTypes.func,
    onAddButtonClickedHandler: PropTypes.func,
    onEditButtonClickedHandler: PropTypes.func,
    onRemoveButtonClickedHandler: PropTypes.func,
    onRemoveAllButtonClickedHandler: PropTypes.func,
    onClickImportOponnets: PropTypes.func,
    hideImportButton: PropTypes.bool,
    importButtonDisabled: PropTypes.bool,
};

OpponentsTableActionBar.defaultProps = {
    tag: 'oppActionBar',
    opponentTypes: [],
    initialTypeSelectedId: 1,
    typesSelectorDisabled: false,
    addButtonDisabled: false,
    editButtonDisabled: false,
    removeButtonDisabled: false,
    removeAllButtonDisabled: false,
    onTypesSelectChangeHandler: null,
    onAddButtonClickedHandler: null,
    onEditButtonClickedHandler: null,
    onRemoveButtonClickedHandler: null,
    onRemoveAllButtonClickedHandler: null,
    onClickImportOponnets: null,
    hideImportButton: false,
    importButtonDisabled: false,
};

export default OpponentsTableActionBar;
