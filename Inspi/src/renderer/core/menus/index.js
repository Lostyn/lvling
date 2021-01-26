import { CommandId } from "../commands";
import { MenuService } from "../services/MenuService";

//Allows to identify each menu and retrieve them anywhere
export const MenuId = {
  FILE: 0,
  MANIFEST: 1
};

function registerFileMenu() {
  MenuService.createMenu({
    id: MenuId.FILE,
    label: "Fichier",
    submenu: [
      {
        label: "Nouveau",
        command: CommandId.NEW,
      },
      {
        label: "Ouvrir",
        command: CommandId.OPEN,
      },
    ],
  });
}

function registerManifestMenu() {
  if (process.env.NODE_ENV == "dev") {
    MenuService.createMenu({
      id: MenuId.MANIFEST,
      label: "Manifest",
      submenu: [
        { 
          label: "Export",
          command: CommandId.EXPORT
        }
      ]
    })
  }
}

export function registerMenus() {
  registerFileMenu();
  registerManifestMenu();
}
