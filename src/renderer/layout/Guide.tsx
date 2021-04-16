import React, { Component } from 'react'
import { withServices } from '../core/serviceContext';
import { MessageTypes, LogEntry } from '../services/ClientLogService';
import { findActFromTown, findActFromZone } from '../datas/ActAndMap';
interface IZoneInfoProps {
    clientLog: EventTarget
}

interface IZoneInfoState {
    act?: number,
    guide?: string
}

class Guide extends Component<IZoneInfoProps, IZoneInfoState> {
    constructor(props) {
        super(props);

        this.state = {
            act: 1
        }
        this.props.clientLog.addEventListener(MessageTypes.ZONE, this.handleZone);
        
        this.LoadAndParseDetails();
    }

    async LoadAndParseDetails() {
        const res = await fetch(`static/Act ${this.state.act}/guide.txt`);
        this.setState({
            guide: await res.text()
        });
        
        this.forceUpdate();
    }

    handleZone = (evt: CustomEvent<LogEntry>) : void => {
        console.log("zone", evt);
        const nextAct = findActFromTown(evt.detail.zone);
        if (nextAct > this.state.act) {
            this.setState({
                act: findActFromZone(evt.detail.zone)
            }, this.LoadAndParseDetails );
        }
    }

    getColor(text:string) :string {
        switch (text.slice(0, 2)) {
            case 'R,': return "#ff1744aa";
            case 'G,': return "#64ffdaaa";
            case 'B,': return "#2196F3aa";
            default: return "";
        }
    }

    cleanText(text:string) :string {
        return text.replace('R,', '')
                .replace('G,', '')
                .replace('B,', '');
    }

    render() {
        const { guide, act } = this.state;
        if (guide == null) return <div />;

        return (
            <div className="layout-guide">
                <div className="layout-guide-zone">Act {act}</div>
                <div className="layout-guide-detail">
                    {guide.split('\n').map( (s, i) => {
                        const text = s.trim();
                        if (text.length > 0) {
                            const style = { backgroundColor : this.getColor(text) }
                            return (<p key={i} style={style}>{this.cleanText(text)}</p>)
                        }
                    })}
                </div>
            </div>
        )
    }
}


export default withServices(Guide);