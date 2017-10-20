import React, { Component } from 'react';
import MarketForm from './MarketForm';
import BookForm from './BookForm';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { isDirty, isValid } from 'redux-form';
import moment from 'moment';
import isEqual from 'lodash.isequal';
import { mapPermissionsToProps } from 'componentsV2/checkPermission/index';
import { permissionsCode } from 'containersV2/EventCreator/App/constants';
import { combineDateTime, selectValidProps, generatePlaceTerms, generateBookPayload } from 'phxUtils';
import { validMarketDetailsProps } from '../constants';
import { validOutcomeProps } from '../../Event/constants';
import { updateMarketDetails, setNewMarketOutcomes, updateMarketOutcomes, updateMarketBooks } from '../actions';
import OpponentsTable from '../../Opponents/index';
import NewMarketModal from '../MarketTypes/index';
import EditMarketModal from '../EditMarket/index';

const mapStateToProps = (state, ownProps) => {
    return {
        market: state.eventCreatorEventMarkets.market,
        outcomes: state.eventCreatorEventMarkets.outcomes,
        updatedMarketBook: state.eventCreatorEventMarkets.updatedMarketBook,
        hasSPBook: state.eventCreatorEventMarkets.hasSPBook,
        activeCode: state.sportsTree.activeSportCode,
        isMarketFormDirtyEvent: isDirty('MarketForm')(state),
        isMarketFormValidEvent: isValid('MarketForm')(state),
        placeTerms: state.apiConstants.values.placeTerms,
        newMarket: state.modals.newMarket,
        editMarket: state.modals.editMarket,
    };
};

const mapDispatchToProps = (dispatch, ownProps) => {
    return bindActionCreators({
        updateMarketDetails,
        setNewMarketOutcomes,
        updateMarketOutcomes,
        updateMarketBooks
    }, dispatch);
};

class Market extends Component {
    _onFormSubmit (data) {
        let {
            market,
            updateMarketDetails,
            updateMarketOutcomes,
            updateMarketBooks,
            outcomes,
            isMarketFormDirtyEvent,
            isMarketFormValidEvent,
            updatedMarketBook,
            hasSPBook,
            placeTerms,
            permissions
        } = this.props;

        if (!isEqual(market.outcomes, outcomes)) {
            let payload = selectValidProps(outcomes, validOutcomeProps);
            updateMarketOutcomes(market.id, payload);
        }
        if ((updatedMarketBook && !isEqual(market.book, updatedMarketBook)) || hasSPBook !== market.hasSPBook) {
            let placeTermsRequest = generatePlaceTerms(placeTerms, updatedMarketBook);
            let payload = [generateBookPayload({...updatedMarketBook, currentBook: true, createSpBook: hasSPBook, placeTermsRequest, id: null})]
            updateMarketBooks(market.id, payload);
        }
        if (isMarketFormDirtyEvent && isMarketFormValidEvent) {
            let payload = selectValidProps([data], validMarketDetailsProps)[0];
            payload.cutoffTime = combineDateTime(data.formCutoffDate, data.formCutoffTime);
            payload.print = !!!data.formPrint;
            if (data.formAutoOpenDate && data.formAutoOpenTime) {
                payload.autoOpenTime = combineDateTime(data.formAutoOpenDate, data.formAutoOpenTime);
            }
            // TODO: ask if BE can handle this instead
            // if (!permissions.includes(permissionsCode.CHANGE_GAME_EVENT_DATE_TIME)) {
            //     delete payload.cutoffTime;
            // }
            // if (!permissions.includes(permissionsCode.AUTO_SETTLEMENT)) {
            //     delete payload.autoSettle;
            // }
            updateMarketDetails(market.id, payload);
        }
    }
    render () {
        let {
            className,
            market,
            outcomes,
            setNewMarketOutcomes,
            activeCode
        } = this.props;
        let initialValues = {
            ...market,
            period: market.period ? market.period.fullDescription : '',
            formCutoffDate: moment(market.cutoffTime).format('L'),
            formCutoffTime: moment(market.cutoffTime).format('HH:mm'),
            formPrint: !!!market.print
        }
        if (market.autoOpenTime) {
            initialValues.formAutoOpenDate = moment(market.autoOpenTime).format('L');
            initialValues.formAutoOpenTime = moment(market.autoOpenTime).format('HH:mm');
        }
        let isGameEvent = market.parentType === 'GAMEEVENT';
        let hasBook = false;
        let marketTypeInfo = market.marketTypeInfo || {};
        let description = marketTypeInfo.description || '';
        if (description.toLowerCase().indexOf('outright') >= 0) {
            hasBook = true;
        }
        return (
            <div className="market-container">
                <div className="columns-container">
                    <MarketForm
                        initialValues={initialValues}
                        onFormSubmit={this._onFormSubmit.bind(this)}
                    />
                    {hasBook &&
                        <BookForm book={market.book} hasSPBook={market.hasSPBook} />
                    }
                    <div className="form-attributes">
                        <div className="form-wrapper">
                            <div className="header panel-header">
                                <div className="panel-header-title">Attributes</div>
                            </div>
                            <div className="panel-content"></div>
                        </div>
                    </div>
                </div>
                <div className="outcomes-container">
                    <div className="form-wrapper">
                        <div className="header panel-header">
                            <div className="panel-header-title">Outcomes</div>
                        </div>
                        <OpponentsTable
                            selectedOpponents={outcomes}
                            setNewSelectedOpponents={setNewMarketOutcomes}
                            clearNewSelectedOpponents={() => {}}
                            hasImportButton={false}
                            activeCode={activeCode}
                            isGameEvent={isGameEvent}
                            className="opponents-table-container panel-content"
                        />
                    </div>
                </div>
                { this.props.newMarket &&
                    <NewMarketModal />
                }
                { this.props.editMarket &&
                    <EditMarketModal market={market}/>
                }
            </div>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(mapPermissionsToProps(Market));