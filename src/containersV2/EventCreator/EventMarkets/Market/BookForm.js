import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import isEqual from 'lodash.isequal';
import { setUpdatedMarketBook } from '../actions';
import { sportsCodesWithRaceCardNumber } from '../../App/constants';
import ModalWindow from 'components/modal';
import { getMarketBookRuleKey } from 'phxUtils';
import SPCheckBox from './BookFormFields/SPCheckbox';
import BookTypes from './BookFormFields/BookTypes';
import PlaceTerms from './BookFormFields/PlaceTerms';
import BookRules from './BookFormFields/BookRules';
import BookManager from './BookManager';


const mapStateToProps = (state, ownProps) => {
    return {
        bookTypes: state.apiConstants.values.bookTypes,
        placeTerms: state.apiConstants.values.placeTerms,
        activeCode: state.sportsTree.activeSportCode
    };
};

const mapDispatchToProps = (dispatch, ownProps) => {
    return bindActionCreators({
        setUpdatedMarketBook
    }, dispatch);
};



class BookForm extends Component {
    constructor (props) {
        super(props);
        this._onRuleChange = this._onRuleChange.bind(this);
        this._onTypeChange = this._onTypeChange.bind(this);
        this._onPlaceTermChange = this._onPlaceTermChange.bind(this);
        this._onSPChange = this._onSPChange.bind(this);
        this._onBookMngrClick = this._onBookMngrClick.bind(this);
        this.state = {
            types: this.props.bookTypes.filter(type => type.description !== 'SP'),
            updatedBook: {...this.props.book},
            hasSPBook: this.props.hasSPBook,
            hasSpCheckbox: sportsCodesWithRaceCardNumber.includes(this.props.activeCode),
            showBookManager: false
        }
    }

    componentWillUpdate (nextProps) {
        if (nextProps.hasSPBook !== this.props.hasSPBook) {
            this.setState({hasSPBook: nextProps.hasSPBook});
        }
        if (nextProps.activeCode !== this.props.activeCode) {
            this.setState({hasSpCheckbox: sportsCodesWithRaceCardNumber.includes(nextProps.activeCode)})
        }
        if (!isEqual(nextProps.book, this.props.book)) {
            this.setState({updatedBook: nextProps.book});
        }
    }
    _onRuleChange (e) {
        let value = e.target.value;
        let nonRunnerNoBet = false;
        let rule4 = false;
        switch (value) {
            case 'allIn':
                nonRunnerNoBet = false;
                rule4 = false;
            break;
            case 'nonRunner':
                nonRunnerNoBet = true;
                rule4 = false;
            break;
            case 'dayEvent':
                nonRunnerNoBet = true;
                rule4 = true;
            break;
        }
        let updatedBook = {
            ...this.state.updatedBook,
            nonRunnerNoBet,
            rule4
        };
        this.setState({updatedBook});
        this.props.setUpdatedMarketBook(updatedBook, this.state.hasSPBook);
    }
    _onTypeChange (e) {
        let value = e.target.value;
        let updatedBook = {
            ...this.state.updatedBook,
            description: value
        }
        this.setState({updatedBook});
        this.props.setUpdatedMarketBook(updatedBook, this.state.hasSPBook);
    }
    _onPlaceTermChange (e) {
        let value = e.target.value;
        let updatedBook = {
            ...this.state.updatedBook,
            placeTerms: [{
                ...this.state.updatedBook.placeTerms[0],
                description: value
            }]
        };
        this.setState({updatedBook});
        this.props.setUpdatedMarketBook(updatedBook, this.state.hasSPBook);
    }
    _onSPChange (e) {
        let isChecked = e.target.checked;
        this.setState({hasSPBook: isChecked});
        this.props.setUpdatedMarketBook(this.state.updatedBook, isChecked);
    }
    _onBookMngrClick () {
        this.setState({showBookManager: true})
    }
    render () {
        let {
            placeTerms,
            book,
        } = this.props;
        let {
            types,
            updatedBook
        } = this.state;
        let ruleKey = getMarketBookRuleKey(updatedBook);
        return (
            <div className="form-books">
                <div className="form-wrapper">
                    <div className="header panel-header">
                        <div className="panel-header-title">Books</div>
                        <div className="panel-header-actions">
                            <button className="button btn-box" onClick={this._onBookMngrClick}><i className="phxico phx-book"></i></button>
                        </div>
                    </div>
                    <div className="panel-content">
                        <div className="desktop-full instance-sp-container">
                            <div className="book-instance">{book.description} Book instance #{book.instance}</div>
                            {this.state.hasSpCheckbox &&
                                <SPCheckBox disabled={this.props.hasSPBook} checked={this.state.hasSPBook} onChange={this._onSPChange} />
                            }
                        </div>
                        <BookTypes types={types} book={updatedBook} onChange={this._onTypeChange} name="types" />
                        <PlaceTerms placeTerms={placeTerms} book={updatedBook} onChange={this._onPlaceTermChange} />
                        <BookRules ruleKey={ruleKey} onChange={this._onRuleChange} name="rules" />
                    </div>
                </div>
                {this.state.showBookManager &&
                    <ModalWindow
                        isVisibleOn={true}
                        title="Books Management"
                        onClose={()=>{this.setState({showBookManager: false})}}
                        className="books-manager"
                        closeButton={true}>
                        <h4>Books Management</h4>
                        <BookManager
                            types={types}
                            placeTerms={placeTerms}
                            isSPAllowed={this.state.hasSpCheckbox}
                        />
                    </ModalWindow>
                }
            </div>
        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(BookForm);
