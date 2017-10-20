import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import SelectBox from 'components/selectBox';
import filterTypes from 'constants/filterTypes';
import { setDatesFilter } from '../actions';
import { DUMMY_ID } from '../constants';    
import ModalWindow from 'components/modal';
import CustomDateRangeSelect from 'containers/CustomDateRangeSelect';

const mapStateToProps = (state) => {
    return {
        datesFilter: state.sportsTree.datesFilter,
        isFetchingEPT: state.sportsTree.isFetchingEPT,
        isCreatingNewPath: !!state.sportsTree.pathsMap[DUMMY_ID]
    };
};

const mapDispatchToProps = (dispatch) => {
    return bindActionCreators({setDatesFilter}, dispatch);
};

class DatesDropdown extends React.Component {
    constructor (props) {
        super(props);
        this._onCustomDateRangeSubmit = this._onCustomDateRangeSubmit.bind(this);
        this.state = {
            showDateRange: false,
            availableDates: this.props.availableDates
        }
        if(this.props.defaultDate){ //set default value in reducer
            this.props.setDatesFilter(this.props.defaultDate)
        }
    }
    _onCustomDateRangeSubmit (from, to) {
        const customDate = `${from} - ${to}`;
        let  { availableDates } = this.state;
        if (!availableDates.includes(customDate)) {
            availableDates = [...availableDates, customDate];
        }
        this.setState({
            showDateRange: false,
            availableDates
        });
        this.props.setDatesFilter(customDate);
        if (this.props.onChange) {
            this.props.onChange(customDate);
        }
    }

    componentWillUpdate (nextProps) {
        let { availableDates } = this.state;
        if (!availableDates.includes(nextProps.datesFilter)) {
            if(nextProps.defaultDate && nextProps.datesFilter.indexOf('Next 7 Days') !== -1){
                return //prevent adding next 7 days from reducer if using defaultDate prop
            }
            this.setState({
                availableDates: [...availableDates, nextProps.datesFilter]
            })
        }
    }
    render () {
        let {isFetchingEPT, datesFilter, setDatesFilter, isCreatingNewPath, onChange, disabled, limit, defaultDate } = this.props;
        const usingCustomDates = defaultDate && datesFilter.indexOf('Next 7 Days') !== -1 //prevent value from not changing
        return <div>
            <SelectBox
                disabled={isFetchingEPT || isCreatingNewPath || disabled}
                onChange={e => {
                    let value = e.target.value;
                    if (value === filterTypes.DATES.CUSTOM) {
                        this.setState({showDateRange: true});
                    } else {
                        setDatesFilter(value);
                        if (onChange) {
                            onChange(value);
                        }
                    }
                }}
                value={usingCustomDates ? defaultDate : datesFilter}
                name="status"
                options={this.state.availableDates}
            />
            <ModalWindow
                title="Select a Date Range"
                name="customEptDate"
                isVisibleOn={this.state.showDateRange}
                shouldCloseOnOverlayClick={false}>
                <CustomDateRangeSelect
                    onSubmit={this._onCustomDateRangeSubmit}
                    onClose={() => {this.setState({showDateRange: false})}}
                    limit={limit}
                />
            </ModalWindow>
        </div>
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(DatesDropdown);