import React from "react";
import { Route } from "react-router-dom";
import Contents from "../pages/Contents";
import Synchro from "../pages/Synchro";
import Settings from "../pages/Settings";

const routes = [
  {
    title: "Vidéos",
    path: "/videos",
    component: Contents,
  },
  {
    title: "Synchronisation",
    path: "/synchro",
    component: Synchro,
  },
  {
    title: "Paramètres",
    path: "/settings",
    component: Settings,
  },
];

export function getRouteFromPath(path) {
  return routes.find((route) => route.path === path);
}

class ReactRouter extends React.Component {
  render() {
    return (
      <React.Fragment>
        {routes.map((route) => (
          <Route
            key={route.title}
            title={route.title}
            exact
            path={route.path}
            component={route.component}
          />
        ))}
      </React.Fragment>
    );
  }
}

export default ReactRouter;
