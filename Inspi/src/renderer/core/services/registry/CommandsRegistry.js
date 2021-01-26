//hold references to each command
export default class CommandRegistry {
  static _commands = {};

  static registerCommand(commandId, handler) {
    this._commands[commandId] = handler;
  }

  static getCommand(commandId) {
    return this._commands[commandId];
  }

  static getCommands() {
    return this._commands;
  }
}
