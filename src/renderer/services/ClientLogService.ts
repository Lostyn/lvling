// 2021/04/15 10:52:17 1729609 bb3 [INFO Client 13468] : You have entered Karui Shores.
// 2021/04/12 15:26:27 22795093 bb3 [INFO Client 11736] : OnePrct (Marauder) is now level 23

import { Dispatch } from 'redux'
import { registerOtherServices } from '.';
import { setLevel, setZone } from '../store/Progress';

// 'channel.trade': /^\$(?: You have entered <(?<guild_tag>.+?)> )?(?<char_name>.+?): (?<body>.+)$/,
const zoneMatch = /^: You have entered (?<zone>.+).$/;
const levelMath = /^: (?<charName>.+) \((?<class>.+)\) is now level (?<level>.+)$/;

export enum MessageTypes {
    ZONE = 'zone',
    LEVEL = 'level'
}

export interface LogEntry {
    type?: MessageTypes,
    charName?: string,
    level?: number,
    zone?: string
}

class ClientLogService {
    dispatcher: Dispatch;

    constructor() {
    }

    public setDispatcher(dispatcher: Dispatch): ClientLogService {
        this.dispatcher = dispatcher;
        return this;
    }

    public handleLine(line: string) {
        const text = line.split('] ').slice(1).join('] ');
        if (!text) return;

        const entry = {} as LogEntry;
        let match: RegExpMatchArray | null;

        entry.zone = match.groups!.zone;
        entry.charName = match.groups!.charName;
        entry.level = +match.groups!.level;

        if ((match = text.match(zoneMatch))) {
            this.dispatcher( 
                setZone(entry.zone)
            );
        } else if ((match = text.match(levelMath))) {
            this.dispatcher(
                setLevel( {
                    character: entry.charName,
                    level: entry.level 
                })
            )
        } else return;
    }
}

export const ClientLog = new ClientLogService()