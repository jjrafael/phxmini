import React from "react";
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import ReactTable from 'react-table';
import { getBetsColumns, getFilteredBets } from '../helpers';
import ModalContent from './RedirectModalContent';
import LoadingIndicator from 'components/loadingIndicator';
import ConfirmModal from 'componentsV2/Modal/ConfirmModal';
import { fetchInitialData, fetchSubsequentData, removeScrollTop } from '../actions';
import { generateRiskUrl } from '../helpers';
import classnames from 'classnames';

const mapStateToProps = (state) => {
  return {
    bets: state.instantAction.tablesData.bets,
    filters: state.instantAction.betFilters,
    brandFilter: state.instantAction.brandFilter,
    display: state.instantAction.betDisplay,
    locked: state.instantAction.locks.bets,
    headersPreferences: state.instantAction.headersPreferences.bets,
    sports: state.instantAction.allSports,
    origins: state.instantAction.origins,
    channels: state.instantAction.channels,
    lastKey: state.instantAction.lastKeys.bets,
    scrollTop: state.instantAction.scrollTop
  }
}

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({
    fetchInitialData,
    fetchSubsequentData,
    removeScrollTop
  }, dispatch);
};

class Bets extends React.Component {
  constructor(props) {
    super(props);
    this._fetchSubsequentData = this._fetchSubsequentData.bind(this);
    this._onEventSelection = this._onEventSelection.bind(this);
    this._openInNewTab = this._openInNewTab.bind(this);
    this.state = {
      showConfirmationModal: false,
      currentRowInfo: {},
      activeUrl: '',
    }
  }

  componentWillMount() {
    const { bets, filters, brandFilter, sports, origins, channels, fetchInitialData, fetchSubsequentData } = this.props;
    if (sports[0] && origins[0] && channels[0]) {
      fetchInitialData('bets');
      this.timer = setInterval(() => {
        this._fetchSubsequentData();
      }, 3000);
    }

    const { maxRows } = this.props.display;
    if (bets) {
      this.filteredBets = getFilteredBets(bets, filters, brandFilter);

      if (maxRows) {
        if (Number(maxRows) === 0) {
          this.filteredBets = [];
        } else {
          this.filteredBets = this.filteredBets.slice(-maxRows);
        }
      }

    }
  }

  componentWillReceiveProps(nextProps) {
    const { bets, filters, brandFilter, sports, origins, channels, scrollTop, fetchInitialData, fetchSubsequentData, removeScrollTop } = nextProps;
    if (!this.timer) {
      if (sports[0] && origins[0] && channels[0]) {
        fetchInitialData('bets');
        this.timer = setInterval(() => {
          this._fetchSubsequentData();
        }, 3000);
      }
    }

    const { maxRows } = nextProps.display;
    if (bets) {
      this.filteredBets = getFilteredBets(bets, filters, brandFilter);

      if (maxRows) {
        if (Number(maxRows) === 0) {
          this.filteredBets = [];
        } else {
          this.filteredBets = this.filteredBets.slice(-maxRows);
        }
      }
    }

    if (scrollTop) {
      if (bets.length > this.props.bets.length) {
        const tableBody = document.querySelector('.bets-table .rt-tbody');
        tableBody.scrollTop = 0;
        removeScrollTop();
      }
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.locked) {
      if (this.props.bets && prevProps.bets) {
        if (this.props.bets.length !== prevProps.bets.length) {
          const tableBody = document.querySelector('.bets-table .rt-tbody');
          tableBody.scrollTop = tableBody.scrollTop + (this.props.bets.length - prevProps.bets.length) * 60;
        }
      }
    }
  }

  componentWillUnmount() {
    clearInterval(this.timer);
    delete this.timer;
  }

  _fetchSubsequentData() {
    const { lastKey, fetchSubsequentData } = this.props;
    if (lastKey) fetchSubsequentData('bets', lastKey);
  }

  _onEventSelection (value) {
    this.setState({activeUrl: value});
  }
  _openInNewTab () {
    const url = `${window.location.origin}/#${this.state.activeUrl}`
    window.open(url, '_blank');
  }

  render() {
    const bets = this.filteredBets && [...this.filteredBets].reverse();
    const { currentRowInfo, showConfirmationModal, activeUrl } = this.state;
    return (
      <div>
        {!bets && <LoadingIndicator />}
        {bets &&
          <ReactTable
            TrGroupComponent = {
              ({children, row, ...rest}) => {
                return  (
                <div className={classnames('rt-tr-group')} {...rest} onClick={() => {
                  if (row.events.length > 1) {
                    this.setState({
                      showConfirmationModal: true,
                      currentRowInfo: row
                    });
                  } else {
                    const activeUrl = generateRiskUrl({rowInfo: row, event: row.events[0]})
                    this.setState({activeUrl}, () => {
                      this._openInNewTab();
                    })
                  }
                }} >
                  {children}
                  <div className='bet-description'>
                    {children[0].props.children[5].props.children != typeof [] && children[0].props.children[5].props.children}
                  </div>
                </div>
                )
              }
            }
          
            expanded={true}
            className="table bets-table"
            defaultPageSize={20}
            pageSizeOptions={[10, 20, 25, 50, 100]}
            data={bets}
            columns={getBetsColumns(this.props.headersPreferences)}
            showPageSizeOptions={true}
            showPagination={true}
            minRows={0}
            noDataText="There are no bets"
            getTrGroupProps={(state, rowInfo) => {
              let props = {}
              if (rowInfo && rowInfo.row.betColor) {
                props = { style: { background: `#${rowInfo.row.betColor}` } }
              }
              if (rowInfo && !rowInfo.row.betColor) {
                this.props.display.items.forEach((item) => {
                  if (rowInfo.row.unitStakeP >= item.lowerLimit && rowInfo.row.unitStakeP <= item.upperLimit) {
                    props = { style: { background: item.backgroundColor, color: item.fontColor } }
                  }
                });
              }
              props.row = rowInfo.row;
              return props;
            }}
          />}
        {showConfirmationModal &&
          <ConfirmModal
              title={'Open in new tab'}
              message={<ModalContent rowInfo={currentRowInfo} onChange={this._onEventSelection} activeUrl={activeUrl} />}
              isVisible={true}
              onConfirm={() => {
                  this.setState({showConfirmationModal: false});
                  this._openInNewTab();
              }}
              onCancel={() => {
                  this.setState({showConfirmationModal: false})
              }}
              yesButtonLabel={'Proceed'}
              noButtonLabel={'Cancel'}
          />
        }
        
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Bets);