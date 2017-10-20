import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { updateSearchStr } from '../actions';
import { DUMMY_ID } from '../constants';

const mapStateToProps = (state, ownProps) => {
    return {
        isFetchingEPT: state.sportsTree.isFetchingEPT,
        searchStr: state.sportsTree.searchStr,
        isCreatingNewPath: !!state.sportsTree.pathsMap[DUMMY_ID]
    };
};

const mapDispatchToProps = (dispatch, ownProps) => {
    return bindActionCreators({updateSearchStr}, dispatch);
};

class Search extends React.Component {
    constructor (props) {
        super(props);
        this._onClear = this._onClear.bind(this);
        this.state = {value: ''}
    }
    _onClear () {
        this.setState({value: ''});
        if (this.props.searchStr) {
            this.props.updateSearchStr('')
        }
        this.searchInput.focus();
    }
    render () {
        let { isFetchingEPT, searchStr ,updateSearchStr, isCreatingNewPath } = this.props;
        let { value } = this.state;
        return <div className="path-search-container">
            <input
                type="text"
                disabled={isFetchingEPT || isCreatingNewPath}
                placeholder="Search..."
                value={value}
                ref={e => this.searchInput = e}
                onChange={e => {
                    let value = e.target.value;
                    this.setState({value})
                    if (value.trim().length >= 2) {
                        updateSearchStr(value)
                    } else {
                        if (searchStr) {
                            updateSearchStr('')
                        }
                    }
                }}
            />
            <i onClick={this._onClear} className="phxico phx-close icon-xsmall icon"></i>
        </div>
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Search);