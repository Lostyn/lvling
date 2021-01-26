import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import ReactRouter, { getRouteFromPath } from "../router/router";
import { withServices } from "../core/services/serviceContext";
import { withStyles } from "@material-ui/core/styles";
import { ListItem, ListItemIcon, List, AppBar, Toolbar, Typography, Badge, Tooltip, } from "@material-ui/core";
import SyncIcon from "@material-ui/icons/Sync";
import VideoLibraryIcon from "@material-ui/icons/VideoLibrary";
import SettingsIcon from "@material-ui/icons/Settings";
import SettingsValidator from "../core/settingsValidator";
import { connect } from "react-redux";
import manifestManager from "../core/manifestManager";
import { setCurrentProjectDataPath, loadFromStorageAsync, updateRecentList, } from "../store/actions/ManifestActionCreator";
import Home from "../pages/Home";

const DRAWER_WIDTH = 56;

class Content extends Component {
  constructor(props) {
    super(props);
    this.router = React.createRef();
  }

  /*
  onProjectOpened({ fileName, fileContents } = {}) {
    const recentFiles = this.props.recentFiles.filter( (file) => file !== fileName );
    this.props.loadFromStorageAsync(fileName, fileContents);
    this.props.updateRecentList([...recentFiles, fileName]);
    this.props.history.push(DEFAULT_PROJET_ROUTE);
  }

  onProjectCreated(fileName) {
    const recentFiles = this.props.recentFiles.filter( (file) => file !== fileName );
    this.props.updateRecentList([...recentFiles, fileName]);
    this.props.setCurrentProjectDataPath(fileName);
    this.props.history.push(DEFAULT_PROJET_ROUTE);
  }
  */

  gotoLibrary = () => this.props.history.push("/videos");
  gotoSettings = () => this.props.history.push("/settings");
  gotoSync = () => this.props.history.push("/synchro");

  renderLeftMenuEntry(tooltip, icon, badgeContent, selected, onClick) {
    const {buttonWrapper, buttonIcon} = this.props.classes;

    return (
      <Tooltip title={tooltip} placement="right" arrow>
        <ListItem button onClick={onClick} selected={selected} className={buttonWrapper}>
          <ListItemIcon className={buttonIcon}>
            <Badge badgeContent={badgeContent} color="error">
              {icon}
            </Badge>
          </ListItemIcon>
        </ListItem>
      </Tooltip>
    )
  }

  renderLeftMenu() {
    const { drawer } = this.props.classes;
    const { pathname } = this.props.history.location;
    
    const libraryErrorCount = manifestManager.getInvalidNodes().length;
    const isSettingsValid = SettingsValidator.validate(this.props.manifest.settings).isValid;
    const deviceCount = this.props.devices.devices.length;

    return (
      <div className={drawer}>
        <List>
          {this.renderLeftMenuEntry('Bibliothèque', <VideoLibraryIcon/>, libraryErrorCount, pathname === '/videos', this.gotoLibrary)}
          {this.renderLeftMenuEntry('Paramètre', <SettingsIcon/>, isSettingsValid ? 0 : 1, pathname === '/settings', this.gotoSettings)}
          {this.renderLeftMenuEntry('Synchroniser', <SyncIcon/>, deviceCount, pathname === '/synchro', this.gotoSync)}
        </List>
      </div>
    )
  }

  render() {
    const { classes } = this.props;
    const { openedProjectPath } = this.props.app;

    if (!openedProjectPath) {
      return (
        <div className={classes.content}>
          <AppBar elevation={0} className={classes.appBar} position="fixed">
            <Toolbar>
              <Typography variant="h6" noWrap>
                Kiosk VR
              </Typography>
            </Toolbar>
          </AppBar>
          <div className={classes.router}>
            <Home></Home>
          </div>
        </div>
      );
    }

    const route = getRouteFromPath(this.props.history.location.pathname);
    return (
      <div className={classes.content}>
        <AppBar elevation={0} className={classes.appBar} position="fixed">
          <Toolbar>
            <Typography variant="h6" noWrap>
              {route && route.title}
            </Typography>
          </Toolbar>
        </AppBar>
        { this.renderLeftMenu() }
        <div className={classes.router}>
          <ReactRouter />
        </div>
      </div>
    );
  }
}

const styles = (theme) => ({
  content: {
    display: "flex",
    height: "100%",
    width: "100%",
  },
  appBar: {
    top: "30px",
  },
  buttonIcon: {
    justifyContent: "center",
    alignItems: "center",
  },
  drawer: {
    background: "white",
    height: "100%",
    position: "fixed",
    top: "94px",
    width: `${DRAWER_WIDTH}px`,
  },
  router: {
    marginTop: "94px",
    marginLeft: `${DRAWER_WIDTH}px`,
    width: "100%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  buttonWrapper: {
    justifyContent: "center",
  },
});

const mapStateToProps = (state) => {
  return {
    devices: state.devices,
    manifest: state.manifest,
    app: state.app,
  }
};

export default connect(mapStateToProps, {
  setCurrentProjectDataPath,
  loadFromStorageAsync,
  updateRecentList,
})(withRouter(withStyles(styles)(withServices(Content))));
