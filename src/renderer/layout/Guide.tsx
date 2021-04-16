import React, { Component } from 'react'
import { withServices } from '../core/serviceContext';
import { MessageTypes, LogEntry } from '../services/ClientLogService';
import { findActFromZone } from '../datas/ActAndMap';
interface IZoneInfoProps {
    clientLog: EventTarget
}

interface IZoneInfoState {
    act?: string,
    guide?: string
}

class Guide extends Component<IZoneInfoProps, IZoneInfoState> {
    constructor(props) {
        super(props);

        this.state = {
            act: "Act 1"
        }
        this.props.clientLog.addEventListener(MessageTypes.ZONE, this.handleZone);
        
        this.LoadAndParseDetails();
    }

    async LoadAndParseDetails() {
        const res = await fetch(`static/${this.state.act}/guide.txt`);
        this.setState({
            guide: await res.text()
        });
        
        this.forceUpdate();
    }

    handleZone = (evt: CustomEvent<LogEntry>) : void => {
        console.log("zone", evt);
        this.setState({
            act: findActFromZone(evt.detail.zone)
        }, this.LoadAndParseDetails );
    }

    getColor(text:string) :string {
        switch (text.slice(0, 2)) {
            case 'G,': return "green";
            case 'R,': return "red";
            case 'B,': return "blue";
            default: return "white";
        }
    }

    render() {
        const { guide, act } = this.state;
        if (guide == null) return <div />;

        return (
            <div className="layout-guide">
                <div className="layout-guide-zone">{act}</div>
                <div className="layout-guide-detail">
                    {guide.split('\n').map( (s, i) => {
                        const text = s.trim();
                        if (text.length > 0) {
                            const style = { color : this.getColor(text) }
                            return (<p key={i} style={style}>{text}</p>)
                        }
                    })}
                </div>
            </div>
        )
    }
}


export default withServices(Guide);