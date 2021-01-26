import React from "react";
import { withRouter } from "react-router-dom";
import {
  withStyles,
  Card,
  CardContent,
  Typography,
  InputLabel,
  Select,
  MenuItem,
  FormControl,
  Button,
  Snackbar,
  Slider,
  Input,
  Grid,
} from "@material-ui/core";
import { withServices } from "../core/services/serviceContext";
import { connect } from "react-redux";
import classNames from "classnames";
import {
  setSettingsUIMode,
  setSettingsVRMode,
  setSettingsPanorama,
  setSettingsLogo,
  setSettingsFrameCount
} from "../store/actions/ManifestActionCreator";
const { dialog } = require("electron").remote;
import fs from "fs";
import SettingsValidator from "../core/settingsValidator";
import FormHelperText from "@material-ui/core/FormHelperText";
import SIZES, { formatContentSizeAndType, validateImage } from "../data/files";
import Alert from "@material-ui/lab/Alert";
import ButtonDropppable from "../components/ButtonDropppable";
import { HTML5Backend } from "react-dnd-html5-backend";
import { DndProvider } from "react-dnd";
import { VR_MODE, UI_MODE } from "../data/modes";

class Settings extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      errorSnackbarVisible: false,
    };
  }

  handleVRModeChange = (e) => {
    this.props.setSettingsVRMode(e.target.value);
  };

  handleUIModeChange = (e) => {
    this.props.setSettingsUIMode(e.target.value);
  };

  handlePanoramaChange = (assetProperties) => {
    dialog.showOpenDialog(
      {
        properties: ["openFile"],
        filters: [
          {
            extensions: assetProperties.extensions,
            name: assetProperties.extensions
              .map((extension) => `*.${extension}`)
              .join(","),
          },
        ],
      },
      (paths) => {
        if (paths) {
          if (!validateImage(paths[0], assetProperties)) {
            this.openErrorSnackbar();
            return;
          }
          this.props.setSettingsPanorama(paths[0]);
        }
      }
    );
  };

  handleLogoChange = (assetProperties) => {
    dialog.showOpenDialog(
      {
        properties: ["openFile"],
        filters: [
          {
            extensions: assetProperties.extensions,
            name: assetProperties.extensions
              .map((extension) => `*.${extension}`)
              .join(","),
          },
        ],
      },
      (paths) => {
        if (paths) {
          if (!validateImage(paths[0], assetProperties)) {
            this.openErrorSnackbar();
            return;
          }

          this.props.setSettingsLogo(paths[0]);
        }
      }
    );
  };

  openErrorSnackbar = () => {
    this.setState({
      errorSnackbarVisible: true,
    });
  };

  handleErrorSnackbarClose = () => {
    this.setState({
      errorSnackbarVisible: false,
    });
  };

  getValidationErrors() {
    const { isValid, errors } = SettingsValidator.validate(
      this.props.manifest.settings
    );
    return errors;
  }

  handleDropLogo = (path) => {
    if (!validateImage(path, SIZES.SLOGAN)) {
      this.openErrorSnackbar();
      return;
    }
    this.props.setSettingsLogo(path, this.props.indexes);
  };

  handleDropPanorama = (path) => {
    if (!validateImage(path, SIZES.PANORAMA)) {
      this.openErrorSnackbar();
      return;
    }
    this.props.setSettingsPanorama(path, this.props.indexes);
  };

  render() {
    const { classes } = this.props;

    const errors = this.getValidationErrors();
    
    return (
      <div className={classes.settings}>
        <DndProvider backend={HTML5Backend}> 
          <Snackbar
            open={this.state.errorSnackbarVisible}
            autoHideDuration={3000}
            onClose={this.handleErrorSnackbarClose}
          >
            <Alert severity="error">Format de fichier invalide</Alert>
          </Snackbar>
          <Card className={classes.card} variant="outlined">
            <CardContent className={classes.cardContent}>
              <Typography
                className={classes.title}
                gutterBottom
                variant="h5"
                component="h2"
              >
                Paramètres du Kiosk
              </Typography>
              
              { this.renderInteractionMode(classes) }
              { this.renderDisplayMode(classes) }
              
              <div className={classes.formItem}>
                <InputLabel
                  required
                  className={classes.baseLabel}
                  id="panorama"
                >
                  Panorama ( {formatContentSizeAndType(SIZES.PANORAMA)} )
                </InputLabel>
                {}
                {this.props.manifest.settings.panorama &&
                  fs.existsSync(this.props.manifest.settings.panorama) && (
                    <img
                      src={this.props.manifest.settings.panorama}
                      className={classes.previewImage}
                    ></img>
                  )}
                <ButtonDropppable
                  disableElevation={true}
                  variant="contained"
                  onDrop={this.handleDropPanorama}
                  component="label"
                  size={"small"}
                  onClick={(_) => this.handlePanoramaChange(SIZES.PANORAMA)}
                  className={classes.previewButton}
                >
                  Choisir un panorama
                </ButtonDropppable>
                <FormHelperText error>{errors.panorama || ""}</FormHelperText>
              </div>
              <div className={classes.formItem}>
                <InputLabel required className={classes.baseLabel} id="logo">
                  Logo ( {formatContentSizeAndType(SIZES.SLOGAN)} )
                </InputLabel>
                {this.props.manifest.settings.logo &&
                  fs.existsSync(this.props.manifest.settings.logo) && (
                    <img
                      src={this.props.manifest.settings.logo}
                      className={classes.previewImage}
                    ></img>
                  )}
                <ButtonDropppable
                  disableElevation={true}
                  onClick={(_) => this.handleLogoChange(SIZES.SLOGAN)}
                  onDrop={this.handleDropLogo}
                  variant="contained"
                  component="label"
                  size={"small"}
                  className={classes.previewButton}
                >
                  Choisir un logo
                </ButtonDropppable>
                <FormHelperText error>{errors.logo || ""}</FormHelperText>
              </div>
            </CardContent>
          </Card>
        </DndProvider>
      </div>
    );
  }

  renderInteractionMode = (classes) => {
    return (
      <FormControl
        className={classNames(classes.formControl, classes.formItem)}
      >
        <InputLabel required id="vrmode">
          Mode d'interaction
        </InputLabel>
        <Select
          value={this.props.manifest.settings.vr_mode}
          onChange={this.handleVRModeChange}
          fullWidth={true}
          labelId="vrmode"
        >
          {Object.keys(VR_MODE).map((key) => (
            <MenuItem key={key} value={key}>
              {VR_MODE[key]}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    );
  }

  renderDisplayMode = (classes) => {
      const { ui_mode, frame_count } = this.props.manifest.settings;
      console.log(frame_count);
      return (
        <React.Fragment>
          <FormControl
            className={classNames(classes.formControl, classes.formItem)}
          >
            <InputLabel required id="vrmode">
              Affichage Kiosk
            </InputLabel>
            <Select
              value={ui_mode}
              onChange={this.handleUIModeChange}
              fullWidth={true}
              labelId="vrmode"
            >
              {Object.keys(UI_MODE).map((key) => (
                <MenuItem key={key} value={key}>
                  {UI_MODE[key]}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          { ui_mode == "Frame" && (
            <div className={classes.formItem}>
              <InputLabel required className={classes.baseLabel} id="logo">
                Nombre de frame verticale
              </InputLabel>
              <Grid container spacing={2}>
                <Grid item xs>
                  <Slider value={frame_count} onChange={this.handlerSliderFrameCountChange} 
                    step={2}
                    marks
                    min={2}
                    max={8}
                  />
                </Grid>
                <Grid item>
                  <Input value={frame_count} onChange={this.handleSliderInputCountChange} inputProps={{
                    step: 2,
                    min: 2,
                    max: 8,
                    type: 'number'
                  }}/>
                </Grid>
              </Grid>
            </div>
          )}
        </React.Fragment>
      );
  }

  handlerSliderFrameCountChange = (evt, newValue) => this.setFrameCount(newValue);
  handleSliderInputCountChange = (evt) => this.setFrameCount(Number(evt.target.value));
  setFrameCount = (value) => {
    if (value < 2) value = 2;
    if (value > 8) value = 8;
    this.props.setSettingsFrameCount(value);
  }

}

const styles = () => ({
  settings: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    width: "500px",
  },
  cardContent: {
    display: "flex",
    flexDirection: "column",
  },
  formItem: {
    marginTop: "15px",
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    width: "100%",
  },
  previewImage: {
    margin: "5px auto",
    border: "1px solid rgba(0,0,0,0.1)",
    height: 200,
    minHeight: 200
  },
  previewButton: {
    margin: '0 auto'
  },
  baseLabel: {
    marginBottom: 10,
  },
});
 
const mapStateToProps = (state) => {
  return {
    manifest: state.manifest,
  };
};

export default connect(mapStateToProps, {
  setSettingsUIMode,
  setSettingsVRMode,
  setSettingsPanorama,
  setSettingsLogo,
  setSettingsFrameCount,
})(withServices(withStyles(styles)(withRouter(Settings))));
