import React, { Component } from 'react'
import { withServices } from '../core/serviceContext';
import { MessageTypes, LogEntry } from '../services/ClientLogService';
import { config } from '../../main/config';
import { registerOtherServices } from '../services';
import gems from '../datas/Gems';

interface IZoneInfoProps {
    clientLog: EventTarget
}

interface IZoneInfoState {
    level?: number
}

class LevelDetail {
    level: number;
    detail: string[];
}

class Gems extends Component<IZoneInfoProps, IZoneInfoState> {
    details: LevelDetail[];

    constructor(props) {
        super(props);

        this.state = {
            level: 0
        }
        this.props.clientLog.addEventListener(MessageTypes.LEVEL, this.handleLevel);
        
        this.LoadAndParseDetails();
    }

    async LoadAndParseDetails() {
        this.details = [];
        const res = await fetch(`static/gems.txt`);
        const data = await res.text();
        const lines = data.split('\n');
        let line;
        
        for(var i = 0; i < lines.length; i++) {
            line = lines[i];
            if(line.startsWith('level:')) {
                this.details.push( {
                    level: +line.split(':')[1].trim(),
                    detail: []
                });
            } else {
                this.details[this.details.length - 1].detail.push(line);
            }
        }

        this.forceUpdate();
    }

    handleLevel = (evt: CustomEvent<LogEntry>) : void => {
        console.log("level", evt);
        if (evt.detail.charName == config.get('characterName')) {
            this.setState({
                level: evt.detail.level
            });
        }
    }

    getColor(text:string) :string {
        switch (text.slice(0, 2)) {
            case 'R:': return "#ff1744aa";
            case 'G:': return "#66BB6Aaa";
            case 'B:': return "#2196F3aa";
            default: return "";
        }
    }

    cleanText(text:string) :string {
        return text.replace('R:', '')
                .replace('G:', '')
                .replace('B:', '');
    }

    drawLinks = ( s, i) => {
        if (s.length <= 0) return;
        
        return (
            <div className="link" key={i}>
                { s.split(', ').map( this.drawSpell )}
            </div>
        );
    }

    drawSpell = (s, i) => {
        if (s.length <= 1) return;
        const style = { backgroundColor : this.getColor(s) }
        const gemName = this.cleanText(s).trim();
        const gem = gems.find( o => o.name == gemName);
        return ( <div key={i} style={style}> <img src={gem.iconPath} /> { gemName }</div> )
    }
    

    render() {
        const { level } = this.state;
        let detail: LevelDetail = null;
        for(var i = 0; i < this.details.length; i++) {
            if (this.details[i].level <= level)
                detail = this.details[i];
        }

        if (detail == null) return <div />

        return (
            <div className="layout-gem">
                <div className="layout-gem-zone">Level {level}</div>
                <div className="layout-gem-detail">
                    {detail.detail.map( this.drawLinks ) }
                </div>
            </div>
        )
    }
}


export default withServices(Gems);