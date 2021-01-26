import React from 'react'
import { withStyles, InputBase, InputLabel, Select } from '@material-ui/core'

const BaseSelect = withStyles( (theme) => ({
    root: {
        margin: '5px 0'
    },
    input: {
        borderRadius: 4,
        position: 'relative',
        backgroundColor: theme.palette.background.white,
        border: '1px solid #ced4da',
        fontSize: 16,
        padding: '10px 26px 10px 12px',
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
    }
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

const FormSelect = (props) => {
    const {classes, label, children, ...otherProps} = props;

    return (
        <div className={classes.root}>
            <InputLabel htmlFor="base-select" className={classes.label}>{label}</InputLabel>
            <Select {...otherProps} id="base-select" fullWidth={true} input={<BaseSelect />}>
                {children}
            </Select>
        </div>
    )
}


export default withStyles(styles)(FormSelect);