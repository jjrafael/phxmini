import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import moment from 'moment';
import isEqual from 'lodash.isequal';
import { getMarketBookRuleKey, generatePlaceTerms, generateBookPayload } from 'phxUtils';
import ModalWindow from 'components/modal';
import LoadingIndicator from 'phxComponents/loadingIndicator';
import { updateMarketBooks, fetchMarketBooks } from '../actions';
import SPCheckBox from './BookFormFields/SPCheckbox';
import BookTypes from './BookFormFields/BookTypes';
import PlaceTerms from './BookFormFields/PlaceTerms';
import BookRules from './BookFormFields/BookRules';
import BookCheckBox from './BookManagerBooks/BookCheckBox';
import BookDetails from './BookManagerBooks/BookDetails';
import NewBook from './BookManagerBooks/NewBook';


const mapStateToProps = (state, ownProps) => {
    return {
        market: state.eventCreatorEventMarkets.market,
        marketBooks: state.eventCreatorEventMarkets.marketBooks,
        isFetchingMarketBooks: state.eventCreatorEventMarkets.isFetchingMarketBooks,
        isFetchingMarketBooksFailed: state.eventCreatorEventMarkets.isFetchingMarketBooksFailed,
        isUpdatingMarketBooks: state.eventCreatorEventMarkets.isUpdatingMarketBooks,
        isUpdatingMarketBooksFailed: state.eventCreatorEventMarkets.isUpdatingMarketBooksFailed
    };
};

const mapDispatchToProps = (dispatch, ownProps) => {
    return bindActionCreators({
        fetchMarketBooks,
        updateMarketBooks
    }, dispatch);
};

class BookManager extends Component {
    constructor (props) {
        super(props);
        this._onBookClick = this._onBookClick.bind(this);
        this._onBookSelection = this._onBookSelection.bind(this);
        this._onRuleChange = this._onRuleChange.bind(this);
        this._onTypeChange = this._onTypeChange.bind(this);
        this._onPlaceTermChange = this._onPlaceTermChange.bind(this);
        this._onSave = this._onSave.bind(this);
        this._onRefresh = this._onRefresh.bind(this);
        this._onRefreshButtonClick = this._onRefreshButtonClick.bind(this);
        let currentBook = this.props.marketBooks.find(book => (book.description !== 'SP' && book.current));
        this.state = {
            updatedBooks: this.props.marketBooks,
            selectedSPBook: this.props.marketBooks.find(book => (book.description === 'SP' && book.current)),
            selectedBook: currentBook,
            showAddBook: false,
            setCurrentBookToCurrent: false,
            currentBook,
        }
    }
    componentWillUpdate (nextProps) {
        if (this.props.isFetchingMarketBooks && !nextProps.isFetchingMarketBooks && !nextProps.isFetchingMarketBooksFailed) {
            let nextCurrentBook = nextProps.marketBooks.find(book => book.description !== 'SP' && book.current);
            let currentBook = this.state.currentBook ? this.state.currentBook : nextCurrentBook;
            if (this.state.setCurrentBookToCurrent) {
                currentBook = nextCurrentBook;
            }
            this.setState({
                updatedBooks: nextProps.marketBooks,
                currentBook: currentBook,
                selectedSPBook: nextProps.marketBooks.find(book => (book.description === 'SP' && book.current)),
                selectedBook: nextCurrentBook,
                setCurrentBookToCurrent: false
            });
        }
        // re-fetch market books after updating
        if (this.props.isUpdatingMarketBooks && !nextProps.isUpdatingMarketBooks && !nextProps.isUpdatingMarketBooksFailed) {
            this._onRefresh();
        }
    }
    componentDidMount () {
        this.props.fetchMarketBooks(this.props.market.id)
    }
    _onBookClick (book) {
        this.setState({currentBook: book})
    }
    _onBookSelection (isChecked, book) {
        let updatedBooks = this.state.updatedBooks;
        let index = updatedBooks.findIndex(e => e.id === book.id)
        let desc = book.description;
        let newUpdatedBooks = [
            ...updatedBooks.slice(0, index),
            {...book, current: isChecked },
            ...updatedBooks.slice(index + 1)
        ]
        let currentSelection;
        let currentSelectionKey;
        let newSelectedBook = book;
        if (desc === 'SP') {
            currentSelection = this.state.selectedSPBook;
            currentSelectionKey = 'selectedSPBook';
        } else {
            currentSelection = this.state.selectedBook;
            currentSelectionKey = 'selectedBook';
        }
        if (currentSelection) { // if there is currently a selected book
            if (currentSelection.id !== book.id) { // and it's not this book
                let index = newUpdatedBooks.findIndex(e => e.id === currentSelection.id);
                newUpdatedBooks = [
                    ...newUpdatedBooks.slice(0, index),
                    {...newUpdatedBooks[index], current: false},
                    ...newUpdatedBooks.slice(index + 1)
                ]
            }
            if (!isChecked && currentSelection.id === book.id) {
                newSelectedBook = null;
            }
        }
        this.setState({
            updatedBooks: newUpdatedBooks,
            [currentSelectionKey]: newSelectedBook,
            currentBook: {...book, current: isChecked }
        });
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
        let { currentBook, updatedBooks } = this.state;
        let index = updatedBooks.findIndex(book => book.id === currentBook.id);
        let newCurrentBook = { ...currentBook, nonRunnerNoBet, rule4 };
        this.setState({
            updatedBooks: [...updatedBooks.slice(0, index), newCurrentBook, ...updatedBooks.slice(index + 1)],
            currentBook: newCurrentBook
        });
    }
    _onTypeChange (e) {
        let value = e.target.value;
        let { currentBook, updatedBooks } = this.state;
        let index = updatedBooks.findIndex(book => book.id === currentBook.id);
        let newCurrentBook = { ...currentBook, description: value };
        this.setState({
            updatedBooks: [...updatedBooks.slice(0, index), newCurrentBook, ...updatedBooks.slice(index + 1)],
            currentBook: newCurrentBook
        });
    }
    _onPlaceTermChange (e) {
        let value = e.target.value;
        let { currentBook, updatedBooks } = this.state;
        let index = updatedBooks.findIndex(book => book.id === currentBook.id);
        let newCurrentBook = { ...currentBook, placeTerms: [{...currentBook.placeTerms[0], description: value }] };
        this.setState({
            updatedBooks: [...updatedBooks.slice(0, index), newCurrentBook, ...updatedBooks.slice(index + 1)],
            currentBook: newCurrentBook
        });
    }
    _onSave (e) {
        let { placeTerms } = this.props;
        let payload = this.state.updatedBooks.reduce((accu, value) => {
            let placeTermsRequest = generatePlaceTerms(placeTerms, value);
            let newValue = generateBookPayload({...value, currentBook: value.current, createSpBook: false, placeTermsRequest})
            return [...accu, newValue];
        }, [])
        this.props.updateMarketBooks(this.props.market.id, payload);
    }
    _onRefresh (e) {
        this.props.fetchMarketBooks(this.props.market.id)
    }
    _onRefreshButtonClick (e) {
        this.setState({currentBook: undefined});
        this._onRefresh();
    }
    _onCreateNewBookSuccess (e) {
        this.setState({setCurrentBookToCurrent: true});
    }
    render () {
        let {
            types,
            placeTerms,
            isSPAllowed=false,
            market,
            isFetchingMarketBooks
        } = this.props;
        let {
            updatedBooks,
            currentBook={},
            selectedSPBook,
            selectedBook,
        } = this.state;
        let ruleKey = getMarketBookRuleKey(currentBook);
        let isSaveButtonDisabled = true;
        let saveButtonClassName = 'button btn-box disabled';
        if (selectedBook && updatedBooks.length && !isEqual(updatedBooks, this.props.marketBooks)) {
            isSaveButtonDisabled = false;
            saveButtonClassName = 'button btn-box';
        }
        return (
            <div className="book-manager-container">
                <div className="form-wrapper">
                    <div className="header panel-header">
                        <div className="panel-header-title">Books</div>
                        {!selectedBook &&
                            <div className="panel-header-error">Please select 1 non-SP book.</div>
                        }
                        <div className="panel-header-actions">
                            <button className="button btn-box" onClick={this._onRefreshButtonClick}><i className="phxicon phx-refresh"></i></button>
                            <button className="button btn-box" onClick={e => { this.setState({showAddBook: true}) }}><i className="phxicon phx-plus"></i></button>
                            <button className={saveButtonClassName} disabled={isSaveButtonDisabled} onClick={this._onSave}><i className="phxicon phx-save"></i></button>
                        </div>
                    </div>
                    <div className="panel-content">
                        {updatedBooks.map(book => {
                            let active = book.id === currentBook.id ? 'active' : '';
                            return <div key={book.id} className={`book-row ${active}`}>
                                <BookCheckBox book={book} checked={book.current} onChange={this._onBookSelection} />
                                <BookDetails book={book} date={moment(book.createDate).format('MM/DD/YYYY HH:mm')} onClick={this._onBookClick} />
                            </div>
                        })}
                    </div>
                </div>
                <div className="book-fields">
                    <div className="form-group clearfix">
                            <label className="form-group-label">&nbsp;</label>
                            <SPCheckBox disabled={true} checked={!!selectedSPBook && currentBook.description !== 'SP'} name="check2" />
                        </div>
                    <BookTypes types={types} disabled={currentBook.description === 'SP'} book={currentBook} onChange={this._onTypeChange} name="types2" />
                    <PlaceTerms placeTerms={placeTerms} book={currentBook} onChange={this._onPlaceTermChange} />
                    <BookRules ruleKey={ruleKey} onChange={this._onRuleChange} name="rules2" />
                </div>
                {this.state.showAddBook &&
                    <ModalWindow
                        isVisibleOn={true}
                        title="Create New Book"
                        onClose={e => this.setState({showAddBook: false})}
                        className="small create-new-book"
                        closeButton={true}>
                        <h4>Create New Book</h4>
                        <NewBook
                            types={types}
                            placeTerms={placeTerms}
                            isSPAllowed={isSPAllowed}
                            market={market}
                            selectedSPBook={selectedSPBook}
                            onClose={()=>{this.setState({showAddBook: false})}}
                            onCreateNewBookSuccess={e => this._onCreateNewBookSuccess()}
                        />
                    </ModalWindow>
                }
                {isFetchingMarketBooks &&
                    <div className="loading-container">
                        <LoadingIndicator />
                    </div>
                }
            </div>
        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(BookManager);
