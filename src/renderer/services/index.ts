import {MainProcess} from './../../ipc/main-process.bindings';
import * as ipc from './../../ipc/ipc-events'
import { ClientLog } from './ClientLogService'

export function registerOtherServices () {
    MainProcess.addEventListener(ipc.CLIENT_LOG_UPDATE, (e) => {
      ClientLog.handleLine((e as CustomEvent<string>).detail)
    })
}