import React from "react";
import { withRouter } from "react-router-dom";
import { Typography, Button, withStyles, Checkbox, FormControlLabel, LinearProgress, Accordion, AccordionSummary, AccordionDetails, Snackbar } from "@material-ui/core";
import { withServices } from "../core/services/serviceContext";
import { connect } from "react-redux";
import path from "path";
import fs from "fs";
import manifestManager from "../core/manifestManager";
import FormHelperText from "@material-ui/core/FormHelperText";
import Tree from "../components/Tree";
import { getFormatedTree, getCurrentChildFromIndexes, getFlatTree, browseTree, } from "../utils/tree";
import { cloneDeep, clone } from "lodash";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import MuiAlert from "@material-ui/lab/Alert";

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

class Synchro extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      currentDeviceId: null,
      progressMessage: "",
      deviceSpaceRemaining: null,
      successSnackbarVisible: false,
      errorSnackbarVisible: false,
      progress: 0,
      itemProgress: 0,
      deviceProgress: 0,
      installing: false,
      hasError: false,
      selectedContents: {
        children: [],
      },
      selectedAll: true,
      advancedSettingsExpanded: false,
      settings: {
        base: {
          installApk: true,
          copyContents: true,
        },
        advanced: {
          copyFiles: true,
          copyJson: true,
          clearOldFiles: false,
        },
      },
    };
  }

  componentDidUpdate(prevProps) {
    if (prevProps.manifest !== this.props.manifest) {
      this.setState({
        selectedContents: getFormatedTree(this.props.manifest),
      });
    }
  }

  componentDidMount() {
    this.setState({
      selectedContents: getFormatedTree(this.props.manifest),
    });
  }

  handleInstallApkChange = (e) => {
    this.setState({
      settings: {
        ...this.state.settings,
        base: {
          ...this.state.settings.base,
          installApk: e.target.checked,
        },
      },
    });
  };
  handleClearOldFilesChange = (e) => {
    this.setState({
      settings: {
        ...this.state.settings,
        advanced: {
          ...this.state.settings.advanced,
          clearOldFiles: e.target.checked,
        },
      },
    });
  };

  handleCopyContents = (e) => {
    this.setState({
      settings: {
        ...this.state.settings,
        base: {
          ...this.state.settings.base,
          copyContents: e.target.checked,
        },
      },
    });
  };

  handleSelectAll = (e) => {
    const items = cloneDeep(this.state.selectedContents);

    browseTree(items, (node) => {
      node.copyEnabled = !this.state.selectedAll;
    });
    this.setState({
      selectedAll: !this.state.selectedAll,
      selectedContents: items,
    });
  };

  getSelectedFilesSize = () => {
    let totalSize = 0;
    const contentsToCopy = getFlatTree(this.state.selectedContents).filter(
      (content) => content.copyEnabled
    );
    const files = manifestManager.getFilesToCopyFromFlatTree(contentsToCopy);
    for (let file of files) {
      if (fs.existsSync(file.from)) {
        totalSize += fs.statSync(file.from).size;
      }
    }

    //megabytes
    return this.formatBytes(totalSize);
  };

  handleInstallApk = () => {
    const { deviceService } = this.props.services;

    if (!manifestManager.validate()) {
      this.setState({ hasError: true });
      return;
    }

    this.setState({
      hasError: false,
    });

    let apkPaths = {
      pico: path.resolve(__dirname, "../../extraResources/pico.apk"),
      go: path.resolve(__dirname, "../../extraResources/go.apk")
    }

    if (process.env.NODE_ENV != "dev") {
      apkPaths.pico = path.join( path.dirname(__dirname), "../../../extraResources", "pico.apk" );
      apkPaths.go = path.join( path.dirname(__dirname), "../../../extraResources", "go.apk" );
    }

    this.setState({
      installing: true,
      progress: 0,
      deviceProgress: 0,
    });

    
    const contentsToCopy = getFlatTree(this.state.selectedContents);
    const files = manifestManager.getFilesToCopyFromFlatTree(contentsToCopy)
    const filesToCopy = files.filter((item, index, self) => index === self.findIndex( t => t.to === item.to ));

    deviceService
      .installAllDevices({
        options: {
          paths: apkPaths,
          files: filesToCopy,
          settings: this.state.settings,
        },
        onProgress: (progress) => this.setState({ progress: progress * 100 }),
        onItemProgress: (progress) => this.setState({ itemProgress: progress }),
        onDeviceProgress: (deviceProgress) => this.setState({ deviceProgress: deviceProgress }),
        onDeviceProcessStart: (deviceId) => this.setState({ currentDeviceId: deviceId }),
        onProgressMessage: (message) => this.setState({ progressMessage: message }),
        onSpaceRemaining: (space) => this.setState({ deviceSpaceRemaining: space }),
      })
      .then(() => {
        this.setState({ installing: false });
        this.openSuccessSnackbar();
      })
      .catch((e) => {
        this.setState({ installing: false });
        this.openErrorSnackbar();
      });
  };

  handleOnItemChecked = (indexes, e) => {
    //settings
    if (!indexes) {
      const root = { ...this.state.selectedContents };
      root.copyEnabled = e.target.checked;
      this.setState({
        selectedContents: {
          ...root,
        },
      });
    } else {
      let children = [...this.state.selectedContents.children];
      const child = getCurrentChildFromIndexes(children, indexes);
      child.copyEnabled = e.target.checked;

      this.setState({
        selectedContents: {
          ...this.state.selectedContents,
          children,
        },
      });
    }
  };

  handleCopyFilesCheckboxChanged = (e) => {
    this.setState({
      settings: {
        ...this.state.settings,
        advanced: {
          ...this.state.settings.advanced,
          copyFiles: e.target.checked,
        },
      },
    });
  };

  handleCopyJsonCheckboxChange = (e) => {
    this.setState({
      settings: {
        ...this.state.settings,
        advanced: {
          ...this.state.settings.advanced,
          copyJson: e.target.checked,
        },
      },
    });
  };

  handleAdvancedSettingsExpand = (e, isExpanded) => this.setState({ advancedSettingsExpanded: isExpanded });
  openSuccessSnackbar = () => this.setState({ successSnackbarVisible: true });
  handleSuccessSnackbarClose = () => this.setState({ successSnackbarVisible: false }); 
  openErrorSnackbar = () => this.setState({ errorSnackbarVisible: true });
  handleErrorSnackbarClose = () => this.setState({ errorSnackbarVisible: false });

  formatBytes(bytes, decimals = 2) {
    if (bytes === 0) return "0 Bytes";

    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];

    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
  }

  setKioskMode = () => {
    const { deviceService } = this.props.services;

    this.setState({
      hasError: false,
      installing: true,
      progress: 0,
      deviceProgress: 0,
    });

    deviceService.setKioskMode()
      .then(() => {
        this.setState({ installing: false });
        this.openSuccessSnackbar();
      })
      .catch((e) => {
        this.setState({ installing: false });
        this.openErrorSnackbar();
      });
  }

  removeKioskMode = () => {
    const { deviceService } = this.props.services;

    this.setState({
      hasError: false,
      installing: true,
      progress: 0,
      deviceProgress: 0,
    });

    deviceService.removeKioskMode()
      .then(() => {
        this.setState({ installing: false });
        this.openSuccessSnackbar();
      })
      .catch((e) => {
        this.setState({ installing: false });
        this.openErrorSnackbar();
      });
  }

  render() {
    const { classes } = this.props;
    
    return (
      <div className={classes.synchro}>
        <Snackbar
          open={this.state.successSnackbarVisible}
          autoHideDuration={4000}
          onClose={this.handleSuccessSnackbarClose}
        >
          <Alert severity="success">
            Succès de la copie des fichiers / installation
          </Alert>
        </Snackbar>
        <Snackbar
          open={this.state.errorSnackbarVisible}
          autoHideDuration={4000}
          onClose={this.handleErrorSnackbarClose}
        >
          <Alert severity="error">
            Echec de la copie des fichiers / installation
          </Alert>
        </Snackbar>
        <Accordion className={classes.accordion} expanded={true}>
          <AccordionSummary
            aria-controls="panel3bh-content"
            id="panel3bh-header"
          >
            <Typography className={classes.heading}>
              Paramètres généraux
            </Typography>
          </AccordionSummary>
          <AccordionDetails className={classes.advancedDetails}>
            <Typography className={classes.title} gutterBottom component="h4">
              {this.props.devices.length} appareils connectés
            </Typography>

            <Typography
              fontWeight="bold"
              className={classes.title}
              gutterBottom
              component="h4"
            >
              Poids des fichiers sélectionnés : {this.getSelectedFilesSize()}
            </Typography>
            <FormControlLabel
              control={
                <Checkbox
                  checked={this.state.settings.base.installApk}
                  onChange={this.handleInstallApkChange}
                  placeholder="Installer l'application"
                />
              }
              label="Installer l'application"
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={this.state.settings.base.copyContents}
                  onChange={this.handleCopyContents}
                  placeholder="Copier les contenus"
                />
              }
              label="Copier les contenus"
            />
          </AccordionDetails>
        </Accordion>
        <Accordion
          className={classes.accordion}
          expanded={this.state.advancedSettingsExpanded}
          onChange={this.handleAdvancedSettingsExpand}
        >
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel3bh-content"
            id="panel3bh-header"
          >
            <Typography className={classes.heading}>
              Paramètres avancés
            </Typography>
          </AccordionSummary>
          <AccordionDetails className={classes.advancedDetails}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={this.state.settings.advanced.clearOldFiles}
                  onChange={this.handleClearOldFilesChange}
                />
              }
              label="Nettoyer les anciens fichiers"
            />
            <Tree
              onItemChecked={this.handleOnItemChecked}
              data={this.state.selectedContents}
              editMode={false}
            >
              <div className={classes.treeCheckboxesHeader}>
                <Button onClick={this.handleSelectAll}>
                  {this.state.selectedAll
                    ? "Tout désélectionner"
                    : "Tout sélectionner"}
                </Button>
                <div className={classes.checkboxesSettings}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        onChange={this.handleCopyFilesCheckboxChanged}
                        checked={this.state.settings.advanced.copyFiles}
                        name="copyFiles"
                      />
                    }
                    label="Fichiers vidéos/images"
                  />
                </div>
              </div>
            </Tree>
          </AccordionDetails>
        </Accordion>
        {this.state.installing && (
          <LinearProgress
            className={classes.progress}
            variant="determinate"
            value={this.state.progress}
          />
        )}
        <div className={classes.progressBottom}>
          <div className={classes.progressLeft}>
            {this.state.installing && (
              <Typography
                className={classes.progressLabel}
                gutterBottom
                component="h4"
              >
                {this.state.deviceProgress + 1}/{this.props.devices.length}{" "}
                appareils
              </Typography>
            )}
            {this.state.installing && (
              <Typography
                className={classes.progressLabel}
                gutterBottom
                component="h4"
              >
                ID de l'appareil : {this.state.currentDeviceId}
              </Typography>
            )}
            {this.state.installing && (
              <Typography className={classes.progressMessage} component="h4">
                {this.state.progressMessage}
              </Typography>
            )}
          </div>
          {this.state.installing && this.state.deviceSpaceRemaining && (
            <Typography
              className={classes.remainSpaceLabel}
              gutterBottom
              component="h4"
            >
              {this.state.deviceSpaceRemaining} restant avant la copie
            </Typography>
          )}
        </div> 
        {this.state.installing && (
          <LinearProgress
            className={classes.progress}
            variant="determinate"
            value={this.state.itemProgress}
          />
        )}
        {this.state.hasError && (
          <FormHelperText error>
            Le manifest est invalide, corrigez les erreurs avant de pouvoir
            modifier les contenus
          </FormHelperText>
        )}
        {this.state.installing || (
          <React.Fragment>
            <Button className={classes.installButton} color="primary" variant="contained" onClick={this.handleInstallApk} >Installer </Button>
            <div className={classes.flex}>
              <div>(Pico 2G 4K seulement) Kiosk Mode:</div>
              <Button className={classes.kioskButton} color="primary" variant="contained" onClick={this.setKioskMode} >Activer</Button>
              <Button className={classes.kioskButton} color="secondary" variant="contained" onClick={this.removeKioskMode} >Desactiver</Button>
            </div>
          </React.Fragment>
        )}
      </div>
    );
  }
}

const styles = (theme) => ({
  flex: {
    width: 'inherit',
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginTop: 30
  },
  accordion: {
    width: "100%",
  },
  advancedDetails: {
    flexDirection: "column",
    display: "flex",
  },
  card: {
    width: "100%",
  },
  cardFiles: {
    marginTop: 10,
  },
  checkboxesSettings: {
    display: "flex",
    marginLeft: "auto",
  },
  installButton: {
    marginLeft: 'auto',
    marginTop: "10px",
  },
  kioskButton: {
    marginLeft: 5
  },
  progressLeft: {
    display: "flex",
    alignSelf: "flex-start",
    flexDirection: "column",
  },
  progressBottom: {
    display: "flex",
    width: "100%",
    alignItems: "center",
  },
  progressLabel: {
    alignSelf: "flex-start",
    marginTop: "10px",
  },
  treeCheckboxesHeader: {
    display: "flex",
  },
  synchro: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "center",
    width: "600px",
  },
  disableCheckbox: {
    marginLeft: "auto",
  },
  cardContent: {
    display: "flex",
    flexDirection: "column",
  },
  progress: {
    marginTop: 20,
    width: "100%",
  },
  progressMessage: {
    fontWeight: "bold",
    alignSelf: "flex-start",
  },
  contentOptions: {
    flexDirection: "row",
  },
  remainSpaceLabel: {
    marginLeft: "auto",
  },
});

const mapStateToProps = (state) => {
  return {
    ...state.devices,
    manifest: state.manifest,
  };
};

export default connect(mapStateToProps)(
  withServices(withStyles(styles)(withRouter(Synchro)))
);
