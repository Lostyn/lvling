import React from "react";
import { append, $} from './browser/dom';
import { render } from "react-dom";

import Workbench from "./containers/workbench";
import { registerOtherServices } from './services';
import { ClientLog } from "./services/ClientLogService";
import { createStore } from "redux";
import reducers from "./store";

const store = createStore(reducers);

function startup() {
    createServices()
        .then( services => {
            // log from IpcMain
            registerOtherServices(store.dispatch);
            
            const container = append(document.body, $("div#workbench"));
            const props = {
                store,
                services,
                container
            }
            render( <Workbench {...props}/>, container )
        })
    
}

function createServices() {
    return Promise.all([
        createClientLog()
    ]).then( services => ({
        clientLog: services[0]
    }))
}

function createClientLog() {
    return ClientLog.setDispatcher(store.dispatch);
}

startup();