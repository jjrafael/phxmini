import React, { PropTypes } from 'react';
import { Grid, Row, Col } from 'react-flexbox-grid/lib';

class GridModule extends React.Component {
    constructor(props) {
        super(props);
    };

    render() {
        const { children, className } = this.props;
        return(
            <Grid fluid className={className}>
                {children}
            </Grid>
        )
    }
};

export default GridModule;