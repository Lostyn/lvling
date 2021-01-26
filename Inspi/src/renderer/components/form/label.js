import React from "react";
import { withStyles } from "@material-ui/core";
import ContentEditable from "./contentEditable";

class Label extends React.Component {
    render() {
        const {
            labelStyle,
            labelStyleError,
        } = this.props.classes;
        
        const {
            label,
            error,
            className
        } = this.props;

        return (
            <div className={className}>
                <div className={error ? labelStyleError : labelStyle}>{ label }</div>
            </div>
        );
    }
}

const styles = (theme) => ({
    labelStyle: {
        opacity: 0.8
    },
    labelStyleError: {
        opacity: 0.8,
        color: '#f44336',
        fontWeight: 600
    },
});

export default withStyles(styles)(Label);