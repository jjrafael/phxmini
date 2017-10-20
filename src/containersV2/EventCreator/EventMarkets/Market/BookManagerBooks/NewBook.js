import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { getMarketBookRuleKey, generatePlaceTerms, generateBookPayload } from 'phxUtils';
import { updateMarketBooks } from '../../actions';
import SPCheckBox from '../BookFormFields/SPCheckbox';
import BookTypes from '../BookFormFields/BookTypes';
import PlaceTerms from '../BookFormFields/PlaceTerms';
import BookRules from '../BookFormFields/BookRules';

const mapStateToProps = (state, ownProps) => {
    return {
        isUpdatingMarketBooks: state.eventCreatorEventMarkets.isUpdatingMarketBooks,
        isUpdatingMarketBooksFailed: state.eventCreatorEventMarkets.isUpdatingMarketBooksFailed,
    };
};

const mapDispatchToProps = (dispatch, ownProps) => {
    return bindActionCreators({
        updateMarketBooks
    }, dispatch);
};

class NewBook extends Component {
    constructor (props) {
        super(props);
        this._onRuleChange = this._onRuleChange.bind(this);
        this._onTypeChange = this._onTypeChange.bind(this);
        this._onPlaceTermChange = this._onPlaceTermChange.bind(this);
        this._onSPChange = this._onSPChange.bind(this);
        this._onSave = this._onSave.bind(this);
        this.state = {
            book: {
                placeTerms : [{description : 'Standard EW terms apply '}],
                description : 'EP',
                rule4 : false,
                nonRunnerNoBet : true,
                createSpBook: false
            }
        }
    }
    componentWillUpdate (nextProps) {
        // close this dialog and set the selection to this book
        if (this.props.isUpdatingMarketBooks && !nextProps.isUpdatingMarketBooks && !nextProps.isUpdatingMarketBooksFailed) {
            this.props.onClose();
            this.props.onCreateNewBookSuccess()
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
        let book = {...this.state.book, nonRunnerNoBet, rule4 };
        this.setState({book});
    }
    _onTypeChange (e) {
        let value = e.target.value;
        let book = {...this.state.book, description: value }
        this.setState({book});
    }
    _onPlaceTermChange (e) {
        let value = e.target.value;
        let book = {...this.state.book, placeTerms: [{...this.state.book.placeTerms[0], description: value }] };
        this.setState({book});
    }
    _onSPChange (e) {
        let isChecked = e.target.checked;
        let book = {...this.state.book, createSpBook: isChecked };
        this.setState({book});
    }
    _onSave (e) {
        let { placeTerms, updateMarketBooks, market, selectedSPBook } = this.props;
        let { book } = this.state;
        let placeTermsRequest = generatePlaceTerms(placeTerms, book);
        let payload = [generateBookPayload({...book, currentBook: true, placeTermsRequest})]

        if (selectedSPBook) {
            let placeTermsRequest = generatePlaceTerms(placeTerms, selectedSPBook);
            payload.push(generateBookPayload({...selectedSPBook, currentBook: false, createSpBook: false, placeTermsRequest}));
        }
        updateMarketBooks(market.id, payload);
    }
    render () {
        let {
            className,
            types,
            placeTerms,
            isSPAllowed,
            onClose
        } = this.props;
        let { book } = this.state;
        let ruleKey = getMarketBookRuleKey(book);
        return (
            <div className="new-book-container">
                <div className="book-fields">
                    {isSPAllowed &&
                        <div className="form-group clearfix">
                            <label className="form-group-label">&nbsp;</label>
                            <SPCheckBox onChange={this._onSPChange} name="check3"/>
                        </div>
                    }
                    <BookTypes types={types} book={book} onChange={this._onTypeChange} name="types3" />
                    <PlaceTerms placeTerms={placeTerms} book={book} onChange={this._onPlaceTermChange} />
                    <BookRules ruleKey={ruleKey} onChange={this._onRuleChange} name="rules3" />
                </div>
                <div className="button-group tcenter">
                    <button type="button" onClick={onClose}>Cancel</button>
                    <button type="button" onClick={this._onSave}>Save</button>
                </div>
            </div>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(NewBook);
