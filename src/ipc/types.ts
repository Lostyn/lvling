export interface Config {
    fontSize: number,
    windowTitle: string,
    characterName: string,
}

export const defaultConfig: Config = {
    fontSize: 16,
    windowTitle: "Fork",
    characterName: ""
}

export interface Gems {
    level: number;
    required_lvl: number;
    name: string;
    Witch: string;
    Shadow: string;
    Ranger: string;
    Duelist: string;
    Marauder: string;
    Templar: string;
    Scion: string;
    quest: string;
    vendor: string;
    cost: string;
    color: string;
    gemTags: string[];
    iconPath: string
}