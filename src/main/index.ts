import path from 'path';
import url from 'url';
import os from 'os'
import { createOverlayWindow } from './overlay-window'

import { app, screen, Display, BrowserWindow, ipcMain, protocol } from 'electron';
import { logger } from './helpers/log'
import LogWatcher from './services/LogWatcher';

const isDevelopment = process.env.NODE_ENV === 'development';

if (!app.requestSingleInstanceLock()) {
    app.exit();
}

protocol.registerSchemesAsPrivileged([{ scheme: 'app', privileges: { secure: true, standard: true}}]);
app.allowRendererProcessReuse = true;

app.on('ready', async () => {
    logger.info('App is running', {
        source: 'init',
        version: app.getVersion(),
        osName: os.type(),
        osRelease: os.release(),
        logLevel: logger.level,
        displays: screen.getAllDisplays().map(d => ({
          bounds: d.bounds,
          workArea: d.workArea,
          scaleFactor: d.scaleFactor,
          isPrimary: d.id === screen.getPrimaryDisplay().id
        }))
    })

    //

    //
    setTimeout(
        async () => {
            await createOverlayWindow();
            LogWatcher.start();;
        }
    );
});


/*
if (!app.requestSingleInstanceLock())
app.exit();

app.allowRendererProcessReuse = false;
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
*/