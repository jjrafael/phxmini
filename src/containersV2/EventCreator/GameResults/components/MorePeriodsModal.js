import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import ModalWindow from 'components/modal';
import { closeModal, openModal } from 'actions/modal';


class MorePeriodsModal extends Component {
    state = {
        selectedId:null
    }
    _pushContentToDOM = (index, domArr, data, className="", updateOthersTabDetails) => {
        domArr.push(<tr className={`${className}`}>
            <td ><input type="checkbox" className="periods-checkboxes" checked={this.state.selectedId === data.id}  onChange={(e) => {
                this.setState({selectedId:data.id})
              updateOthersTabDetails(e, data, index)
            }}/> { index ? `Live ${data.fullDescription}` : data.fullDescription}</td>
            <td>
            </td>
            <td></td>
            <td></td>
        </tr>);
    }

    render(){
        let {updateOthersTabDetails} = this.props
        let dom = [];
        if(this.props.tree.length) {
          this.props.tree.forEach((t, ti) => {
              this._pushContentToDOM(ti, dom, t, 'parent',updateOthersTabDetails);
              if(t.hasOwnProperty('children') && t.children) {
                  let firstChildLoop =  t.children;
                  firstChildLoop.forEach((c, ci) => {
                    this._pushContentToDOM(ti, dom, c, "first", updateOthersTabDetails);
                      if(c.hasOwnProperty('children') && c.children) {
                            let secondChildLoop =  c.children;
                            secondChildLoop.forEach((cc, cci) => {
                                this._pushContentToDOM(ti, dom, cc, "second", updateOthersTabDetails);
                              if(cc.hasOwnProperty('children') && cc.children) {
                                  let thirdChildLoop =  cc.children;
                                  thirdChildLoop.forEach((ccc, ccci) => {
                                    this._pushContentToDOM(ti, dom, ccc, "third", updateOthersTabDetails);
                                  })
                              }
                          })
                      }
                  })
              }
          })
        }
        return <ModalWindow
            className="medium more-periods-modal"
            title="More Periods"
            name="gameResultsMorePeriod"
            isVisibleOn={this.props.modals.gameResultsMorePeriod}
            shouldCloseOnOverlayClick={true}>
            <div className="">
              <div className="tcenter top"><h4>More Periods</h4></div>
              <div className="more-periods-container">
                  <div className="inner">
                      <table className="event-score">
                          <tbody>
                              {dom.length ?  dom : null}
                          </tbody>
                      </table>
                  </div>
              </div>
              <div className="modal-controls tcenter">
                    <button type="button" onClick={(e)=> {
                        this.props.closeModal('gameResultsMorePeriod');
                    }}>Close</button>
              </div>
            </div>
        </ModalWindow>;
    }
}

function mapStateToProps(state) {
    return {
        event: state.eventCreatorEvent,
        eventDetails: state.eventCreatorEvent.event,
        marketStateDetails: state.marketStateDetails,
        event: state.eventCreatorEvent,
        gameResults: state.gameResults,
        newMarketFilters: state.eventCreatorEventMarkets.newMarketFilters,
        isFetchingMarketPeriods: state.eventCreatorEventMarkets.isFetchingMarketPeriods,
        isFetchingMarketTypes: state.eventCreatorEventMarkets.isFetchingMarketTypes,
        modals: state.modals,
    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({ 
      closeModal, 
      openModal
    }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(MorePeriodsModal);