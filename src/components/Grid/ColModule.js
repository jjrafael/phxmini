import React, { PropTypes } from 'react';
import { Grid, Row, Col } from 'react-flexbox-grid/lib';

class SpanModule extends React.Component {
    constructor(props) {
        super(props);
    };

    render() {
        const { children, className, xs, sm, md, lg } = this.props;
        return(
            <Col type="row" className={className} xs={xs} sm={sm} md={md} lg={lg}>
                {children}
            </Col>
        )
    }
};

export default SpanModule;