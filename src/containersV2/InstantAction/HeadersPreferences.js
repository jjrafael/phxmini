import React from "react";
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { setHeaderPreference } from './actions';

const mapStateToProps = (state) => {
  return {
    headersPreferences: state.instantAction.headersPreferences
  }
}

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({
    setHeaderPreference
  }, dispatch);
};

class HeadersPreferences extends React.Component {
  render() {
    const { bets, accounts, payments, failedBets } = this.props.headersPreferences;
    return (
      <div className="headers-preferences-modal">
        <div>
          <h4 className="tcenter title">Headers Preferences</h4>
        </div>
        <div className="body">
          <div className="preferences-headers">
            <div className="header">Bets</div>
            <div className="header">Accounts</div>
            <div className="header">Payments</div>
            <div className="header">Failed Bets</div>
          </div>
          <div className="preferences-columns">
            <div className="column">
              <label>
                <input
                  type="checkbox"
                  checked={bets.icon}
                  onChange={() => this.props.setHeaderPreference('bets', 'icon', !bets.icon)}
                />
                Origin
              </label>
              <label>
                <input
                  type="checkbox"
                  checked={bets.date}
                  onChange={() => this.props.setHeaderPreference('bets', 'date', !bets.date)}
                />
                Date/Time
              </label>
              <label>
                <input
                  type="checkbox"
                  checked={bets.shop}
                  onChange={() => this.props.setHeaderPreference('bets', 'shop', !bets.shop)}
                />
                Shop
              </label>
              <label>
                <input
                  type="checkbox"
                  checked={bets.username}
                  onChange={() => this.props.setHeaderPreference('bets', 'username', !bets.username)}
                />
                Username
              </label>
              <label>
                <input
                  type="checkbox"
                  checked={bets.accountDescription}
                  onChange={() => this.props.setHeaderPreference('bets', 'accountDescription', !bets.accountDescription)}
                />
                Account Description
              </label>
              <label>
                <input
                  type="checkbox"
                  checked={bets.description}
                  onChange={() => this.props.setHeaderPreference('bets', 'description', !bets.description)}
                />
                Description
              </label>
              <label>
                <input
                  type="checkbox"
                  checked={bets.sport}
                  onChange={() => this.props.setHeaderPreference('bets', 'sport', !bets.sport)}
                />
                Sports
              </label>
              <label>
                <input
                  type="checkbox"
                  checked={bets.unitStake}
                  onChange={() => this.props.setHeaderPreference('bets', 'unitStake', !bets.unitStake)}
                />
                Unit Stake
              </label>
              <label>
                <input
                  type="checkbox"
                  checked={bets.totalStake}
                  onChange={() => this.props.setHeaderPreference('bets', 'totalStake', !bets.totalStake)}
                />
                Total Stake
              </label>
              <label>
                <input
                  type="checkbox"
                  checked={bets.winAmount}
                  onChange={() => this.props.setHeaderPreference('bets', 'winAmount', !bets.winAmount)}
                />
                Win Amount
              </label>
              <label>
                <input
                  type="checkbox"
                  checked={bets.unitStakeP}
                  onChange={() => this.props.setHeaderPreference('bets', 'unitStakeP', !bets.unitStakeP)}
                />
                Unit Stake (&#8369;)
              </label>
              <label>
                <input
                  type="checkbox"
                  checked={bets.totalStakeP}
                  onChange={() => this.props.setHeaderPreference('bets', 'totalStakeP', !bets.totalStakeP)}
                />
                Total Stake (&#8369;)
              </label>
              <label>
                <input
                  type="checkbox"
                  checked={bets.winAmountP}
                  onChange={() => this.props.setHeaderPreference('bets', 'winAmountP', !bets.winAmountP)}
                />
                Win Amount (&#8369;)
              </label>
            </div>
            <div className="column">
              <label>
                <input
                  type="checkbox"
                  checked={accounts.icon}
                  onChange={() => this.props.setHeaderPreference('accounts', 'icon', !accounts.icon)}
                />
                Origin
              </label>
              <label>
                <input
                  type="checkbox"
                  checked={accounts.date}
                  onChange={() => this.props.setHeaderPreference('accounts', 'date', !accounts.date)}
                />
                Date/Time
              </label>
              <label>
                <input
                  type="checkbox"
                  checked={accounts.account}
                  onChange={() => this.props.setHeaderPreference('accounts', 'account', !accounts.account)}
                />
                Account
              </label>
              <label>
                <input
                  type="checkbox"
                  checked={accounts.username}
                  onChange={() => this.props.setHeaderPreference('accounts', 'username', !accounts.username)}
                />
                Username
              </label>
              <label>
                <input
                  type="checkbox"
                  checked={accounts.name}
                  onChange={() => this.props.setHeaderPreference('accounts', 'name', !accounts.name)}
                />
                Name
              </label>
              <label>
                <input
                  type="checkbox"
                  checked={accounts.email}
                  onChange={() => this.props.setHeaderPreference('accounts', 'email', !accounts.email)}
                />
                Email
              </label>
              <label>
                <input
                  type="checkbox"
                  checked={accounts.site}
                  onChange={() => this.props.setHeaderPreference('accounts', 'site', !accounts.site)}
                />
                Site
              </label>
              <label>
                <input
                  type="checkbox"
                  checked={accounts.referrer}
                  onChange={() => this.props.setHeaderPreference('accounts', 'referrer', !accounts.referrer)}
                />
                Referrer
              </label>
            </div>
            <div className="column">
              <label>
                <input
                  type="checkbox"
                  checked={payments.time}
                  onChange={() => this.props.setHeaderPreference('payments', 'time', !payments.time)}
                />
                Date/Time
              </label>
              <label>
                <input
                  type="checkbox"
                  checked={payments.account}
                  onChange={() => this.props.setHeaderPreference('payments', 'account', !payments.account)}
                />
                Account
              </label>
              <label>
                <input
                  type="checkbox"
                  checked={payments.description}
                  onChange={() => this.props.setHeaderPreference('payments', 'description', !payments.description)}
                />
                Description
              </label>
              <label>
                <input
                  type="checkbox"
                  checked={payments.credit}
                  onChange={() => this.props.setHeaderPreference('payments', 'credit', !payments.credit)}
                />
                Credit
              </label>
              <label>
                <input
                  type="checkbox"
                  checked={payments.debit}
                  onChange={() => this.props.setHeaderPreference('payments', 'debit', !payments.debit)}
                />
                Debit
              </label>
            </div>
            <div className="column">
              <label>
                <input
                  type="checkbox"
                  checked={failedBets.date}
                  onChange={() => this.props.setHeaderPreference('failedBets', 'date', !failedBets.date)}
                />
                Date/Time
              </label>
              <label>
                <input
                  type="checkbox"
                  checked={failedBets.username}
                  onChange={() => this.props.setHeaderPreference('failedBets', 'username', !failedBets.username)}
                />
                Username
              </label>
              <label>
                <input
                  type="checkbox"
                  checked={failedBets.account}
                  onChange={() => this.props.setHeaderPreference('failedBets', 'account', !failedBets.account)}
                />
                Account
              </label>
              <label>
                <input
                  type="checkbox"
                  checked={failedBets.description}
                  onChange={() => this.props.setHeaderPreference('failedBets', 'description', !failedBets.description)}
                />
                Description
              </label>
              <label>
                <input
                  type="checkbox"
                  checked={failedBets.stake}
                  onChange={() => this.props.setHeaderPreference('failedBets', 'stake', !failedBets.stake)}
                />
                Stake (&#8369;)
              </label>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(HeadersPreferences);