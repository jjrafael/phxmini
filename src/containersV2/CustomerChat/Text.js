import React from "react";
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

const mapStateToProps = (state) => {
  return {
    value: state.customerChat.text
  }
}

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({}, dispatch);
};

class Text extends React.Component {
  render() {
    return (
      <textarea
        className="text-field"
        maxLength="1000"
        value={this.props.value}
        onChange={(e) => this.props.handleChange(e.target.value)}
      >
      </textarea>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Text);