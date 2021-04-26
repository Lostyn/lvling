import path from 'path';
import url from 'url';
import os from 'os'
import { createOverlayWindow, overlayWindow } from './overlay-window'

import { app, screen, Display, BrowserWindow, ipcMain, protocol } from 'electron';
import { logger } from './helpers/log'
import LogWatcher from './services/LogWatcher';
import { registerCommands } from './shortcuts';
import * as ipc from '../ipc/ipc-events'

const isDevelopment = process.env.NODE_ENV === 'development';

if (!app.requestSingleInstanceLock()) {
    app.exit();
}

protocol.registerSchemesAsPrivileged([{ scheme: 'app', privileges: { secure: true, standard: true}}]);
app.allowRendererProcessReuse = true;

const toggleGems = () => overlayWindow!.webContents.send(ipc.TOGGLE_GEMS);
const toggleGuide = () => overlayWindow!.webContents.send(ipc.TOGGLE_GUIDE);
const toggleNote = () => overlayWindow!.webContents.send(ipc.TOGGLE_NOTE);

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
    registerCommands('F2', toggleGems);
    registerCommands('F3', toggleGuide);
    registerCommands('F4', toggleNote);

    //
    setTimeout(
        async () => {
            await createOverlayWindow();
            //setupShortcuts();
            LogWatcher.start();
        }
    );
});