import { globalShortcut } from "electron";
/*
import { uIOhook, UiohookKey } from "uiohook-napi";


export interface Commands {
    shortcut: string,
    cb: Function
}
let commands : Commands[] = [];

function canRegister(shortcut:string):boolean {
    return !globalShortcut.isRegistered(shortcut);
}
*/
export function registerCommands(shortcut: string, cb: () => void) {
    const success = globalShortcut.register(shortcut, cb);
    /*
    if (!commands.find( o => o.shortcut == shortcut) && success) {
        commands.push({shortcut, cb});
    }
    */
}

/*
export function setupShortcuts() {
    uIOhook.on('keydown', (e) => {
        const pressed = eventToString(e);
        console.log('Keydown', { source: 'shortcuts', keys: pressed })
        const cmd = commands.find(o => o.shortcut == pressed);
        if(cmd) {
            cmd.cb();
        }
    });

    //uIOhook.start()
}


export const UiohookToName = Object.fromEntries(Object.entries(UiohookKey).map(([k, v]) => ([v, k])))
function eventToString (e: { keycode: number, ctrlKey: boolean, altKey: boolean, shiftKey: boolean }) {
    const { ctrlKey, shiftKey, altKey } = e
    
    let code = UiohookToName[e.keycode]
    if (!code) return 'unknown'
    
    if (code === 'Shift' || code === 'Alt' || code === 'Ctrl') return code
    
    if (shiftKey && altKey) code = `Shift + Alt + ${code}`
    else if (ctrlKey && shiftKey) code = `Ctrl + Shift + ${code}`
    else if (ctrlKey && altKey) code = `Ctrl + Alt + ${code}`
    else if (altKey) code = `Alt + ${code}`
    else if (ctrlKey) code = `Ctrl + ${code}`
    else if (shiftKey) code = `Shift + ${code}`
    
    return code
}
*/