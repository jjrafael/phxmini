import React, { PropTypes } from 'react';

class FormElement extends React.Component {
    constructor(props) {
        super(props);
    };

    render() {
        const { title, children, formInnerClass, formWrapperClass, onClick, hasAction, actionComponent } = this.props;
        let newformInnerClass = formInnerClass ? formInnerClass : '';
        let newformWrapperClass = formWrapperClass ? formWrapperClass : '';
        return(
            <div className={`form-inner ${newformInnerClass}`}>
                <div className={`form-wrapper ${newformWrapperClass}`}>
                    {title && <h4>{title} {hasAction && actionComponent}</h4>}
                    <div>
                        {children}
                    </div>
                </div>
            </div>
        )
    }
};

export default FormElement;