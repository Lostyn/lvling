import path from 'path';
import url from 'url';

import { app, BrowserWindow } from "electron";
import createWindow from './helpers/window'

app.whenReady().then(
    function() {
        var mainWindow : BrowserWindow = createWindow('main', {
            width: 1000,
            height: 600, 
            webPreferences: {
                nodeIntegration: true
            },
            frame: false,
            resizable: true
        });
    
        mainWindow.loadURL(url.format({
            pathname: path.join(__dirname, '../renderer/index.html'),
            protocol: 'file:',
            slashes: true
        }));
    
        if (process.env.NODE_ENV === 'development') {
            var { client } = require('electron-connect');
            client.create(mainWindow);
        }
    }
)

app.on('window-all-closed', function () {
    app.quit();
});