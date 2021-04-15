
import { promises as fs, watchFile, unwatchFile } from 'fs'
import {win} from './../index';
import * as ipc from '../../ipc/ipc-events';

export default class LogWatcher {
    static filePath?: string
    static file?: fs.FileHandle;
    static isReading: boolean = false;
    static offset = 0;
    static readBuff = Buffer.allocUnsafe(64 * 1024)

    
    static async start() {
        let logFile = "E:/Steam/steamapps/common/Path of Exile/logs/Client.txt"
        if (logFile) {
            try {
              await LogWatcher.watch(logFile)
            } catch {
              console.error('Failed to watch', { source: 'log-watcher', file: logFile })
            }
        }
    }
    
    static async watch(path: string) {
        if (this.file) {
            unwatchFile(this.filePath!);
            await this.file.close();
            this.file = undefined;
            this.isReading = false;
        }

        watchFile(path, {interval: 450}, () => {
            this.handleFileCHange();
        });
        this.filePath = path;

        this.file = await fs.open(path, 'r');
        const stats = await this.file.stat();
        this.offset = stats.size;
    }

    static handleFileCHange () {
        if (!this.isReading) {
            this.isReading = true;
            this.readToEOF();
        }
    }
    
    
    static async readToEOF() {
        if (!this.file) {
            this.isReading = false;
            return;
        }

        const {bytesRead} = await this.file.read(this.readBuff, 0, this.readBuff.length, this.offset);

        if (bytesRead) {
            const str = this.readBuff.toString('utf8', 0, bytesRead);
            const lines = str.split('\n').map( line => line.trim()).filter(line => line.length);
            win!.webContents.send(ipc.CLIENT_LOG_UPDATE, { lines } as ipc.IpcClientLog);
        }

        if (bytesRead) {
            this.offset += bytesRead
            this.readToEOF()
          } else {
            this.isReading = false
          }
    }
    
}