import React from "react";
import { append, $} from './browser/dom';
import { render } from "react-dom";

import Workbench from "./containers/workbench";
import { registerOtherServices } from './services';

function startup() {
    createServices()
        .then( services => {
            registerOtherServices();
            
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
        createClientService()
    ]).then( services => ({
        logWatcher: services[0]
    }))
}

function createClientService() {
    return null;
}

startup();