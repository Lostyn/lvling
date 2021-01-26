import CommandRegistry from "./registry/CommandsRegistry";

export class CommandService {
  //run a command by id
  static executeCommand(id, data) {
    const command = CommandRegistry.getCommand(id);
    command && command(data);
  }
}
