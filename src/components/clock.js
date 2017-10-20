import React from "react";
import moment from 'moment';

class Clock extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            timer: null,
            interval: null,
            time: moment().format('h:mm A')
        };

        this._getTime = this._getTime.bind(this);
    }

    componentWillMount() {
        const interval = setInterval(this._getTime, 1000);
        this.setState({interval});
    }

    componentWillUnmount() {
        clearInterval(this.state.interval);
    }

    _initClock(){
        //console.log('jj _clock: ', this.state);
        //this.state.timer = moment().format('H:mm:ss A');
        // setInterval(function(){
        //   this.state.timer = moment().format('H:mm:ss A');
        //   console.log('jj debug every 1s');
        // }, 1000);

        // this.state.timer = setInterval(()=> {
        //   this._getTime();
        //   console.log('jj debug every 1s');
        // }, 1000);
    }
    _getTime(){
        this.setState({time: moment().format('h:mm A')});
    }

    render(){
        return (
            <div className="clock user-timezone">
                {this.state.time}
            </div>
        )
    }
}

export default Clock;
