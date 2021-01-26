import React, { Component } from "react";
import { css } from "emotion";
import PropTypes from "prop-types";
import classNames from "classnames";
import HYPWindow, { InteractionTypes } from "../../utils/HYPWindow";
import HYPCrypto from "../../utils/HYPCrypto";
import { CommandService } from "../../core/services/CommandService";

export default class Menu extends Component {
  static propTypes = {
    menu: PropTypes.object,
    opened: PropTypes.bool,
  };

  static defaultProps = {
    menu: null,
    opened: false,
  };

  constructor(props) {
    super(props);

    this.menuItem = React.createRef();
    this.eventIdentifier = HYPCrypto.generateUid();
  }

  componentDidMount() {
    HYPWindow.on(
      InteractionTypes.TOUCH,
      this.onWindowTouch.bind(this),
      this.eventIdentifier
    );
  }

  componentWillUnmount() {
    HYPWindow.off(InteractionTypes.TOUCH, this.eventIdentifier);
  }

  onWindowTouch(e) {
    if (!this.menuItem.current.contains(e.target)) {
      this.props.onMouseDownOutside();
    }
  }

  get hasSubmenuItems() {
    return this.props.menu.submenu && this.props.menu.submenu.length > 0;
  }

  //retrieve the clicked command and execute it
  onMenuItemClick(item) {
    if (!item.command) return;

    CommandService.executeCommand(item.command);
    this.props.onMouseDownOutside();
  }

  render() {
    const MenuItems = (_) => {
      if (this.hasSubmenuItems && this.props.opened) {
        return (
          <div
            onMouseDown={(e) => e.stopPropagation()}
            style={{
              top: `${this.menuItem.current.clientHeight}px`,
              left: `${this.menuItem.current.getBoundingClientRect().x}px`,
            }}
            className={styles.menuItemsHolder}
          >
            <ul className={styles.actionsContainer}>
              {this.props.menu.submenu.map((menuItem) => (
                <li
                  onClick={() => this.onMenuItemClick(menuItem)}
                  key={menuItem.label}
                  className={styles.actionItem}
                  role="presentation"
                >
                  <a className={styles.actionMenuItem}>
                    <span className={styles.actionLabel}>{menuItem.label}</span>
                    {menuItem.submenu.length > 0 && (
                      <span className={styles.actionSubmenuIndicator}>
                        <svg
                          width="14"
                          height="14"
                          viewBox="0 0 14 14"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M4.52 12.364L9.879 7 4.52 1.636l.615-.615L11.122 7l-5.986 5.98-.615-.616z"
                            fill="#fff"
                          />
                        </svg>
                      </span>
                    )}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        );
      }

      return null;
    };

    return (
      <div
        ref={this.menuItem}
        onMouseDown={this.props.onMouseDown}
        onMouseEnter={this.props.onMouseEnter}
        onMouseLeave={this.props.onMouseLeave}
        className={classNames(styles.menuButton, {
          [styles.active]: this.props.opened,
        })}
        role="menuitem"
        tabIndex="-1"
        aria-label="File"
        aria-haspopup="true"
        aria-keyshortcuts="Alt+f"
      >
        <div className="menubar-menu-title" role="none" aria-hidden="true">
          {this.props.menu.label}
        </div>
        <MenuItems></MenuItems>
      </div>
    );
  }
}

const styles = {
  menuButton: css`
    color: rgba(0, 0, 0, 0.87);
    align-items: center;
    display: flex;
    box-sizing: border-box;
    padding: 0 8px;
    cursor: pointer;
    -webkit-app-region: no-drag;
    zoom: 1;
    white-space: nowrap;
    outline: 0;

    &:hover {
      background-color: rgba(0, 0, 0, 0.1);
    }
  `,
  active: css`
    background-color: rgba(0, 0, 0, 0.1);
  `,
  menuItemsHolder: css`
    position: absolute;
    left: 0px;
    opacity: 1;
    z-index: 999999;
    padding: 7px 0;
    background-color: white;
  `,
  actionsContainer: css``,
  actionItem: css`
    position: static;
    overflow: visible;
  `,
  actionMenuItem: css`
    display: flex;
    align-items: center;
    position: relative;
    color: rgba(0, 0, 0, 0.67);
    background-color: white;
    font-size: 13px;
    padding: 9px;
    cursor: pointer;

    &:hover {
      background-color: rgba(0, 0, 0, 0.1);
    }
  `,
  actionLabel: css`
    -ms-flex: 1 1 auto;
    flex: 1 1 auto;
    text-decoration: none;
    padding: 0 1em;
    background: none;
    font-size: 12px;
    line-height: 1;
  `,
  actionSubmenuIndicator: css``,
  keybinding: css`
    opacity: 0.4;
  `,
};
