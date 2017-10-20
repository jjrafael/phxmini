import React from "react";
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { closeModal } from '../actions/modal';
import DateRangePicker from '../components/dateRangePicker';
import filterTypes from '../constants/filterTypes';
import moment from 'moment';
import { DateUtils } from 'react-day-picker'


function mapStateToProps(state) {
  return {
  };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
      closeModal
    }, dispatch);
}

class CustomDateRangeSelect extends React.Component {
  constructor(props) {
    super(props);
    this.from = moment().format('L');
    this.to = moment().add(7,'days').format('L');
    this.isvalidDateRange = true;
    this.toOptions = {
      disabledDays: this.props.limit 
      ? [
        {after: new Date(moment(this.from).add(this.props.limit,'months').format('L')) }
      ] 
      : day => {
        return moment(day) < moment(this.from)
      },
      fromMonth: new Date(moment(this.to).format('L'))
    };
  }

  _fromDateChangeHandler(value) {
    this.from = value;
    if (moment(value) > moment(this.to) || moment(this.to) > moment(this.from).add(this.props.limit,'months')) {
      this.to = moment(value).add(7,'days').format('L');
    }
    this.toOptions =  {
      ...this.props.limit && {disabledDays:[
        {before: new Date(moment(this.from).format('L'))},
        {after: new Date(moment(this.from).add(this.props.limit,'months').format('L')) }
      ]}, 
      fromMonth: new Date(moment(this.from).format('L'))
    }
    this._validateDateRange();
  }

  _toDateChangeHandler(value) {
    this.to = value;
    this._validateDateRange();
  }

  _validateDateRange() {
    const { from, to } = this;
    const diff = moment(to, 'L').diff(moment(from, 'L'), 'days');
    this.isvalidDateRange = diff >= 0;
    this.forceUpdate();
  }

  _onCancelClick() {
    if (this.props.onClose) {
      this.props.onClose();
    } else {
      this.props.closeModal('customEptDate');
    }
  }

  _onSubmitClick() {
    this.props.onSubmit(this.from, this.to);
  }


  render() {
      const { from, to, isvalidDateRange, _onCancelClick } = this;
      return (
        <div className="custom-range-picker clearfix">
          <h4 className="tcenter title">Custom date range</h4>
          <div className="content">
            <div className="daterange-picker-from fleft">
              <DateRangePicker inputLabel="From" 
                value={from}
                onDateChange={(value)=>{this._fromDateChangeHandler(value)}}
              />
            </div>
            <div className="daterange-picker-to fright">
              <DateRangePicker inputLabel="To"
                value={to}
                onDateChange={(value)=>{this._toDateChangeHandler(value)}}
                options={this.toOptions}
              />
            </div>
          </div>
          <div className="button-group tcenter bottom">
            <button onClick={()=>this._onCancelClick()}>Cancel</button>
            <button onClick={ ()=>this._onSubmitClick() }disabled={!isvalidDateRange}>Submit</button>
          </div>
        </div>
      );
  }
}


export default connect(mapStateToProps, mapDispatchToProps)(CustomDateRangeSelect);
