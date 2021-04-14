import React, { Component } from "react";
import ServiceProvider from "../core/serviceContext";
import App from "./app";

const Workbench = props => {
    const {services} = props;

    return ( 
        <ServiceProvider services={services}>
            <App />
        </ServiceProvider>
    );
}

export default Workbench;