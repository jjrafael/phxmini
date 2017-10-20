import React from "react";
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { removeFormatterItem } from '../../actions';
import FormattingItem from './FormattingItem';

const mapStateToProps = (state) => {
  return {
    items: state.instantAction.betDisplay.items
  }
}

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({
    removeFormatterItem
  }, dispatch);
};

class FormattingList extends React.Component {
  render() {
    const { items, removeFormatterItem } = this.props;
    return (
      <div className="formatting-list">
        <div className="list">
          {items.map((item, i) => <FormattingItem {...item} removeFormatterItem={removeFormatterItem} key={i} />)}
        </div>
        <div className="attention-field">
          <i className="phxico phx-alert"></i>
          <div className="attention-text">Any profile formatting will overwrite stake formatting</div>
        </div>
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(FormattingList);


