import React, { PropTypes } from "react";
import { formatISODateString } from '../../utils';
import SelectBox from '../selectBox';

export default class BookInfo extends React.Component {
    constructor(props) {
        super(props);
        this._handleRowChange = this._handleRowChange.bind(this);
        const { data } = props;
        this.state = {
            bookInfo: data.bookInfo
        }
    }
    
    componentDidUpdate(prevProps, prevState) {
        if(this.props.shouldResetState) {
            this._resetState();
        }
    }

    _resetState() {
        this.setState({
            bookInfo: this.props.data.bookInfo
        });
    }

    _handleRowChange(index, propToChange, value) {
        const { changeHandler } = this.props;
        const newRowState = { ...this.state.bookInfo[index], [propToChange]: value };
        const newState = [ ...this.state.bookInfo ];
        newState[index] = newRowState;
        this.setState({
            bookInfo: newState
        });
        changeHandler('bookInfo.bookInfo', [newRowState], 'book');
    }

    _getAppliedPlaceTerms(value, id) {
        let matchFound = this.props.placeTerms.find((placeTerm)=> placeTerm.description === value);
        const { numPlaces, fixed } = matchFound;
        return {
            id,
            numPlaces,
            fixed,
            deduction: matchFound.placeTerms.deduction
        }; 
    }


    render() {
        const { placeTerms } = this.props;
        if(this.state.bookInfo.length) {
            return (
                <div className="book-info">
                    <table cellPadding="0" cellSpacing="0">
                        <thead>
                            <tr>
                                <th>
                                    Book
                                </th>
                                <th>
                                    Time
                                </th>
                                <th>
                                    Default Place Terms
                                </th>
                                <th>
                                    Applied Place Terms
                                </th>
                                <th>
                                    Fixed
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {this.state.bookInfo.map((bookInfoItem, index)=> {
                                return (
                                    <tr key={index}>
                                        <td>
                                            {bookInfoItem.book}
                                        </td>
                                        <td>
                                            {formatISODateString(bookInfoItem.time)}
                                        </td>
                                        <td>
                                            {bookInfoItem.defaultPlaceTerms}
                                        </td>
                                        <td className="editable">
                                        <SelectBox
                                            className="place-terms block-input"
                                            onChange={(e)=> {
                                                this._handleRowChange(index, 'appliedPlaceTerms', this._getAppliedPlaceTerms(e.target.value, bookInfoItem.appliedPlaceTerms.id));
                                            }}
                                            valueKey={'description'}
                                            descKey={'description'}
                                            value={bookInfoItem.appliedPlaceTerms.description}
                                            name="place-terms"
                                            options={placeTerms}/>
                                        </td>
                                        <td className="editable">
                                            <input type="checkbox" disabled={true} checked={bookInfoItem.appliedPlaceTerms.fixed}/>
                                        </td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                </div>
            )
        } else {
            return (
                <div className="tcenter">
                    Books are not applicable for this market.
                </div>
            )
        }
    }
}