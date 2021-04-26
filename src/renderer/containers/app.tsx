import React, { Component } from 'react'
import { config } from '../../main/config';
import { withServices } from '../core/serviceContext'
import Gems from '../layout/Gems';
import Guide from '../layout/Guide';
import Notes from '../layout/Notes';
import { MessageTypes, LogEntry } from '../services/ClientLogService';

interface IAPPProps {
    clientLog: EventTarget
}

class App extends Component<IAPPProps> {
    constructor(props) {
        super(props);
    }


    render() {
        return (
            <div>
                <Notes />
                <Guide />
                <Gems />
            </div>
        )
    }
}

export default withServices(App);