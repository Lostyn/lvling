import { fade, InputBase, InputLabel, withStyles } from "@material-ui/core";
import React from 'react'

const BaseInput = withStyles( (theme) => ({
    root: {
        margin: '5px 0'
    },
    input: {
      borderRadius: 4,
      position: 'relative',
      backgroundColor: theme.palette.common.white,
      border: '1px solid #ced4da',
      fontSize: 16,
      padding: '10px 12px',
      // Use the system font instead of the default Roboto font.
      fontFamily: [
        '-apple-system',
        'BlinkMacSystemFont',
        '"Segoe UI"',
        'Roboto',
        '"Helvetica Neue"',
        'Arial',
        'sans-serif',
        '"Apple Color Emoji"',
        '"Segoe UI Emoji"',
        '"Segoe UI Symbol"',
      ].join(','),
    },
}))(InputBase)

const styles = (theme) => ({
    root: {
        margin: '0 5px',
        display: 'flex'
    },
    label: {
        width: 150,
        marginTop: 18
    }
})

const TextField = (props) => {
    const {classes, label, ...otherProps} = props;
    return (
        <div className={classes.root}>
            <InputLabel htmlFor="base-input"  className={classes.label}>{label}</InputLabel>
            <BaseInput {...otherProps} id="base-input" fullWidth={true}/>
        </div>
    )
}

export default withStyles(styles)(TextField);
