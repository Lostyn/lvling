import React from "react";
import { withRouter } from "react-router-dom";
import Typography from "@material-ui/core/Typography";
import {
  withStyles,
  Card,
  Button,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Checkbox,
} from "@material-ui/core";
import DeleteIcon from "@material-ui/icons/Delete";
import DragHandleIcon from "@material-ui/icons/DragHandle";
import classNames from "classnames";
import CreateNewFolderIcon from "@material-ui/icons/CreateNewFolder";
import AddBoxIcon from "@material-ui/icons/AddBox";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import {
  addCategory,
  addVideo,
  removeItem,
  setItemVisible,
} from "../store/actions/ManifestActionCreator";
import ErrorIcon from "@material-ui/icons/Error";
import CategoryValidator from "../core/categoryValidator";
import FolderIcon from "@material-ui/icons/Folder";
class TreeItemCategory extends React.Component {
  static propsTypes = {
    category: PropTypes.object.isRequired,
    indexes: PropTypes.object.isRequired,
    selected: PropTypes.bool,
    connectDragPreview: PropTypes.func.isRequired,
    connectDragSource: PropTypes.func.isRequired,
    draggable: PropTypes.bool,
  };

  static defaultProps = {
    indexes: [],
    selected: false,
    draggable: true,
  };

  constructor(props) {
    super(props);

    this.state = {
      deleteCategoryDialogVisible: false,
    };
  }

  get isValid() {
    return CategoryValidator.validate(this.props.category).isValid;
  }

  toggleVisibility = () => {
    const isVisible =
      this.props.category.visible === undefined
        ? true
        : this.props.category.visible;

    this.props.setItemVisible(!isVisible, this.props.indexes);
  };

  renderCategoryIconOff = () => {
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
          d="M3.99994 4C2.89997 4.00003 2.01 4.90002 2.01 6L2 18C2 19.1 2.9 20 4 20H19.9999L3.99994 4ZM21.7208 19.0162C21.898 18.7179 22 18.3703 22 18V8C22 6.9 21.1 6 20 6H12L10 4H6.70461L21.7208 19.0162Z"
        />
      </svg>
    );
  };

  renderVisibleIcon = () => {
    const { classes } = this.props;

    const isVisible =
      this.props.category.visible === undefined
        ? true
        : this.props.category.visible;

    if (isVisible) {
      return (
        <IconButton
          className={classes.visibleIcon}
          onClick={this.toggleVisibility}
        >
          <FolderIcon />
        </IconButton>
      );
    }

    return (
      <IconButton
        onClick={this.toggleVisibility}
        className={classes.visibleIcon}
      >
        {this.renderCategoryIconOff()}
      </IconButton>
    );
  };

  renderCopyCheckbox = () => {
    const { classes } = this.props;
    return (
      <Checkbox
        className={classes.copyCheckbox}
        checked={this.props.category.copyEnabled}
        onChange={(e) => this.props.onChecked && this.props.onChecked(e)}
        color="primary"
      />
    );
  };

  handleCreateSubcategory = () => {
    this.props.addCategory(this.props.indexes);
  };

  handleRemoveItem = () => {
    this.showDialog();
  };

  handleDeleteDialog = () => {
    this.props.removeItem(this.props.indexes);
    this.handleDialogClose();
  };

  handleCreateVideo = () => {
    this.props.addVideo(this.props.indexes);
  };

  handleDialogClose = () =>
    this.setState({
      deleteCategoryDialogVisible: false,
    });

  showDialog = () =>
    this.setState({
      deleteCategoryDialogVisible: true,
    });

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
      category,
      connectDragSource,
      connectDragPreview,
      isDragging,
      didDrop,
      canDrop,
    } = this.props;

    const isVisible =
      this.props.category.visible === undefined
        ? true
        : this.props.category.visible;

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
            onClick={(_) => this.props.onClick()}
            style={{
              opacity: this.getOpacity(),
            }}
            className={classes.card}
            elevation={0}
          >
            <div className={classes.cardHeader}>
              {handle}
              {!this.isValid && <ErrorIcon color="error"></ErrorIcon>}
              <div className={classes.content}>
                <Typography
                  className={classes.title}
                  gutterBottom
                  component="h6"
                >
                  {category.name}
                </Typography>
              </div>
              <div className={classes.actions}>
                <IconButton
                  onClick={(e) => {
                    e.stopPropagation();
                    this.handleCreateSubcategory();
                  }}
                >
                  <CreateNewFolderIcon />
                </IconButton>
                <IconButton
                  onClick={(e) => {
                    e.stopPropagation();
                    this.handleCreateVideo();
                  }}
                >
                  <AddBoxIcon />
                </IconButton>
                <IconButton
                  onClick={(e) => {
                    e.stopPropagation();
                    this.handleRemoveItem();
                  }}
                >
                  <DeleteIcon />
                </IconButton>
              </div>
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
        className={classes.card}
        style={{ cursor: "default" }}
        elevation={0}
      >
        <div className={classes.cardContent}>
          {this.renderCopyCheckbox()}
          <div className={classes.cardHeader} style={{ height: "48px" }}>
            {!this.isValid && <ErrorIcon color="error"></ErrorIcon>}
            <div className={classes.content}>
              <Typography className={classes.title} gutterBottom component="h6">
                {category.name}
              </Typography>
            </div>
          </div>
          <div
            style={{
              opacity: this.props.selected ? 1 : 0,
            }}
            className={classes.overlay}
          ></div>
        </div>
        <div className={classes.items}>{this.props.children}</div>
      </Card>
    );
  };

  render() {
    const { classes } = this.props;

    return (
      <div>
        <Dialog
          open={this.state.deleteCategoryDialogVisible}
          onClose={this.handleDialogClose}
        >
          <DialogTitle id="alert-dialog-title">
            {"Suppression d'une catégorie"}
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              La suppression de la catégorie entrainera la suppression de toutes
              les vidéos et sous catégories contenus dans celle ci.
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
  cardHeader: {
    display: "flex",
    alignItems: "center",
  },
  actions: {
    marginLeft: "auto",
  },
  content: {
    marginLeft: 12,
  },
  title: {
    margin: 0,
  },
  items: {
    marginLeft: "15px",
  },
  cardWrapper: {
    display: "flex",
    alignItems: "center",
    position: "relative",
  },
  card: {
    width: "100%",
    cursor: "pointer",
    position: "relative",
  },
  cardContent: {
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
  copyCheckbox: {},
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
  addCategory,
  addVideo,
  removeItem,
  setItemVisible,
})(withStyles(styles)(withRouter(TreeItemCategory)));
