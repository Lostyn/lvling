import React, { Component } from 'react'
import { withServices } from '../core/serviceContext'

class App extends Component {
    render() {
        console.log(this.props);
        return (
            <div>
                coucou
            </div>
        )
    }
}

export default withServices(App);