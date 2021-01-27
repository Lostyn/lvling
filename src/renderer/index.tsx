import React from "react";
import { append, $} from './browser/dom';
import { render } from "react-dom";

import Workbench from "./containers/workbench";

function startup() {
    const container = append(document.body, $("div#workbench"));

    render( <Workbench />, container )
}

startup();