import React from "react";
import { withRouter } from "react-router-dom";
import { withStyles, IconButton, Snackbar } from "@material-ui/core";
import { setVideoFramePreview, setVideoGridPreview, setCategoryPanorama, setVideoName, } from "../store/actions/ManifestActionCreator";
import { connect } from "react-redux";
import CategoryValidator from "../core/categoryValidator";
import FormHelperText from "@material-ui/core/FormHelperText";
import SIZES, { formatContentSizeAndType, validateImage } from "../data/files";
import Alert from "@material-ui/lab/Alert";
import ButtonDropppable from "./ButtonDropppable";

import TextField from "./form/textfield";
import Separator from "./form/separator";
import Label from "./form/label";
import {AntTabs, AntTab} from "./form/AntTabs";
import Preview from "./form/preview";

const { dialog } = require("electron").remote;



class CategoryEdit extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      errorSnackbarVisible: false,
      previewTab: 0
    };
  }

  removePreviewChange = (isGrid) => { 
    if (isGrid) this.props.setVideoGridPreview("", this.props.indexes);
    else this.props.setVideoFramePreview("", this.props.indexes);
  }
  handlePreviewChange = (assetProperties, isGrid = false) => {
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
          if (isGrid) {
            this.props.setVideoGridPreview(paths[0], this.props.indexes);
          } else {
            this.props.setVideoFramePreview(paths[0], this.props.indexes);
          }
        }
      }
    );
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
          this.props.setCategoryPanorama(paths[0], this.props.indexes);
        }
      }
    );
  };

  removePanoramaChange = () => this.props.setCategoryPanorama("", this.props.indexes);

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

  handleChangeName = (e) => {
    this.props.setVideoName(e.target.value, this.props.indexes);
  };

  getValidationErrors() {
    const { errors } = CategoryValidator.validate(this.props.category);
    return errors;
  }

  handleDropFramePreview = (path) => {
    if (!validateImage(path, SIZES.PREVIEW_FRAME)) {
      this.openErrorSnackbar();
      return;
    }
    this.props.setVideoFramePreview(path, this.props.indexes);
  };

  handleDropGridPreview = (path) => {
    if (!validateImage(path, SIZES.PREVIEW_GRID)) {
      this.openErrorSnackbar();
      return;
    }
    this.props.setVideoGridPreview(path, this.props.indexes);
  };

  handleDropPanorama = (path) => {
    if (!validateImage(path, SIZES.PANORAMA)) {
      this.openErrorSnackbar();
      return;
    }
    this.props.setCategoryPanorama(path, this.props.indexes);
  };

  handlePreviewTabChange = (e, newValue) => {
    this.setState({
      previewTab: newValue
    })
  }
  
  render() {
    const { 
      classes,
      category
    } = this.props;

    const {
      errorSnackbarVisible,
      previewTab
    } = this.state;
    const errors = this.getValidationErrors();

    return (
      <React.Fragment>
        <Separator label="Categorie"/>
        <Snackbar open={errorSnackbarVisible} autoHideDuration={3000} onClose={this.handleErrorSnackbarClose}>
          <Alert severity="error">Format de fichier non valide !</Alert>
        </Snackbar>

        <TextField label="Titre" value={category.name} onChange={this.handleChangeName} error={errors.name != undefined}/>
        <Separator/>
        <AntTabs  value={previewTab} onChange={this.handlePreviewTabChange} variant="fullWidth">
          <AntTab label={`Frame ( ${formatContentSizeAndType(SIZES.PREVIEW_FRAME)} )`} />
          <AntTab label={`Grille ( ${formatContentSizeAndType(SIZES.PREVIEW_GRID)} )`} />
        </AntTabs>
        { previewTab == 0 && (
            <Preview path={category.framePreview} buttonLabel='Choisir une miniature'
                        onClick={(_) => this.handlePreviewChange(SIZES.PREVIEW_FRAME, false)}
                        onDrop={this.handleDropFramePreview}
                        onRemove={(_) => this.removePreviewChange(false)}
            />
        )}
        { previewTab == 1 && (
            <Preview path={category.gridPreview} buttonLabel='Choisir une miniature'
                        onClick={(_) => this.handlePreviewChange(SIZES.PREVIEW_GRID, true)}
                        onDrop={this.handleDropGridPreview}
                        onRemove={(_) => this.removePreviewChange(true)}
            />
        )}
        <FormHelperText error className={classes.baseLabel}>{errors.preview || ""}</FormHelperText>
        <Separator/>
        <Label label={`Panorama ( ${formatContentSizeAndType(SIZES.PANORAMA)} )`} className={classes.baseLabel}/>
        <Preview path={category.panorama} buttonLabel='Choisir un panorama'
                  onClick={(_) => this.handlePanoramaChange(SIZES.PANORAMA)}
                  onDrop={this.handleDropPanorama}
                  onRemove={this.removePanoramaChange}
                  customClassName={classes.previewPanorama}
        />
        {!this.props.category.panorama && <FormHelperText className={classes.baseLabel}> Utilisation du panorama par défault </FormHelperText> }
        <FormHelperText error >{errors.panorama || ""}</FormHelperText>
      </React.Fragment>
    );
  }
}

const styles = (theme) => ({
  
  previewPanorama: {
    position: "relative",
    margin: "5px auto",
    height: 170,
    minHeight: 170
  },
  baseLabel: {
    margin: 5,
  },
  textfield: {
    root: {
      'label + &': {
        marginTop: theme.spacing(3)
      }
    },
    margin: '0 5px',
    fontWeight: 300
  }
});

const mapStateToProps = (state) => {
  return state.manifest;
};

export default connect(mapStateToProps, {
  setCategoryPanorama,
  setVideoFramePreview,
  setVideoGridPreview,
  setVideoName,
})(withStyles(styles)(withRouter(CategoryEdit)));
