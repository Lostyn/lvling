import {MainProcess} from './../../ipc/main-process.bindings';
import * as ipc from './../../ipc/ipc-events'
import { ClientLog } from './ClientLogService'
import { Dispatch } from 'redux';
import { toggleGems, toggleGuide, toggleNote } from '../store/Layout';

export function registerOtherServices (dispatch: Dispatch) {
    MainProcess.addEventListener(ipc.CLIENT_LOG_UPDATE, (e) => {
      ClientLog.handleLine((e as CustomEvent<string>).detail)
    })

    MainProcess.addEventListener(ipc.TOGGLE_GEMS, (e) => {
      dispatch(toggleGems());
    })

    MainProcess.addEventListener(ipc.TOGGLE_GUIDE, (e) => {
      dispatch(toggleGuide());
    })

    MainProcess.addEventListener(ipc.TOGGLE_NOTE, (e) => {
      dispatch(toggleNote());
    })
}