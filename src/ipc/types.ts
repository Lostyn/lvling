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
    name: string;
    iconPath: string
}