import React, {Component, createContext} from 'react';
import Proptypes from 'prop-types'

export const ServiceContext = createContext({});

interface IServiceProviderProps {
    services: object;
}
class ServiceProvider extends Component<IServiceProviderProps> {
    render() {
        const { services } = this.props;
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
        {store => <Component {...props} {...store} />}
    </ServiceContext.Consumer>
)