import React from "react";
import { withRouter } from "react-router-dom";
import { withStyles, IconButton, Snackbar, Select, MenuItem } from "@material-ui/core";
import { connect } from "react-redux";
import RemoveCircleIcon from '@material-ui/icons/RemoveCircle';
import PropTypes from "prop-types";
import { setVideoName, setVideoPath, setVideoProjection, setVideoCountry, setVideoDirector, setVideoDuration, setVideoOrganization, setVideoPoster, setVideoSynopsis, setVideoYear, setVideoSubtitles, setVideoFramePreview, setVideoGridPreview } from "../store/actions/ManifestActionCreator";
import VideoValidator from "../core/videoValidator";
import FormHelperText from "@material-ui/core/FormHelperText";
import Alert from "@material-ui/lab/Alert";
import SIZES, { validateImage, formatContentSizeAndType, validateFromExtension, } from "../data/files";
import ButtonDropppable from "./ButtonDropppable";

import TextField from "./form/textfield";
import Separator from "./form/separator";
import Label from "./form/label";
import {AntTabs, AntTab} from "./form/AntTabs";
import Preview from "./form/preview";
import SSelect from "./form/select";
import PathInput from "./form/pathInput";

const PROJECTIONS = {
  mono: "Mono",
  rl: "Stereo side by side",
  tb: "Stereo top bottom",
};

const { dialog } = require("electron").remote;

class VideoEdit extends React.Component {
  static propsTypes = {
    indexes: PropTypes.object.isRequired,
  };

  static defaultProps = {
    indexes: [],
  };

  constructor(props) {
    super(props);
    this.state = {
      projection: PROJECTIONS.MONO,
      errorSnackbarVisible: false,
      previewTab: 0
    };
  }

  handleProjectionChange = (e) =>
    this.props.setVideoProjection(e.target.value, this.props.indexes);

  handleVideoNameChange = (e) => {
    this.props.setVideoName(e.target.value, this.props.indexes);
  };

  removePreviewFrame = () => this.props.setVideoFramePreview("", this.props.indexes);
  removePreviewGrid = () => this.props.setVideoGridPreview("", this.props.indexes);
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

  handleCountryChange = (e) => {
    this.props.setVideoCountry(e.target.value, this.props.indexes);
  };

  handleYearChange = (e) => {
    this.props.setVideoYear(e.target.value, this.props.indexes);
  };

  handleDurationChange = (e) => {
    this.props.setVideoDuration(e.target.value, this.props.indexes);
  };

  handleOrganizationChange = (e) => {
    this.props.setVideoOrganization(e.target.value, this.props.indexes);
  };

  handleDirectorChange = (e) => {
    this.props.setVideoDirector(e.target.value, this.props.indexes);
  };

  handleSynopsisChange = (e) => {
    this.props.setVideoSynopsis(e.target.value, this.props.indexes);
  };

  removePoster = () => this.props.setVideoPoster("", this.props.indexes);
  handlePosterChange = (assetProperties) => {
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
          this.props.setVideoPoster(paths[0], this.props.indexes);
        }
      }
    );
  };

  
  handleVideoError = (e) => {
    //console.log(e);
  };

  handleLoadVideo = (assetProperties) => {
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
          this.props.setVideoPath(paths[0], this.props.indexes);
        }
      }
    );
  };

  getValidationErrors() {
    const { isValid, errors } = VideoValidator.validate(this.props.video);
    return errors;
  }

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

  handleDropPoster = (path) => {
    if (!validateImage(path, SIZES.POSTER)) {
      this.openErrorSnackbar();
      return;
    }
    this.props.setVideoPoster(path, this.props.indexes);
  };

  handleDropVideo = (path) => {
    if (!validateFromExtension(path, SIZES.VIDEO)) {
      this.openErrorSnackbar();
      return;
    }
    this.props.setVideoPath(path, this.props.indexes);
  };

  subtitleChangeHandler = (path) => this.props.setVideoSubtitles(path, this.props.indexes);
  videoChangeHandler = (path) => this.props.setVideoPath(path, this.props.indexes);

  handlePreviewTabChange = (e, newValue) => {
    this.setState({
      previewTab: newValue
    })
  }
  

  render() {
    const errors = this.getValidationErrors();

    return (
      <React.Fragment>
        {this.renderVideo(errors)}
        {this.renderDetails(errors)}
      </React.Fragment>
    )
  }

  renderVideo(errors) {
    const { classes, video } = this.props;
    const { errorSnackbarVisible, previewTab } = this.state;

    return (
      <React.Fragment>
        <Separator label="Video"/>
        <Snackbar open={errorSnackbarVisible} autoHideDuration={3000} onClose={this.handleErrorSnackbarClose} >
          <Alert severity="error">Format de fichier invalide</Alert>
        </Snackbar>
        <Separator/>
        <AntTabs  value={previewTab} onChange={this.handlePreviewTabChange} variant="fullWidth">
          <AntTab label='Vertical' />
          <AntTab label='Grille' />
        </AntTabs>
        { previewTab == 0 && (
          <Preview path={video.framePreview} buttonLabel='Choisir une miniature'
                    onClick={(_) => this.handlePreviewChange(SIZES.PREVIEW_FRAME, false)}
                    onDrop={this.handleDropFramePreview}
                    onRemove={(_) => this.removePreviewChange(false)}
          />
        )}
        { previewTab == 1 && (
          <Preview path={video.gridPreview} buttonLabel='Choisir une miniature'
                    onClick={(_) => this.handlePreviewChange(SIZES.PREVIEW_GRID, true)}
                    onDrop={this.handleDropGridPreview}
                    onRemove={(_) => this.removePreviewChange(false)}
          />
        )}
        <FormHelperText error className={classes.baseLabel}>{errors.preview || ""}</FormHelperText>
        <Separator/>
        <TextField label="Titre" value={video.name} onChange={this.handleVideoNameChange} error={errors.name != undefined} />
        <Separator/>
        <PathInput label={`Video ( ${formatContentSizeAndType(SIZES.VIDEO)} )`}
                    button='Choisir une video'
                    value={video.url}
                    onChange={this.videoChangeHandler}
                    onError={this.openErrorSnackbar}
                    control={SIZES.VIDEO}
        />
        {errors.url && <FormHelperText error className={classes.baseLabel}>{errors.url}</FormHelperText>}
        <Separator/>
        <SSelect label="Projection" required value={video.projection} onChange={this.handleProjectionChange}>
          {Object.keys(PROJECTIONS).map( proj => (
            <MenuItem key={proj} value={proj}>{PROJECTIONS[proj]}</MenuItem>
          ))}
        </SSelect>
        <Separator/>
        <PathInput label={`Sous-titres ( ${formatContentSizeAndType(SIZES.SUBTITLES)} )`}
                    button='Choisir des sous-titres'
                    value={video.srt}
                    onChange={this.subtitleChangeHandler}
                    onError={this.openErrorSnackbar}
                    control={SIZES.SUBTITLES}
        />
        {errors.srt && <FormHelperText error className={classes.baseLabel}>{errors.srt}</FormHelperText>}
      </React.Fragment>
    )
  }

  renderDetails(errors) {
    const { classes, video } = this.props;

    const pays = video.details ? video.details.pays : "";
    const annee = video.details ? video.details.annee : "";
    const duree = video.details ? video.details.duree : "";
    const organisme = video.details ? video.details.organisme : "";
    const realisateur = video.details ? video.details.realisateur : "";
    const synopsis = video.details ? video.details.synopsis : "";

    return (
      <React.Fragment>
        <Separator/>
        <Separator label="Détails"/>
        <Label label={`Affiche ( ${formatContentSizeAndType(SIZES.POSTER)} )`} className={classes.baseLabel} />
        <Preview path={video.details ? video.details.affiche : ""} buttonLabel='Choisir une affiche'
                  onClick={(_) => this.handlePosterChange(SIZES.POSTER)}
                  onDrop={this.handleDropPoster}
                  onRemove={this.removePoster}
        />
        <FormHelperText error className={classes.baseLabel}>{errors.affiche || ""}</FormHelperText>
        <Separator/>
        <TextField value={pays} onChange={this.handleCountryChange} label="Pays" />
        <Separator/>
        <TextField value={annee} onChange={this.handleYearChange} label="Année" />
        <Separator/>
        <TextField value={duree} onChange={this.handleDurationChange} label="Durée" />
        <Separator/>
        <TextField value={organisme} onChange={this.handleOrganizationChange} label="Organisme" />
        <Separator/>
        <TextField value={realisateur} onChange={this.handleDirectorChange} label="Réalisateur" />
        <Separator/>
        <TextField value={synopsis} onChange={this.handleSynopsisChange} label="Synopsis" multiline rows={4}/>
      </React.Fragment>
    )
  }
}

const styles = (theme) => ({
  video: {
    width: "100%",
    marginBottom: 5
  },
  baseLabel: {
    margin: 5,
  },
  select: {
    margin: 5,
    border: '1px solid rgb(211, 211, 211)',
    borderRadius: '4px',
    background: 'rgb(255, 255, 255)',
    padding: '5px 11px',
    lineHeight: '28px',
    fontWeight: 300,
    fontSize: 14
  },
  previewButton: {
    textAlign: 'center'
  }
});

const mapStateToProps = (state) => {
  return state.manifest;
};

export default connect(mapStateToProps, {
  setVideoName,
  setVideoPath,
  setVideoProjection,
  setVideoSubtitles,
  setVideoGridPreview,
  setVideoFramePreview,
  setVideoPoster,
  setVideoCountry,
  setVideoYear,
  setVideoDuration,
  setVideoOrganization,
  setVideoDirector,
  setVideoSynopsis,
})(withStyles(styles)(withRouter(VideoEdit)));
