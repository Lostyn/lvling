import React from "react";
import { withStyles } from "@material-ui/core";
import {findDOMNode} from 'react-dom';

class ContentEditable extends React.Component {
    
    shouldComponentUpdate(nextProps, nextState) {
        return nextProps.html !== this.innerHTML();
    }

    componentDidUpdate(prevProps, prevState) {
        if (this.props.html !== this.innerHTML())
            this.setInnerHTML(this.props.html);
    }

    emitChange = (e) => {
        var html = this.innerHTML();
        if (this.props.onChange && html !== this.lastHtml) {
            this.props.onChange({
                target: { value: html }
            });
        }
        this.lastHtml = html;
    }

    keydown = (e) => {
        if (!this.props.multiline)
            if (e.keyCode == 13) e.preventDefault();
    }

    innerHTML = () => findDOMNode(this).innerHTML;
    setInnerHTML = (value) => findDOMNode(this).innerHTML = value;

    render() { 
        const { classes, multiline } = this.props;
        return (
            <div 
                onKeyDown={this.keydown}
                className={multiline ? classes.multilineContent : classes.content}
                onInput={this.emitChange}
                onBlur={this.emitChange}
                contentEditable
                dangerouslySetInnerHTML={{__html: this.props.html}}
            />
        )
    }
}

const styles = (theme) => ({
    content: {
        border: '1px solid rgb(211, 211, 211)',
        borderRadius: '4px',
        background: 'rgb(255, 255, 255)',
        padding: '5px 11px',
        lineHeight: '28px',
        outline: 'none',
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        fontWeight: 300,
        fontSize: 14
    },
    multilineContent: {
        border: '1px solid rgb(211, 211, 211)',
        borderRadius: '4px',
        background: 'rgb(255, 255, 255)',
        padding: '5px 11px',
        lineHeight: '28px',
        outline: 'none',
        whiteSpace: 'pre-wrap',
        fontWeight: 300,
        fontSize: 14,
        height: 100,
        overflow: 'scroll'
    }
});

export default withStyles(styles)(ContentEditable);