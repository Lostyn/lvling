import { Renderer } from "electron";
import * as ipcEvent from './ipc-events';
import { IpcClientLog } from './ipc-events';

let electron: typeof Renderer | undefined
try {
  electron = require('electron')
} catch {}

class MainProcessBinding extends EventTarget {
    constructor() {
        super();

        if (electron) {
            electron.ipcRenderer.on(ipcEvent.CLIENT_LOG_UPDATE, (e, data: ipcEvent.IpcClientLog) => {
                data.lines.forEach( line => {
                    this.dispatchEvent(new CustomEvent(
                        ipcEvent.CLIENT_LOG_UPDATE,
                        {
                            detail: line
                        }
                    ))
                })
            })
        }
    }
}

export const MainProcess = new MainProcessBinding()