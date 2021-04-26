export const CLIENT_LOG_UPDATE = 'MAIN->OVERLAY::client-log'
export const TOGGLE_GEMS = "MAIN->OVERLAY::gems-layout"
export const TOGGLE_GUIDE = "MAIN->OVERLAY::guide-layout"
export const TOGGLE_NOTE = "MAIN->OVERLAY::note-layout"

export interface IpcClientLog {
  lines: string[]
}