import React, { PropTypes } from "react";

export default class EventDetails extends React.Component {
    constructor(props) {
        super(props);
        const { eventDetails } = props;
        this._handleRestrictedChange = this._handleRestrictedChange.bind(this);
        this._handleTeasersChange = this._handleTeasersChange.bind(this);
        this._handleDenyRestrictionChange = this._handleDenyRestrictionChange.bind(this);
        this.state = {
            restricted: props.eventDetails.restricted,
            teaserBetsAllowed: props.eventDetails.teaserBetsAllowed,
            denySameGameRestriction: props.eventDetails.denySameGameRestriction
        }
    }

    componentDidUpdate(prevProps, prevState) {
        if(this.props.shouldResetState) {
            this._resetState();
        }
    }

    _resetState() {
        const { restricted, teaserBetsAllowed, denySameGameRestriction } = this.props.eventDetails;
        this.setState({
            restricted,
            teaserBetsAllowed,
            denySameGameRestriction
        });
    }

    _handleRestrictedChange(e) {
        this.setState({
            restricted: e.target.checked
        });
        this.props.changeHandler('eventDetails.restricted', e.target.checked);
    }

    _handleTeasersChange(e) {
        this.setState({
            teaserBetsAllowed: e.target.checked
        });
        this.props.changeHandler('eventDetails.teaserBetsAllowed', e.target.checked);
    }

    _handleDenyRestrictionChange(e) {
        this.setState({
            denySameGameRestriction: e.target.value
        });
        this.props.changeHandler('eventDetails.denySameGameRestriction', e.target.value);
    }

    render() {
        const { restricted, teaserBetsAllowed, denySameGameRestriction } = this.state;
        return (
            <section className="event-details form-wrapper">
                <h4>Event Details</h4>
                <div className="form-inner">
                    <div className="tleft form-field">
                        <label className="push-right">
                            <input type="checkbox" checked={restricted} onChange={this._handleRestrictedChange}/>
                            Restricted Event
                        </label>
                        <label>
                            <input type="checkbox" checked={teaserBetsAllowed} onChange={this._handleTeasersChange}/>
                            Teasers Allowed
                        </label>
                    </div>
                    <div className="tleft form-field">
                        <span className="text-bold">
                            Deny same game
                        </span>
                        <br/>
                        <label className="push-right">
                            <input type="radio" name="deny-game" value="NO" onChange={this._handleDenyRestrictionChange} checked={denySameGameRestriction === "NO"} />
                            No restriction
                        </label>
                        <label className="push-right">
                            <input type="radio" name="deny-game" value="MAINPERIOD" onChange={this._handleDenyRestrictionChange} checked={denySameGameRestriction === "MAINPERIOD"}/>
                            Match
                        </label>
                        <label className="push-right">
                            <input type="radio" name="deny-game" value="ALLPERIODS" onChange={this._handleDenyRestrictionChange} checked={denySameGameRestriction === "ALLPERIODS"}/>
                            All periods
                        </label>
                    </div>
                </div>
            </section>
        )
    }
}