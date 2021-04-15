import React, { Component } from 'react'
import { withServices } from '../core/serviceContext'
import Guide from '../layout/Guide';
import Notes from '../layout/Notes';
import { MessageTypes, LogEntry } from '../services/ClientLogService';

interface IAPPProps {
    clientLog: EventTarget
}

const ME: string = "SplLvlTest"

class App extends Component<IAPPProps> {
    constructor(props) {
        super(props);

        this.props.clientLog.addEventListener(MessageTypes.LEVEL, this.handleLevel);
    }

    handleLevel = (evt: CustomEvent<LogEntry>) : void => {
        console.log("level", evt);
        if (evt.detail.charName == ME) {
            this.setState({
                level: evt.detail.level
            })
        }
    }


    render() {
        return (
            <div>
                <Notes />
                <Guide />
            </div>
        )
    }
}

export default withServices(App);