import React, { Component } from "react";
import { remote, BrowerWindow } from "electron";
import classNames from "classnames";
import MenuBar from "../components/menu/MenuBar";

export default class Titlebar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isMaximized: false,
    };
  }

  componentDidMount() {
    const win = remote.getCurrentWindow();
    if (win) {
      this.setState({
        isMaximized: win.isMaximized(),
      });
    }

    this.addEvents();
  }

  onMinimize = (e) => {
    const win = remote.getCurrentWindow();
    if (win) win.minimize();
  };

  onMaximize = (e) => {
    const win = remote.getCurrentWindow();

    if (win) {
      if (win.isMaximized()) {
        win.unmaximize();
      } else {
        win.maximize();
      }

      this.setState({
        isMaximized: win.isMaximized(),
      });
    }
  };

  onClose = (e) => {
    const win = remote.getCurrentWindow();
    if (win) win.close();
  };

  addEvents = (e) => {
    const win = remote.getCurrentWindow();
    win.addListener("maximize", this.checkWindowMaximizeStatus.bind(this));
    win.addListener("unmaximize", this.checkWindowMaximizeStatus.bind(this));
  };

  checkWindowMaximizeStatus() {
    const win = remote.getCurrentWindow();
    this.setState({
      isMaximized: win.isMaximized(),
    });
  }

  removeEvents = (e) => {
    const win = remote.getCurrentWindow();
    win.removeListener("maximize", this.checkWindowMaximizeStatus.bind(this));
    win.removeListener("unmaximize", this.checkWindowMaximizeStatus.bind(this));
  };

  get isCurrentWindowMaximized() {
    const win = remote.getCurrentWindow();
    if (!win) {
      return false;
    }
    return win.isMaximized();
  }

  render() {
    return (
      <div className="titlebar" ref={this.props.elRef}>
        <div className="titlebar-drag-region" />
        <div className="window-appicon" />
        <div className="menubar">
          <MenuBar></MenuBar>
        </div>
        <div className="menus"></div>
        <div className="window-controls-container">
          <div className="window-icon-bg">
            <div
              className="window-icon window-minimize"
              onClick={this.onMinimize}
            />
          </div>
          <div className="window-icon-bg">
            <div
              className={classNames("window-icon", {
                "window-maximize": this.state.isMaximized,
                "window-restore": !this.state.isMaximized,
              })}
              onClick={this.onMaximize}
            />
          </div>
          <div className="window-icon-bg window-close-bg">
            <div className="window-icon window-close" onClick={this.onClose} />
          </div>
        </div>
        <div className="resizer"></div>
      </div>
    );
  }
}
