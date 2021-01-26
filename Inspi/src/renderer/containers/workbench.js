import React from "react";
import { Provider } from "react-redux";
import ServiceProvider from "../core/services/serviceContext";

import Titlebar from "./titlebar";
import Content from "./content";
import { HashRouter } from "react-router-dom";

const Workbench = (props) => {
  const { store, services, container } = props;

  return (
    <Provider store={store}>
      <ServiceProvider services={services}>
        <Titlebar></Titlebar>
        <HashRouter>
          <Content />
        </HashRouter>
      </ServiceProvider>
    </Provider>
  );
};

export default Workbench;
