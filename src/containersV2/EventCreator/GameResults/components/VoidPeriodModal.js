import React from 'react';
import { Field, reduxForm, Form, Fields, reset, formValueSelector } from 'redux-form';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import _ from 'underscore';
import { closeModal, openModal } from 'actions/modal';
import ModalWindow from 'components/modal';
import SelectBox from 'components/selectBox';
const VoidReasonField = ({ input, label, type, isRequired, disabled, className, meta: { touched, error, warning } }) => { 
    return <input type="text" value={""} {...input}/>;
};

let VoidPeriodModal = (props) => {
	const { handleSubmit, 
        pristine, 
        reset, 
        submitting, 
        dirty, 
        eventDetails, 
        event, 
        gameResults, 
        _handleSubmitVoidPeriodModal, 
        apiConstants,
        initialValues } = props;
  	let voidResons = _.filter(apiConstants.values.voidReasons, (vr) => {
  		return vr.enabled;
  	})
    return (
        <ModalWindow
            className="small"
            title="Void Period"
            name="voidPeriodModal"
            isVisibleOn={props.modals.voidPeriodModal}
            shouldCloseOnOverlayClick={true}>
	            <div className="abandon-market-modal-container content">
	                <div className="tcenter top"><h4>Void Period</h4></div>
            		<Form onSubmit={handleSubmit(_handleSubmitVoidPeriodModal)} className="border-box">
		                <div className="content-details padding-small body">
		                    <p>
		                        Please select a reason for voiding outcome(s).
		                    </p>
		                    <div className="desktop-full"> 
		                     	<label>Reason:
		                     	<Field name={`voidReasonId`} component={({ input, label, type, isRequired, disabled, className, meta: { touched, error, warning } }) => {
		                            return <SelectBox
					                        disabled={false}
					                        className="abandon"
					                        options={voidResons.map(vr => {
					                        	return {
					                        		value:vr.id,
					                        		desc:vr.description
					                        	}
					                        })} {...input}/>;
	                            }} />
			                     	
		                        </label>
		                    </div>
		                    <div className="desktop-full">
		                        <label>Notes: <Field name={`voidReasonNotes`} component={VoidReasonField} />
	    						</label>
		                    </div>
		                </div>
		                <div className="bottom button-group">
		                    <button onClick={(e)=> {
		                        props.closeModal('voidPeriodModal');
		                    }}>Cancel</button>
		                    <button disabled={!dirty} type="submit">
		                        Save
		                    </button>
		                </div>
            		</Form>

	            </div>
        </ModalWindow>
    )
}



VoidPeriodModal = reduxForm({
  form: 'VoidPeriodModal' ,
  enableReinitialize: true,
})(VoidPeriodModal);

function mapStateToProps(state) {
    return {
        event: state.eventCreatorEvent,
        eventDetails: state.eventCreatorEvent.event,
        marketStateDetails: state.marketStateDetails,
        event: state.eventCreatorEvent,
        gameResults: state.gameResults,
        newMarketFilters: state.eventCreatorEventMarkets.newMarketFilters,
        isFetchingMarketPeriods: state.eventCreatorEventMarkets.isFetchingMarketPeriods,
        isFetchingMarketTypes: state.eventCreatorEventMarkets.isFetchingMarketTypes,
        modals: state.modals,
        apiConstants : state.apiConstants
    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({ 
        reset,
        closeModal, 
        openModal, 
    }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(VoidPeriodModal);

