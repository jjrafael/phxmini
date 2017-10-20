import React, { PropTypes } from "react";

export default class EventInfo extends React.Component {
    constructor(props) {
        super(props);
        this._handleInfoChange = this._handleInfoChange.bind(this);
        this._handleCommentsChange = this._handleCommentsChange.bind(this);
        this.state = {
            eventInformation: props.eventInfo.eventInformation || '',
            eventComments: props.eventInfo.comments,
        }
    }

    componentDidUpdate(prevProps, prevState) {
        if(this.props.shouldResetState) {
            this._resetState();
        }
    }

    _resetState() {
        const { eventInformation, eventComments } = this.props.eventInfo;
        this.setState({
            eventInformation: eventInformation || '',
            eventComments
        });
    }

    _handleCommentsChange(e) {
        this.setState({ eventComments: e.target.value });
        this.props.changeHandler('eventDetails.comments', e.target.value);
    }

    _handleInfoChange(e) {
        this.setState({ eventInformation: e.target.value });
        this.props.changeHandler('eventDetails.eventInformation', e.target.value);
    }



    render() {
        const { eventInfo, changeHandler } = this.props;
        const { eventInformation, eventComments } = this.state;
        return (
            <section className="event-info form-wrapper">
                <h4>Event Information</h4>
                <div className="form-inner">
                    <div className="form-field block-form-field">
                        <label>
                            Information
                        </label>
                        <textarea className="block-input" onChange={this._handleInfoChange} value={eventInformation}/>
                    </div>
                    <div className="form-field block-form-field">
                        <label>
                            Comments
                        </label>
                        <textarea className="block-input" onChange={this._handleCommentsChange} value={eventComments}/>
                    </div>
                </div>
            </section>
        )
    }
}