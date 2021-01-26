import { IconButton, InputLabel, withStyles } from '@material-ui/core'
import React from 'react'
import { validateFromExtension } from '../../data/files';
import ButtonDropppable from '../ButtonDropppable';
import RemoveCircleIcon from '@material-ui/icons/RemoveCircle';

const { dialog } = require("electron").remote;

const styles = (theme) => ({
    root: {
        margin: '5px',
    },
    flex: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    label: {
        width: 150
    },
    value: {
        fontSize: 11,
        marginTop: 5,
        textAlign: 'center'
    }
})

const PathInput = (props) => {
    const {classes, label, button, value, onChange, onError, control} = props;
    
    const clickHandler = () => {
        dialog.showOpenDialog({
            properties: ['openFile'],
            filters: {
                extensions: control.extensions,
                name: control.extensions
                    .map( ext => `*.${ext}`)
                    .join(',')
            }
        }, paths => {
            if (paths) onChange && onChange(paths[0])
        })
    }

    const dropHandler = (path) => {
        if (!validateFromExtension(path, control)) {
            onError && onError();
        } else {
            onChange(path);
        }
    }

    const removeHandler = () => {
        onChange("");
    }

    return (
        <div className={classes.root}>
            <div className={classes.flex}>
                <InputLabel className={classes.label}>{label}</InputLabel>
                <ButtonDropppable
                    onClick={clickHandler}
                    onDrop={dropHandler}
                    disableElevation={true}
                    variant="contained"
                    component="label"
                    size="small"
                >
                    {button}
                </ButtonDropppable>
            </div>
            { value && (
                <div className={classes.flex}>
                    <IconButton color="secondary" onClick={removeHandler}>
                        <RemoveCircleIcon/>
                    </IconButton>
                    <div className={classes.value}>{value}</div>
                </div>
            )}
        </div>
    )
}

export default withStyles(styles)(PathInput);