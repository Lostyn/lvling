import React, { Component } from "react";
import { Provider } from "react-redux";
import ServiceProvider from "../core/serviceContext";
import App from "./app";

const Workbench = props => {
    const {store, services} = props;

    return ( 
        <Provider store={store}>
            <ServiceProvider services={services}>
                <App />
            </ServiceProvider>
        </Provider>
    );
}

export default Workbench;