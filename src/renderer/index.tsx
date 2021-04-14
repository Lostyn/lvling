import React from "react";
import { append, $} from './browser/dom';
import { render } from "react-dom";

import Workbench from "./containers/workbench";

function startup() {
    createServices()
        .then( services => {
            const container = append(document.body, $("div#workbench"));
            const props = {
                services,
                container
            }
            render( <Workbench {...props}/>, container )
        })
    
}

function createServices() {
    return Promise.all([

    ]).then( services => ({
        sampleService: null
    }))
}

startup();