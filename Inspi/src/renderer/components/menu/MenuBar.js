import React, { Component } from "react";
import { remote, BrowerWindow } from "electron";
import { css } from "emotion";
import PropTypes from "prop-types";
import Menu from "./Menu";
import { MenuService } from "../../core/services/MenuService";
import { MenuId } from "../../core/menus";
import { MenuRegistry } from "../../core/services/registry/MenuRegistry";

export default class MenuBar extends Component {
  static propTypes = {};

  static defaultProps = {};

  constructor(props) {
    super(props);

    this.menuService = new MenuService();
    this.state = {
      currentOpenedMenu: null,
      menus: MenuRegistry.getAllMenus(),
    };
  }

  setCurrentOpenedMenu = (menu) => {
    this.setState({
      currentOpenedMenu: menu,
    });
  };

  onMenuClick = (menuItem) => {
    if (this.state.currentOpenedMenu === menuItem) {
      this.setCurrentOpenedMenu(null);
    } else {
      this.setCurrentOpenedMenu(menuItem);
    }
  };

  onMenuClickOutside = (menuItem) => {
    if (this.state.currentOpenedMenu === menuItem) {
      this.setCurrentOpenedMenu(null);
    }
  };

  onMenuEnter = (menuItem) => {
    if (this.state.currentOpenedMenu !== null) {
      this.setCurrentOpenedMenu(menuItem);
    }
  };

  render() {
    return (
      <div className={styles.menubar} role="menubar">
        {this.state.menus.map((menu) => (
          <Menu
            opened={this.state.currentOpenedMenu === menu.label}
            onMouseDown={(_) => this.onMenuClick(menu.label)}
            onMouseDownOutside={(_) => this.onMenuClickOutside(menu.label)}
            onMouseEnter={(_) => this.onMenuEnter(menu.label)}
            menu={menu}
            key={menu.label}
          ></Menu>
        ))}
      </div>
    );
  }
}

const styles = {
  menubar: css`
    display: flex;
    flex-shrink: 1;
    box-sizing: border-box;
    overflow: hidden;
    flex-wrap: wrap;
    height: 100%;
  `,
};
