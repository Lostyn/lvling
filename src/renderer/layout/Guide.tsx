import React, { Component } from 'react'
import { withServices } from '../core/serviceContext';
import { connect } from 'react-redux';
import { RootState } from '../store';
interface IZoneInfoProps {
    clientLog: EventTarget,
    act: number
}

interface IZoneInfoState {
    guide?: string
}

class Guide extends Component<IZoneInfoProps, IZoneInfoState> {
    constructor(props) {
        super(props);

        this.state = {
            guide: ""
        }
        
        this.LoadAndParseDetails();
    }

    async LoadAndParseDetails() {
        const res = await fetch(`static/Act ${this.props.act}/guide.txt`);
        this.setState({
            guide: await res.text()
        });
        
        this.forceUpdate();
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
        const { guide } = this.state;
        const { act } = this.props;
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


const mapState = (state: RootState) => ({
    act: state.progress.act
})

export default connect(mapState)(withServices(Guide));