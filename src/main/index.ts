import path from 'path';
import url from 'url';

import { app, BrowserWindow } from "electron";
import createWindow from './helpers/window'

app.on('ready', function() {
    var mainWindow : BrowserWindow = createWindow('main', {
        width: 1000,
        height: 600
    });

    mainWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'app.html'),
        protocol: 'file:',
        slashes: true
    }));

    if (process.env.NODE_ENV === 'development') {
        
    }
});

app.on('window-all-closed', function () {
    app.quit();
});