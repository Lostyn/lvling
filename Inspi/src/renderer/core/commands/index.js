import CommandsRegistry from "../services/registry/CommandsRegistry";
import ProjectManager from "../ProjectManager";
import manifestManager from "../manifestManager";

//Allows to identify each command and call them anywhere
export const CommandId = {
  OPEN: "file.open",
  NEW: "file.new",
  EXPORT: "manifest.export"
};

//register each command function
export function registerCommands() {
  // Ficher
  CommandsRegistry.registerCommand(CommandId.OPEN, (fileName) =>
    ProjectManager.open(fileName)
  );
  CommandsRegistry.registerCommand(CommandId.NEW, (_) =>
    ProjectManager.create()
  );

  // Manifest
  CommandsRegistry.registerCommand(CommandId.EXPORT, (_) => 
    manifestManager.export()
  );
}
