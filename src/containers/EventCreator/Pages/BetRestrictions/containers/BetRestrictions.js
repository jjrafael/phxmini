'use strict';
import React from "react";
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

class BetRestrictions extends React.Component {
    render() {
        return (
            <div>
            <EventPathMain />
            <div>Bet Restrictions</div>
            </div>
        );
    }
};

export default BetRestrictions;
