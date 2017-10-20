import React, { Component } from 'react';
import ActiveCell from './Editable/ActiveCell';
import InactiveCell from './Editable/InactiveCell';

class EditableCell extends Component {
    constructor (props) {
        super(props);
        this._onClick = this._onClick.bind(this);
        this._onBlur = this._onBlur.bind(this);
        this.state = {
            isEditing: false
        }
    }
    _onClick () {
        if (!this.state.isEditing) {
            this.setState({isEditing: true});
        }
    }
    _onBlur (data) {
        this.setState({isEditing: false});
        this.props.onBlur(data);
    }
    render () {
        let { opponent, target, className, disabled } = this.props;
        let content = <ActiveCell {...this.props} onBlur={this._onBlur} />;
        if (disabled) {
            content = <InactiveCell {...this.props} />
        }
        return (
            <div className={className} onClick={this._onClick}>
                {content}
            </div>
        );
    }
}

export default EditableCell;