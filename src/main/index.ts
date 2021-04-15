import path from 'path';
import url from 'url';

import { app, screen, Display, BrowserWindow, ipcMain } from 'electron';
import * as log from './helpers/log';
import LogWatcher from './services/LogWatcher';



if (!app.requestSingleInstanceLock())
app.exit();

app.allowRendererProcessReuse = false;
log.register(ipcMain);
console.info('App starting');

function getDisplay(): Display {
    return screen.getPrimaryDisplay();
}

export let win: BrowserWindow = null;
app.whenReady().then( () => {
        const { bounds } = getDisplay();

        win = new BrowserWindow({
            width: bounds.width - 1,
            height: bounds.height - 1,
            x: bounds.x,
            y: bounds.y,
            transparent: true,
            frame: false,
            resizable: false,
            movable: false,
            webPreferences: {
                nodeIntegration: true,
                allowRunningInsecureContent: true,
                webSecurity: false
            },
            skipTaskbar: true
        });

        win.removeMenu();
        win.setIgnoreMouseEvents(true);
        win.setAlwaysOnTop(true, 'pop-up-menu', 1);
        win.setVisibleOnAllWorkspaces(true);
        LogWatcher.start();

        loadApp(win);

        win.on('closed', () => {
            win = null;
        });
        return win;
    }
);

function loadApp(self: BrowserWindow, route: string = '') {
    self.loadURL(url.format({
        pathname: path.join(__dirname, '../renderer/index.html'),
        protocol: 'file:',
        slashes: true
    }));

    if (process.env.NODE_ENV === 'development') {
        var { client } = require('electron-connect');
        client.create(self);
        self.webContents.openDevTools();
    }
}