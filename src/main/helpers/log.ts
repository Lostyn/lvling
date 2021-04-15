import { IpcMain } from "electron";
import * as log from 'electron-log';

export function register(ipcMain: IpcMain):void {
    ipcMain.on('log', (evt, level, message, ...args) => {
        log[level](message, ...args);
        evt.returnValue = true;
    });

    log.transports.file.level = 'info';
    Object.assign(console, log.functions);
}