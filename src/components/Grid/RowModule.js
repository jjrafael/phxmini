import React, { PropTypes } from 'react';
import { Grid, Row, Col } from 'react-flexbox-grid/lib';

class RowModule extends React.Component {
    constructor(props) {
        super(props);
    };

    render() {
        const { className, children, start, end, center } = this.props;
        return(
            <Row className={className} start={start} end={end} center={center}>
                {children}
            </Row>
        )
    }
};

export default RowModule;