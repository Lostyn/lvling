import Store from 'electron-store'
import { Config, defaultConfig } from '../ipc/types';


export const config = (() => {
    const store = new Store<Config>({
        name: 'config',
        cwd: 'apt-data',
        defaults: defaultConfig
    });
    
    const config = store.store;
    store.store = config;
    return store;
})();