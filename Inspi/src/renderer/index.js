import React from "react";
import { render } from "react-dom";
import { append, $ } from "./core/dom";

import Workbench from "./containers/workbench";
import store from "./store";

import { registerMenus } from "./core/menus";
import { registerCommands } from "./core/commands";
import { objToString } from "./utils/Styles";

import { HTML5Backend } from "react-dnd-html5-backend";
import { DndProvider } from "react-dnd";
import { ADBService } from "./core/services/adbService";
import ProjectService from "./core/ProjectManager";

function startup() {
  createCoreService().then((coreServices) => {
    createAppService(coreServices).then((appServices) => {
      const container = append(document.body, $("div#workbench"));

      const props = {
        store,
        services: {
          ...coreServices,
          ...appServices,
        },
        container,
      };

      // render the application
      render(
        <DndProvider backend={HTML5Backend}>
          <Workbench {...props}/>
        </DndProvider>
        , container
      );
    });
  });
}

// Create application core services and
// 	return an object with all core services
function createCoreService() {
  return Promise.all([registerCommands(), registerMenus()]);
}

// Create application specific services
// return an object with all specific services
function createAppService(coreServices) {
  return Promise.all([
    // All service create function
    new ADBService(),
    ProjectService
  ]).then((appServices) => ({
    deviceService: appServices[0],
    projectService: appServices[1]
  }));
}

startup();
