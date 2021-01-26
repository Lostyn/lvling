import React from "react";
import { withStyles } from "@material-ui/core";

class Separator extends React.Component {
    render() {
        const {header, labelessHeader} = this.props.classes;
        const {
            label
        } = this.props;


        return (
            <div className={label ? header : labelessHeader}>
                {label}
            </div>
        )
    }
}

const styles = (theme) => ({
    header: {
        padding: '20px 20px 8px',
        color: 'rgb(38, 38, 39)',
        fontSize: 16,
        lineHeight: '20px',
        textTransform: 'uppercase',
        boxShadow: 'rgba(0, 0, 0, 0.07) 0px -1px inset',
        marginBottom: 8,
        color: '#ffffff',
        backgroundColor: '#3f51b5'
    },
    labelessHeader: {
        height: 1,
        boxShadow: 'rgba(0, 0, 0, 0.07) 0px -1px inset',
        display: 'inline-table'
    }
});

export default withStyles(styles)(Separator);