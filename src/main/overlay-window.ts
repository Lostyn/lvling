import { BrowserWindow, dialog, systemPreferences } from "electron";
import path from 'path'
import url from 'url';
import { overlayWindow as OW } from 'electron-overlay-window'
import { config } from "./config";
import { PoeWindow } from './PoeWindow'

export let overlayWindow: BrowserWindow | undefined
export async function createOverlayWindow () {
    PoeWindow.onceAttach(handleOverlayAttached);

    overlayWindow = new BrowserWindow({
        //icon: path.join('static/icon.png'),
        ...OW.WINDOW_OPTS, 
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: true,
            webSecurity: false,
            defaultFontSize: config.get('fontSize')
        }
    });
    
    overlayWindow.setIgnoreMouseEvents(true);

    overlayWindow.loadURL(url.format({
        pathname: path.join(__dirname, '../renderer/index.html'),
        protocol: 'file:',
        slashes: true
    })) 

    const electronReadyToShow = new Promise<void>(resolve => overlayWindow!.once('ready-to-show', resolve));
    await electronReadyToShow;
    PoeWindow.attach(overlayWindow);

    if (process.env.NODE_ENV === 'development') {
        var { client } = require('electron-connect');
        client.create(overlayWindow);
        overlayWindow.webContents.openDevTools({ mode: 'detach', activate: false });
    }
}


function handleOverlayAttached(hasAccess?: boolean) {
    if (hasAccess === false) {
        dialog.showErrorBox(
          'PoE window - No access',
          // ----------------------
          'Path of Exile is running with administrator rights.\n' +
          '\n' +
          'You need to restart Awakened PoE Trade with administrator rights.'
        )
        return
    }

    if (process.platform === 'win32' && !systemPreferences.isAeroGlassEnabled()) {
        dialog.showErrorBox(
            'Windows 7 - Aero',
            // ----------------------
            'You must enable Windows Aero in "Appearance and Personalization".\n' +
            'It is required to create a transparent overlay window.'
        )
    }
}