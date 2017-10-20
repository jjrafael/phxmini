import React from "react";
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import SportItem from './SportItem';
import { toggleExpand, toggleActive, changeSportsType, addSport, removeSport } from '../../actions';
import LoadingIndicator from 'components/loadingIndicator';

const mapStateToProps = (state) => {
  return {
    filter: state.instantAction.betFilters.sports,
    sports: state.apiConstants.values.riskSports
  }
}

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({
    toggleExpand,
    toggleActive,
    changeSportsType,
    addSport,
    removeSport
  }, dispatch);
};

class SportsFilter extends React.Component {
  constructor(props) {
    super(props);
    this._toggleSportChecked = this._toggleSportChecked.bind(this);
  }

  _toggleSportChecked(e) {
    const { name, checked } = e.target;
    if (checked) {
      this.props.addSport(name);
    } else {
      this.props.removeSport(name);
    }
  }

  render() {
    const { sports, filter, toggleExpand, toggleActive, changeSportsType, addSport, removeSport } = this.props;
    return (
      <div className="sports-filter">
        <div className="toggle-header">
          <label>
            <input type="checkbox" checked={filter.active} onChange={() => toggleActive('sports')} />
            <span className="header-text">Sports</span>
          </label>
          <i
            className={filter.expanded ? "toggle-button phxico phx-minus-box-outline" : "toggle-button phxico phx-plus-box-outline"}
            onClick={() => toggleExpand('sports')}
          >
          </i>
        </div>

        {filter.expanded &&
          <div>
            <div className={filter.active ? "body" : "body disabled-body"}>
              <div className="show-bets-field">
                <label>
                  <input
                    type="radio"
                    value="show"
                    checked={filter.type === 'show'}
                    onChange={(e) => changeSportsType(e.target.value)}
                  />
                  <span>Show bets for selected sports</span>
                </label>
              </div>

              <div className="exclude-bets-field">
                <label>
                  <input
                    type="radio"
                    value="exclude"
                    checked={filter.type === 'exclude'}
                    onChange={(e) => changeSportsType(e.target.value)}
                  />
                  <span>Exclude bets for selected sports</span>
                </label>
              </div>
            </div>

            <div className={(filter.active && filter.type) ? "sports" : "sports disabled-body"}>
              {!sports && <LoadingIndicator />}
              {sports && sports.map((sport, index) =>
                <SportItem
                  title={sport.description}
                  name={sport.description}
                  checked={filter.items.some((item) => item === sport.description)}
                  onChange={this._toggleSportChecked}
                  key={index}
                />
              )}
            </div>
          </div>}
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(SportsFilter);