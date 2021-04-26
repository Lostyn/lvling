import React, { Component } from 'react'
import { connect } from 'react-redux';
import { withServices } from '../core/serviceContext';
import { RootState } from '../store';
interface IZoneInfoProps {
    clientLog: EventTarget,
    act: number,
    zone: string
}

interface IZoneInfoState { }

class ZoneDetail {
    zone: string;
    detail: string;
}

class Notes extends Component<IZoneInfoProps, IZoneInfoState> {

    details: ZoneDetail[];

    constructor(props) {
        super(props);
        
        this.LoadAndParseDetails();
    }

    async LoadAndParseDetails() {
        this.details = [];
        const res = await fetch(`static/Act ${this.props.act}/notes.txt`);
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

        this.forceUpdate();
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
        const { zone } = this.props;
        const detail = this.details.find( o => o.zone.includes(zone) || zone.includes(o.zone));
        console.log(zone);
        if (detail == null) return <div />;

        return (
            <div className="layout-leveling">
                <div className="layout-leveling-zone">{zone}</div>
                <div className="layout-leveling-detail">
                    {detail.detail.split('\n').map( (s, i) => {
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

const mapState = (state: RootState) => ({
    act: state.progress.act,
    zone: state.progress.zone
})

export default connect(mapState)(withServices(Notes));