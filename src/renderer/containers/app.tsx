import React, { Component } from 'react'
import { withServices } from '../core/serviceContext'
import Gems from '../components/Gems';
import Guide from '../components/Guide';
import Notes from '../components/Notes';
import { connect } from 'react-redux';
import { RootState } from '../store';

interface IAPPProps {
    clientLog: EventTarget,
    gems: boolean,
    guide: boolean,
    note: boolean,
}

class App extends Component<IAPPProps> {
    constructor(props) {
        super(props);
    }


    render() {
        const { gems, guide, note } = this.props;
        return (
            <div>
                { note && <Notes /> }
                { guide && <Guide /> }
                { gems && <Gems /> }
            </div>
        )
    }
}

const mapState = (state: RootState) => ({
    ...state.layout
})

export default connect(mapState)(withServices(App));