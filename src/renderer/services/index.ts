import {MainProcess} from './../../ipc/main-process.bindings';
import * as ipc from './../../ipc/ipc-events'
import { handleLine } from './ClientLogService'

export function registerOtherServices () {
    MainProcess.addEventListener(ipc.CLIENT_LOG_UPDATE, (e) => {
      handleLine((e as CustomEvent<string>).detail)
    })
}