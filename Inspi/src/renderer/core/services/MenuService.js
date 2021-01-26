import { MenuRegistry } from "./registry/MenuRegistry";

//base menu model
class Menu {
  constructor({
    id = null,
    label = null,
    submenu = [],
    group = null,
    command = null,
  } = {}) {
    this.id = id;
    this.label = label;
    this.group = group;
    //serialize each menu children as menu instances
    this.submenu = submenu.map((menuItem) => new Menu(menuItem));
    this.command = command;

    this.initialize();
  }

  initialize() {
    //add the menu to the registry
    MenuRegistry.appendMenuItem(this);
  }

  addSubmenu(submenu) {
    this.submenu.push(new Menu(submenu));
  }

  removeSubmenu(id) {
    const index = this.submenu.findIndex((submenu) => submenu.id === id);
    if (index != -1) {
      this.submenu.splice(index, 1);
      MenuRegistry.removeMenuItem(id);
    }
  }
}

//responsible for creating menu
export class MenuService {
  static createMenu(menuProps) {
    return MenuRegistry.appendMenu(new Menu(menuProps));
  }
}
