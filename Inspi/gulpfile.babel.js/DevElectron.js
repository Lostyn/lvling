import {Subject} from 'rxjs';
import electronConnect from 'electron-connect';
let electronConnectServer = electronConnect.server;

export class DevElectron {
    constructor() {
        this._onClose = new Subject();

        this.start = this.start.bind(this);
        this.callback = this.callback.bind(this);
        this.reload = this.reload.bind(this);
        this.restart = this.restart.bind(this);
        this.onClose = this.onClose.bind(this);
    }

    start() {
        this.electron = electronConnectServer.create({
            stopOnClose: true
        });
        this.electron.start(this.callback);

        return Promise.resolve();
    }

    callback(electronProcState) {
        if (electronProcState == 'stopped') {
            this._onClose.complete();
        }
    }

    onClose() {
		return this._onClose.asObservable();
	}

    reload() {
        this.electron.reload(this.callback);
        return Promise.resolve();
    }

    restart() {
        this.electron.restart(this.callback);
        return Promise.resolve();
    }
}