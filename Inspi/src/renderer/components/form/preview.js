import {  IconButton, withStyles } from "@material-ui/core";
import React from 'react'
import ButtonDropppable from "../ButtonDropppable";
import RemoveCircleIcon from '@material-ui/icons/RemoveCircle';

const styles = (theme) => ({
    previewImage: {
        width: "auto",
        height: '100%',
    },
    previewContent: {
        position: "relative",
        margin: "5px auto",
        height: 300,
        minHeight: 300
    },
    removeButton: {
        position: "absolute",
        left: 5,
        top: 5
    },
    previewButton: {
        textAlign: 'center'
    }
})

const Preview = (props) => {
    const { classes, path, buttonLabel, onClick, onDrop, onRemove, customClassName } = props;
    const className = customClassName ? customClassName : classes.previewContent
    
    return (
        <React.Fragment>
            <div className={className}>
                {path && (
                    <React.Fragment>
                        <img className={classes.previewImage} src={path} />
                        <IconButton color="secondary" className={classes.removeButton}
                            onClick={onRemove}
                        >
                            <RemoveCircleIcon/>
                        </IconButton>
                    </React.Fragment>
                )}
            </div>
            <ButtonDropppable 
                onClick={onClick }
                onDrop={onDrop}
                disableElevation={true}
                variant="contained"
                component="label"
                size={"small"}
                className={classes.previewButton}
            >
                {buttonLabel}
            </ButtonDropppable>
        </React.Fragment>  
    );
}

export default withStyles(styles)(Preview);
