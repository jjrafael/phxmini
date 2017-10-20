'use strict';
import React, { PropTypes } from "react";
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import { createSelector } from 'reselect';
import { submit, isValid, isDirty } from 'redux-form';
import ModalWindow from 'phxComponents/modal';
import KitsForm from 'eventCreatorOpponentsComponents/KitsForm';
import MODE from 'eventCreatorOpponentsConstants/modeConst';
import { fetchKitPatterns } from 'eventCreatorOpponentsActions/opponentsAction';
import update from 'immutability-helper';


function mapStateToProps(state) {
  return {
    isFetchKitPatternsPerforming: state.opponentsReducers.isFetchKitPatternsPerforming,
    kitPatternList: state.opponentsReducers.kitPattenList,
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    fetchKitPatterns,
    submit,
  }, dispatch);
}

class AddEditKitDlg extends React.Component {
    constructor(props) {
        super(props);

        this._onOkButtonClickedHandler = this._onOkButtonClickedHandler.bind(this);
        this._onCancelButtonClickedHandler = this._onCancelButtonClickedHandler.bind(this);
        this._onModalCloseHandler = this._onModalCloseHandler.bind(this);
        this._onKitFormSubmitHandler = this._onKitFormSubmitHandler.bind(this);
    }

    componentDidMount() {
      this.props.fetchKitPatterns();
    }

    _onOkButtonClickedHandler(e) {
      const { onOkButtonClickedHandler, submit } = this.props;
      if (onOkButtonClickedHandler) {
        submit('KitsForm');
      }
    }

    _onCancelButtonClickedHandler() {
      const { onCancelButtonClickedHandler } = this.props;
      if (onCancelButtonClickedHandler) {
        onCancelButtonClickedHandler();
      }
    }

    _onModalCloseHandler() {
      const { onCancelButtonClickedHandler } = this.props;
      if (onCancelButtonClickedHandler) {
        onCancelButtonClickedHandler();
      }
    }

    _displayDlgTitle() {
        const { mode } = this.props;

        return (mode === MODE.ADD ? 'New Kit' : 'Edit Kit' );
    }

    _onKitFormSubmitHandler(formData) {
      const { mode, onOkButtonClickedHandler } = this.props;
      if (onOkButtonClickedHandler) {
          onOkButtonClickedHandler(mode, formData);
      }
    }

    _displayKitPatternList() {
      const {kitPatternList} = this.props;

      return update(kitPatternList, {
        $unshift: [
          {
            id: -1,
            description: ''
          }
        ]
      });
    }

    render() {
        const { kitPatternList, initialValues } = this.props;

        return (
            <ModalWindow
                key="modal"
                className="add-edit-kit "
                title={this._displayDlgTitle()}
                name="addEditKit"
                isVisibleOn={true}
                shouldCloseOnOverlayClick={true}
                closeButton={true}
                onClose={this._onModalCloseHandler}>

                <div>
                    <h4>{this._displayDlgTitle()}</h4>
                    <KitsForm
                      kitPatternList={this._displayKitPatternList()}
                      initialValues={initialValues}
                      kitFormSubmitHandler={this._onKitFormSubmitHandler}
                      okHandler={this._onOkButtonClickedHandler}
                      cancelHandler={this._onCancelButtonClickedHandler} />
                </div>
            </ModalWindow>
        )
    }
};


AddEditKitDlg.propTypes = {
    mode: PropTypes.oneOf( [ MODE.ADD, MODE.EDIT ] ).isRequired,
    selectedKitId: PropTypes.number,
    initialValues: PropTypes.object,
    onOkButtonClickedHandler: PropTypes.func,
    onCancelButtonClickedHandler: PropTypes.func,
};


AddEditKitDlg.defaultProps = {
    mode: MODE.ADD,
    selectedKitId: -1,
    initialValues: null,
    onOkButtonClickedHandler: null,
    onCancelButtonClickedHandler: null,
};


export default connect(mapStateToProps, mapDispatchToProps)(AddEditKitDlg);
