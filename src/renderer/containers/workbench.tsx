import React, { Component } from "react";

import Batteur from '../components/batteur';

class Workbench extends Component {
    
    requestBluetooth = (e) => {
        
    }

    render() {
        return ( 
            <>
                <button onClick={this.requestBluetooth}>connect</button>
            </>
        );
    }
}

export default Workbench;