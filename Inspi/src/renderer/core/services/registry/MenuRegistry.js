//hold references to each menu
export class MenuRegistry {
  static _menus = [];
  static _ids = {};

  //add a new menuitem to registry
  static appendMenuItem = (menu) => {
    if (menu.id !== void 0) {
      this._ids[menu.id] = menu;
    }
  };

  //remove menuitem from the registry
  static removeMenuItem = (id) => {
    if (this._ids[id]) {
      delete this._ids[id];
    }
  };

  //add a new menu
  static appendMenu = (menu) => {
    this._menus.push(menu);
    return menu;
  };

  //retrieve a menu by id
  static get(id) {
    return this._ids[id];
  }

  //retrieve all the menus from the registry
  static getAllMenus() {
    return this._menus;
  }
}
