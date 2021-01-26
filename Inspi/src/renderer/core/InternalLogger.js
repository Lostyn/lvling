import { EventEmitter } from "events";

const LogType = {
    LOG: "LOG",
    WARNING: "WARNING",
    ERROR: "ERROR"
}

class Logger extends EventEmitter {
    constructor() {
        super();

        this.logs = [];
    }

    relog(message, index) {
        this.log(message, LogType.LOG, index);
    }

    log(message, type = LogType.LOG, index = -1) {
        console.log(message);
        let i = index;

        if (index != -1 && this.logs.length > index) {
            this.logs[i] = {message, type};
        } else {
            this.logs.push({message, type, progressIndex: undefined});
            i = this.logs.length - 1;
        }
        
        this.emit('data', this.logs);
        return i;
    }

    progress(index, percent) {
        let i = index;
        
        if (index != -1 && this.logs.length > index) {
            if (!this.logs[i].progress) {
                this.logs[i] = Object.assign({}, this.logs[i], {
                    progressIndex: index
                });
                this.emit('data', this.logs);
            }

            let fill =  document.getElementById(`log_progress_${this.logs[i].progressIndex}`);
            if (fill) {
                fill.style['width'] = `${percent * 100}%`;
            }
        }
    }

    warn(message){
        return this.log(message, LogType.WARNING);
    }

    error(message) {
        return this.log(message, LogType.ERROR);
    }

    Clear = () => { 
        this.logs = [];
        this.emit('data', this.logs);
    } 
}

var logger = new Logger();

export default logger;
export { LogType };