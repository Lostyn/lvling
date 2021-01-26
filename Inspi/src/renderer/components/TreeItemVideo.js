import React from "react";
import { withRouter } from "react-router-dom";
import Typography from "@material-ui/core/Typography";
import {
  withStyles,
  Card,
  CardContent,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CardHeader,
  IconButton,
  Checkbox,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Chip,
  Avatar,
} from "@material-ui/core";
import DeleteIcon from "@material-ui/icons/Delete";
import DragHandleIcon from "@material-ui/icons/DragHandle";
import classNames from "classnames";
import PropTypes from "prop-types";
import VisibilityIcon from "@material-ui/icons/Visibility";
import VisibilityOffIcon from "@material-ui/icons/VisibilityOff";
import { connect } from "react-redux";
import { removeItem } from "../store/actions/ManifestActionCreator";
import ErrorIcon from "@material-ui/icons/Error";
import VideoValidator from "../core/videoValidator";
import { setItemVisible } from "../store/actions/ManifestActionCreator";
import VideoLibraryIcon from "@material-ui/icons/VideoLibrary";
import { browseTree, getCurrentChildFromIndexes } from "../utils/tree";
import { cloneDeep } from "lodash";
class TreeItemVideo extends React.Component {
  static propsTypes = {
    video: PropTypes.object.isRequired,
    selected: PropTypes.bool,
    draggable: PropTypes.bool,
  };

  static defaultProps = {
    selected: false,
    draggable: true,
  };

  constructor(props) {
    super(props);
    this.state = {
      deleteDialogVisible: false,
    };
  }

  handleDialogClose = () =>
    this.setState({
      deleteDialogVisible: false,
    });

  showDialog = () =>
    this.setState({
      deleteDialogVisible: true,
    });

  handleDeleteDialog = () => {
    this.props.removeItem(this.props.indexes);
    this.handleDialogClose();
  };

  handleRemoveItem = () => {
    this.props.removeItem(this.props.indexes);
  };

  get isValid() {
    return VideoValidator.validate(this.props.video).isValid;
  }

  toggleVisibility = () => {
    const isVisible =
      this.props.video.visible === undefined ? true : this.props.video.visible;

    this.props.setItemVisible(!isVisible, this.props.indexes);
  };

  renderVideoOffIcon = () => {
    return (
      <svg
        className={"MuiSvgIcon-root"}
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect
          x="1.85095"
          y="4.55566"
          width="1.91249"
          height="24.8809"
          transform="rotate(-45 1.85095 4.55566)"
        />
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M6 6.00006V16C6 17.1 6.9 18 8 18H17.9999L13.4285 13.4286L12 14.5V12.0001L6 6.00006ZM14.9741 12.2695L18 10L12 5.5V9.29539L6.09543 3.39082C6.35464 2.58629 7.11217 2 8 2H20C21.1 2 22 2.9 22 4V16C22 16.8878 21.4137 17.6454 20.6092 17.9046L14.9741 12.2695ZM2 6H4V20H18V22H4C2.9 22 2 21.1 2 20V6Z"
        />
      </svg>
    );
  };

  renderVisibleIcon = () => {
    const { classes } = this.props;

    const isVisible =
      this.props.video.visible === undefined ? true : this.props.video.visible;

    if (isVisible) {
      /* return (
        <IconButton onClick={this.toggleVisibility}>
          <VisibilityIcon />
        </IconButton>
      ); */

      return (
        <IconButton
          className={classes.visibleIcon}
          onClick={this.toggleVisibility}
        >
          <VideoLibraryIcon />
        </IconButton>
      );
    }

    return (
      <IconButton
        className={classes.visibleIcon}
        onClick={this.toggleVisibility}
      >
        {this.renderVideoOffIcon()}
      </IconButton>
    );
  };

  renderCopyCheckbox = () => {
    return (
      <Checkbox
        onChange={(e) => this.props.onChecked && this.props.onChecked(e)}
        checked={this.props.video.copyEnabled}
        color="primary"
      />
    );
  };

  getOpacity = () => {
    let opacity = 1;
    let currentItem = { items: this.props.manifest.items };
    if (this.props.indexes !== null) {
      for (let index of this.props.indexes) {
        currentItem = currentItem.items[index];

        if (!currentItem.visible) {
          opacity = opacity * 0.4;
        }
      }
    }

    return opacity;
  };

  renderContent = () => {
    const {
      classes,
      video,
      connectDragSource,
      connectDragPreview,
      isDragging,
      didDrop,
      canDrop,
    } = this.props;
    const isVisible =
      this.props.video.visible === undefined ? true : this.props.video.visible;

    if (this.props.draggable) {
      let handle = connectDragSource(
        <div>
          <IconButton>
            <DragHandleIcon />
          </IconButton>
        </div>,
        {
          dropEffect: "copy",
        }
      );

      const isLandingPadActive = !didDrop && isDragging;
      return connectDragPreview(
        <div
          className={classNames(
            classes.dragPreview,
            isLandingPadActive && "rst__rowLandingPad",
            isLandingPadActive && !canDrop && "rst__rowCancelPad"
          )}
        >
          <Card
            onClick={(_) => this.props.onClick && this.props.onClick()}
            style={{
              opacity: this.getOpacity(),
            }}
            className={classes.card}
            elevation={0}
          >
            {handle}
            {!this.isValid && <ErrorIcon color="error"></ErrorIcon>}
            <div className={classes.content}>
              <Typography className={classes.title} gutterBottom component="h6">
                {video.name}
              </Typography>
            </div>
            <div className={classes.actions}>
              <IconButton
                onClick={(e) => {
                  e.stopPropagation();
                  this.showDialog();
                }}
              >
                <DeleteIcon />
              </IconButton>
            </div>
            <div
              style={{
                opacity: this.props.selected ? 1 : 0,
              }}
              className={classes.overlay}
            ></div>
          </Card>
        </div>
      );
    }
    return (
      <Card
        onClick={(_) => this.props.onClick && this.props.onClick()}
        style={{ height: "48px" }}
        className={classes.card}
        style={{ cursor: "default" }}
        elevation={0}
      >
        {this.renderCopyCheckbox()}
        {!this.isValid && <ErrorIcon color="error"></ErrorIcon>}
        <div className={classes.content}>
          <Typography className={classes.title} gutterBottom component="h6">
            {video.name}
          </Typography>
        </div>
        <div
          style={{
            opacity: this.props.selected ? 1 : 0,
          }}
          className={classes.overlay}
        ></div>
      </Card>
    );
  };

  render() {
    const { classes } = this.props;
    return (
      <div>
        <Dialog
          open={this.state.deleteDialogVisible}
          onClose={this.handleDialogClose}
        >
          <DialogTitle id="alert-dialog-title">
            {"Suppression d'une catégorie"}
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              Voulez-vous vraiment supprimer cette vidéo ?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleDialogClose} color="primary">
              Annuler
            </Button>
            <Button onClick={this.handleDeleteDialog} color="primary" autoFocus>
              Supprimer
            </Button>
          </DialogActions>
        </Dialog>
        <div className={classes.cardWrapper}>
          {this.props.draggable && this.renderVisibleIcon()}
          {this.renderContent()}
        </div>
      </div>
    );
  }
}

const styles = (theme) => ({
  actions: {
    marginLeft: "auto",
  },
  content: {
    marginLeft: 12,
  },
  card: {
    display: "flex",
    alignItems: "center",
    width: "100%",
    cursor: "pointer",
    position: "relative",
  },
  title: {
    margin: 0,
  },
  cardWrapper: {
    display: "flex",
    alignItems: "center",
  },
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    pointerEvents: "none",
    backgroundColor: "rgba(0,0,0,0.1)",
  },
  dragPreview: {
    width: "100%",
    position: "relative",
  },
  chip: {
    marginLeft: "10px",
    width: "130px",
  },
  visibleIcon: {
    marginRight: "10px",
  },
});

const mapStateToProps = (state) => {
  return {
    manifest: state.manifest
  };
};

export default connect(mapStateToProps, {
  removeItem,
  setItemVisible,
})(withStyles(styles)(withRouter(TreeItemVideo)));
