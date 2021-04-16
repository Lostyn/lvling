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
            LogWatcher.start();
        }
    );
});