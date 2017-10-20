import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { setHideOutcomesOnCreateOption } from '../../actions';

const mapStateToProps = (state, ownProps) => {
    return {
        hideOutcomesOnCreate: state.eventCreatorEventMarkets.hideOutcomesOnCreate,
    };
};

const mapDispatchToProps = (dispatch, ownProps) => {
    return bindActionCreators({setHideOutcomesOnCreateOption}, dispatch);
};

const HideOutcomes = ({hideOutcomesOnCreate, setHideOutcomesOnCreateOption}) => {
    return <div className="hide-outcomes-option">
        <input
            type="checkbox"
            checked={hideOutcomesOnCreate}
            id="hide-outcomes-checkbox"
            onChange={e => {
                setHideOutcomesOnCreateOption(e.target.checked)
            }}
        />
        <label htmlFor="hide-outcomes-checkbox">Hide outcomes</label>
    </div>
}

export default connect(mapStateToProps, mapDispatchToProps)(HideOutcomes);