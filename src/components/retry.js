import React from "react";

class Retry extends React.Component {

    render(){
        let { message, onClick, label} = this.props;
        return (
            <div className="info-message error">
                <span>{message}</span>
                {label && <button onClick={onClick}>{label}</button>}
            </div>
        )
    }
}

export default Retry;