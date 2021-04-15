import React, { Component } from 'react'
import { withServices } from '../core/serviceContext';
import { MessageTypes, LogEntry } from '../services/ClientLogService';
import readline from 'readline';
import fs from 'fs';

interface IZoneInfoProps {
    clientLog: EventTarget
}

interface IZoneInfoState {
    act: string,
    zone?: string
}

class ZoneDetail {
    zone: string;
    detail: string;
}

class ZoneInfo extends Component<IZoneInfoProps, IZoneInfoState> {

    details: ZoneDetail[];

    constructor(props) {
        super(props);

        this.state = {
            act: "Act1"
        }
        this.props.clientLog.addEventListener(MessageTypes.ZONE, this.handleZone);
        
        this.LoadAndParseDetails();
    }

    async LoadAndParseDetails() {
        this.details = [];
        const res = await fetch(`static/${this.state.act}.txt`);
        const data = await res.text();
        const lines = data.split('\n');
        let line;

        for(var i = 0; i < lines.length; i++) {
            line = lines[i];
            if (line.startsWith('zone:')) {
                this.details.push( {
                    zone: line.split(':')[1].trim(),
                    detail: ""
                });
            } else {
                this.details[this.details.length - 1].detail += line + '\n';
            }
        }

        console.log(this.details);
        this.forceUpdate();
    }

    handleZone = (evt: CustomEvent<LogEntry>) : void => {
        console.log("zone", evt);
        this.setState({
            zone: evt.detail.zone
        });
    }

    render() {
        const { zone } = this.state;
        const detail = this.details.find( o => o.zone === zone);
        if (detail == null) return <div />;

        return (
            <div className="layout-leveling">
                <div className="layout-leveling-zone">{zone}</div>
                <div className="layout-leveling-detail">
                    {detail.detail.split('\n').map( (s, i) => {
                        const text = s.trim();
                        if (text.length > 0)
                            return (<p key={i}>{text}</p>)
                    })}
                </div>
            </div>
        )
    }
}


export default withServices(ZoneInfo);