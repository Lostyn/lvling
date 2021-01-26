import React, {Component, createContext} from 'react';

export const ServiceContext = createContext({});

class ServiceProvider extends Component {
    render() {
        const {services} = this.props;
        return (
            <ServiceContext.Provider value={services}>
                {this.props.children}
            </ServiceContext.Provider>
        );
    }
}

export default ServiceProvider;
export const withServices = Component => props => (
    <ServiceContext.Consumer>
        {store => <Component {...props} services={store} />}
    </ServiceContext.Consumer>
)